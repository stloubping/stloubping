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
  const documentNode: XmlNode = { name: "#document", children: [], text: "" };
  const stack: XmlNode[] = [documentNode];
  const tokens =
    xml
      .replace(/<\?xml[\s\S]*?\?>/gi, "")
      .match(/<!\[CDATA\[[\s\S]*?\]\]>|<[^>]+>|[^<]+/g) || [];

  for (const token of tokens) {
    if (token.startsWith("<!--") || token.startsWith("<!DOCTYPE")) continue;
    if (token.startsWith("<![CDATA[")) {
      const current = stack.at(-1);
      if (current) current.text += token;
      continue;
    }
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
        child.children.length ? JSON.stringify(toObject(child)) : decodeXml(child.text),
      ]),
    );
  if (!root.children.some((child) => child.children.length)) {
    return [toObject(root)];
  }
  return root.children.map(toObject);
}

function parseXmlList(
  xml: string,
  tagName: "equipe" | "classement" | "poule" | "tour",
): XmlRecord[] {
  const recordPattern = new RegExp(`<${tagName}>[\\s\\S]*?<\\/${tagName}>`, "gi");
  return Array.from(xml.matchAll(recordPattern)).flatMap((match) =>
    parseXmlRecords(match[0]),
  );
}

function parseLink(value = ""): Record<string, string> {
  const decoded = decodeXml(value);
  const query = decoded.includes("?") ? decoded.split("?").at(-1) || "" : decoded;
  return Object.fromEntries(new URLSearchParams(query));
}

function extractTeamNumber(name: string): string {
  const withoutPhase = name.replace(/\s*-\s*phase\s*\d+\s*$/i, "").trim();
  return withoutPhase.match(/(\d+)\s*$/)?.[1] || "1";
}

function containsTeam(ranking: XmlRecord[], teamNumber: string): boolean {
  return ranking.some((row) => {
    const name = decodeXml(row.equipe || "");
    return /(?:st|saint)\s*loub/i.test(name) && extractTeamNumber(name) === teamNumber;
  });
}

function isClubTeam(name: string, teamNumber: string): boolean {
  const decodedName = decodeXml(name);
  return (
    /(?:st|saint)\s*loub/i.test(decodedName) &&
    extractTeamNumber(decodedName) === teamNumber
  );
}

function phaseFrom(name: string): string {
  return name.match(/phase\s*(\d+)/i)?.[1] || "1";
}

async function loadRanking(team: XmlRecord): Promise<{
  ranking: XmlRecord[];
  divisionId: string;
  poolId: string;
}> {
  const teamName = decodeXml(team.libequipe || "");
  const teamNumber = extractTeamNumber(teamName);
  const divisionLink = parseLink(team.liendivision || "");
  if (!divisionLink.D1) return { ranking: [], divisionId: "", poolId: "" };

  const rankingParams: Record<string, string> = {
    action: "classement",
    auto: "1",
    D1: divisionLink.D1,
  };
  if (divisionLink.cx_poule) rankingParams.cx_poule = divisionLink.cx_poule;
  const ranking = parseXmlList(
    await callSmartping("xml_result_equ", rankingParams),
    "classement",
  );
  if (containsTeam(ranking, teamNumber)) {
    return {
      ranking,
      divisionId: divisionLink.D1,
      poolId: divisionLink.cx_poule || "",
    };
  }

  const pools = parseXmlList(
    await callSmartping("xml_result_equ", {
      action: "poule",
      auto: "1",
      D1: divisionLink.D1,
    }),
    "poule",
  );
  for (const pool of pools) {
    const poolLink = parseLink(pool.lien || "");
    const poolId = poolLink.cx_poule;
    if (!poolId || poolId === divisionLink.cx_poule) continue;
    const candidate = parseXmlList(
      await callSmartping("xml_result_equ", {
        action: "classement",
        auto: "1",
        D1: divisionLink.D1,
        cx_poule: poolId,
      }),
      "classement",
    );
    if (containsTeam(candidate, teamNumber)) {
      return { ranking: candidate, divisionId: divisionLink.D1, poolId };
    }
  }
  return {
    ranking,
    divisionId: divisionLink.D1,
    poolId: divisionLink.cx_poule || "",
  };
}

function dateSortKey(value: string): number {
  const match = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return match ? Number(`${match[3]}${match[2]}${match[1]}`) : 0;
}

async function loadTeamMatches(
  divisionId: string,
  poolId: string,
  teamNumber: string,
) {
  if (!divisionId || !poolId) return [];
  const tours = parseXmlList(
    await callSmartping("xml_result_equ", {
      auto: "1",
      D1: divisionId,
      cx_poule: poolId,
    }),
    "tour",
  );

  return tours
    .filter(
      (tour) =>
        isClubTeam(tour.equa || "", teamNumber) ||
        isClubTeam(tour.equb || "", teamNumber),
    )
    .map((tour, index) => {
      const home = isClubTeam(tour.equa || "", teamNumber);
      const link = parseLink(tour.lien || "");
      const scoreHome = tour.scorea || "";
      const scoreAway = tour.scoreb || "";
      const played = scoreHome !== "" && scoreAway !== "";
      return {
        id: link.renc_id || `${teamNumber}-${index}`,
        round: decodeXml(tour.libelle || "").match(/tour\s*n[°ºo]?\s*(\d+)/i)?.[1] || "",
        date: decodeXml(tour.datereelle || tour.dateprevue || ""),
        time: decodeXml(tour.heurereelle || ""),
        home,
        opponent: decodeXml(home ? tour.equb || "" : tour.equa || ""),
        scoreFor: played ? (home ? scoreHome : scoreAway) : "",
        scoreAgainst: played ? (home ? scoreAway : scoreHome) : "",
        played,
      };
    })
    .sort(
      (a, b) =>
        dateSortKey(a.date) - dateSortKey(b.date) ||
        Number(a.round || "99") - Number(b.round || "99"),
    );
}

function normalizeTeamName(value: string): string {
  return decodeXml(value).replace(/\s+/g, " ").trim().toUpperCase();
}

async function loadPoolStats(
  divisionId: string,
  poolId: string,
): Promise<Map<string, { pointsFor: number; pointsAgainst: number }>> {
  const stats = new Map<string, { pointsFor: number; pointsAgainst: number }>();
  if (!divisionId || !poolId) return stats;

  const tours = parseXmlList(
    await callSmartping("xml_result_equ", {
      auto: "1",
      D1: divisionId,
      cx_poule: poolId,
    }),
    "tour",
  );

  for (const tour of tours) {
    const scoreHome = Number(tour.scorea || "");
    const scoreAway = Number(tour.scoreb || "");
    const home = normalizeTeamName(tour.equa || "");
    const away = normalizeTeamName(tour.equb || "");
    if (!home || !away || !Number.isFinite(scoreHome) || !Number.isFinite(scoreAway)) continue;

    const homeStats = stats.get(home) || { pointsFor: 0, pointsAgainst: 0 };
    homeStats.pointsFor += scoreHome;
    homeStats.pointsAgainst += scoreAway;
    stats.set(home, homeStats);

    const awayStats = stats.get(away) || { pointsFor: 0, pointsAgainst: 0 };
    awayStats.pointsFor += scoreAway;
    awayStats.pointsAgainst += scoreHome;
    stats.set(away, awayStats);
  }

  return stats;
}

export async function loadClubTeamRankings(competition: "criterium" | "championnat") {
  const config = getConfiguration();
  const initialization = parseXmlRecords(await callSmartping("xml_initialisation"));
  if (initialization[0]?.appli !== "1") throw new Error("Accès Smartping refusé");

  const teams = parseXmlList(
    await callSmartping("xml_equipe", { numclu: config.clubNumber }),
    "equipe",
  ).filter((team) => {
    const isCriterium = /crit[eé]rium/i.test(decodeXml(team.libepr || ""));
    return competition === "criterium" ? isCriterium : !isCriterium;
  });

  const resolvedTeams = await Promise.all(
    teams.map(async (team) => {
      const name = decodeXml(team.libequipe || "");
      let ranking: XmlRecord[] = [];
      let matches: Awaited<ReturnType<typeof loadTeamMatches>> = [];
      try {
        const rankingResult = await loadRanking(team);
        ranking = rankingResult.ranking;
        matches = await loadTeamMatches(
          rankingResult.divisionId,
          rankingResult.poolId,
          extractTeamNumber(name),
        );
        const poolStats = await loadPoolStats(rankingResult.divisionId, rankingResult.poolId);
        ranking = ranking.map((row) => {
          const stats = poolStats.get(normalizeTeamName(row.equipe || "")) || {
            pointsFor: 0,
            pointsAgainst: 0,
          };
          return {
            ...row,
            pointsFor: String(stats.pointsFor),
            pointsAgainst: String(stats.pointsAgainst),
            goalAverage: String(stats.pointsFor - stats.pointsAgainst),
          };
        });
      } catch (error) {
        console.warn(`[api/fftt/${competition}] Données indisponibles pour ${name}`, error);
      }
      return {
        libequipe: name,
        libdivision: decodeXml(team.libdivision || ""),
        libepr: decodeXml(team.libepr || ""),
        phase: phaseFrom(name),
        ranking: ranking.map((row) => ({
          clt: row.clt || "",
          equipe: decodeXml(row.equipe || ""),
          joue: row.joue || "0",
          pts: row.pts || "0",
          vic: row.vic || "0",
          nul: row.nul || "0",
          def: row.def || "0",
          pointsFor: row.pointsFor || "0",
          pointsAgainst: row.pointsAgainst || "0",
          goalAverage: row.goalAverage || "0",
        })),
        matches,
      };
    }),
  );
  resolvedTeams.sort(
    (a, b) => Number(extractTeamNumber(a.libequipe)) - Number(extractTeamNumber(b.libequipe)),
  );
  return resolvedTeams;
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Méthode non autorisée", teams: [] });
    return;
  }

  try {
    const requestedCompetition = request.query?.competition;
    const competitionValue = Array.isArray(requestedCompetition)
      ? requestedCompetition[0]
      : requestedCompetition;
    const competition = competitionValue === "championnat" ? "championnat" : "criterium";
    const resolvedTeams = await loadClubTeamRankings(competition);
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.status(200).json({ teams: resolvedTeams, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("[api/fftt/equipes]", error);
    response.status(500).json({
      error: error instanceof Error ? error.message : "Erreur interne du service FFTT",
      teams: [],
    });
  }
}
