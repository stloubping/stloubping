export const WEEK_DAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const;

export const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getCurrentWeekDays = () => {
  const today = new Date();
  const monday = new Date(today);
  const weekday = today.getDay() || 7;
  monday.setDate(today.getDate() - weekday + 1);
  monday.setHours(0, 0, 0, 0);

  return WEEK_DAY_LABELS.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      label,
      date,
      dateKey: toLocalDateKey(date),
      shortDate: new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" }).format(date),
    };
  });
};

export const getCurrentWeekLabel = () => {
  const days = getCurrentWeekDays();
  const formatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });
  return `Du ${formatter.format(days[0].date)} au ${formatter.format(days[6].date)}`;
};
