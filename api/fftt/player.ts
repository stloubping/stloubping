import { createHash, createHmac } from "node:crypto";

type ApiRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

type XmlNode = {
  name: string;
  children: XmlNode[];
  text: string;
};

type XmlRecord = Record<string, string>;

const API_BASE_URL = "https://www.fftt.com/mobile/pxml";

function requiredSecret(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variable Vercel manquante : ${name}`);
  return value;
}

function getConfiguration() {
  return {
    appId: requiredSecret("FFTT_APP_ID"),
    password: requiredSecret("FFTT_APP_PASSWORD"),
    serial: requiredSecret("FFTT_SERIAL"),
    clubNumber: process.env.FFTT_CLUB_NUMBER || "10330022",
  };
}

function getTimestamp(date = new Date()): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${parts.year}${parts.month}${parts.day}${parts.hour}${parts.minute}${parts.second}${String(
    date.getMilliseconds(),
  ).padStart(3, "0")}`;
}

function generateHash(timestamp: string, password: string): string {
  const key = createHash("md5").update(password, "utf8").digest("hex");
  return createHmac("sha1", key).update(timestamp, "utf8").digest("hex");
}

async function callSmartping(
  script: string,
  params: Record<string, string> = {},
): Promise<string> {
  const config = getConfiguration();
  const tm = getTimestamp();
  const queryParams = new URLSearchParams({
    id: config.appId,
    serie: config.serial,
    tm,
    tmc: generateHash(tm, config.password),
    ...params,
  });

  const response = await fetch(
    `${API_BASE_URL}/${script}.php?${queryParams.toString()}`,
    {
      headers: {
        Accept: "application/xml, text/xml",
        "User-Agent": "Saint-Loub-Ping/1.0",
      },
    },
  );
  const bytes = await response.arrayBuffer();
  const utf8Body = new TextDecoder("utf-8").decode(bytes);
  const body = utf8Body.includes("\uFFFD")
    ? new TextDecoder("windows-1252").decode(bytes)
    : utf8Body;

  if (!response.ok) {
    throw new Error(`Erreur FFTT ${response.status} sur ${script}`);
  }

  return body;
}

function decodeXml(value = ""): string {
  return value
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .trim();
}

function parseXmlRecords(xml: string): XmlRecord[] {
  const documentNode: XmlNode = {
    name: "#document",
    children: [],
    text: "",
  };
  const stack: XmlNode[] = [documentNode];
  const tokens =
    xml.replace(/<\?xml[\s\S]*?\?>/gi, "").match(/<[^>]+>|[^<]+/g) || [];

  for (const token of tokens) {
    if (token.startsWith("<!--") || token.startsWith("<!DOCTYPE")) continue;

    if (token.startsWith("</")) {
      if (stack.length > 1) stack.pop();
      continue;
    }

    if (token.startsWith("<")) {
      const name = token.match(/^<\s*([^\s/>]+)/)?.[1];
      if (!name) continue;

      const node: XmlNode = { name, children: [], text: "" };
      stack.at(-1)?.children.push(node);
      if (!/\/>$/.test(token)) stack.push(node);
      continue;
    }

    const current = stack.at(-1);
    if (current) current.text += token;
  }

  const root = documentNode.children[0];
  if (!root) return [];

  const toObject = (node: XmlNode): XmlRecord =>
    Object.fromEntries(
      node.children.map((child) => [
        child.name,
        child.children.length
          ? JSON.stringify(toObject(child))
          : decodeXml(child.text),
      ]),
    );

  if (!root.children.some((child) => child.children.length)) {
    return [toObject(root)];
  }

  return root.children.map(toObject);
}

function numberValue(value?: string): number {
  const parsed = Number(String(value || "0").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function rounded(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalized(value = ""): string {
  return decodeXml(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function matchKey(date = "", opponent = ""): string {
  return `${normalized(date)}:${normalized(opponent)}`;
}

function dateSortKey(value = ""): number {
  const frenchDate = value.match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (frenchDate) {
    return Number(`${frenchDate[3]}${frenchDate[2]}${frenchDate[1]}`);
  }

  const isoDate = value.match(/(\d{4})[/-](\d{2})[/-](\d{2})/);
  if (isoDate) {
    return Number(`${isoDate[1]}${isoDate[2]}${isoDate[3]}`);
  }

  return 0;
}

function recordsFrom(
  result: PromiseSettledResult<string>,
  source: string,
): XmlRecord[] {
  if (result.status === "fulfilled") return parseXmlRecords(result.value);
  console.warn(`[api/fftt/player] Source FFTT indisponible : ${source}`);
  return [];
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Méthode non autorisée" });
    return;
  }

  const rawLicence = request.query?.licence;
  const licence = Array.isArray(rawLicence) ? rawLicence[0] : rawLicence;

  if (!licence || !/^\d{6,10}$/.test(licence)) {
    response.status(400).json({ error: "Numéro de licence invalide" });
    return;
  }

  try {
    const config = getConfiguration();
    const initialization = parseXmlRecords(
      await callSmartping("xml_initialisation"),
    );

    if (initialization[0]?.appli !== "1") {
      throw new Error("Accès Smartping refusé");
    }

    const licenceRecords = parseXmlRecords(
      await callSmartping("xml_licence_b", { licence }),
    );
    const licenceRecord =
      licenceRecords.find((record) => record.licence === licence) ||
      licenceRecords[0];

    if (!licenceRecord) {
      response.status(404).json({ error: "Joueur introuvable" });
      return;
    }

    if (licenceRecord.numclub !== config.clubNumber) {
      response.status(404).json({ error: "Joueur absent de l’effectif du club" });
      return;
    }

    const [rankingResult, mysqlPartiesResult, spidPartiesResult, historyResult] =
      await Promise.allSettled([
        callSmartping("xml_joueur", { licence }),
        callSmartping("xml_partie_mysql", { licence }),
        callSmartping("xml_partie", { numlic: licence }),
        callSmartping("xml_histo_classement", { numlic: licence }),
      ]);

    const ranking = recordsFrom(rankingResult, "classement")[0] || {};
    const mysqlParties = recordsFrom(mysqlPartiesResult, "parties classement");
    const spidParties = recordsFrom(spidPartiesResult, "parties SPID");
    const rawHistory = recordsFrom(historyResult, "historique classement");

    const spidByMatch = new Map(
      spidParties.map((partie) => [
        matchKey(partie.date, partie.nom),
        partie,
      ]),
    );

    const matches =
      mysqlParties.length > 0
        ? mysqlParties.map((partie, index) => {
            const spid = spidByMatch.get(
              matchKey(partie.date, partie.advnompre),
            );

            return {
              id: `${partie.date || "date"}-${partie.advlic || index}-${index}`,
              date: decodeXml(partie.date || spid?.date || ""),
              opponentName: decodeXml(partie.advnompre || spid?.nom || ""),
              opponentLicence: partie.advlic || "",
              opponentSex: partie.advsexe || "",
              opponentRanking: numberValue(
                partie.advclaof || spid?.classement,
              ),
              result: String(partie.vd || spid?.victoire || "").toUpperCase(),
              event: decodeXml(spid?.epreuve || partie.codechamp || ""),
              championshipCode: decodeXml(partie.codechamp || ""),
              round: decodeXml(partie.numjourn || ""),
              pointsDelta: rounded(numberValue(partie.pointres)),
              coefficient: rounded(numberValue(partie.coefchamp)),
              forfeit: String(spid?.forfait || "").toUpperCase() === "1",
            };
          })
        : spidParties.map((partie, index) => ({
            id: `${partie.date || "date"}-${index}`,
            date: decodeXml(partie.date || ""),
            opponentName: decodeXml(partie.nom || ""),
            opponentLicence: "",
            opponentSex: "",
            opponentRanking: numberValue(partie.classement),
            result: String(partie.victoire || "").toUpperCase(),
            event: decodeXml(partie.epreuve || ""),
            championshipCode: "",
            round: "",
            pointsDelta: 0,
            coefficient: 0,
            forfeit: String(partie.forfait || "").toUpperCase() === "1",
          }));

    matches.sort(
      (a, b) =>
        dateSortKey(b.date) - dateSortKey(a.date) ||
        a.opponentName.localeCompare(b.opponentName, "fr"),
    );

    const history = rawHistory
      .map((item) => ({
        season: decodeXml(item.saison || ""),
        phase: decodeXml(item.phase || ""),
        points: rounded(numberValue(item.point)),
        echelon: decodeXml(item.echelon || ""),
        place: decodeXml(item.place || ""),
      }))
      .sort(
        (a, b) =>
          b.season.localeCompare(a.season, "fr", { numeric: true }) ||
          Number(b.phase) - Number(a.phase),
      );

    const points = numberValue(licenceRecord.pointm || licenceRecord.point);
    const previousPoints = numberValue(licenceRecord.apointm);
    const initialPoints = numberValue(licenceRecord.initm || ranking.valinit);
    const newMonthlyRegistration = previousPoints === 0 && points === 500;
    const newSeasonRegistration =
      initialPoints === 0 && points === 500;
    const wins = matches.filter((match) => match.result === "V").length;
    const losses = matches.filter((match) => match.result === "D").length;
    const playedMatches = wins + losses;
    const pointsBalance = rounded(
      matches.reduce((total, match) => total + match.pointsDelta, 0),
    );
    const bestWin = matches
      .filter((match) => match.result === "V")
      .sort((a, b) => b.opponentRanking - a.opponentRanking)[0];

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.status(200).json({
      player: {
        idlicence: licenceRecord.idlicence || "",
        licence,
        nom: decodeXml(licenceRecord.nom || ranking.nom || "").toUpperCase(),
        prenom: decodeXml(licenceRecord.prenom || ranking.prenom || ""),
        sexe: licenceRecord.sexe || "",
        category: licenceRecord.cat || ranking.categ || "",
        licenceType: licenceRecord.type || "",
        clubNumber: licenceRecord.numclub || ranking.nclub || "",
        clubName: decodeXml(licenceRecord.nomclub || ranking.club || ""),
        points: rounded(points),
        previousPoints: rounded(previousPoints),
        initialPoints: rounded(initialPoints),
        monthlyProgress: newMonthlyRegistration
          ? 0
          : rounded(points - previousPoints),
        annualProgress: newSeasonRegistration
          ? 0
          : rounded(points - initialPoints),
        officialRanking: ranking.clast || Math.floor(points / 100).toString(),
        globalRank: ranking.clglob || "",
        previousGlobalRank: ranking.aclglob || "",
        regionalRank: ranking.rangreg || "",
        departmentRank: ranking.rangdep || "",
        officialPoints: rounded(numberValue(ranking.valcla)),
        proposedRanking: ranking.clpro || "",
        echelon: licenceRecord.echelon || "",
        nationalPlace: licenceRecord.place || "",
        nationality: licenceRecord.natio || ranking.natio || "",
        mutationDate: licenceRecord.mutation || "",
        umpireGrade: decodeXml(licenceRecord.arb || ""),
        refereeGrade: decodeXml(licenceRecord.ja || ""),
        coachGrade: decodeXml(licenceRecord.tech || ""),
      },
      summary: {
        matches: playedMatches,
        wins,
        losses,
        winRate: playedMatches ? rounded((wins / playedMatches) * 100) : 0,
        pointsBalance,
        bestWin: bestWin
          ? {
              opponentName: bestWin.opponentName,
              opponentRanking: bestWin.opponentRanking,
              date: bestWin.date,
            }
          : null,
      },
      matches,
      history,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[api/fftt/player]", error);
    response.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Erreur interne du service FFTT",
    });
  }
}
