import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type Visit = { page_path: string; session_id: string; visited_on: string };

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR");

export default function SiteVisitsAdmin() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(() =>
    new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" }),
  );

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const allVisits: Visit[] = [];
      const batchSize = 500;
      for (let offset = 0; ; offset += batchSize) {
        const { data, error: queryError } = await supabase
          .from("site_visits")
          .select("page_path,session_id,visited_on")
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(offset, offset + batchSize - 1);
        if (queryError) throw queryError;
        const batch = (data || []) as Visit[];
        allVisits.push(...batch);
        if (batch.length < batchSize) break;
      }
      setVisits(allVisits);
    } catch (loadError) {
      console.error("Impossible de charger les visites.", loadError);
      setError("Les statistiques n’ont pas pu être chargées. Cliquez sur Actualiser pour réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const homeVisits = visits.filter((visit) => visit.page_path === "/");
  const uniqueVisitors = new Set(visits.map((visit) => visit.session_id)).size;
  const byDay = useMemo(() => {
    const counts = new Map<string, number>();
    visits.forEach((visit) => counts.set(visit.visited_on, (counts.get(visit.visited_on) || 0) + 1));
    return [...counts.entries()].sort(([a], [b]) => b.localeCompare(a)).slice(0, 14);
  }, [visits]);
  const maxDailyVisits = Math.max(1, ...byDay.map(([, count]) => count));
  const pageCounts = useMemo(() => {
    const counts = new Map<string, number>();
    visits.forEach((visit) => counts.set(visit.page_path, (counts.get(visit.page_path) || 0) + 1));
    return [...counts.entries()].sort(([, a], [, b]) => b - a);
  }, [visits]);
  const dailyStats = useMemo(() => {
    const dailyVisits = visits.filter((visit) => visit.visited_on === selectedDay);
    const pages = new Map<string, { count: number; visitors: Set<string> }>();
    dailyVisits.forEach((visit) => {
      const page = pages.get(visit.page_path) || { count: 0, visitors: new Set<string>() };
      page.count += 1;
      page.visitors.add(visit.session_id);
      pages.set(visit.page_path, page);
    });
    return {
      total: dailyVisits.length,
      visitors: new Set(dailyVisits.map((visit) => visit.session_id)).size,
      pages: [...pages.entries()].sort(([pathA, a], [pathB, b]) =>
        b.count - a.count || pathA.localeCompare(pathB, "fr"),
      ),
    };
  }, [visits, selectedDay]);

  return (
    <section className="min-h-[70vh] bg-clubLight px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" />Retour au tableau de bord</Link>
        </Button>
        <Card className="overflow-hidden border-0 shadow-xl">
          <CardHeader className="bg-clubDark text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Statistiques</p>
                <CardTitle className="text-3xl">Visites du site</CardTitle>
                <p className="mt-1 text-sm text-white/70">Suivi anonyme des visites, sans adresse IP.</p>
              </div>
              <Button disabled={loading} variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={() => void load()}>
                <RefreshCw className="mr-2 h-4 w-4" />Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-5 md:p-7">
            {loading ? (
              <div className="flex justify-center py-16" role="status" aria-label="Chargement des statistiques">
                <Loader2 className="h-8 w-8 animate-spin text-clubPrimary" />
              </div>
            ) : error ? (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">{error}</p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Visites accueil</p><p className="text-3xl font-black">{homeVisits.length}</p></CardContent></Card>
                  <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Visiteurs estimés</p><p className="text-3xl font-black text-clubPrimary">{uniqueVisitors}</p></CardContent></Card>
                  <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Toutes les pages</p><p className="text-3xl font-black">{visits.length}</p></CardContent></Card>
                </div>

                <div className="rounded-xl border">
                  <div className="flex items-center gap-2 border-b bg-clubSection/30 p-4 font-bold"><Eye className="h-5 w-5 text-clubPrimary" />Toutes les pages — visites par jour</div>
                  {byDay.length === 0 ? (
                    <p className="p-8 text-center text-muted-foreground">Aucune visite enregistrée pour le moment.</p>
                  ) : (
                    <>
                      <div className="flex h-56 items-end gap-2 overflow-x-auto px-4 pb-4 pt-6">
                        {[...byDay].reverse().map(([date, count]) => (
                          <button key={date} type="button" onClick={() => setSelectedDay(date)} aria-pressed={selectedDay === date} aria-label={`Voir les pages visitées le ${formatDate(date)} : ${count} visites`} className="flex min-w-12 flex-1 flex-col items-center justify-end gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clubPrimary">
                            <span className="text-xs font-bold text-clubDark">{count}</span>
                            <div className={`w-full max-w-10 rounded-t-md ${selectedDay === date ? "bg-clubDark" : "bg-clubPrimary"}`} style={{ height: `${Math.max(8, (count / maxDailyVisits) * 150)}px` }} />
                            <span className="text-[10px] text-muted-foreground">{new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}</span>
                          </button>
                        ))}
                      </div>
                      <p className="px-4 pb-3 text-xs text-muted-foreground">Cliquez sur une journée pour voir les pages consultées ci-dessous.</p>
                      <div className="divide-y border-t">
                        {byDay.map(([date, count]) => (
                          <button key={date} type="button" onClick={() => setSelectedDay(date)} aria-pressed={selectedDay === date} className={`flex w-full justify-between gap-4 px-4 py-3 text-left hover:bg-muted/50 ${selectedDay === date ? "bg-clubPrimary/10" : ""}`}>
                            <span>{formatDate(date)}</span><strong>{count} visite{count > 1 ? "s" : ""}</strong>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="overflow-hidden rounded-xl border" aria-live="polite">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-clubSection/30 p-4">
                    <div>
                      <h2 className="font-bold">Pages visitées par jour</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Choisissez une date pour consulter son détail.</p>
                    </div>
                    <label className="flex items-center gap-3 text-sm font-semibold">
                      Journée
                      <Input type="date" value={selectedDay} onChange={(event) => { if (event.target.value) setSelectedDay(event.target.value); }} className="w-auto bg-white" />
                    </label>
                  </div>
                  <div className="border-b px-4 py-3">
                    <p className="font-semibold">{formatDate(selectedDay)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {dailyStats.total} visite{dailyStats.total > 1 ? "s" : ""} · {dailyStats.visitors} visiteur{dailyStats.visitors > 1 ? "s" : ""} estimé{dailyStats.visitors > 1 ? "s" : ""} · {dailyStats.pages.length} page{dailyStats.pages.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  {dailyStats.pages.length === 0 ? (
                    <p className="p-8 text-center text-muted-foreground">Aucune visite enregistrée pour cette journée.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <caption className="sr-only">Pages visitées le {formatDate(selectedDay)}</caption>
                        <thead className="bg-muted/40">
                          <tr><th scope="col" className="px-4 py-3 text-left">Page</th><th scope="col" className="px-4 py-3 text-right">Visites</th><th scope="col" className="px-4 py-3 text-right">Visiteurs estimés</th></tr>
                        </thead>
                        <tbody className="divide-y">
                          {dailyStats.pages.map(([path, stats]) => (
                            <tr key={path}>
                              <td className="min-w-40 px-4 py-3"><span className="break-all font-medium">{path === "/" ? "Accueil (/)" : path}</span></td>
                              <td className="px-4 py-3 text-right font-bold">{stats.count}</td>
                              <td className="px-4 py-3 text-right">{stats.visitors.size}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <p className="border-t px-4 py-3 text-xs text-muted-foreground">Les visiteurs sont estimés à partir des sessions de navigation anonymes.</p>
                </div>

                <div className="rounded-xl border">
                  <div className="border-b bg-clubSection/30 p-4 font-bold">Visites par page — tout l’historique</div>
                  {pageCounts.length === 0 ? <p className="p-8 text-center text-muted-foreground">Aucune page visitée pour le moment.</p> : (
                    <div className="divide-y">
                      {pageCounts.map(([path, count]) => (
                        <div key={path} className="flex items-center justify-between gap-4 px-4 py-3"><code className="min-w-0 break-all rounded bg-muted px-2 py-1 text-sm">{path}</code><strong className="shrink-0">{count} visite{count > 1 ? "s" : ""}</strong></div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
