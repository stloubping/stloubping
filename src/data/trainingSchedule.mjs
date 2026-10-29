export const trainingSchedule = [
  {
    day: "Lundi",
    slots: [{ time: "18h00 – 20h00", label: "Entraînement libre", tone: "libre" }],
  },
  {
    day: "Mardi",
    slots: [{ time: "18h00 – 20h00", label: "Entraînement libre", tone: "libre" }],
  },
  {
    day: "Mercredi",
    slots: [
      { time: "15h30 – 16h30", label: "Loisirs 7–10 ans", tone: "jeunes" },
      { time: "16h30 – 18h00", label: "Loisirs 11–16 ans", tone: "jeunes" },
      { time: "18h00 – 19h30", label: "Jeunes compétitions", tone: "jeunes" },
      { time: "19h30 – 21h00", label: "Adultes compétitions", tone: "adultes" },
    ],
  },
  {
    day: "Jeudi",
    slots: [
      { time: "17h00 – 18h00", label: "Jeunes perfectionnement", tone: "jeunes" },
      { time: "18h00 – 19h30", label: "Loisirs 11–16 ans", tone: "jeunes" },
      { time: "19h30 – 21h00", label: "Adultes loisirs", tone: "adultes" },
    ],
  },
  {
    day: "Vendredi",
    slots: [
      { time: "17h00 – 18h00", label: "Jeunes perfectionnement", tone: "jeunes" },
      { time: "18h00 – 20h00", label: "Jeunes compétitions", tone: "jeunes" },
      { time: "20h00 – 00h00", label: "Critérium Gironde", tone: "competition" },
    ],
  },
  {
    day: "Samedi",
    slots: [
      { time: "09h30 – 11h00", label: "Loisirs 7–10 ans", tone: "jeunes" },
      { time: "11h00 – 12h00", label: "Jeunes perfectionnement", tone: "jeunes" },
    ],
  },
];
