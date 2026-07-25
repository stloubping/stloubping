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
  const body = await response.text();

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

    const rawPlayers = parseXmlRecords(
      await callSmartping("xml_licence_b", { club: config.clubNumber }),
    );

    const players = rawPlayers
      .map((player) => {
        const points = numberValue(player.pointm || player.point);
        const previousMonthly = numberValue(player.apointm);
        const initialSeason = numberValue(player.initm);

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
          progmens: rounded(points - previousMonthly),
          progans: rounded(points - initialSeason),
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
