import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchClubPlayers, Player } from "@/services/ffttService";

const categoryOrder: Record<string, number> = {
  P: 1,
  B: 2,
  M: 3,
  C: 4,
  J: 5,
  S: 6,
  V: 7,
};

const categorySort = (first: string, second: string) => {
  const firstPrefix = first.match(/^[A-Z]+/i)?.[0]?.[0]?.toUpperCase() || "";
  const secondPrefix =
    second.match(/^[A-Z]+/i)?.[0]?.[0]?.toUpperCase() || "";
  const orderDifference =
    (categoryOrder[firstPrefix] || 99) - (categoryOrder[secondPrefix] || 99);

  return (
    orderDifference ||
    first.localeCompare(second, "fr", {
      numeric: true,
      sensitivity: "base",
    })
  );
};

const simplifiedRanking = (points: number) =>
  Math.max(0, Math.floor(Number(points || 0) / 100));

const categoryChartConfig = {
  joueurs: {
    label: "Joueurs",
    color: "#e11d48",
  },
} satisfies ChartConfig;

const rankingChartConfig = {
  joueurs: {
    label: "Joueurs",
    color: "#111827",
  },
} satisfies ChartConfig;

const categoryRankingChartConfig = {
  moyenne: {
    label: "Classement moyen",
    color: "#e11d48",
  },
  meilleur: {
    label: "Meilleur classement",
    color: "#111827",
  },
} satisfies ChartConfig;

const StatistiquesJoueurs = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlayers = async () => {
    setLoading(true);
    setError("");

    try {
      setPlayers(await fetchClubPlayers());
    } catch {
      setError(
        "Les statistiques FFTT sont momentanément indisponibles. Réessayez dans quelques instants.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const categoryData = useMemo(() => {
    const counts = new Map<string, number>();

    players.forEach((player) => {
      const category = player.cat || "Non renseignée";
      counts.set(category, (counts.get(category) || 0) + 1);
    });

    return [...counts.entries()]
      .map(([categorie, joueurs]) => ({ categorie, joueurs }))
      .sort((a, b) => categorySort(a.categorie, b.categorie));
  }, [players]);

  const rankingBandData = useMemo(() => {
    const counts = new Map<number, number>();

    players.forEach((player) => {
      const classement = simplifiedRanking(player.points);
      counts.set(classement, (counts.get(classement) || 0) + 1);
    });

    return [...counts.entries()]
      .map(([classement, joueurs]) => ({
        classement: String(classement),
        joueurs,
      }))
      .sort((a, b) => Number(a.classement) - Number(b.classement));
  }, [players]);

  const categoryRankingData = useMemo(() => {
    const groups = new Map<
      string,
      { totalPoints: number; count: number; bestPoints: number }
    >();

    players.forEach((player) => {
      const category = player.cat || "Non renseignée";
      const current = groups.get(category) || {
        totalPoints: 0,
        count: 0,
        bestPoints: 0,
      };

      current.totalPoints += Number(player.points || 0);
      current.count += 1;
      current.bestPoints = Math.max(
        current.bestPoints,
        Number(player.points || 0),
      );
      groups.set(category, current);
    });

    return [...groups.entries()]
      .map(([categorie, values]) => ({
        categorie,
        moyenne: Number(
          (values.totalPoints / values.count / 100).toFixed(1),
        ),
        meilleur: simplifiedRanking(values.bestPoints),
      }))
      .sort((a, b) => categorySort(a.categorie, b.categorie));
  }, [players]);

  const maxCategoryCount = Math.max(
    1,
    ...categoryData.map((item) => item.joueurs),
  );
  const maxRankingBandCount = Math.max(
    1,
    ...rankingBandData.map((item) => item.joueurs),
  );
  const maxCategoryRanking = Math.max(
    1,
    ...categoryRankingData.map((item) => item.meilleur),
  );

  const averageRanking = useMemo(() => {
    if (!players.length) return 0;
    const averagePoints =
      players.reduce(
        (total, player) => total + Number(player.points || 0),
        0,
      ) / players.length;
    return Number((averagePoints / 100).toFixed(1));
  }, [players]);

  const bestPlayer = players[0];

  return (
    <div className="min-h-screen bg-slate-50 text-clubDark">
      <section className="relative overflow-hidden bg-clubDark text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.35),transparent_42%)]" />
        <div className="container relative px-4 py-14 md:px-6 md:py-20">
          <Link
            to="/classement-joueurs"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au classement
          </Link>
          <span className="block text-xs font-extrabold uppercase tracking-[0.18em] text-clubPrimary">
            Effectif du club
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-6xl">
            Statistiques joueurs
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">
            Une lecture visuelle de l’effectif, des catégories d’âge et des
            classements officiels FFTT.
          </p>
        </div>
      </section>

      <section className="container relative z-10 -mt-7 grid gap-px overflow-hidden rounded-xl border bg-slate-200 shadow-xl sm:grid-cols-3">
        <article className="bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
            <Users className="h-4 w-4" />
            Effectif
          </div>
          <strong className="mt-2 block text-3xl">
            {loading ? "—" : players.length}
          </strong>
          <span className="text-sm text-muted-foreground">
            joueurs et joueuses
          </span>
        </article>

        <article className="bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
            <BarChart3 className="h-4 w-4" />
            Classement moyen
          </div>
          <strong className="mt-2 block text-3xl">
            {loading ? "—" : averageRanking}
          </strong>
          <span className="text-sm text-muted-foreground">
            échelle FFTT simplifiée
          </span>
        </article>

        <article className="bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
            <Trophy className="h-4 w-4" />
            Meilleur classement
          </div>
          <strong className="mt-2 block text-3xl">
            {loading || !bestPlayer
              ? "—"
              : simplifiedRanking(bestPlayer.points)}
          </strong>
          <span className="text-sm text-muted-foreground">
            {bestPlayer
              ? `${bestPlayer.prenom} ${bestPlayer.nom}`
              : "Données FFTT"}
          </span>
        </article>
      </section>

      <main className="container px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-clubPrimary">
              Données officielles FFTT
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
              Les chiffres du club
            </h2>
          </div>
          <Button
            type="button"
            onClick={loadPlayers}
            disabled={loading}
            variant="outline"
            className="h-11 w-fit bg-white"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>

        {loading ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border bg-white text-muted-foreground">
            <RefreshCw className="mb-4 h-8 w-8 animate-spin text-clubPrimary" />
            <p>Calcul des statistiques FFTT…</p>
          </div>
        ) : error ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border bg-white px-6 text-center">
            <p className="max-w-lg text-muted-foreground">{error}</p>
            <Button
              type="button"
              onClick={loadPlayers}
              className="mt-5 rounded-full bg-clubPrimary text-white hover:bg-red-600"
            >
              Réessayer
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            <article className="overflow-hidden rounded-xl border bg-white p-5 shadow-sm md:p-7">
              <h3 className="text-xl font-extrabold md:text-2xl">
                Nombre de joueurs par catégorie
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Répartition des licenciés selon leur catégorie d’âge FFTT.
              </p>
              <div className="mt-6 space-y-3 md:hidden">
                {categoryData.map((item) => (
                  <div key={item.categorie}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <strong>{item.categorie}</strong>
                      <span className="font-extrabold text-clubPrimary">
                        {item.joueurs}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-rose-100">
                      <div
                        className="h-full rounded-full bg-clubPrimary"
                        style={{
                          width: `${Math.max(
                            5,
                            (item.joueurs / maxCategoryCount) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 hidden md:block">
                <ChartContainer
                  config={categoryChartConfig}
                  className="h-[340px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={categoryData}
                    margin={{ top: 16, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="categorie"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="joueurs"
                      fill="var(--color-joueurs)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </article>

            <article className="overflow-hidden rounded-xl border bg-white p-5 shadow-sm md:p-7">
              <h3 className="text-xl font-extrabold md:text-2xl">
                Joueurs par tranche de classement
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Exemple : un joueur à 1 000 points appartient à la tranche 10.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 md:hidden">
                {rankingBandData.map((item) => (
                  <div
                    key={item.classement}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Classement
                        </span>
                        <strong className="text-xl text-clubDark">
                          {item.classement}
                        </strong>
                      </div>
                      <span className="text-right text-xs font-bold text-slate-600">
                        {item.joueurs} joueur
                        {item.joueurs > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-clubDark"
                        style={{
                          width: `${Math.max(
                            8,
                            (item.joueurs / maxRankingBandCount) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 hidden md:block">
                <ChartContainer
                  config={rankingChartConfig}
                  className="h-[340px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={rankingBandData}
                    margin={{ top: 16, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="classement"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="joueurs"
                      fill="var(--color-joueurs)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </article>

            <article className="overflow-hidden rounded-xl border bg-white p-5 shadow-sm md:p-7">
              <h3 className="text-xl font-extrabold md:text-2xl">
                Classement par catégorie
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comparaison du classement moyen et du meilleur classement de
                chaque catégorie. L’échelle est simplifiée : 500 points = 5,
                1 000 points = 10.
              </p>
              <div className="mt-6 divide-y divide-slate-100 md:hidden">
                {categoryRankingData.map((item) => (
                  <div
                    key={item.categorie}
                    className="grid grid-cols-[42px_1fr] gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <strong className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-xs text-clubPrimary">
                      {item.categorie}
                    </strong>
                    <div className="min-w-0">
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-500">
                          Moy.{" "}
                          <b className="text-clubPrimary">{item.moyenne}</b>
                        </span>
                        <span className="text-slate-500">
                          Meilleur{" "}
                          <b className="text-clubDark">{item.meilleur}</b>
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 overflow-hidden rounded-full bg-rose-100">
                          <div
                            className="h-full rounded-full bg-clubPrimary"
                            style={{
                              width: `${Math.max(
                                5,
                                (item.moyenne / maxCategoryRanking) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-clubDark"
                            style={{
                              width: `${Math.max(
                                5,
                                (item.meilleur / maxCategoryRanking) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 hidden md:block">
                <ChartContainer
                  config={categoryRankingChartConfig}
                  className="h-[380px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={categoryRankingData}
                    margin={{ top: 16, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="categorie"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="moyenne"
                      fill="var(--color-moyenne)"
                      radius={[5, 5, 0, 0]}
                    />
                    <Bar
                      dataKey="meilleur"
                      fill="var(--color-meilleur)"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-clubPrimary" />
                  Classement moyen
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-clubDark" />
                  Meilleur classement
                </span>
              </div>
            </article>
          </div>
        )}
      </main>
    </div>
  );
};

export default StatistiquesJoueurs;
