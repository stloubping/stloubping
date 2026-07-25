import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  Minus,
  RefreshCw,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { fetchClubPlayers, Player } from "@/services/ffttService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatPoints = (value: number) =>
  Number(value || 0).toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  });

const normalize = (value = "") =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const playerName = (player: Player) =>
  `${player.prenom} ${player.nom}`
    .toLocaleLowerCase("fr-FR")
    .replace(/(^|[\s'-])\p{L}/gu, (letter) =>
      letter.toLocaleUpperCase("fr-FR"),
    );

const initials = (player: Player) =>
  `${player.prenom?.[0] || ""}${player.nom?.[0] || ""}`.toUpperCase();

const ClassementJoueurs = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    field: "points" | "progression";
    direction: "desc" | "asc";
  }>({ field: "points", direction: "desc" });

  const loadPlayers = async () => {
    setLoading(true);
    setError("");

    try {
      setPlayers(await fetchClubPlayers());
    } catch {
      setError(
        "Le classement FFTT est momentanément indisponible. Réessayez dans quelques instants.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
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
      const matchesSearch =
        !query ||
        normalize(`${player.prenom} ${player.nom} ${player.licence}`).includes(
          query,
        );
      const matchesCategory =
        selectedCategory === "all" || player.cat === selectedCategory;
      const matchesGender =
        selectedGender === "all" || player.sexe === selectedGender;

      return matchesSearch && matchesCategory && matchesGender;
    });
  }, [players, searchQuery, selectedCategory, selectedGender]);

  const displayedPlayers = useMemo(
    () =>
      [...filteredPlayers].sort((a, b) => {
        const firstValue =
          sortConfig.field === "progression"
            ? Number(a.progmens || 0)
            : Number(a.points || 0);
        const secondValue =
          sortConfig.field === "progression"
            ? Number(b.progmens || 0)
            : Number(b.points || 0);
        const valueDifference =
          sortConfig.direction === "asc"
            ? firstValue - secondValue
            : secondValue - firstValue;

        return (
          valueDifference ||
          a.nom.localeCompare(b.nom, "fr") ||
          a.prenom.localeCompare(b.prenom, "fr")
        );
      }),
    [filteredPlayers, sortConfig],
  );

  const toggleSort = (field: "points" | "progression") => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "desc"
          ? "asc"
          : "desc",
    }));
  };

  const rankByLicence = useMemo(
    () =>
      new Map(
        players.map((player, index) => [player.licence, index + 1] as const),
      ),
    [players],
  );

  const bestPlayer = players[0];
  const positiveEvolutions = players.filter(
    (player) => Number(player.progmens || 0) > 0,
  ).length;

  return (
    <div className="min-h-screen bg-white text-clubDark">
      <section className="relative isolate h-[430px] overflow-hidden text-white">
        <img
          src="/images/hero/club-training.jpg"
          alt="Joueurs du St Loub Ping en entraînement"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="container relative flex h-full flex-col items-start justify-center px-4 md:px-6">
          <span className="mb-4 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em]">
            Saison en cours · Club n° 10330022
          </span>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">
            Classement des joueurs
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
            Les points officiels et l’évolution mensuelle des licenciés du St
            Loub Ping, synchronisés avec la FFTT.
          </p>
          <a
            href="#classement"
            className="mt-7 rounded-full bg-clubPrimary px-7 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-600"
          >
            Voir le classement
          </a>
        </div>
      </section>

      <section className="container relative z-10 -mt-10 grid overflow-hidden rounded-xl border bg-white shadow-xl sm:grid-cols-3">
        <article className="border-b p-6 sm:border-b-0 sm:border-r">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
            <Users className="h-4 w-4" />
            Licenciés
          </div>
          <strong className="mt-2 block text-3xl text-clubDark">
            {loading ? "—" : players.length}
          </strong>
          <span className="text-sm text-muted-foreground">
            joueurs et joueuses
          </span>
        </article>

        <article className="border-b p-6 sm:border-b-0 sm:border-r">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
            <Trophy className="h-4 w-4" />
            Meilleur classement
          </div>
          <strong className="mt-2 block text-3xl text-clubDark">
            {bestPlayer ? formatPoints(bestPlayer.points) : "—"}
          </strong>
          <span className="text-sm text-muted-foreground">points FFTT</span>
        </article>

        <article className="p-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clubPrimary">
            <CalendarDays className="h-4 w-4" />
            Progressions du mois
          </div>
          <strong className="mt-2 block text-3xl text-clubDark">
            {loading ? "—" : positiveEvolutions}
          </strong>
          <span className="text-sm text-muted-foreground">
            joueurs en progression
          </span>
        </article>
      </section>

      <section
        id="classement"
        className="container scroll-mt-24 px-4 py-16 md:px-6 md:py-20"
      >
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-clubPrimary">
              St Loub Ping
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-clubDark md:text-5xl">
              Classement du club
            </h2>
            <p className="mt-2 text-muted-foreground">
              Recherchez un licencié ou filtrez le tableau.
            </p>
          </div>
          <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            {filteredPlayers.length} joueur
            {filteredPlayers.length > 1 ? "s" : ""} affiché
            {filteredPlayers.length > 1 ? "s" : ""}
          </span>
        </header>

        <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_220px_190px_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher un joueur…"
              className="h-12 rounded-md border-slate-200 bg-white pl-10 focus-visible:ring-clubPrimary"
              aria-label="Rechercher un joueur"
            />
          </label>

          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="h-12 rounded-md border-slate-200">
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
            <SelectTrigger className="h-12 rounded-md border-slate-200">
              <SelectValue placeholder="Tous les joueurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les joueurs</SelectItem>
              <SelectItem value="M">Messieurs</SelectItem>
              <SelectItem value="F">Dames</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={loadPlayers}
            disabled={loading}
            variant="outline"
            className="h-12 rounded-md border-slate-200"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>

        <div className="min-h-72 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-muted-foreground">
              <RefreshCw className="mb-4 h-8 w-8 animate-spin text-clubPrimary" />
              <p>Récupération du classement FFTT…</p>
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
          ) : filteredPlayers.length === 0 ? (
            <div className="flex min-h-72 items-center justify-center text-muted-foreground">
              Aucun joueur ne correspond à cette recherche.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">Rang</th>
                    <th className="px-5 py-4">Joueur</th>
                    <th className="px-5 py-4">Catégorie</th>
                    <th className="px-5 py-4">Licence</th>
                    <th className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleSort("progression")}
                        className="ml-auto inline-flex items-center gap-1.5 font-semibold transition-colors hover:text-clubPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clubPrimary/40"
                        aria-label={`Trier par évolution mensuelle ${
                          sortConfig.field === "progression" &&
                          sortConfig.direction === "desc"
                            ? "croissante"
                            : "décroissante"
                        }`}
                        title="Trier par évolution mensuelle"
                      >
                        Évolution mensuelle
                        {sortConfig.field === "progression" ? (
                          sortConfig.direction === "desc" ? (
                            <ArrowDown className="h-3.5 w-3.5 text-clubPrimary" />
                          ) : (
                            <ArrowUp className="h-3.5 w-3.5 text-clubPrimary" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
                        )}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleSort("points")}
                        className="ml-auto inline-flex items-center gap-1.5 font-semibold transition-colors hover:text-clubPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clubPrimary/40"
                        aria-label={`Trier par points ${
                          sortConfig.field === "points" &&
                          sortConfig.direction === "desc"
                            ? "croissants"
                            : "décroissants"
                        }`}
                        title="Trier par points"
                      >
                        Points
                        {sortConfig.field === "points" ? (
                          sortConfig.direction === "desc" ? (
                            <ArrowDown className="h-3.5 w-3.5 text-clubPrimary" />
                          ) : (
                            <ArrowUp className="h-3.5 w-3.5 text-clubPrimary" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
                        )}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPlayers.map((player) => {
                    const rank = rankByLicence.get(player.licence) || 0;
                    const monthly = Number(player.progmens || 0);
                    const isPositive = monthly > 0;
                    const isNegative = monthly < 0;

                    return (
                      <tr
                        key={player.idlicence || player.licence}
                        className="border-t border-slate-200 transition hover:bg-red-50/40"
                      >
                        <td
                          className={`px-5 py-4 font-bold ${
                            rank <= 3 ? "text-clubPrimary" : "text-slate-500"
                          }`}
                        >
                          {String(rank).padStart(2, "0")}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-clubDark text-xs font-extrabold text-white">
                              {initials(player)}
                            </span>
                            <span>
                              <strong className="block text-sm text-clubDark">
                                {playerName(player)}
                              </strong>
                              <small className="text-muted-foreground">
                                {player.sexe === "F" ? "Joueuse" : "Joueur"} du
                                club
                              </small>
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                            {player.cat || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-sm text-slate-500">
                          {player.licence}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-extrabold ${
                              isPositive
                                ? "bg-emerald-50 text-emerald-700"
                                : isNegative
                                  ? "bg-red-50 text-red-700"
                                  : "bg-slate-100 text-slate-500"
                            }`}
                            title={`Points du mois précédent : ${formatPoints(
                              Number(player.valmen || 0),
                            )}`}
                          >
                            {isPositive ? (
                              <ArrowUp className="h-3.5 w-3.5" />
                            ) : isNegative ? (
                              <ArrowDown className="h-3.5 w-3.5" />
                            ) : (
                              <Minus className="h-3.5 w-3.5" />
                            )}
                            {isPositive ? "+" : ""}
                            {formatPoints(monthly)} pts
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right text-lg font-extrabold text-clubPrimary">
                          {formatPoints(player.points)}{" "}
                          <small className="text-xs font-medium text-slate-400">
                            pts
                          </small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-right text-xs text-muted-foreground">
          Données officielles de la Fédération Française de Tennis de Table.
        </p>
      </section>
    </div>
  );
};

export default ClassementJoueurs;
