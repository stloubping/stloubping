import { type FormEvent, useEffect, useState } from "react";
import { CalendarDays, Check, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StageDaySelector from "@/components/StageDaySelector";
import { supabase } from "@/integrations/supabase/client";
import { allStageDaysFull, blockedStageDays, emptyStageDays, stageRegistrationError } from "@/lib/stageCapacity";
import { useStageDayCounts } from "@/lib/useStageDayCounts";

type Stage = { id: string; name: string; start_date: string | null; end_date: string | null; daily_price: number; package_price: number; capacity: number | null };
type Registrant = { first_name: string; last_name: string };
const euro = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
const date = (value: string | null) => value ? new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "Dates à préciser";

export default function StageRegistrationForm({ slug, legacy = false }: { slug: string | undefined; legacy?: boolean }) {
  const [stage, setStage] = useState<Stage | null>(null);
  const [players, setPlayers] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState(emptyStageDays);
  const [saving, setSaving] = useState(false);
  const table = legacy ? "august_stage_registrations" : "stage_registrations";
  const availability = useStageDayCounts(stage?.id);

  useEffect(() => {
    let active = true;
    setStage(null); setPlayers([]); setLoading(true); setLoadError(false); setSelected(emptyStageDays());
    const load = async () => {
      const { data, error } = await supabase.from("stages")
        .select("id,name,start_date,end_date,daily_price,package_price,capacity").eq("slug", slug).maybeSingle();
      if (!active) return;
      if (error || !data) { setLoadError(Boolean(error)); setLoading(false); return; }
      setStage(data as Stage);
      let namesQuery = supabase.from(table).select("first_name,last_name");
      if (!legacy) namesQuery = namesQuery.eq("stage_id", data.id);
      const { data: names, error: namesError } = await namesQuery.order("last_name").order("first_name");
      if (!active) return;
      if (namesError) toast.error("La liste des inscrits n’a pas pu être chargée.");
      setPlayers(names ?? []);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [slug, table, legacy]);

  const full = allStageDaysFull(availability.data, stage?.capacity ?? null);
  const blocked = blockedStageDays(selected, availability.data, stage?.capacity ?? null);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stage || availability.isPending || availability.isError) return;
    if (blocked.length) return toast.error(`Journée complète : ${blocked.map((day) => day.label).join(", ")}. Choisissez une autre journée.`);
    if (!phone.trim() || !Object.values(selected).some(Boolean)) return toast.error("Renseignez le téléphone et au moins une journée.");
    setSaving(true);
    try {
      const { error } = await supabase.from(table).insert({
        ...(!legacy ? { stage_id: stage.id } : {}),
        first_name: firstName.trim(), last_name: lastName.trim(), emergency_phone: phone.trim(), ...selected,
      });
      if (error) {
        toast.error(stageRegistrationError(error));
      } else {
        setPlayers((current) => [...current, { first_name: firstName.trim(), last_name: lastName.trim() }]
          .sort((a, b) => a.last_name.localeCompare(b.last_name, "fr") || a.first_name.localeCompare(b.first_name, "fr")));
        setFirstName(""); setLastName(""); setPhone(""); setSelected(emptyStageDays());
        toast.success("Inscription enregistrée.");
      }
      await availability.refetch();
    } catch { toast.error("L’inscription n’a pas pu être confirmée. Vérifiez la liste avant de réessayer."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="mr-2 h-6 w-6 animate-spin" />Chargement du stage…</div>;
  if (!stage) return <div className="flex min-h-[60vh] items-center justify-center">{loadError ? "Le stage n’a pas pu être chargé. Rechargez la page pour réessayer." : "Stage introuvable."}</div>;
  return <div className="min-h-screen bg-clubLight">
    <section className="bg-clubDark px-4 py-12 text-white"><div className="container mx-auto max-w-6xl">
      <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-clubPrimary">Les joueurs</p>
      <h1 className="mt-2 text-4xl font-black md:text-5xl">{stage.name}</h1>
      <p className="mt-3 flex items-center gap-2 text-white/80"><CalendarDays className="h-5 w-5 text-clubPrimary" />{date(stage.start_date)}{stage.end_date ? ` – ${date(stage.end_date)}` : ""}</p>
    </div></section>
    <main className="container mx-auto max-w-6xl space-y-8 px-4 py-10">
      <Card className="border-0 shadow-xl"><CardHeader>
        <CardTitle className="flex gap-2"><UserPlus className="text-clubPrimary" />Mon inscription</CardTitle>
        <p className="text-sm text-muted-foreground">{euro(stage.daily_price)} par jour · forfait 5 jours : {euro(stage.package_price)}</p>
        {stage.capacity !== null && <p className="text-sm text-muted-foreground">Limite de {stage.capacity} joueurs par jour, indépendamment du total des inscrits au stage.</p>}
      </CardHeader><CardContent>
        {availability.isError ? <div role="alert"><p>Les places disponibles n’ont pas pu être chargées.</p><Button variant="outline" onClick={() => void availability.refetch()}>Réessayer</Button></div>
          : full ? <p className="rounded-xl bg-amber-50 p-4 font-bold text-amber-900">Toutes les journées sont complètes. Les inscriptions sont fermées.</p>
          : <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="stage-last">Nom</Label><Input id="stage-last" className="mt-2" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={80} required /></div>
              <div><Label htmlFor="stage-first">Prénom</Label><Input id="stage-first" className="mt-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={80} required /></div>
              <div className="sm:col-span-2"><Label htmlFor="stage-phone">Tél. à contacter en cas de problème</Label><Input id="stage-phone" type="tel" inputMode="tel" className="mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} minLength={6} maxLength={30} required /></div>
            </div>
            <StageDaySelector selected={selected} onChange={setSelected} counts={availability.data} capacity={stage.capacity} disabled={saving || availability.isPending} />
            {blocked.length > 0 && <p role="alert" className="text-sm font-semibold text-red-700">{blocked.map((day) => day.label).join(", ")} : complet. Décochez ces journées pour continuer.</p>}
            <Button type="submit" disabled={saving || availability.isPending || blocked.length > 0} className="w-full bg-clubPrimary py-6 sm:w-auto">{saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}Valider mon inscription</Button>
          </form>}
      </CardContent></Card>
      <Card className="border-0 shadow-xl"><CardHeader><CardTitle>Joueurs inscrits</CardTitle></CardHeader><CardContent>
        {players.length ? <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{players.map((player, index) => <li key={`${player.last_name}-${player.first_name}-${index}`} className="rounded-lg bg-white px-4 py-3 font-semibold">{player.last_name} {player.first_name}</li>)}</ul> : <p className="text-muted-foreground">Aucun joueur inscrit pour le moment.</p>}
      </CardContent></Card>
    </main>
  </div>;
}
