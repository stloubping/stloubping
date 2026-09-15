import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type Visit = { page_path: string; session_id: string; visited_on: string };

export default function SiteVisitsAdmin() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_visits").select("page_path,session_id,visited_on").order("visited_on", { ascending: false }).limit(5000);
    if (!error) setVisits((data || []) as Visit[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);
  const homeVisits = visits.filter((visit) => visit.page_path === "/");
  const uniqueHomeVisitors = new Set(homeVisits.map((visit) => visit.session_id)).size;
  const byDay = useMemo(() => {
    const counts = new Map<string, number>();
    homeVisits.forEach((visit) => counts.set(visit.visited_on, (counts.get(visit.visited_on) || 0) + 1));
    return [...counts.entries()].sort(([a], [b]) => b.localeCompare(a)).slice(0, 14);
  }, [homeVisits]);

  return <section className="min-h-[70vh] bg-clubLight px-4 py-10"><div className="mx-auto max-w-5xl"><Button asChild variant="ghost" className="mb-4"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" />Retour au tableau de bord</Link></Button><Card className="overflow-hidden border-0 shadow-xl"><CardHeader className="bg-clubDark text-white"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Statistiques</p><CardTitle className="text-3xl">Visites du site</CardTitle><p className="mt-1 text-sm text-white/70">Suivi anonyme des visites, sans adresse IP.</p></div><Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Actualiser</Button></div></CardHeader><CardContent className="space-y-6 p-5 md:p-7">{loading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div> : <><div className="grid gap-4 sm:grid-cols-3"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Visites accueil</p><p className="text-3xl font-black">{homeVisits.length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Visiteurs estimés</p><p className="text-3xl font-black text-clubPrimary">{uniqueHomeVisitors}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Toutes les pages</p><p className="text-3xl font-black">{visits.length}</p></CardContent></Card></div><div className="rounded-xl border"><div className="flex items-center gap-2 border-b bg-clubSection/30 p-4 font-bold"><Eye className="h-5 w-5 text-clubPrimary" />Accueil — visites par jour</div>{byDay.length === 0 ? <p className="p-8 text-center text-muted-foreground">Aucune visite enregistrée pour le moment.</p> : <div className="divide-y">{byDay.map(([date, count]) => <div key={date} className="flex justify-between px-4 py-3"><span>{new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR")}</span><strong>{count} visite{count > 1 ? "s" : ""}</strong></div>)}</div>}</div></>}</CardContent></Card></div></section>;
}
