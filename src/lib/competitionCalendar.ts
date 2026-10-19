import type { CompetitionEvent } from "@/data/competitions20262027";

export type CalendarOverride = {
  id: string;
  date: string;
  end_date: string | null;
  location: string | null;
  details: string | null;
};

// Keep the complete season even when only a few events have been customized.
export const mergeCompetitionCalendar = (defaults: CompetitionEvent[], rows: CalendarOverride[]): CompetitionEvent[] => {
  const overrides = new Map(rows.map((row) => [row.id, row]));
  return defaults.map((event) => {
    const override = overrides.get(event.id);
    if (!override) return { ...event };
    return {
      ...event,
      date: override.date,
      endDate: override.end_date ?? undefined,
      location: override.location ?? event.location,
      details: override.details ?? event.details,
    };
  });
};

const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(Date.parse(`${value}T12:00:00Z`))
  && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;

export const validateCalendarDates = (date: string, endDate?: string): string | null => {
  if (!isDate(date)) return "Saisissez une date de début valide.";
  if (endDate && !isDate(endDate)) return "Saisissez une date de fin valide.";
  if (endDate && endDate < date) return "La date de fin ne peut pas précéder la date de début.";
  return null;
};

export const formatCalendarDates = (date: string, endDate?: string): string => {
  const formatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric", timeZone: "Europe/Paris" });
  const start = new Date(`${date}T12:00:00Z`);
  return endDate && endDate !== date
    ? `${formatter.format(start)} – ${formatter.format(new Date(`${endDate}T12:00:00Z`))}`
    : formatter.format(start);
};
