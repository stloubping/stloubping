import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Loader2, LogOut, Plus, ShieldCheck, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { fetchClubPlayers, type Player } from "@/services/ffttService";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const GROUPS = [
  ["debutant", "Débutant"],
  ["intermediaire", "Intermédiaire"],
  ["perfectionnement", "Perfectionnement"],
  ["competition", "Compétition"],
  ["adultes_loisir", "Adultes loisir"],
  ["adultes_competition", "Adultes compétition"],
] as const;
type GroupKey = (typeof GROUPS)[number][0];
type Row = { id: string; group_key: GroupKey; first_name: string; last_name: string; age: number | null; source: "existing" | "new"; licence: string | null };

const groupLabel = (key: GroupKey) => GROUPS.find(([value]) => value === key)?.[1] ?? key;

export default function TrainingGroups() {
  const [session, setSession] = useState<Session | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [group, setGroup] = useState<GroupKey>("debutant");
  const [selectedLicence, setSelectedLicence] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [email, setEmail] = useState("saintloubping@laposte.net");
  const [password, setPassword] = useState("");

  const loadData = async (userId: string) => {
    const { data: admin, error: adminError } = await supabase.from("club_admins").select("user_id").eq("user_id", userId).maybeSingle();
    if (adminError || !admin) { setAuthorized(false); setLoading(false); return; }
    setAuthorized(true);
    const [{ data, error }, clubPlayers] = await Promise.all([
      supabase.from("training_group_players").select("id,group_key,first_name,last_name,age,source,licence").eq("season", "2026-2027").order("last_name").order("first_name"),
      fetchClubPlayers().catch(() => [] as Player[]),
    ]);
    if (error) toast.error("Les groupes d’entraînement n’ont pas pu être chargés.");
    setRows((data ?? []) as Row[]);
    setPlayers([...clubPlayers].sort((a, b) =>
      a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" }) ||
      a.prenom.localeCompare(b.prenom, "fr", { sensitivity: "base" }),
    ));
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) void loadData(data.session.user.id); else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next) void loadData(next.user.id); else { setAuthorized(false); setRows([]); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const selectedPlayer = useMemo(() => players.find((player) => player.licence === selectedLicence), [players, selectedLicence]);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) { toast.error("Adresse e-mail ou mot de passe incorrect."); setLoading(false); }
  };

  const addPlayer = async (event: FormEvent) => {
    event.preventDefault();
    const player = mode === "existing" ? selectedPlayer : null;
    if (mode === "existing" && !player) return toast.error("Sélectionnez un joueur.");
    if (mode === "new" && (!firstName.trim() || !lastName.trim() || !age)) return toast.error("Renseignez le nom, le prénom et l’âge.");
    setSaving(true);
    const payload = {
      group_key: group, first_name: player?.prenom ?? firstName.trim(), last_name: player?.nom ?? lastName.trim(),
      age: mode === "new" ? Number(age) : null, source: mode, licence: player?.licence ?? null, season: "2026-2027",
    };
    const { data, error } = await supabase.from("training_group_players").insert(payload).select("id,group_key,first_name,last_name,age,source,licence").single();
    if (error) toast.error("Le joueur n’a pas pu être ajouté.");
    else { setRows((current) => [...current, data as Row].sort((a, b) => a.last_name.localeCompare(b.last_name, "fr"))); setSelectedLicence(""); setFirstName(""); setLastName(""); setAge(""); toast.success("Joueur ajouté au groupe."); }
    setSaving(false);
  };

  const removePlayer = async (id: string) => {
    const { error } = await supabase.from("training_group_players").delete().eq("id", id);
    if (error) toast.error("Le joueur n’a pas pu être retiré."); else { setRows((current) => current.filter((row) => row.id !== id)); toast.success("Joueur retiré du groupe."); }
  };

  if (loading) return <div className="flex min-h-[65vh] items-center justify-center bg-clubLight"><Loader2 className="h-9 w-9 animate-spin text-clubPrimary" /></div>;
  if (!session || !authorized) return <section className="min-h-[75vh] bg-clubLight px-4 py-16"><Card className="mx-auto max-w-lg overflow-hidden border-0 shadow-xl"><CardHeader className="space-y-3 bg-clubDark text-center text-white"><ShieldCheck className="mx-auto h-9 w-9 text-clubPrimary" /><CardTitle className="text-3xl">Groupes d’entraînement</CardTitle><p className="text-sm text-white/70">Accès réservé à l’entraîneur et aux responsables du club.</p></CardHeader><CardContent className="p-6 md:p-8">{session ? <div className="space-y-5 text-center"><p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Ce compte n’est pas autorisé à gérer les groupes.</p><Button onClick={() => void supabase.auth.signOut()} className="w-full bg-clubPrimary">Utiliser un autre compte</Button></div> : <form onSubmit={signIn} className="space-y-5"><div><label htmlFor="training-email" className="mb-2 block text-sm font-bold">Adresse e-mail</label><Input id="training-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div><div><label htmlFor="training-password" className="mb-2 block text-sm font-bold">Mot de passe</label><Input id="training-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div><Button type="submit" className="w-full bg-clubPrimary">Se connecter</Button></form>}</CardContent></Card></section>;

  return <section className="min-h-[75vh] bg-clubLight px-4 py-10 md:py-14"><div className="mx-auto max-w-6xl space-y-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-sm font-semibold uppercase tracking-widest text-clubPrimary">Saison 2026-2027</p><h1 className="text-4xl font-black text-clubDark">Groupes d’entraînement</h1><p className="mt-2 text-muted-foreground">Ajoutez les joueurs dans le groupe correspondant à leur niveau.</p></div><Button variant="outline" onClick={() => void supabase.auth.signOut()}><LogOut className="h-4 w-4" /> Se déconnecter</Button></div><Card><CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-clubPrimary" /> Ajouter un joueur</CardTitle></CardHeader><CardContent><div className="mb-5 flex flex-wrap gap-2"><Button type="button" variant={mode === "existing" ? "default" : "outline"} onClick={() => setMode("existing")}>Joueur déjà inscrit</Button><Button type="button" variant={mode === "new" ? "default" : "outline"} onClick={() => setMode("new")}>Nouveau joueur</Button></div><form onSubmit={addPlayer} className="grid gap-4 md:grid-cols-4 md:items-end"><div><label className="mb-2 block text-sm font-bold">Groupe</label><Select value={group} onValueChange={(value) => setGroup(value as GroupKey)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{GROUPS.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>{mode === "existing" ? <div className="md:col-span-2"><label className="mb-2 block text-sm font-bold">Joueur de la saison passée</label><Select value={selectedLicence} onValueChange={setSelectedLicence}><SelectTrigger><SelectValue placeholder={players.length ? "Choisir un joueur" : "Liste indisponible"} /></SelectTrigger><SelectContent>{players.map((player) => <SelectItem key={player.licence} value={player.licence}><span className="flex w-full justify-between gap-8"><span>{player.nom}</span><span className="text-muted-foreground">{player.prenom}</span></span></SelectItem>)}</SelectContent></Select></div> : <><div><label htmlFor="training-last-name" className="mb-2 block text-sm font-bold">Nom</label><Input id="training-last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div><div><label htmlFor="training-first-name" className="mb-2 block text-sm font-bold">Prénom</label><Input id="training-first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div><div><label htmlFor="training-age" className="mb-2 block text-sm font-bold">Âge</label><Input id="training-age" type="number" min="3" max="99" value={age} onChange={(e) => setAge(e.target.value)} /></div></>}<Button type="submit" disabled={saving} className="bg-clubPrimary md:col-span-1">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Ajouter</Button></form></CardContent></Card><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{GROUPS.map(([key, label]) => { const groupRows = rows.filter((row) => row.group_key === key); return <Card key={key}><CardHeader className="pb-3"><CardTitle className="flex items-center justify-between text-xl"><span>{label}</span><span className="rounded-full bg-clubPrimary/10 px-3 py-1 text-sm text-clubDark">{groupRows.length}</span></CardTitle></CardHeader><CardContent>{groupRows.length ? <ul className="space-y-2">{groupRows.map((row) => <li key={row.id} className="flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2"><span><span className="font-semibold">{row.first_name} {row.last_name}</span>{row.age ? <span className="ml-2 text-sm text-muted-foreground">({row.age} ans)</span> : null}</span><Button type="button" variant="ghost" size="icon" onClick={() => void removePlayer(row.id)} aria-label={`Retirer ${row.first_name} ${row.last_name}`}><Trash2 className="h-4 w-4 text-red-600" /></Button></li>)}</ul> : <p className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /> Aucun joueur pour le moment.</p>}</CardContent></Card>; })}</div></div></section>;
}
