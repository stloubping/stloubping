import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Car, Check, Clock3, Euro, MapPin, Phone, ShieldCheck, UserRoundCheck, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const matches = [
  { id: 1, round: "Journée 1", date: "Sam. 19 sept. · 16 h", opponent: "CAM Bordeaux 4", place: "Domicile", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 2, round: "Journée 2", date: "Sam. 3 oct. · 16 h", opponent: "Libourne TT 3", place: "Extérieur", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 3, round: "Journée 3", date: "Sam. 17 oct. · 16 h", opponent: "Cestas SAG 5", place: "Domicile", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 4, round: "Journée 4", date: "Sam. 7 nov. · 16 h", opponent: "Bègles US 4", place: "Extérieur", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 5, round: "Journée 5", date: "Sam. 21 nov. · 16 h", opponent: "Mérignac SAM 6", place: "Domicile", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 6, round: "Journée 6", date: "Sam. 5 déc. · 16 h", opponent: "Bruges PPC 3", place: "Extérieur", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 7, round: "Journée 7", date: "Sam. 12 déc. · 16 h", opponent: "Villenave TT 4", place: "Domicile", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
];

const teamPlayers = ["Yves", "Nicolas", "Yann", "Thomas", "Anthony", "Frédéric"];

const crossTeamPlayers = [
  { name: "Lucas Martin", ranking: "9", team: "Équipe 2", played: 1, status: "Éligible" },
  { name: "Hugo Bernard", ranking: "8", team: "Équipe 2", played: 2, status: "À vérifier" },
  { name: "Emma Laurent", ranking: "7", team: "Équipe 3", played: 1, status: "Éligible" },
  { name: "Paul Robert", ranking: "6", team: "Équipe 3", played: 3, status: "Brûlé" },
];

const doubles = [
  { round: "J1", pair1: "Yves / Nicolas", pair2: "Yann / Thomas", result1: "3–1", result2: "2–3" },
  { round: "J2", pair1: "Yves / Yann", pair2: "Nicolas / Anthony", result1: "3–0", result2: "3–2" },
  { round: "J3", pair1: "Yves / Nicolas", pair2: "Thomas / Anthony", result1: "1–3", result2: "3–1" },
  { round: "J4", pair1: "Nicolas / Yann", pair2: "Yves / Thomas", result1: "3–2", result2: "2–3" },
  { round: "J5", pair1: "Yves / Nicolas", pair2: "Yann / Anthony", result1: "3–1", result2: "3–0" },
  { round: "J6", pair1: "Yves / Yann", pair2: "Nicolas / Thomas", result1: "2–3", result2: "3–2" },
  { round: "J7", pair1: "À composer", pair2: "À composer", result1: "—", result2: "—" },
];

type Answer = "present" | "absent" | undefined;

const CaptainSpace = () => {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [distance, setDistance] = useState("42");
  const [rate, setRate] = useState("0.45");
  const [cars, setCars] = useState("2");
  const total = useMemo(() => Number(distance || 0) * 2 * Number(rate || 0), [distance, rate]);
  const perCar = total / Math.max(1, Number(cars || 1));

  return (
    <div className="min-h-screen bg-clubLight">
      <section className="bg-clubDark px-4 py-8 text-white">
        <div className="container mx-auto">
          <Button asChild variant="ghost" className="mb-4 -ml-4 text-white hover:bg-white/10 hover:text-white"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" />Retour au tableau de bord</Link></Button>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-clubPrimary">Gestion sportive</p><h1 className="mt-2 text-3xl font-black md:text-4xl">Espace capitaine</h1><p className="mt-2 max-w-2xl text-white/65">Pilotez toute la phase 1 de l’Équipe 1, de la convocation au déplacement.</p></div>
            <div className="flex flex-wrap gap-2"><Badge className="bg-clubPrimary text-white hover:bg-clubPrimary">Équipe 1 · Départementale</Badge><Badge className="bg-amber-400 text-amber-950 hover:bg-amber-400">Phase 1 · démonstration</Badge></div>
          </div>
        </div>
      </section>

      <main className="container mx-auto space-y-8 px-4 py-8">
        <section>
          <div className="mb-4 flex items-center gap-3"><CalendarDays className="h-7 w-7 text-clubPrimary" /><div><h2 className="text-2xl font-black text-clubDark">Calendrier complet · Phase 1</h2><p className="text-sm text-muted-foreground">7 journées, 6 joueurs. Cliquez sur une case pour passer de « à confirmer » à « présent », puis « absent ».</p></div></div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-sm">
                <thead className="bg-clubDark text-white">
                  <tr><th className="p-3 text-left">Journée</th><th className="p-3 text-left">Rencontre</th><th className="p-3 text-left">Date</th>{teamPlayers.map((player) => <th key={player} className="min-w-24 p-3 text-center">{player}</th>)}</tr>
                </thead>
                <tbody>
                  {matches.map((match, index) => <tr key={match.id} className={index % 2 ? "bg-muted/35" : "bg-white"}>
                    <td className="border-b p-3 font-black text-clubPrimary">J{match.id}</td>
                    <td className="border-b p-3"><p className="font-bold">{match.opponent}</p><Badge variant={match.place === "Domicile" ? "default" : "outline"} className="mt-1">{match.place}</Badge></td>
                    <td className="whitespace-nowrap border-b p-3 font-semibold">{match.date}</td>
                    {teamPlayers.map((player) => { const key = `${match.id}-${player}`; const answer = answers[key]; return <td key={player} className="border-b p-2 text-center"><button type="button" title={`${player} · ${answer === "present" ? "Présent" : answer === "absent" ? "Absent" : "À confirmer"}`} onClick={() => setAnswers((old) => ({ ...old, [key]: answer === undefined ? "present" : answer === "present" ? "absent" : undefined }))} className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${answer === "present" ? "border-emerald-600 bg-emerald-600 text-white" : answer === "absent" ? "border-red-500 bg-red-500 text-white" : "border-slate-300 bg-white text-slate-400 hover:border-clubPrimary"}`}>{answer === "present" ? <Check className="h-4 w-4" /> : answer === "absent" ? <X className="h-4 w-4" /> : "?"}</button></td>; })}
                  </tr>)}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-4 border-t bg-muted/30 px-4 py-3 text-xs font-semibold"><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-600" />Présent</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-500" />Absent</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-slate-400 bg-white" />À confirmer</span></div>
          </Card>
        </section>

        <section>
          <div className="mb-4"><h2 className="text-2xl font-black text-clubDark">Composition des deux paires de doubles</h2><p className="text-sm text-muted-foreground">Composition et résultat de chaque double pour les sept journées.</p></div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="bg-clubDark text-white"><tr><th className="p-3 text-left">Journée</th><th className="p-3 text-left">Double 1</th><th className="p-3 text-center">Résultat</th><th className="p-3 text-left">Double 2</th><th className="p-3 text-center">Résultat</th><th className="p-3 text-center">Bilan</th></tr></thead><tbody>{doubles.map((item, index) => { const wins = [item.result1, item.result2].filter((result) => result !== "—" && Number(result.charAt(0)) === 3).length; return <tr key={item.round} className={index % 2 ? "bg-muted/35" : "bg-white"}><td className="border-b p-3 font-black text-clubPrimary">{item.round}</td><td className="border-b p-3 font-bold">{item.pair1}</td><td className="border-b p-3 text-center"><Badge variant={item.result1.startsWith("3") ? "default" : "outline"}>{item.result1}</Badge></td><td className="border-b p-3 font-bold">{item.pair2}</td><td className="border-b p-3 text-center"><Badge variant={item.result2.startsWith("3") ? "default" : "outline"}>{item.result2}</Badge></td><td className="border-b p-3 text-center font-black">{item.result1 === "—" ? "À jouer" : `${wins} V · ${2 - wins} D`}</td></tr>; })}</tbody></table></div>
            <div className="grid gap-3 border-t bg-muted/30 p-4 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Doubles joués</p><p className="text-xl font-black">12</p></div><div><p className="text-xs text-muted-foreground">Victoires</p><p className="text-xl font-black text-emerald-600">8</p></div><div><p className="text-xs text-muted-foreground">Taux de réussite</p><p className="text-xl font-black text-clubPrimary">66,7 %</p></div></div>
          </Card>
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><UserRoundCheck className="text-clubPrimary" />Joueurs ayant joué dans une autre équipe</CardTitle><p className="text-sm text-muted-foreground">Suivi des participations et des règles de brûlage avant toute convocation.</p></CardHeader><CardContent className="space-y-3">{crossTeamPlayers.map((player) => <div key={player.name} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border p-3 sm:grid-cols-[1fr_auto_auto_auto]"><div><p className="font-bold">{player.name}</p><p className="text-xs text-muted-foreground sm:hidden">Équipe {player.team} · {player.played} rencontre(s)</p></div><Badge variant="outline" className="hidden sm:inline-flex">Cl. {player.ranking}</Badge><span className="hidden text-sm sm:inline">{player.team} · {player.played} J.</span><Badge className={player.status === "Éligible" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : player.status === "Brûlé" ? "bg-red-100 text-red-800 hover:bg-red-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}>{player.status}</Badge></div>)}<div className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900"><strong>Règle de brûlage :</strong> ce statut est une aide visuelle. Le capitaine doit toujours vérifier le règlement officiel et les feuilles de rencontre avant de composer l’équipe.</div></CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Car className="text-clubPrimary" />Covoiturage · prochain déplacement</CardTitle></CardHeader><CardContent className="space-y-4"><div className="rounded-xl bg-muted/55 p-4"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Conducteurs</p><p className="mt-1 font-bold">Frédéric · Anthony</p></div><div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-clubPrimary" /><div><p className="font-bold">Rendez-vous à 7 h 30</p><p className="text-sm text-muted-foreground">Parking de la salle de Saint-Loubès</p></div></div><div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-clubPrimary" /><div><p className="font-bold">Salle de Libourne TT</p><p className="text-sm text-muted-foreground">12 avenue des Sports, 33500 Libourne</p><a className="text-sm font-semibold text-clubPrimary hover:underline" href="https://www.google.com/maps" target="_blank" rel="noreferrer">Ouvrir le GPS</a></div></div><div className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-clubPrimary" /><div><p className="font-bold">Capitaine adverse</p><p className="text-sm text-muted-foreground">Jean Dupont · 06 00 00 00 00</p></div></div></CardContent></Card>
        </section>

        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Euro className="text-clubPrimary" />Calculateur d’indemnités</CardTitle></CardHeader><CardContent><div className="grid gap-4 md:grid-cols-3"><div><Label htmlFor="distance">Distance aller (km)</Label><Input id="distance" type="number" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} className="mt-2" /></div><div><Label htmlFor="rate">Barème par km (€)</Label><Input id="rate" type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-2" /></div><div><Label htmlFor="cars">Nombre de véhicules</Label><Input id="cars" type="number" min="1" value={cars} onChange={(e) => setCars(e.target.value)} className="mt-2" /></div></div><div className="mt-5 grid gap-3 rounded-xl bg-clubDark p-5 text-white sm:grid-cols-2"><div><p className="text-sm text-white/60">Total aller-retour</p><p className="text-3xl font-black text-clubPrimary">{total.toFixed(2).replace(".", ",")} €</p></div><div><p className="text-sm text-white/60">Indemnité par véhicule</p><p className="text-3xl font-black">{perCar.toFixed(2).replace(".", ",")} €</p></div></div></CardContent></Card>

        <Card className="border-dashed"><CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:text-left"><ShieldCheck className="h-9 w-9 shrink-0 text-clubPrimary" /><div><p className="font-black text-clubDark">Étape suivante après validation du MVP</p><p className="text-sm text-muted-foreground">Connexion à Supabase, vraies équipes, invitations des joueurs et sauvegarde partagée des confirmations.</p></div></CardContent></Card>
      </main>
    </div>
  );
};

export default CaptainSpace;
