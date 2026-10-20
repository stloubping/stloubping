import { countStageDays, stageDays, type StageDays } from "@/lib/stageCapacity";

export default function StageAttendanceSummary({ rows, capacity }: { rows: StageDays[]; capacity: number | null }) {
  const counts = countStageDays(rows);
  return <section aria-label="Effectifs par jour" className="space-y-3">
    <p className="text-sm text-muted-foreground">{capacity === null ? "Aucune limite de places définie." : `Limite : ${capacity} joueurs par jour. Le total des inscrits au stage n’est pas limité.`}</p>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{stageDays.map(({ key, label }) => <div key={key} className={`rounded-xl border p-3 ${capacity !== null && counts[key] >= capacity ? "border-amber-300 bg-amber-50" : "bg-white"}`}>
      <p className="text-sm font-bold">{label}</p><p className="mt-1 text-lg font-black">{counts[key]}{capacity !== null ? ` / ${capacity}` : counts[key] === 1 ? " joueur" : " joueurs"}</p>
    </div>)}</div>
  </section>;
}
