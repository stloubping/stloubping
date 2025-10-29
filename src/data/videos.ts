export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId: string; // L'ID de la vidéo YouTube (ex: "dQw4w9WgXcQ")
  category: 'wtt' | 'tutos' | 'legends';
  dateAdded: string; // Format YYYY-MM-DD pour un tri facile
}

export const allVideos: VideoItem[] = [
  // Vidéos WTT
  {
    id: 'wtt-1',
    title: "WTT Contender Doha 2024 - Finale Hommes",
    description: "Revivez les moments forts de la finale masculine du WTT Contender Doha 2024 entre Liang Jingkun et Lin Gaoyuan.",
    youtubeId: "7pl_dmo24nM",
    category: 'wtt',
    dateAdded: "2024-01-15",
  },
  {
    id: 'wtt-2',
    title: "WTT Star Contender Goa 2024 - Finale Hommes",
    description: "Les meilleurs échanges de la finale simple messieurs du WTT Star Contender Goa 2024.",
    youtubeId: "hBvyU6guwm8",
    category: 'wtt',
    dateAdded: "2024-02-01",
  },
  {
    id: 'wtt-3',
    title: "WTT Champions Incheon 2024 - Finale Hommes",
    description: "Découvrez les points spectaculaires de la finale hommes du WTT Champions Incheon 2024.",
    youtubeId: "uZ2wVtstweQ",
    category: 'wtt',
    dateAdded: "2024-07-28",
  },
  {
    id: 'wtt-4',
    title: "WTT Saudi Smash 2024 - Finale Hommes",
    description: "Les temps forts de la finale simple messieurs du WTT Saudi Smash 2024.",
    youtubeId: "37tr9lUgn6Q",
    category: 'wtt',
    dateAdded: "2024-07-29",
  },
  // Vidéos Tutos
  {
    id: 'tuto-1',
    title: "Le Service Revers Latéral Rentrant",
    description: "Apprenez la technique du service revers latéral rentrant pour déstabiliser vos adversaires.",
    youtubeId: "RXSJkvkzVpY",
    category: 'tutos',
    dateAdded: "2024-07-25",
  },
  {
    id: 'tuto-2',
    title: "Le Topspin Coup Droit",
    description: "Maîtrisez le topspin coup droit avec ce tutoriel pour plus de puissance et de précision.",
    youtubeId: "2Te0542ZiaE",
    category: 'tutos',
    dateAdded: "2024-07-26",
  },
  // Vidéos Les Légendes
  {
    id: 'legend-1',
    title: "Ma Long - The Dragon",
    description: "Les actions légendaires de Ma Long, surnommé 'Le Dragon', l'un des plus grands joueurs de tous les temps.",
    youtubeId: "VzzvEG2rVi0",
    category: 'legends',
    dateAdded: "2023-11-01",
  },
  {
    id: 'legend-2',
    title: "Jan-Ove Waldner - The Mozart of Table Tennis",
    description: "La créativité et le génie de Jan-Ove Waldner, le 'Mozart du tennis de table', en pleine action.",
    youtubeId: "7KtWBNL9yEQ",
    category: 'legends',
    dateAdded: "2023-11-05",
  },
  {
    id: 'legend-3',
    title: "Ding Ning - The Grand Slam Champion",
    description: "Les moments marquants de Ding Ning, la championne du Grand Chelem, avec sa technique unique.",
    youtubeId: "WykRbfiwKEU",
    category: 'legends',
    dateAdded: "2023-11-10",
  },
  {
    id: 'legend-4',
    title: "Timo Boll - European Legend",
    description: "Les plus beaux points et la carrière exceptionnelle de Timo Boll, légende européenne du tennis de table.",
    youtubeId: "sOX9IixjIbQ",
    category: 'legends',
    dateAdded: "2023-11-15",
  },
  {
    id: 'legend-5',
    title: "Simon Gauzy - Les Meilleurs Points",
    description: "Découvrez les meilleurs points et les coups incroyables du joueur français Simon Gauzy.",
    youtubeId: "lxZiv-fiHkY",
    category: 'legends',
    dateAdded: "2024-07-30",
  },
];