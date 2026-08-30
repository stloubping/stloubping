import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Loader2, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { competitions20262027, type CompetitionEvent } from "@/data/competitions20262027";

type CalendarRow = CompetitionEvent & { endDate?: string; location: string; details: string };
const seedRows = competitions20262027.map((event, index) => ({ id: event.id, date: event.date, end_date: event.endDate || null, title: event.title, category: event.category, phase: event.phase || null, location: event.location || "", details: event.details || "", sort_order: index }));

const CompetitionCalendarAdmin = () => {
  const [events, setEvents] = useState<CalendarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const load = async () => {
    setLoading(true);
    let { data, error } = await supabase.from("competition_calendar_events").select("id,date,end_date,title,category,phase,location,details").order("date").order("sort_order");
    if (!error && (!data || data.length === 0)) {
      const seeded = await supabase.from("competition_calendar_events").upsert(seedRows);
      if (!seeded.error) ({ data, error } = await supabase.from("competition_calendar_events").select("id,date,end_date,title,category,phase,location,details").order("date").order("sort_order"));
    }
    if (error) toast.error("Le calendrier n’a pas pu être chargé.");
    setEvents((data ?? []).map((event) => ({ id: event.id, date: event.date, endDate: event.end_date ?? undefined, title: event.title, category: event.category as CompetitionEvent["category"], phase: event.phase as CompetitionEvent["phase"] | undefined, location: event.location ?? "", details: event.details ?? "" })));
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);
  const update = (id: string, field: "location" | "details", value: string) => setEvents((current) => current.map((event) => event.id === id ? { ...event, [field]: value } : event));
  const save = async (event: CalendarRow) => {
    setSaving(event.id);
    const { error } = await supabase.from("competition_calendar_events").update({ location: event.location.trim() || null, details: event.details.trim() || null }).eq("id", event.id);
    if (error) toast.error("Le champ « Lieu / Infos » n’a pas pu être enregistré."); else toast.success("Lieu / Infos enregistré.");
    setSaving(null);
  };
  return <section className="min-h-[70vh] bg-clubLight px-4 py-10"><div className="mx-auto max-w-7xl"><Button asChild variant="ghost" className="mb-4"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" />Retour au tableau de bord</Link></Button><Card className="overflow-hidden border-0 shadow-xl"><CardHeader className="bg-clubDark text-white"><div className="flex items-center gap-3"><CalendarDays className="h-8 w-8 text-clubPrimary" /><div><p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Compétitions</p><CardTitle className="text-2xl">Calendrier Interactif des Compétitions</CardTitle><p className="mt-1 text-sm text-white/70">Modifiez uniquement le champ « Lieu / Infos » du calendrier public.</p></div></div></CardHeader><CardContent className="space-y-3 p-4 md:p-6">{loading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div> : events.map((event) => <div key={event.id} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-[1fr_2fr_2fr_auto] md:items-end"><div><p className="text-xs font-bold uppercase text-muted-foreground">{new Date(`${event.date}T12:00:00`).toLocaleDateString("fr-FR")}</p><p className="font-black text-clubDark">{event.title}</p></div><label className="text-sm font-bold">Lieu<Input value={event.location} onChange={(e) => update(event.id, "location", e.target.value)} placeholder="Ex. Gymnase de Saint-Loubès" /></label><label className="text-sm font-bold">Infos<Input value={event.details} onChange={(e) => update(event.id, "details", e.target.value)} placeholder="Informations complémentaires" /></label><Button onClick={() => void save(event)} disabled={saving !== null}>{saving === event.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Enregistrer</Button></div>)}</CardContent></Card></div></section>;
};
export default CompetitionCalendarAdmin;
