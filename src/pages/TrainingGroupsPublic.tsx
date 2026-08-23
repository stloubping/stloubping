import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GROUPS = [
  ["debutant", "Débutant"], ["intermediaire", "Intermédiaire"],
  ["perfectionnement", "Perfectionnement"], ["competition", "Compétition"],
  ["adultes_loisir", "Adultes loisir"], ["adultes_competition", "Adultes compétition"],
] as const;
type GroupKey = (typeof GROUPS)[number][0];
type PublicPlayer = { id: string; group_key: GroupKey; first_name: string; last_name: string };

export default function TrainingGroupsPublic() {
  const [players, setPlayers] = useState<PublicPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("public_training_group_players").select("id,group_key,first_name,last_name").eq("season", "2026-2027").order("last_name").order("first_name")
      .then(({ data }) => { setPlayers((data ?? []) as PublicPlayer[]); setLoading(false); });
  }, []);

  return <section className="min-h-[75vh] bg-clubLight px-4 py-10 md:py-14"><div className="mx-auto max-w-6xl"><div className="mb-10 text-center"><p className="mb-2 text-sm font-semibold uppercase tracking-widest text-clubPrimary">Saison 2026-2027</p><h1 className="text-4xl font-black text-clubDark">Groupes d’entraînement</h1><p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Retrouvez la répartition des joueurs dans les groupes d’entraînement du club.</p></div>{loading ? <p className="py-12 text-center text-muted-foreground">Chargement des groupes…</p> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{GROUPS.map(([key, label]) => { const groupPlayers = players.filter((player) => player.group_key === key); return <Card key={key}><CardHeader className="pb-3"><CardTitle className="flex items-center justify-between text-xl"><span>{label}</span><span className="rounded-full bg-clubPrimary/10 px-3 py-1 text-sm text-clubDark">{groupPlayers.length}</span></CardTitle></CardHeader><CardContent>{groupPlayers.length ? <ul className="space-y-2">{groupPlayers.map((player) => <li key={player.id} className="rounded-lg border bg-white px-3 py-2 font-semibold">{player.first_name} {player.last_name}</li>)}</ul> : <p className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /> Groupe à compléter.</p>}</CardContent></Card>; })}</div>}</div></section>;
}
