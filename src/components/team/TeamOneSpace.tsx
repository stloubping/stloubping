import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Car, Check, Clock3, LogOut, MapPin, Phone, ShieldCheck, UserRoundCheck, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const matches = [
  { id: 1, round: "Journée 1", date: "Sam. 19 sept. · 16 h", opponent: "CAM Bordeaux 4", place: "Domicile", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 2, round: "Journée 2", date: "Sam. 3 oct. · 16 h", opponent: "Libourne TT 3", place: "Extérieur", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 3, round: "Journée 3", date: "Sam. 17 oct. · 16 h", opponent: "Cestas SAG 5", place: "Domicile", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 4, round: "Journée 4", date: "Sam. 7 nov. · 16 h", opponent: "Bègles US 4", place: "Extérieur", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 5, round: "Journée 5", date: "Sam. 21 nov. · 16 h", opponent: "Mérignac SAM 6", place: "Domicile", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 6, round: "Journée 6", date: "Sam. 5 déc. · 16 h", opponent: "Bruges PPC 3", place: "Extérieur", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
  { id: 7, round: "Journée 7", date: "Sam. 12 déc. · 16 h", opponent: "Villenave TT 4", place: "Domicile", players: ["Yves", "Nicolas", "Yann", "Thomas"] },
];

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
type DoubleField = "pair1" | "pair2" | "result1" | "result2";
type CrossTeamField = "name" | "ranking" | "team" | "played" | "status";

type TeamOneSpaceProps = {
  displayName: string;
  email: string;
  onSignOut: () => void;
};

const TeamOneSpace = ({ displayName, email, onSignOut }: TeamOneSpaceProps) => {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [playerNames, setPlayerNames] = useState(() => Array.from({ length: 8 }, () => ""));
  const [doubleRows, setDoubleRows] = useState(doubles);
  const [crossTeamRows, setCrossTeamRows] = useState(crossTeamPlayers);
  const [drivers, setDrivers] = useState("Frédéric · Anthony");

  const toggleAnswer = (answerKey: string) => {
    setAnswers((currentAnswers) => {
      const currentAnswer = currentAnswers[answerKey];
      return {
        ...currentAnswers,
        [answerKey]: currentAnswer === undefined ? "present" : currentAnswer === "present" ? "absent" : undefined,
      };
    });
  };

  const updateDouble = (rowIndex: number, field: DoubleField, value: string) => {
    setDoubleRows((currentRows) =>
      currentRows.map((row, index) => (index === rowIndex ? { ...row, [field]: value } : row)),
    );
  };

  const updateCrossTeamPlayer = (rowIndex: number, field: CrossTeamField, value: string) => {
    setCrossTeamRows((currentRows) =>
      currentRows.map((row, index) =>
        index === rowIndex
          ? { ...row, [field]: field === "played" ? Number(value) : value }
          : row,
      ),
    );
  };

  const completedDoubleResults = doubleRows
    .flatMap((row) => [row.result1, row.result2])
    .filter((result) => result.trim() !== "" && result.trim() !== "—");
  const doubleWins = completedDoubleResults.filter((result) => result.trim().startsWith("3")).length;
  const doubleSuccessRate = completedDoubleResults.length > 0
    ? ((doubleWins / completedDoubleResults.length) * 100).toFixed(1).replace(".", ",")
    : "0,0";

  return (
    <div className="min-h-screen bg-clubLight">
      <section className="bg-clubDark px-4 py-8 text-white">
        <div className="container mx-auto">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><Button asChild variant="ghost" className="-ml-4 text-white hover:bg-white/10 hover:text-white"><Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Retour au site</Link></Button><Button type="button" variant="outline" onClick={onSignOut} className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"><LogOut className="mr-2 h-4 w-4" />Déconnexion</Button></div>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-clubPrimary">Espace privé · {displayName}</p><h1 className="mt-2 text-3xl font-black md:text-4xl">Équipe 1</h1><p className="mt-2 max-w-2xl text-white/65">Pilotez toute la phase 1 de l’Équipe 1, de la convocation au déplacement. Compte connecté : {email}.</p></div>
            <div className="flex flex-wrap gap-2"><Badge className="bg-clubPrimary text-white hover:bg-clubPrimary">Équipe 1 · Départementale</Badge><Badge className="bg-amber-400 text-amber-950 hover:bg-amber-400">Phase 1 · démonstration</Badge></div>
          </div>
        </div>
      </section>

      <main className="container mx-auto space-y-8 px-4 py-8">
        <section>
          <div className="mb-4 flex items-center gap-3"><CalendarDays className="h-7 w-7 text-clubPrimary" /><div><h2 className="text-2xl font-black text-clubDark">Calendrier complet · Phase 1</h2><p className="text-sm text-muted-foreground">Saisissez les noms des joueurs en ligne, puis cliquez sur une case pour passer de « à confirmer » à « présent », puis « absent ».</p></div></div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 min-w-[210px] border-b border-r bg-background px-3 py-3 text-left font-semibold">
                      Joueur
                    </th>
                    {matches.map((match) => (
                      <th
                        key={match.id}
                        className="min-w-[92px] border-b px-2 py-3 text-center font-semibold"
                        title={`${match.round} – ${match.opponent} – ${match.date}`}
                      >
                        J{match.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {playerNames.map((playerName, playerIndex) => (
                    <tr key={playerIndex} className="border-b last:border-b-0">
                      <th className="sticky left-0 z-10 border-r bg-background p-2 text-left font-medium">
                        <Input
                          value={playerName}
                          onChange={(event) => {
                            const nextNames = [...playerNames];
                            nextNames[playerIndex] = event.target.value;
                            setPlayerNames(nextNames);
                          }}
                          placeholder={`Nom du joueur ${playerIndex + 1}`}
                          aria-label={`Nom du joueur ${playerIndex + 1}`}
                          maxLength={80}
                        />
                      </th>
                      {matches.map((match) => {
                        const answerKey = `${playerIndex}-${match.id}`;
                        const answer = answers[answerKey];
                        const playerLabel = playerName.trim() || `Joueur ${playerIndex + 1}`;

                        return (
                          <td key={match.id} className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => toggleAnswer(answerKey)}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                                answer === "present"
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : answer === "absent"
                                    ? "border-rose-500 bg-rose-500 text-white"
                                    : "border-muted-foreground/30 bg-muted/40 text-muted-foreground hover:bg-muted"
                              }`}
                              title={`${playerLabel} – J${match.id} : ${answer === "present" ? "présent" : answer === "absent" ? "absent" : "à confirmer"}`}
                              aria-label={`${playerLabel}, journée ${match.id}`}
                            >
                              {answer === "present" ? <Check className="h-4 w-4" /> : answer === "absent" ? <X className="h-4 w-4" /> : "?"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-4 border-t bg-muted/30 px-4 py-3 text-xs font-semibold"><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-600" />Présent</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-500" />Absent</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-slate-400 bg-white" />À confirmer</span></div>
          </Card>
        </section>

        <section>
          <div className="mb-4"><h2 className="text-2xl font-black text-clubDark">Composition des deux paires de doubles</h2><p className="text-sm text-muted-foreground">Composition et résultat de chaque double pour les sept journées.</p></div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-clubDark text-white">
                  <tr>
                    <th className="p-3 text-left">Journée</th>
                    <th className="p-3 text-left">Double 1</th>
                    <th className="p-3 text-left">Résultat</th>
                    <th className="p-3 text-left">Double 2</th>
                    <th className="p-3 text-left">Résultat</th>
                    <th className="p-3 text-center">Bilan</th>
                  </tr>
                </thead>
                <tbody>
                  {doubleRows.map((item, index) => {
                    const rowResults = [item.result1, item.result2].filter(
                      (result) => result.trim() !== "" && result.trim() !== "—",
                    );
                    const wins = rowResults.filter((result) => result.trim().startsWith("3")).length;

                    return (
                      <tr key={item.round} className={index % 2 ? "bg-muted/35" : "bg-white"}>
                        <td className="border-b p-3 font-black text-clubPrimary">{item.round}</td>
                        <td className="border-b p-2">
                          <Input value={item.pair1} onChange={(event) => updateDouble(index, "pair1", event.target.value)} aria-label={`${item.round} – composition du double 1`} placeholder="Joueur 1 / Joueur 2" />
                        </td>
                        <td className="border-b p-2">
                          <Input value={item.result1} onChange={(event) => updateDouble(index, "result1", event.target.value)} aria-label={`${item.round} – résultat du double 1`} placeholder="3–1" className="min-w-20 text-center" />
                        </td>
                        <td className="border-b p-2">
                          <Input value={item.pair2} onChange={(event) => updateDouble(index, "pair2", event.target.value)} aria-label={`${item.round} – composition du double 2`} placeholder="Joueur 1 / Joueur 2" />
                        </td>
                        <td className="border-b p-2">
                          <Input value={item.result2} onChange={(event) => updateDouble(index, "result2", event.target.value)} aria-label={`${item.round} – résultat du double 2`} placeholder="3–1" className="min-w-20 text-center" />
                        </td>
                        <td className="border-b p-3 text-center font-black">
                          {rowResults.length === 0 ? "À jouer" : `${wins} V · ${rowResults.length - wins} D`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 border-t bg-muted/30 p-4 sm:grid-cols-3">
              <div><p className="text-xs text-muted-foreground">Doubles joués</p><p className="text-xl font-black">{completedDoubleResults.length}</p></div>
              <div><p className="text-xs text-muted-foreground">Victoires</p><p className="text-xl font-black text-emerald-600">{doubleWins}</p></div>
              <div><p className="text-xs text-muted-foreground">Taux de réussite</p><p className="text-xl font-black text-clubPrimary">{doubleSuccessRate} %</p></div>
            </div>
          </Card>
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserRoundCheck className="text-clubPrimary" />Joueurs ayant joué dans une autre équipe</CardTitle>
              <p className="text-sm text-muted-foreground">Suivi des participations et des règles de brûlage avant toute convocation.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {crossTeamRows.map((player, index) => (
                <div key={index} className="grid gap-3 rounded-xl border p-3 sm:grid-cols-[1.4fr_.6fr_1fr_.65fr_1fr] sm:items-end">
                  <div>
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Nom</p>
                    <Input value={player.name} onChange={(event) => updateCrossTeamPlayer(index, "name", event.target.value)} aria-label={`Nom du joueur ${index + 1}`} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Classement</p>
                    <Input value={player.ranking} onChange={(event) => updateCrossTeamPlayer(index, "ranking", event.target.value)} aria-label={`Classement de ${player.name || `joueur ${index + 1}`}`} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Équipe</p>
                    <Input value={player.team} onChange={(event) => updateCrossTeamPlayer(index, "team", event.target.value)} aria-label={`Équipe de ${player.name || `joueur ${index + 1}`}`} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Rencontres</p>
                    <Input type="number" min="0" value={player.played} onChange={(event) => updateCrossTeamPlayer(index, "played", event.target.value)} aria-label={`Rencontres jouées par ${player.name || `joueur ${index + 1}`}`} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Statut</p>
                    <select
                      value={player.status}
                      onChange={(event) => updateCrossTeamPlayer(index, "status", event.target.value)}
                      aria-label={`Statut de ${player.name || `joueur ${index + 1}`}`}
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring ${
                        player.status === "Éligible"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : player.status === "Brûlé"
                            ? "border-red-200 bg-red-50 text-red-800"
                            : "border-amber-200 bg-amber-50 text-amber-800"
                      }`}
                    >
                      <option value="Éligible">Éligible</option>
                      <option value="À vérifier">À vérifier</option>
                      <option value="Brûlé">Brûlé</option>
                    </select>
                  </div>
                </div>
              ))}
              <div className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900"><strong>Règle de brûlage :</strong> ce statut est une aide visuelle. Le capitaine doit toujours vérifier le règlement officiel et les feuilles de rencontre avant de composer l’équipe.</div>
            </CardContent>
          </Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Car className="text-clubPrimary" />Covoiturage · prochain déplacement</CardTitle></CardHeader><CardContent className="space-y-4"><div className="rounded-xl bg-muted/55 p-4"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Conducteurs</p><Input className="mt-2 bg-background" value={drivers} onChange={(event) => setDrivers(event.target.value)} aria-label="Conducteurs du prochain déplacement" placeholder="Noms des conducteurs" /></div><div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-clubPrimary" /><div><p className="font-bold">Rendez-vous à 7 h 30</p><p className="text-sm text-muted-foreground">Parking de la salle de Saint-Loubès</p></div></div><div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-clubPrimary" /><div><p className="font-bold">Salle de Libourne TT</p><p className="text-sm text-muted-foreground">12 avenue des Sports, 33500 Libourne</p><a className="text-sm font-semibold text-clubPrimary hover:underline" href="https://www.google.com/maps" target="_blank" rel="noreferrer">Ouvrir le GPS</a></div></div><div className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-clubPrimary" /><div><p className="font-bold">Capitaine adverse</p><p className="text-sm text-muted-foreground">Jean Dupont · 06 00 00 00 00</p></div></div></CardContent></Card>
        </section>


        <Card className="border-dashed"><CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:text-left"><ShieldCheck className="h-9 w-9 shrink-0 text-clubPrimary" /><div><p className="font-black text-clubDark">Étape suivante après validation du MVP</p><p className="text-sm text-muted-foreground">Connexion à Supabase, vraies équipes, invitations des joueurs et sauvegarde partagée des confirmations.</p></div></CardContent></Card>
      </main>
    </div>
  );
};

export default TeamOneSpace;
