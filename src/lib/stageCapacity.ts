export const stageDays = [
  { key: "monday", label: "Lundi" }, { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" }, { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
] as const;
export type StageDayKey = typeof stageDays[number]["key"];
export type StageDays = Record<StageDayKey, boolean>;
export type StageDayCounts = Record<StageDayKey, number>;
export const emptyStageDays = (): StageDays => ({ monday: false, tuesday: false, wednesday: false, thursday: false, friday: false });
export const isStageDayFull = (counts: StageDayCounts | undefined, capacity: number | null, day: StageDayKey) =>
  capacity !== null && counts !== undefined && counts[day] >= capacity;
export const blockedStageDays = (selected: StageDays, counts: StageDayCounts | undefined, capacity: number | null) =>
  stageDays.filter(({ key }) => selected[key] && isStageDayFull(counts, capacity, key));
export const allStageDaysFull = (counts: StageDayCounts | undefined, capacity: number | null) =>
  stageDays.every(({ key }) => isStageDayFull(counts, capacity, key));
export const countStageDays = (rows: StageDays[]): StageDayCounts => Object.fromEntries(
  stageDays.map(({ key }) => [key, rows.filter((row) => row[key]).length]),
) as StageDayCounts;
export const stageRegistrationError = (error: { code?: string; message?: string }) =>
  error.code === "23514" && error.message?.startsWith("Journée complète")
    ? error.message : "L’inscription n’a pas pu être enregistrée. Vérifiez vos informations et les places disponibles.";
