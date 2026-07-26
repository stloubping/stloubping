import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Award,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleEqual,
  RefreshCw,
  ShieldCheck,
  Target,
  Trophy,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchPlayerDetails,
  PlayerDetails,
  PlayerMatch,
} from "@/services/ffttPlayerService";

const formatPoints = (value: number, maximumFractionDigits = 2) =>
  Number(value || 0).toLocaleString("fr-FR", {
    maximumFractionDigits,
  });

const formatProgress = (value: number) =>
  `${value > 0 ? "+" : ""}${formatPoints(value, 2)}`;

const formatDate = (value: string) => {
  if (!value) return "Date non renseignée";

  const frenchDate = value.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (frenchDate) {
    return `${frenchDate[1]}/${frenchDate[2]}/${frenchDate[3]}`;
  }

  const isoDate = value.match(/^(\d{4})[/-](\d{2})[/-](\d{2})$/);
  if (isoDate) {
    return `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}`;
  }

  return value;
};

const displayName = (firstName: string, lastName: string) =>
  `${firstName} ${lastName}`
    .toLocaleLowerCase("fr-FR")
    .replace(/(^|[\s'-])\p{L}/gu, (letter) =>
      letter.toLocaleUpperCase("fr-FR"),
    );

const initials = (firstName: string, lastName: string) =>
  `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toLocaleUpperCase("fr-FR");

const resultLabel = (match: PlayerMatch) =>
  match.forfeit
    ? match.result === "V"
      ? "Victoire par forfait"
      : "Défaite par forfait"
    : match.result === "V"
      ? "Victoire"
      : match.result === "D"
        ? "Défaite"
        : "Résultat";

const ResultBadge = ({ match }: { match: PlayerMatch }) => (
  <span
    className={`inline-flex min-w-20 items-center justify-center rounded-full px-3 py-1 text-xs font-extrabold ${
      match.result === "V"
        ? "bg-emerald-50 text-emerald-700"
        : match.result === "D"
          ? "bg-red-50 text-red-700"
          : "bg-slate-100 text-slate-600"
    }`}
  >
    {resultLabel(match)}
  </span>
);

const ProgressValue = ({ value }: { value: number }) => (
  <span
    className={`inline-flex items-center gap-1 font-extrabold ${
      value > 0
        ? "text-emerald-700"
        : value < 0
          ? "text-red-700"
          : "text-slate-500"
    }`}
  >
    {value > 0 ? (
      <ArrowUp className="h-4 w-4" />
    ) : value < 0 ? (
      <ArrowDown className="h-4 w-4" />
    ) : (
      <CircleEqual className="h-4 w-4" />
    )}
    {formatProgress(value)} pts
  </span>
);

const FicheJoueur = () => {
  const { licence = "" } = useParams();
  const [details, setDetails] = useState<PlayerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setDetails(await fetchPlayerDetails(licence));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "La fiche FFTT est momentanément indisponible.",
      );
    } finally {
      setLoading(false);
    }
  }, [licence]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const additionalInformation = useMemo(() => {
    if (!details) return [];

    const { player } = details;
    return [
      ["Rang national", player.globalRank],
      ["Ancien rang national", player.previousGlobalRank],
      ["Rang régional", player.regionalRank],
      ["Rang départemental", player.departmentRank],
      ["Échelon", player.echelon],
      ["Place nationale", player.nationalPlace],
      ["Proposition de classement", player.proposedRanking],
      ["Nationalité FFTT", player.nationality],
      ["Mutation", player.mutationDate],
      ["Grade d’arbitre", player.umpireGrade],
      ["Grade de juge-arbitre", player.refereeGrade],
      ["Grade technique", player.coachGrade],
    ].filter(([, value]) => String(value || "").trim());
  }, [details]);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center bg-slate-50 text-muted-foreground">
        <RefreshCw className="mb-4 h-9 w-9 animate-spin text-clubPrimary" />
        <p>Récupération de la fiche FFTT…</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="container flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <UserRound className="mb-5 h-12 w-12 text-clubPrimary" />
        <h1 className="text-3xl font-extrabold text-clubDark">
          Fiche joueur indisponible
        </h1>
        <p className="mt-3 text-muted-foreground">{error}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={loadDetails} className="bg-clubPrimary text-white">
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Button asChild variant="outline">
            <Link to="/classement-joueurs">Retour au classement</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { player, summary, matches, history } = details;
  const name = displayName(player.prenom, player.nom);
  const licenceType =
    player.licenceType === "T"
      ? "Compétition"
      : player.licenceType === "P"
        ? "Loisir"
        : player.licenceType;

  return (
    <div className="min-h-screen bg-slate-50 text-clubDark">
      <section className="bg-clubDark text-white">
        <div className="container px-4 py-10 md:px-6 md:py-14">
          <Link
            to="/classement-joueurs"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au classement
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="grid h-20 w-20 flex-none place-items-center rounded-2xl bg-clubPrimary text-2xl font-black shadow-lg md:h-28 md:w-28 md:text-4xl">
              {initials(player.prenom, player.nom)}
            </div>
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                  Catégorie {player.category || "—"}
                </span>
                {licenceType && (
                  <span className="rounded-full bg-clubPrimary px-3 py-1 text-xs font-bold">
                    Licence {licenceType}
                  </span>
                )}
              </div>
              <h1 className="break-words text-4xl font-extrabold tracking-tight md:text-6xl">
                {name}
              </h1>
              <p className="mt-3 text-sm text-white/70 md:text-base">
                {player.clubName || "St Loub Ping"} · Licence {player.licence}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container px-4 py-10 md:px-6 md:py-14">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
              <Trophy className="h-4 w-4" />
              Points mensuels
            </div>
            <strong className="mt-3 block text-3xl">
              {formatPoints(player.points)}
            </strong>
            <span className="text-sm text-muted-foreground">
              Classement {player.officialRanking || "—"}
            </span>
          </article>

          <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
              <CalendarDays className="h-4 w-4" />
              Évolution mensuelle
            </div>
            <div className="mt-4 text-xl">
              <ProgressValue value={player.monthlyProgress} />
            </div>
            <span className="mt-2 block text-sm text-muted-foreground">
              Précédent : {formatPoints(player.previousPoints)} pts
            </span>
          </article>

          <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
              <ChartNoAxesColumnIncreasing className="h-4 w-4" />
              Évolution annuelle
            </div>
            <div className="mt-4 text-xl">
              <ProgressValue value={player.annualProgress} />
            </div>
            <span className="mt-2 block text-sm text-muted-foreground">
              Début de saison : {formatPoints(player.initialPoints)} pts
            </span>
          </article>

          <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
              <Target className="h-4 w-4" />
              Taux de victoire
            </div>
            <strong className="mt-3 block text-3xl">
              {formatPoints(summary.winRate, 1)} %
            </strong>
            <span className="text-sm text-muted-foreground">
              {summary.wins} victoire{summary.wins > 1 ? "s" : ""} ·{" "}
              {summary.losses} défaite{summary.losses > 1 ? "s" : ""}
            </span>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <article className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <header className="border-b p-5 md:p-6">
              <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-clubPrimary">
                Saison en cours
              </span>
              <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
                Rencontres individuelles
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {summary.matches} partie{summary.matches > 1 ? "s" : ""}{" "}
                enregistrée{summary.matches > 1 ? "s" : ""} par la FFTT.
              </p>
            </header>

            {matches.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Aucune rencontre disponible pour ce joueur.
              </div>
            ) : (
              <>
                <div className="divide-y md:hidden">
                  {matches.map((match) => (
                    <article key={match.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <strong className="block break-words text-sm">
                            {match.opponentName || "Adversaire non renseigné"}
                          </strong>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {formatDate(match.date)}
                            {match.opponentRanking
                              ? ` · ${formatPoints(match.opponentRanking)} pts`
                              : ""}
                          </span>
                        </div>
                        <ResultBadge match={match} />
                      </div>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <span className="min-w-0 text-xs text-slate-600">
                          {match.event || "Épreuve non renseignée"}
                        </span>
                        <ProgressValue value={match.pointsDelta} />
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-5 py-4">Résultat</th>
                        <th className="px-5 py-4">Adversaire</th>
                        <th className="px-5 py-4">Épreuve</th>
                        <th className="px-5 py-4 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.map((match) => (
                        <tr
                          key={match.id}
                          className="border-t transition hover:bg-red-50/30"
                        >
                          <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                            {formatDate(match.date)}
                          </td>
                          <td className="px-5 py-4">
                            <ResultBadge match={match} />
                          </td>
                          <td className="px-5 py-4">
                            <strong className="block">
                              {match.opponentName ||
                                "Adversaire non renseigné"}
                            </strong>
                            {match.opponentRanking > 0 && (
                              <small className="text-muted-foreground">
                                {formatPoints(match.opponentRanking)} pts
                              </small>
                            )}
                          </td>
                          <td className="max-w-56 px-5 py-4 text-slate-600">
                            {match.event || "—"}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <ProgressValue value={match.pointsDelta} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </article>

          <div className="space-y-6">
            <article className="rounded-xl border bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
                <Award className="h-4 w-4" />
                Bilan sportif
              </div>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Solde des parties</dt>
                  <dd>
                    <ProgressValue value={summary.pointsBalance} />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Victoires</dt>
                  <dd className="font-extrabold text-emerald-700">
                    {summary.wins}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Défaites</dt>
                  <dd className="font-extrabold text-red-700">
                    {summary.losses}
                  </dd>
                </div>
              </dl>
              {summary.bestWin && (
                <div className="mt-5 rounded-lg bg-amber-50 p-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                    Meilleure victoire
                  </span>
                  <strong className="mt-1 block text-sm text-clubDark">
                    {summary.bestWin.opponentName}
                  </strong>
                  <span className="text-xs text-amber-900/70">
                    {formatPoints(summary.bestWin.opponentRanking)} pts ·{" "}
                    {formatDate(summary.bestWin.date)}
                  </span>
                </div>
              )}
            </article>

            <article className="rounded-xl border bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
                <ShieldCheck className="h-4 w-4" />
                Informations FFTT
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                {additionalInformation.length > 0 ? (
                  additionalInformation.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="text-right font-semibold">{value}</dd>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    Aucune information sportive complémentaire.
                  </p>
                )}
              </dl>
            </article>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          <header className="border-b p-5 md:p-6">
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-clubPrimary">
              Parcours FFTT
            </span>
            <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
              Historique des classements
            </h2>
          </header>

          {history.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Aucun historique de classement disponible.
            </div>
          ) : (
            <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {history.map((item, index) => (
                <article
                  key={`${item.season}-${item.phase}-${index}`}
                  className="bg-white p-5"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Saison {item.season || "—"} · Phase {item.phase || "—"}
                  </span>
                  <strong className="mt-2 block text-2xl text-clubPrimary">
                    {formatPoints(item.points)} pts
                  </strong>
                  {(item.echelon || item.place) && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {item.echelon === "N" ? "National" : item.echelon}
                      {item.place ? ` · n° ${item.place}` : ""}
                    </span>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <p className="mt-5 text-right text-xs text-muted-foreground">
          Données sportives officielles FFTT · actualisées le{" "}
          {new Date(details.updatedAt).toLocaleString("fr-FR")}.
        </p>
      </main>
    </div>
  );
};

export default FicheJoueur;
