import { createHash, createHmac } from "node:crypto";

type ApiRequest = {
  method?: string;
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

  // Smartping mélange selon les réponses UTF-8 et Windows-1252.
  // On conserve UTF-8 quand il est valide et on répare uniquement les
  // réponses contenant le caractère de remplacement Unicode.
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

function parseXmlRecords(xml: string): Record<string, string>[] {
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

  const toObject = (node: XmlNode): Record<string, string> =>
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

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Méthode non autorisée", players: [] });
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

    // xml_licence_b renvoie aussi des licences conservées dans SPID mais non
    // validées pour la saison courante. La liste officielle avec valid=1 est
    // donc utilisée comme source de vérité, puis enrichie avec les données de
    // classement de xml_licence_b.
    const [validatedRecords, rawPlayers] = await Promise.all([
      callSmartping("xml_liste_joueur_o", {
        club: config.clubNumber,
        valid: "1",
      }).then(parseXmlRecords),
      callSmartping("xml_licence_b", { club: config.clubNumber }).then(
        parseXmlRecords,
      ),
    ]);

    const validatedLicences = new Set(
      validatedRecords
        .map((player) => String(player.licence || "").trim())
        .filter(Boolean),
    );

    if (validatedLicences.size === 0) {
      throw new Error("Aucune licence FFTT validée trouvée pour le club");
    }

    const players = rawPlayers
      .filter((player) =>
        validatedLicences.has(String(player.licence || "").trim()),
      )
      .map((player) => {
        const points = numberValue(player.pointm || player.point);
        const previousMonthly = numberValue(player.apointm);
        const initialSeason = numberValue(player.initm);
        const hasMonthlyReference = previousMonthly > 0;
        const hasSeasonReference = initialSeason > 0;

        return {
          idlicence: player.idlicence || "",
          licence: player.licence || "",
          nom: decodeXml(player.nom || "").toUpperCase(),
          prenom: decodeXml(player.prenom || ""),
          sexe: player.sexe || "",
          points: rounded(points),
          clast: Math.floor(points / 100).toString(),
          cat: player.cat || "",
          valinit: rounded(initialSeason),
          valmen: rounded(previousMonthly),
          // Une référence à 0 signifie que la FFTT ne fournit pas encore de
          // valeur antérieure (nouveau licencié, reprise ou donnée absente).
          // Le classement complet ne doit jamais devenir une progression.
          progmens: hasMonthlyReference
            ? rounded(points - previousMonthly)
            : 0,
          progans: hasSeasonReference ? rounded(points - initialSeason) : 0,
        };
      })
      .filter((player) => player.nom && player.prenom && player.licence)
      .sort(
        (a, b) =>
          b.points - a.points ||
          a.nom.localeCompare(b.nom, "fr") ||
          a.prenom.localeCompare(b.prenom, "fr"),
      );

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.status(200).json({
      players,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[api/fftt/players]", error);
    response.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Erreur interne du service FFTT",
      players: [],
    });
  }
}
