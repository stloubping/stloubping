import { FormEvent, useState } from "react";
import { Check, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
const AUGUST = "ao\u00fbt";
const days: Array<{ key: DayKey; label: string }> = [
  { key: "monday", label: "Lundi" }, { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" }, { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
];
const emptyDays = (): Record<DayKey, boolean> => ({ monday: false, tuesday: false, wednesday: false, thursday: false, friday: false });
const StageAout = () => {
  const [firstName, setFirstName] = useState(""); const [lastName, setLastName] = useState(""); const [emergencyPhone, setEmergencyPhone] = useState("");
  const [selected, setSelected] = useState(emptyDays); const [saving, setSaving] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!emergencyPhone.trim()) return toast.error("Saisissez un numéro de téléphone à contacter.");
    if (!Object.values(selected).some(Boolean)) return toast.error("Choisissez au moins une journée.");
    setSaving(true);
    const { error } = await supabase.from("august_stage_registrations").insert({ first_name: firstName.trim(), last_name: lastName.trim(), emergency_phone: emergencyPhone.trim(), ...selected });
    if (error) toast.error("L'inscription n'a pas pu etre enregistree.");
    else { setFirstName(""); setLastName(""); setEmergencyPhone(""); setSelected(emptyDays()); toast.success("Inscription enregistree."); }
    setSaving(false);
  };
  return <div className="min-h-screen bg-clubLight"><section className="bg-clubDark px-4 py-12 text-white"><div className="container mx-auto max-w-6xl"><p className="text-sm font-extrabold uppercase tracking-[0.2em] text-clubPrimary">Les joueurs</p><h1 className="mt-2 text-4xl font-black md:text-5xl">Stage {AUGUST}</h1><p className="mt-3 text-white/70">Cochez les journees auxquelles vous serez present.</p></div></section><main className="container mx-auto max-w-6xl space-y-8 px-4 py-10">
    <Card className="border-0 shadow-xl"><CardHeader><CardTitle className="flex gap-2"><UserPlus className="text-clubPrimary" />Mon inscription</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="space-y-6"><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="stage-last">Nom</Label><Input id="stage-last" className="mt-2" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={80} required /></div><div><Label htmlFor="stage-first">Prénom</Label><Input id="stage-first" className="mt-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={80} required /></div><div className="sm:col-span-2"><Label htmlFor="stage-emergency-phone">Tél. à contacter en cas de problème</Label><Input id="stage-emergency-phone" type="tel" inputMode="tel" autoComplete="tel" className="mt-2" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} minLength={6} maxLength={30} placeholder="06 12 34 56 78" required /></div></div><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">{days.map((day) => <label key={day.key} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${selected[day.key] ? "border-clubPrimary bg-clubPrimary/5" : "bg-white"}`}><Checkbox checked={selected[day.key]} onCheckedChange={(checked) => setSelected((current) => ({ ...current, [day.key]: checked === true }))} /><strong>{day.label}</strong></label>)}</div><Button type="submit" disabled={saving} className="w-full py-6 sm:w-auto">{saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}Valider mon inscription</Button></form></CardContent></Card>
  </main></div>;
};
export default StageAout;
