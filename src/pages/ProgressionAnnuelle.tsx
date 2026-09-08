import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  RefreshCw,
  Search,
  Medal,
  Printer,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchClubPlayers, Player } from "@/services/ffttService";

type SortField = "progression" | "points" | "name";
type SortDirection = "asc" | "desc";
type ProgressionFilter = "all" | "positive" | "stable" | "negative";

const normalize = (value = "") =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr-FR");

const playerName = (player: Player) =>
  `${player.prenom} ${player.nom}`
    .toLocaleLowerCase("fr-FR")
    .replace(/(^|[\s'-])\p{L}/gu, (letter) =>
      letter.toLocaleUpperCase("fr-FR"),
    );

const formatPoints = (value: number) =>
  Number(value || 0).toLocaleString("fr-FR", {
    maximumFractionDigits: 1,
  });

const isNewRegistration = (player: Player) =>
  Number(player.valinit || 0) === 0 && Number(player.points || 0) === 500;

const annualEvolution = (player: Player) =>
  isNewRegistration(player) ? 0 : Number(player.progans || 0);

const isYouthPlayer = (player: Player) =>
  /^(P|B|M|C|J)/i.test(String(player.cat || "").trim());

const ProgressionAnnuelle = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [progressionFilter, setProgressionFilter] =
    useState<ProgressionFilter>("all");
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({ field: "progression", direction: "desc" });

  const loadPlayers = async () => {
    setLoading(true);
    setError("");

    try {
      setPlayers(await fetchClubPlayers());
    } catch {
      setError(
        "Les progressions FFTT sont momentanément indisponibles. Réessayez dans quelques instants.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    document.body.classList.add("annual-progression-page");

    return () => document.body.classList.remove("annual-progression-page");
  }, []);

  const categories = useMemo(
    () =>
      [...new Set(players.map((player) => player.cat).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b, "fr"),
      ),
    [players],
  );

  const filteredPlayers = useMemo(() => {
    const query = normalize(searchQuery.trim());

    return players.filter((player) => {
      const progression = annualEvolution(player);
      const matchesSearch =
        !query ||
        normalize(`${player.prenom} ${player.nom} ${player.licence}`).includes(
          query,
        );
      const matchesCategory =
        selectedCategory === "all" || player.cat === selectedCategory;
      const matchesGender =
        selectedGender === "all" || player.sexe === selectedGender;
      const matchesProgression =
        progressionFilter === "all" ||
        (progressionFilter === "positive" && progression > 0) ||
        (progressionFilter === "stable" && progression === 0) ||
        (progressionFilter === "negative" && progression < 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesGender &&
        matchesProgression
      );
    });
  }, [
    players,
    progressionFilter,
    searchQuery,
    selectedCategory,
    selectedGender,
  ]);

  const displayedPlayers = useMemo(
    () =>
      [...filteredPlayers].sort((a, b) => {
        if (sortConfig.field === "name") {
          const comparison = playerName(a).localeCompare(
            playerName(b),
            "fr",
          );
          return sortConfig.direction === "asc" ? comparison : -comparison;
        }

        const firstValue =
          sortConfig.field === "progression"
            ? annualEvolution(a)
            : Number(a.points || 0);
        const secondValue =
          sortConfig.field === "progression"
            ? annualEvolution(b)
            : Number(b.points || 0);
        const difference =
          sortConfig.direction === "asc"
            ? firstValue - secondValue
            : secondValue - firstValue;

        return difference || playerName(a).localeCompare(playerName(b), "fr");
      }),
    [filteredPlayers, sortConfig],
  );

  const seasonPodium = useMemo(
    () =>
      [...players]
        .filter((player) => annualEvolution(player) > 0)
        .sort(
          (a, b) => annualEvolution(b) - annualEvolution(a),
        )
        .slice(0, 3),
    [players],
  );

  const youthSeasonPodium = useMemo(
    () =>
      [...players]
        .filter(
          (player) =>
            isYouthPlayer(player) && annualEvolution(player) > 0,
        )
        .sort(
          (a, b) => annualEvolution(b) - annualEvolution(a),
        )
        .slice(0, 3),
    [players],
  );

  const averageProgression = useMemo(() => {
    if (!players.length) return 0;
    return (
      players.reduce(
        (total, player) => total + annualEvolution(player),
        0,
      ) / players.length
    );
  }, [players]);

  const toggleSort = (field: SortField) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "desc"
          ? "asc"
          : "desc",
    }));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedGender("all");
    setProgressionFilter("all");
  };

  const sortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />;
    }

    return sortConfig.direction === "desc" ? (
      <ArrowDown className="h-3.5 w-3.5 text-clubPrimary" />
    ) : (
      <ArrowUp className="h-3.5 w-3.5 text-clubPrimary" />
    );
  };

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
            Saison en cours
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-6xl">
            Progression annuelle
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">
            Suivez l’évolution des points FFTT depuis le début de la saison et
            comparez les parcours des joueurs du club.
          </p>
        </div>
      </section>

      <section className="container relative z-10 -mt-7 grid gap-px overflow-hidden rounded-xl border bg-slate-200 shadow-xl sm:grid-cols-3">
        <article className="bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
            <Trophy className="h-4 w-4" />
            Podium de la saison
          </div>
          {loading ? (
            <strong className="mt-2 block text-3xl text-clubDark">—</strong>
          ) : seasonPodium.length > 0 ? (
            <ol className="mt-3 space-y-2">
              {seasonPodium.map((player, index) => (
                <li
                  key={player.idlicence || player.licence}
                  className="flex min-w-0 items-center gap-2 text-sm"
                >
                  <span
                    className={`grid h-6 w-6 flex-none place-items-center rounded-full text-xs font-black ${
                      index === 0
                        ? "bg-amber-100 text-amber-800"
                        : index === 1
                          ? "bg-slate-200 text-slate-700"
                          : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <strong className="min-w-0 flex-1 truncate text-clubDark">
                    {playerName(player)}
                  </strong>
                  <span className="flex-none font-extrabold text-emerald-700">
                    +{formatPoints(annualEvolution(player))} pts
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <span className="mt-2 block text-sm text-muted-foreground">
              Aucune progression positive
            </span>
          )}
        </article>

        <article className="bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
            <Medal className="h-4 w-4" />
            Podium jeunes
          </div>
          {loading ? (
            <strong className="mt-2 block text-3xl text-clubDark">—</strong>
          ) : youthSeasonPodium.length > 0 ? (
            <ol className="mt-3 space-y-2">
              {youthSeasonPodium.map((player, index) => (
                <li
                  key={player.idlicence || player.licence}
                  className="flex min-w-0 items-center gap-2 text-sm"
                >
                  <span
                    className={`grid h-6 w-6 flex-none place-items-center rounded-full text-xs font-black ${
                      index === 0
                        ? "bg-amber-100 text-amber-800"
                        : index === 1
                          ? "bg-slate-200 text-slate-700"
                          : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <strong className="min-w-0 flex-1 truncate text-clubDark">
                    {playerName(player)}
                  </strong>
                  <span className="flex-none font-extrabold text-emerald-700">
                    +{formatPoints(annualEvolution(player))} pts
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <span className="mt-2 block text-sm text-muted-foreground">
              Aucune progression jeune positive
            </span>
          )}
        </article>

        <article className="bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
            <Users className="h-4 w-4" />
            Moyenne du club
          </div>
          <strong className="mt-2 block text-3xl text-clubDark">
            {loading
              ? "—"
              : `${averageProgression > 0 ? "+" : ""}${formatPoints(
                  averageProgression,
                )}`}
          </strong>
          <span className="text-sm text-muted-foreground">points par joueur</span>
        </article>
      </section>

      <main className="annual-progression-print-area container px-4 py-14 md:px-6 md:py-20">
        <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-clubPrimary">
              Données officielles FFTT
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
              Tableau des progressions
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              {filteredPlayers.length} joueur
              {filteredPlayers.length > 1 ? "s" : ""} affiché
              {filteredPlayers.length > 1 ? "s" : ""}
            </span>
            <Button
              type="button"
              onClick={() => window.print()}
              variant="outline"
              className="print:hidden"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimer la progression
            </Button>
          </div>
        </header>

        <div className="mb-4 grid gap-3 print:hidden md:grid-cols-2 xl:grid-cols-[minmax(230px,1fr)_180px_160px_190px_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher un joueur…"
              className="h-12 bg-white pl-10 focus-visible:ring-clubPrimary"
              aria-label="Rechercher un joueur"
            />
          </label>

          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="h-12 bg-white">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedGender} onValueChange={setSelectedGender}>
            <SelectTrigger className="h-12 bg-white">
              <SelectValue placeholder="Tous les joueurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les joueurs</SelectItem>
              <SelectItem value="M">Messieurs</SelectItem>
              <SelectItem value="F">Dames</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={progressionFilter}
            onValueChange={(value) =>
              setProgressionFilter(value as ProgressionFilter)
            }
          >
            <SelectTrigger className="h-12 bg-white">
              <SelectValue placeholder="Toutes les évolutions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les évolutions</SelectItem>
              <SelectItem value="positive">En progression</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="negative">En baisse</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={loadPlayers}
            disabled={loading}
            variant="outline"
            className="h-12 bg-white"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>

        {(searchQuery ||
          selectedCategory !== "all" ||
          selectedGender !== "all" ||
          progressionFilter !== "all") && (
          <button
            type="button"
            onClick={resetFilters}
            className="mb-4 text-sm font-semibold text-clubPrimary hover:underline print:hidden"
          >
            Effacer tous les filtres
          </button>
        )}

        <div className="min-h-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-muted-foreground">
              <RefreshCw className="mb-4 h-8 w-8 animate-spin text-clubPrimary" />
              <p>Récupération des progressions FFTT…</p>
            </div>
          ) : error ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <p className="max-w-lg text-muted-foreground">{error}</p>
              <Button
                type="button"
                onClick={loadPlayers}
                className="mt-5 rounded-full bg-clubPrimary text-white hover:bg-red-600"
              >
                Réessayer
              </Button>
            </div>
          ) : displayedPlayers.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center text-muted-foreground">
              <p>Aucun joueur ne correspond à ces filtres.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 font-semibold text-clubPrimary hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs md:min-w-[800px] md:text-sm">
                <thead>
                  <tr className="bg-clubDark text-left text-[11px] uppercase tracking-wider text-white/70">
                    <th className="px-3 py-4 text-center md:px-5">Rang</th>
                    <th className="px-3 py-4 md:px-5">
                      <button
                        type="button"
                        onClick={() => toggleSort("name")}
                        className="inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-clubPrimary"
                      >
                        Joueur
                        {sortIcon("name")}
                      </button>
                    </th>
                    <th className="hidden px-5 py-4 text-center md:table-cell">
                      Catégorie
                    </th>
                    <th className="px-3 py-4 text-right md:px-5">
                      <button
                        type="button"
                        onClick={() => toggleSort("progression")}
                        className="ml-auto inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-clubPrimary"
                      >
                        Progression
                        {sortIcon("progression")}
                      </button>
                    </th>
                    <th className="px-3 py-4 text-right md:px-5">
                      <button
                        type="button"
                        onClick={() => toggleSort("points")}
                        className="ml-auto inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-clubPrimary"
                      >
                        Points
                        {sortIcon("points")}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPlayers.map((player, index) => {
                    const progression = annualEvolution(player);

                    return (
                      <tr
                        key={player.idlicence || player.licence}
                        className="border-t border-slate-200 transition hover:bg-red-50/40"
                      >
                        <td className="px-3 py-4 text-center font-bold text-slate-500 md:px-5">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-3 py-4 font-semibold text-clubDark md:px-5">
                          {playerName(player)}
                        </td>
                        <td className="hidden px-5 py-4 text-center md:table-cell">
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-800">
                            {player.cat || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-right md:px-5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-extrabold ${
                              progression > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : progression < 0
                                  ? "bg-red-50 text-red-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {progression > 0 ? (
                              <TrendingUp className="h-3.5 w-3.5" />
                            ) : progression < 0 ? (
                              <TrendingDown className="h-3.5 w-3.5" />
                            ) : null}
                            {progression > 0 ? "+" : ""}
                            {formatPoints(progression)}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-right font-extrabold text-clubPrimary md:px-5">
                          {formatPoints(player.points)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProgressionAnnuelle;
