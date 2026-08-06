export const WEEK_DAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const;

export const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getCurrentWeekDays = (reference = new Date()) => {
  const today = new Date(reference);
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
      timeLabel: index < 5 ? "18 h" : "10 h",
    };
  });
};

export const getCurrentWeekLabel = (days = getCurrentWeekDays()) => {
  const formatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });
  return `Du ${formatter.format(days[0].date)} au ${formatter.format(days[6].date)}`;
};

export const getRoomAttendanceWeekDays = (weekOffset = 0) => {
  const reference = new Date();
  if (reference.getDay() === 1 && reference.getHours() < 1) {
    reference.setDate(reference.getDate() - 1);
  }
  reference.setDate(reference.getDate() + weekOffset * 7);
  return getCurrentWeekDays(reference);
};
