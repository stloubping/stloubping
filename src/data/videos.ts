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
    description: "Les moments forts de la finale simple messieurs entre Liang Jingkun et Lin Gaoyuan au WTT Contender Doha 2024.",
    youtubeId: "7pl_dmo24nM",
    category: 'wtt',
    dateAdded: "2024-01-15",
  },
  {
    id: 'wtt-2',
    title: "WTT Star Contender Goa 2024 - Finale Hommes",
    description: "Revivez la finale simple messieurs entre Liang Jingkun et Lin Gaoyuan au WTT Star Contender Goa 2024.",
    youtubeId: "hBvyU6guwm8",
    category: 'wtt',
    dateAdded: "2024-02-01",
  },
  {
    id: 'wtt-3',
    title: "WTT Champions Incheon 2024 - Finale Hommes",
    description: "Les échanges incroyables de la finale simple messieurs entre Liang Jingkun et Lin Gaoyuan au WTT Champions Incheon 2024.",
    youtubeId: "uZ2wVtstweQ",
    category: 'wtt',
    dateAdded: "2024-07-28",
  },
  {
    id: 'wtt-4',
    title: "WTT Saudi Smash 2024 - Finale Hommes",
    description: "Les meilleurs moments de la finale simple messieurs entre Liang Jingkun et Lin Gaoyuan au WTT Saudi Smash 2024.",
    youtubeId: "37tr9lUgn6Q",
    category: 'wtt',
    dateAdded: "2024-07-29",
  },
  // Vidéos Tutos
  {
    id: 'tuto-1',
    title: "Le Service Revers : Surprenez vos adversaires",
    description: "Apprenez à maîtriser le service revers pour prendre l'avantage.",
    youtubeId: "RXSJkvkzVpY",
    category: 'tutos',
    dateAdded: "2024-07-25",
  },
  {
    id: 'tuto-2',
    title: "Le Topspin Coup Droit : Puissance et Précision",
    description: "Développez un topspin coup droit dévastateur avec ce tutoriel.",
    youtubeId: "2Te0542ZiaE",
    category: 'tutos',
    dateAdded: "2024-07-26",
  },
  // Vidéos Les Légendes
  {
    id: 'legend-1',
    title: "Ma Long - The Dragon",
    description: "Les meilleurs moments de Ma Long, le 'Dragon' du tennis de table.",
    youtubeId: "VzzvEG2rVi0",
    category: 'legends',
    dateAdded: "2023-11-01",
  },
  {
    id: 'legend-2',
    title: "Jan-Ove Waldner - The Mozart of Table Tennis",
    description: "Découvrez la magie de Jan-Ove Waldner, une légende suédoise.",
    youtubeId: "7KtWBNL9yEQ",
    category: 'legends',
    dateAdded: "2023-11-05",
  },
  {
    id: 'legend-3',
    title: "Ding Ning - The Grand Slam Champion",
    description: "Les moments clés de la carrière de Ding Ning, championne du Grand Chelem.",
    youtubeId: "WykRbfiwKEU",
    category: 'legends',
    dateAdded: "2023-11-10",
  },
  {
    id: 'legend-4',
    title: "Timo Boll - European Legend",
    description: "Les plus beaux points de Timo Boll, l'icône européenne.",
    youtubeId: "sOX9IixjIbQ",
    category: 'legends',
    dateAdded: "2023-11-15",
  },
  {
    id: 'legend-5',
    title: "Simon Gauzy - Les Meilleurs Points",
    description: "Découvrez les actions les plus spectaculaires du joueur français Simon Gauzy.",
    youtubeId: "lxZiv-fiHkY",
    category: 'legends',
    dateAdded: "2024-07-30",
  },
];