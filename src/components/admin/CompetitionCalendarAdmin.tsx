import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { competitions20262027, categoryLabels, type CompetitionEvent } from "@/data/competitions20262027";

type EditableEvent = CompetitionEvent & { endDate?: string };
const categories = Object.keys(categoryLabels) as CompetitionEvent["category"][];
const blankEvent = (): EditableEvent => ({ id: `event-${Date.now()}`, date: new Date().toISOString().slice(0, 10), title: "Nouvel événement", category: "club", location: "", details: "" });

const CompetitionCalendarAdmin = () => {
  const [events, setEvents] = useState<EditableEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("competition_calendar_events").select("*").order("date").order("sort_order");
    if (error) { setEvents([]); toast.info("La table n’est pas encore alimentée. Importez le calendrier actuel."); }
    else setEvents((data ?? []).map((item) => ({ id: item.id, date: item.date, endDate: item.end_date ?? undefined, title: item.title, category: item.category as CompetitionEvent["category"], phase: item.phase as CompetitionEvent["phase"] | undefined, location: item.location ?? "", details: item.details ?? "" })));
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const update = (id: string, patch: Partial<EditableEvent>) => setEvents((current) => current.map((event) => event.id === id ? { ...event, ...patch } : event));
  const save = async (event: EditableEvent) => {
    setSaving(event.id);
    const payload = { id: event.id, date: event.date, end_date: event.endDate || null, title: event.title.trim(), category: event.category, phase: event.phase || null, location: event.location?.trim() || null, details: event.details?.trim() || null, sort_order: events.findIndex((item) => item.id === event.id) };
    const { error } = await supabase.from("competition_calendar_events").upsert(payload);
    if (error) toast.error("Événement non enregistré."); else toast.success("Événement enregistré.");
    setSaving(null);
  };
  const remove = async (event: EditableEvent) => {
    if (!window.confirm(`Supprimer « ${event.title} » ?`)) return;
    setSaving(event.id);
    const { error } = await supabase.from("competition_calendar_events").delete().eq("id", event.id);
    if (error) toast.error("Événement non supprimé."); else { setEvents((current) => current.filter((item) => item.id !== event.id)); toast.success("Événement supprimé."); }
    setSaving(null);
  };
  const importCurrent = async () => {
    if (!window.confirm("Importer le calendrier actuel ? Les événements déjà enregistrés seront remplacés.")) return;
    setImporting(true);
    const rows = competitions20262027.map((event, index) => ({ id: event.id, date: event.date, end_date: event.endDate || null, title: event.title, category: event.category, phase: event.phase || null, location: event.location || null, details: event.details || null, sort_order: index }));
    const { error } = await supabase.from("competition_calendar_events").upsert(rows);
    if (error) toast.error("Import impossible."); else { toast.success("Calendrier actuel importé."); await load(); }
    setImporting(false);
  };

  return <section className="min-h-[70vh] bg-clubLight px-4 py-10"><div className="mx-auto max-w-7xl"><Button asChild variant="ghost" className="mb-4"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" />Retour au tableau de bord</Link></Button><Card className="overflow-hidden border-0 shadow-xl"><CardHeader className="bg-clubDark text-white"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><CalendarDays className="h-8 w-8 text-clubPrimary" /><div><p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Compétitions</p><CardTitle className="text-2xl">Calendrier Interactif des Compétitions</CardTitle><p className="mt-1 text-sm text-white/70">Modifiez les dates affichées sur l’accueil et la page calendrier.</p></div></div><div className="flex flex-wrap gap-2"><Button onClick={() => setEvents((current) => [...current, blankEvent()])} className="bg-clubPrimary font-bold"><Plus className="mr-2 h-4 w-4" />Ajouter</Button><Button onClick={() => void importCurrent()} disabled={importing} variant="outline" className="border-white/30 bg-white/10 text-white hover:text-white">{importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Importer le calendrier actuel</Button></div></div></CardHeader><CardContent className="space-y-4 p-4 md:p-6">{loading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div> : events.length === 0 ? <p className="py-12 text-center text-muted-foreground">Aucun événement. Cliquez sur « Importer le calendrier actuel ».</p> : events.map((event) => <div key={event.id} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-[1fr_1fr_1.5fr_1fr_1fr_auto] md:items-end"><label className="text-sm font-bold">Date<Input type="date" value={event.date} onChange={(e) => update(event.id, { date: e.target.value })} /></label><label className="text-sm font-bold">Fin (facultatif)<Input type="date" value={event.endDate || ""} onChange={(e) => update(event.id, { endDate: e.target.value || undefined })} /></label><label className="text-sm font-bold">Titre<Input value={event.title} onChange={(e) => update(event.id, { title: e.target.value })} /></label><label className="text-sm font-bold">Catégorie<Select value={event.category} onValueChange={(value) => update(event.id, { category: value as CompetitionEvent["category"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category} value={category}>{categoryLabels[category].label}</SelectItem>)}</SelectContent></Select></label><label className="text-sm font-bold">Lieu<Input value={event.location || ""} onChange={(e) => update(event.id, { location: e.target.value })} /></label><div className="flex gap-2"><Button size="icon" onClick={() => void save(event)} disabled={saving !== null} aria-label="Enregistrer">{saving === event.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}</Button><Button size="icon" variant="outline" onClick={() => void remove(event)} disabled={saving !== null} aria-label="Supprimer"><Trash2 className="h-4 w-4 text-red-600" /></Button></div><label className="text-sm font-bold md:col-span-6">Détails (facultatif)<Input value={event.details || ""} onChange={(e) => update(event.id, { details: e.target.value })} /></label></div>)}</CardContent></Card></div></section>;
};
export default CompetitionCalendarAdmin;
