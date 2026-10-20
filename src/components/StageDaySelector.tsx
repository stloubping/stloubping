import { Checkbox } from "@/components/ui/checkbox";
import { isStageDayFull, stageDays, type StageDays, type StageDayCounts } from "@/lib/stageCapacity";

export default function StageDaySelector({ selected, onChange, counts, capacity, disabled }: {
  selected: StageDays; onChange: (days: StageDays) => void;
  counts: StageDayCounts | undefined; capacity: number | null; disabled: boolean;
}) {
  return <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">{stageDays.map((day) => {
    const full = isStageDayFull(counts, capacity, day.key);
    const remaining = capacity === null ? null : Math.max(0, capacity - (counts?.[day.key] ?? 0));
    return <label key={day.key} className={`flex items-center gap-3 rounded-xl border p-4 ${full ? "bg-muted text-muted-foreground" : selected[day.key] ? "border-clubPrimary bg-clubPrimary/5" : "bg-white"}`}>
      <Checkbox aria-label={day.label} checked={selected[day.key]} disabled={disabled || (full && !selected[day.key])}
        onCheckedChange={(checked) => onChange({ ...selected, [day.key]: checked === true })} />
      <span><strong>{day.label}</strong><span className="mt-1 block text-xs">{disabled ? "Chargement…" : full ? "Complet" : capacity === null ? "Disponible" : `${remaining} ${remaining === 1 ? "place restante" : "places restantes"}`}</span></span>
    </label>;
  })}</div>;
}
