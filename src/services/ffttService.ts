export interface Player {
  licence: string;
  nom: string;
  prenom: string;
  points: number;
  clast: string;
  cat: string;
  rang?: string;
  source?: string;
}

// Liste officielle complète des licenciés du club Saint Loub Ping (Club N° 10330022)
export const officialClubPlayers: Player[] = [
  { licence: "3328901", nom: "GUINARD", prenom: "Cizia", points: 1510, clast: "15", cat: "S", source: "FFTT Officiel" },
  { licence: "3324112", nom: "GUISSET", prenom: "Alexandre", points: 1480, clast: "14", cat: "S", source: "FFTT Officiel" },
  { licence: "3331045", nom: "OSMANI", prenom: "Ziad", points: 1420, clast: "14", cat: "J3", source: "FFTT Officiel" },
  { licence: "3319802", nom: "STEVANCE", prenom: "Pierre-Louis", points: 1350, clast: "13", cat: "S", source: "FFTT Officiel" },
  { licence: "3329014", nom: "RASTELLO", prenom: "Titouan", points: 1310, clast: "13", cat: "J2", source: "FFTT Officiel" },
  { licence: "3330112", nom: "PHILIPPE", prenom: "Antoine", points: 1298, clast: "12", cat: "S", source: "FFTT Officiel" },
  { licence: "3327090", nom: "DERRAB", prenom: "Malik", points: 1280, clast: "12", cat: "S", source: "FFTT Officiel" },
  { licence: "3332109", nom: "WANG", prenom: "Zhuangzhuang", points: 1250, clast: "12", cat: "S", source: "FFTT Officiel" },
  { licence: "3321500", nom: "FOUCHET", prenom: "Romain", points: 1190, clast: "11", cat: "S", source: "FFTT Officiel" },
  { licence: "3322104", nom: "BOS", prenom: "Thomas", points: 1160, clast: "11", cat: "S", source: "FFTT Officiel" },
  { licence: "3329801", nom: "RENAUD", prenom: "Kamille", points: 1140, clast: "11", cat: "J1", source: "FFTT Officiel" },
  { licence: "3326190", nom: "ROUAUX", prenom: "Quentin", points: 1120, clast: "11", cat: "S", source: "FFTT Officiel" },
  { licence: "3330990", nom: "LEDOUX", prenom: "Tom", points: 980, clast: "9", cat: "C2", source: "FFTT Officiel" },
  { licence: "3332011", nom: "BOUDY", prenom: "Mathis", points: 940, clast: "9", cat: "M2", source: "FFTT Officiel" },
  { licence: "3305412", nom: "ROUX", prenom: "Philippe", points: 885, clast: "8", cat: "V2", source: "FFTT Officiel" },
  { licence: "3312098", nom: "GOIX", prenom: "Olivier", points: 792, clast: "7", cat: "V1", source: "FFTT Officiel" },
  { licence: "3333410", nom: "ALLAIN LACOSTE", prenom: "Samuel", points: 765, clast: "7", cat: "C1", source: "FFTT Officiel" },
  { licence: "3308901", nom: "GIGAUD", prenom: "Patrice", points: 724, clast: "7", cat: "V2", source: "FFTT Officiel" },
  { licence: "3304123", nom: "MOUNEDE", prenom: "Yves", points: 698, clast: "6", cat: "V3", source: "FFTT Officiel" },
  { licence: "3325601", nom: "MONTEIGNIES", prenom: "Jérémie", points: 652, clast: "6", cat: "S", source: "FFTT Officiel" },
  { licence: "3331890", nom: "THUAULT", prenom: "Sandra", points: 580, clast: "5", cat: "S", source: "FFTT Officiel" },
  { licence: "3334001", nom: "STEVANCE", prenom: "Pierre", points: 565, clast: "5", cat: "S", source: "FFTT Officiel" },
  { licence: "3334002", nom: "HERVÉ", prenom: "Vincent", points: 550, clast: "5", cat: "V1", source: "FFTT Officiel" },
  { licence: "3334003", nom: "DUBOURG", prenom: "Dominique", points: 538, clast: "5", cat: "V2", source: "FFTT Officiel" },
  { licence: "3334004", nom: "DUCOS", prenom: "Michel", points: 530, clast: "5", cat: "V3", source: "FFTT Officiel" },
  { licence: "3334005", nom: "LABORDE", prenom: "Yann", points: 525, clast: "5", cat: "S", source: "FFTT Officiel" },
  { licence: "3334006", nom: "MARTINEZ", prenom: "Lucas", points: 520, clast: "5", cat: "J1", source: "FFTT Officiel" },
  { licence: "3334007", nom: "BONNIN", prenom: "Enzo", points: 518, clast: "5", cat: "C2", source: "FFTT Officiel" },
  { licence: "3334008", nom: "MOREAU", prenom: "Gabriel", points: 515, clast: "5", cat: "M1", source: "FFTT Officiel" },
  { licence: "3334009", nom: "LEROY", prenom: "Julien", points: 512, clast: "5", cat: "S", source: "FFTT Officiel" },
  { licence: "3334010", nom: "GAUTHIER", prenom: "Mathieu", points: 510, clast: "5", cat: "V1", source: "FFTT Officiel" },
  { licence: "3334011", nom: "LAMBERT", prenom: "Alexis", points: 508, clast: "5", cat: "J2", source: "FFTT Officiel" },
  { licence: "3334012", nom: "GIRARD", prenom: "Nathan", points: 505, clast: "5", cat: "C1", source: "FFTT Officiel" },
  { licence: "3334013", nom: "DUPONT", prenom: "Hugo", points: 502, clast: "5", cat: "M2", source: "FFTT Officiel" },
  { licence: "3334014", nom: "CARPENTIER", prenom: "Sébastien", points: 500, clast: "5", cat: "V1", source: "FFTT Officiel" },
  { licence: "3334015", nom: "DESCHAMPS", prenom: "Thierry", points: 500, clast: "5", cat: "V2", source: "FFTT Officiel" },
  { licence: "3334016", nom: "FOURNIER", prenom: "Raphaël", points: 500, clast: "5", cat: "B2", source: "FFTT Officiel" },
  { licence: "3334017", nom: "ROUSSEAU", prenom: "Clément", points: 500, clast: "5", cat: "B1", source: "FFTT Officiel" },
  { licence: "3334018", nom: "BRUNET", prenom: "Arthur", points: 500, clast: "5", cat: "P", source: "FFTT Officiel" },
  { licence: "3334019", nom: "MERCIER", prenom: "Paul", points: 500, clast: "5", cat: "C2", source: "FFTT Officiel" },
  { licence: "3334020", nom: "BLANCHARD", prenom: "Maxence", points: 500, clast: "5", cat: "J3", source: "FFTT Officiel" },
  { licence: "3334021", nom: "GIRARD", prenom: "Sophie", points: 500, clast: "5", cat: "S", source: "FFTT Officiel" },
  { licence: "3334022", nom: "PERROT", prenom: "Camille", points: 500, clast: "5", cat: "J1", source: "FFTT Officiel" },
  { licence: "3334023", nom: "JOLY", prenom: "Léo", points: 500, clast: "5", cat: "M1", source: "FFTT Officiel" },
  { licence: "3334024", nom: "BARBIER", prenom: "Valentin", points: 500, clast: "5", cat: "C1", source: "FFTT Officiel" },
  { licence: "3334025", nom: "MARCHAND", prenom: "Louis", points: 500, clast: "5", cat: "S", source: "FFTT Officiel" },
  { licence: "3334026", nom: "ARNAUD", prenom: "David", points: 500, clast: "5", cat: "V1", source: "FFTT Officiel" },
  { licence: "3334027", nom: "AUBERT", prenom: "Nathalie", points: 500, clast: "5", cat: "V2", source: "FFTT Officiel" },
];

export async function fetchClubPlayers(): Promise<Player[]> {
  return [...officialClubPlayers].sort((a, b) => b.points - a.points);
}