import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Loader2, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { competitions20262027, type CompetitionEvent } from "@/data/competitions20262027";
import { mergeCompetitionCalendar, validateCalendarDates } from "@/lib/competitionCalendar";

type CalendarRow = CompetitionEvent & { location: string; details: string };

const CompetitionCalendarAdmin = () => {
  const [events, setEvents] = useState<CalendarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("competition_calendar_events")
      .select("id,date,end_date,title,category,phase,location,details").order("date").order("sort_order");
    setLoadError(Boolean(error));
    if (error) toast.error("Impossible de charger les modifications existantes. Réessayez avant d’enregistrer.");
    setEvents(mergeCompetitionCalendar(competitions20262027, data ?? [])
      .map((event) => ({ ...event, location: event.location ?? "", details: event.details ?? "" }))
      .sort((a, b) => a.date.localeCompare(b.date)));
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const update = (id: string, field: "date" | "endDate" | "location" | "details", value: string) => {
    setEvents((current) => current.map((event) => event.id === id ? { ...event, [field]: value } : event));
  };

  const save = async (event: CalendarRow) => {
    const validationError = validateCalendarDates(event.date, event.endDate);
    if (validationError) { toast.error(validationError); return; }
    setSaving(event.id);
    try {
      const { error } = await supabase.from("competition_calendar_events").upsert({
        id: event.id, date: event.date, end_date: event.endDate || null,
        title: event.title, category: event.category, phase: event.phase || null,
        location: event.location.trim(), details: event.details.trim(),
        sort_order: competitions20262027.findIndex((item) => item.id === event.id),
      }).select("id").single();
      if (error) throw error;
      toast.success("Dates et Lieu / Infos enregistrés dans le calendrier public.");
    } catch {
      toast.error("Les modifications n’ont pas pu être enregistrées.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <section className="min-h-[70vh] bg-clubLight px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <Button asChild variant="ghost" className="mb-4"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" />Retour au tableau de bord</Link></Button>
        <Card className="overflow-hidden border-0 shadow-xl">
          <CardHeader className="bg-clubDark text-white">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-8 w-8 shrink-0 text-clubPrimary" />
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Compétitions</p>
                <CardTitle className="text-2xl">Calendrier Interactif des Compétitions</CardTitle>
                <p className="mt-1 text-sm text-white/70">Modifiez les dates et les champs « Lieu / Infos ». Les changements s’appliquent à l’accueil et à la page calendrier.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4 md:p-6">
            {loadError && <div role="alert" className="rounded-xl border border-destructive p-4 text-sm">Le chargement a échoué. L’enregistrement est désactivé pour protéger les données existantes. <Button variant="link" onClick={() => void load()}>Réessayer</Button></div>}
            {loading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div> : events.map((event) => (
              <div key={event.id} className="space-y-3 rounded-xl border bg-white p-4">
                <p className="font-black text-clubDark">{event.title}</p>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.3fr_1.5fr_auto] xl:items-end">
                  <label className="text-sm font-bold">Date de début<Input type="date" required value={event.date} disabled={saving !== null || loadError} onChange={(e) => update(event.id, "date", e.target.value)} /></label>
                  <label className="text-sm font-bold">Date de fin (facultative)<Input type="date" min={event.date || undefined} value={event.endDate ?? ""} disabled={saving !== null || loadError} onChange={(e) => update(event.id, "endDate", e.target.value)} /></label>
                  <label className="text-sm font-bold">Lieu<Input value={event.location} disabled={saving !== null || loadError} onChange={(e) => update(event.id, "location", e.target.value)} placeholder="Ex. Gymnase de Saint-Loubès" /></label>
                  <label className="text-sm font-bold">Infos<Input value={event.details} disabled={saving !== null || loadError} onChange={(e) => update(event.id, "details", e.target.value)} placeholder="Informations complémentaires" /></label>
                  <Button aria-label={`Enregistrer ${event.title}`} onClick={() => void save(event)} disabled={saving !== null || loadError}>{saving === event.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Enregistrer</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompetitionCalendarAdmin;
