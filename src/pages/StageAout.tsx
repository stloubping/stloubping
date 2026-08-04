import { FormEvent, useCallback, useEffect, useState } from "react";
import { Check, Loader2, Printer, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
type Registration = Record<DayKey, boolean> & { id: string; first_name: string; last_name: string };
const AUGUST = "ao\u00fbt";
const days: Array<{ key: DayKey; label: string }> = [
  { key: "monday", label: "Lundi" }, { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" }, { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
];
const emptyDays = (): Record<DayKey, boolean> => ({ monday: false, tuesday: false, wednesday: false, thursday: false, friday: false });
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]!));

const StageAout = () => {
  const [rows, setRows] = useState<Registration[]>([]);
  const [firstName, setFirstName] = useState(""); const [lastName, setLastName] = useState(""); const [emergencyPhone, setEmergencyPhone] = useState("");
  const [selected, setSelected] = useState(emptyDays); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from("august_stage_registrations").select("id,first_name,last_name,monday,tuesday,wednesday,thursday,friday").order("last_name").order("first_name");
    if (error) toast.error("Impossible de charger les inscriptions."); else setRows((data ?? []) as Registration[]);
    setLoading(false);
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!emergencyPhone.trim()) return toast.error("Saisissez un numéro de téléphone à contacter.");
    if (!Object.values(selected).some(Boolean)) return toast.error("Choisissez au moins une journée.");
    setSaving(true);
    const { error } = await supabase.from("august_stage_registrations").insert({ first_name: firstName.trim(), last_name: lastName.trim(), emergency_phone: emergencyPhone.trim(), ...selected });
    if (error) toast.error("L'inscription n'a pas pu etre enregistree.");
    else { setFirstName(""); setLastName(""); setEmergencyPhone(""); setSelected(emptyDays()); await refresh(); toast.success("Inscription enregistree."); }
    setSaving(false);
  };
  const print = () => {
    const popup = window.open("", "_blank", "width=1100,height=750");
    if (!popup) return toast.error("Autorisez les fenetres surgissantes pour imprimer.");
    const headers = days.map((day) => "<th>" + day.label + "</th>").join("");
    const body = rows.map((row) => "<tr><td>" + escapeHtml(row.last_name) + "</td><td>" + escapeHtml(row.first_name) + "</td>" + days.map((day) => "<td>" + (row[day.key] ? "&#10003;" : "&mdash;") + "</td>").join("") + "</tr>").join("");
    popup.document.write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Stage aout</title><style>body{font-family:Arial;padding:28px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #bbb;padding:10px;text-align:center}th{background:#171717;color:#fff}td:first-child,td:nth-child(2){text-align:left}</style></head><body><h1>Stage aout - inscriptions</h1><table><thead><tr><th>Nom</th><th>Prenom</th>' + headers + '</tr></thead><tbody>' + body + '</tbody></table></body></html>');
    popup.document.close(); popup.focus(); popup.print();
  };
  return <div className="min-h-screen bg-clubLight"><section className="bg-clubDark px-4 py-12 text-white"><div className="container mx-auto max-w-6xl"><p className="text-sm font-extrabold uppercase tracking-[0.2em] text-clubPrimary">Les joueurs</p><h1 className="mt-2 text-4xl font-black md:text-5xl">Stage {AUGUST}</h1><p className="mt-3 text-white/70">Cochez les journees auxquelles vous serez present.</p></div></section><main className="container mx-auto max-w-6xl space-y-8 px-4 py-10">
    <Card className="border-0 shadow-xl"><CardHeader><CardTitle className="flex gap-2"><UserPlus className="text-clubPrimary" />Mon inscription</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="space-y-6"><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="stage-last">Nom</Label><Input id="stage-last" className="mt-2" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={80} required /></div><div><Label htmlFor="stage-first">Prénom</Label><Input id="stage-first" className="mt-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={80} required /></div><div className="sm:col-span-2"><Label htmlFor="stage-emergency-phone">Tél. à contacter en cas de problème</Label><Input id="stage-emergency-phone" type="tel" inputMode="tel" autoComplete="tel" className="mt-2" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} minLength={6} maxLength={30} placeholder="06 12 34 56 78" required /></div></div><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">{days.map((day) => <label key={day.key} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${selected[day.key] ? "border-clubPrimary bg-clubPrimary/5" : "bg-white"}`}><Checkbox checked={selected[day.key]} onCheckedChange={(checked) => setSelected((current) => ({ ...current, [day.key]: checked === true }))} /><strong>{day.label}</strong></label>)}</div><Button type="submit" disabled={saving} className="w-full py-6 sm:w-auto">{saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}Valider mon inscription</Button></form></CardContent></Card>
    <Card className="overflow-hidden border-0 shadow-xl"><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Tableau des {"pr\u00e9sences"}</CardTitle><p className="text-sm text-muted-foreground">{rows.length} inscription{rows.length > 1 ? "s" : ""}</p></div><Button variant="outline" onClick={print} disabled={!rows.length}><Printer className="mr-2 h-4 w-4" />Imprimer</Button></CardHeader><CardContent className="p-0">{loading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div> : !rows.length ? <p className="p-10 text-center text-muted-foreground">Aucune inscription.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="bg-clubDark text-white"><tr><th className="p-4 text-left">Nom</th><th className="p-4 text-left">{"Pr\u00e9nom"}</th>{days.map((day) => <th key={day.key} className="p-4">{day.label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td className="border-b p-4 font-black uppercase">{row.last_name}</td><td className="border-b p-4">{row.first_name}</td>{days.map((day) => <td key={day.key} className="border-b p-4 text-center">{row[day.key] ? <Check className="mx-auto h-5 w-5 text-emerald-600" /> : "\u2014"}</td>)}</tr>)}</tbody></table></div>}</CardContent></Card>
  </main></div>;
};
export default StageAout;
