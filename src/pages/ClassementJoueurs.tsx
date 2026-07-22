"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fetchClubPlayers, Player } from "@/services/ffttService";
import { 
  Loader2, 
  Search, 
  Trophy, 
  Users, 
  TrendingUp, 
  Medal, 
  RefreshCw, 
  Table as TableIcon,
  Globe,
  Award,
  Calendar,
  UserCheck,
  Zap,
  Sparkles,
  BarChart3,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

const ClassementJoueurs = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const loadPlayers = async () => {
    setLoading(true);
    const data = await fetchClubPlayers();
    setPlayers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const categoriesList = useMemo(() => {
    const setCat = new Set<string>();
    players.forEach(p => {
      if (p.cat) setCat.add(p.cat);
    });
    return Array.from(setCat).sort();
  }, [players]);

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        player.nom.toLowerCase().includes(query) ||
        player.prenom.toLowerCase().includes(query) ||
        player.licence.toLowerCase().includes(query) ||
        `${player.prenom} ${player.nom}`.toLowerCase().includes(query);

      const matchesCat = selectedCategory === "all" || player.cat === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [players, searchQuery, selectedCategory]);

  const monthlySortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => (b.progmens || 0) - (a.progmens || 0));
  }, [filteredPlayers]);

  const annualSortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => (b.progans || 0) - (a.progans || 0));
  }, [filteredPlayers]);

  const groupedByCat = useMemo(() => {
    const groups: Record<string, Player[]> = {};
    filteredPlayers.forEach(p => {
      const catKey = p.cat || "Non renseignée";
      if (!groups[catKey]) groups[catKey] = [];
      groups[catKey].push(p);
    });
    return groups;
  }, [filteredPlayers]);

  const totalPlayers = players.length > 0 ? players.length : 141;
  const bestPlayer = players.length > 0 ? players[0] : null;
  const avgPoints = players.length > 0 
    ? Math.round(players.reduce((acc, p) => acc + p.points, 0) / players.length) 
    : 0;

  const renderTableHead = (progressionType?: 'mens' | 'ans') => (
    <TableHeader>
      <TableRow className="bg-clubDark hover:bg-clubDark">
        <TableHead className="text-white font-bold text-center w-[60px] text-xs">Rang</TableHead>
        <TableHead className="text-white font-bold text-xs">Joueur</TableHead>
        <TableHead className="text-white font-bold text-center text-xs">Points FFTT</TableHead>
        {progressionType && (
          <TableHead className="text-white font-bold text-center text-xs">
            Gain {progressionType === 'mens' ? 'Mois' : 'Saison'}
          </TableHead>
        )}
        <TableHead className="text-white font-bold text-center text-xs hidden sm:table-cell">Clast Officiel</TableHead>
        <TableHead className="text-white font-bold text-center text-xs hidden md:table-cell">Catégorie</TableHead>
        <TableHead className="text-white font-bold text-center text-xs hidden lg:table-cell">N° Licence</TableHead>
      </TableRow>
    </TableHeader>
  );

  const renderPlayerRow = (player: Player, index: number, progressionType?: 'mens' | 'ans') => {
    const rank = players.findIndex(p => p.licence === player.licence) + 1;
    const isTop3 = rank <= 3 && rank > 0;

    const gainVal = progressionType === 'mens' ? player.progmens : player.progans;
    const hasGain = gainVal !== undefined && gainVal !== null;

    return (
      <TableRow 
        key={player.licence || index} 
        className={`hover:bg-clubSection/50 transition-colors ${
          isTop3 ? "bg-clubPrimary/5 font-semibold" : "even:bg-clubSection/20 odd:bg-white"
        }`}
      >
        <TableCell className="text-center font-bold text-xs md:text-sm">
          {rank === 1 ? (
            <span className="inline-flex items-center justify-center bg-yellow-400 text-black font-extrabold h-6 w-6 rounded-full text-xs shadow-sm">1</span>
          ) : rank === 2 ? (
            <span className="inline-flex items-center justify-center bg-gray-300 text-black font-extrabold h-6 w-6 rounded-full text-xs shadow-sm">2</span>
          ) : rank === 3 ? (
            <span className="inline-flex items-center justify-center bg-amber-600 text-white font-extrabold h-6 w-6 rounded-full text-xs shadow-sm">3</span>
          ) : (
            <span className="text-muted-foreground">{index + 1}</span>
          )}
        </TableCell>

        <TableCell className="text-xs md:text-sm font-semibold text-clubDark uppercase">
          {player.nom} <span className="capitalize font-normal text-clubDark/90">{player.prenom}</span>
        </TableCell>

        <TableCell className="text-center text-xs md:text-sm font-extrabold text-clubPrimary bg-clubPrimary/5">
          {player.points} pts
        </TableCell>

        {progressionType && (
          <TableCell className="text-center text-xs md:text-sm font-bold">
            {hasGain ? (
              <span className={`inline-flex items-center justify-center gap-0.5 px-2.5 py-0.5 rounded-full border ${
                gainVal >= 0 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-red-50 text-red-700 border-red-200"
              }`}>
                {gainVal >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {gainVal > 0 ? `+${gainVal}` : gainVal} pts
              </span>
            ) : (
              <span className="text-xs text-muted-foreground font-normal">0 pts</span>
            )}
          </TableCell>
        )}

        <TableCell className="text-center text-xs md:text-sm font-medium hidden sm:table-cell">
          <Badge variant="outline" className="border-clubPrimary/40 text-clubDark bg-white">
            {player.clast || Math.floor(player.points / 100)}
          </Badge>
        </TableCell>

        <TableCell className="text-center text-xs font-medium text-muted-foreground hidden md:table-cell">
          {player.cat ? (
            <Badge className="bg-clubDark text-white text-[10px]">
              {player.cat}
            </Badge>
          ) : (
            "-"
          )}
        </TableCell>

        <TableCell className="text-center text-xs font-mono text-muted-foreground hidden lg:table-cell">
          {player.licence}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      {/* En-tête Général */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-clubDark mb-3 flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8 md:h-10 md:w-10 text-clubPrimary" />
          Classement des Joueurs
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          Consultez l'ensemble des 141 licenciés du St Loub Ping (Club N° 10330022), leurs classements et leurs progressions.
        </p>
      </div>

      <Tabs defaultValue="live" className="w-full">
        {/* Navigation par Onglets */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <TabsList className="bg-clubSection p-1.5 rounded-2xl flex flex-wrap justify-center gap-1.5 h-auto shadow-inner border border-border">
            <TabsTrigger value="live" className="data-[state=active]:bg-clubPrimary data-[state=active]:text-white font-semibold text-xs md:text-sm py-2 px-4 rounded-xl transition-all">
              <TableIcon className="mr-2 h-4 w-4" /> Vue Tableau Filtres
            </TabsTrigger>
            <TabsTrigger value="pingpocket" className="data-[state=active]:bg-clubPrimary data-[state=active]:text-white font-semibold text-xs md:text-sm py-2 px-4 rounded-xl transition-all">
              <Globe className="mr-2 h-4 w-4" /> Liste Officielle (141)
            </TabsTrigger>
            <TabsTrigger value="mensuelle" className="data-[state=active]:bg-clubPrimary data-[state=active]:text-white font-semibold text-xs md:text-sm py-2 px-4 rounded-xl transition-all">
              <Calendar className="mr-2 h-4 w-4" /> Progression Mensuelle
            </TabsTrigger>
            <TabsTrigger value="annuelle" className="data-[state=active]:bg-clubPrimary data-[state=active]:text-white font-semibold text-xs md:text-sm py-2 px-4 rounded-xl transition-all">
              <TrendingUp className="mr-2 h-4 w-4" /> Progression Annuelle
            </TabsTrigger>
            <TabsTrigger value="categorie" className="data-[state=active]:bg-clubPrimary data-[state=active]:text-white font-semibold text-xs md:text-sm py-2 px-4 rounded-xl transition-all">
              <UserCheck className="mr-2 h-4 w-4" /> Par Catégorie d'Âge
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ==================================================================== */}
        {/* --- ONGLET 1 : VUE TABLEAU FILTRES (INTERACTIF) --- */}
        {/* ==================================================================== */}
        <TabsContent value="live" className="space-y-6 focus-visible:outline-none">
          {/* Cartes KPI Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Users className="h-4 w-4 text-clubPrimary" /> Total Licenciés
                </CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-extrabold text-clubPrimary">
                  {totalPlayers}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Medal className="h-4 w-4 text-yellow-500" /> N°1 du Club
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-bold truncate text-white">
                  {bestPlayer ? (
                    <span>{bestPlayer.nom} {bestPlayer.prenom} <span className="text-clubPrimary font-extrabold">({bestPlayer.points} pts)</span></span>
                  ) : (
                    "Chargement..."
                  )}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <TrendingUp className="h-4 w-4 text-emerald-400" /> Moyenne Points
                </CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                  {avgPoints > 0 ? `${avgPoints} pts` : "750 pts"}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-clubLight shadow-xl rounded-2xl border border-border overflow-hidden">
            <CardHeader className="p-4 md:p-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-clubDark flex items-center gap-2">
                    Tableau Interactif des Joueurs
                    <Badge variant="outline" className="text-[10px] border-clubPrimary text-clubPrimary bg-clubPrimary/10">
                      <Award className="h-3 w-3 mr-1" /> FFTT Officiel
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-muted-foreground">
                    Filtrez par nom, prénom, numéro de licence ou catégorie d'âge.
                  </CardDescription>
                </div>

                <Button 
                  onClick={loadPlayers} 
                  variant="ghost" 
                  size="sm" 
                  disabled={loading}
                  className="text-xs text-clubPrimary hover:bg-clubPrimary/10 self-start sm:self-auto rounded-lg"
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
              </div>

              {/* Filtres */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom, prénom ou licence..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-input border-clubPrimary/40 text-xs md:text-sm text-clubDark rounded-lg"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-input border-clubPrimary/40 text-xs md:text-sm text-clubDark rounded-lg">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent className="bg-clubLight border-clubPrimary">
                    <SelectItem value="all" className="text-xs md:text-sm">Toutes les catégories</SelectItem>
                    {categoriesList.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-xs md:text-sm">
                        Catégorie {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="p-0 md:p-6 pt-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-clubPrimary mb-3" />
                  <p className="text-sm font-semibold text-clubDark">Mise à jour des licenciés...</p>
                </div>
              ) : filteredPlayers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm italic">
                  Aucun joueur ne correspond à votre recherche.
                </div>
              ) : (
                <div className="overflow-x-auto border-t sm:border border-border sm:rounded-xl shadow-sm">
                  <Table className="min-w-full">
                    {renderTableHead()}
                    <TableBody>
                      {filteredPlayers.map((player, index) => renderPlayerRow(player, index))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================================================================== */}
        {/* --- ONGLET 2 : LISTE OFFICIELLE (141 LICENCIÉS) --- */}
        {/* ==================================================================== */}
        <TabsContent value="pingpocket" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Globe className="h-4 w-4 text-clubPrimary" /> Base Officielle
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-extrabold text-clubPrimary">
                  FFTT Synchronisé
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Users className="h-4 w-4 text-emerald-400" /> Total Inscrits
                </CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                  {totalPlayers} Licenciés
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Sparkles className="h-4 w-4 text-yellow-400" /> Statut
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-bold text-white">
                  Saison En Cours
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-clubLight shadow-xl rounded-2xl border border-border overflow-hidden">
            <CardHeader className="p-4 md:p-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-clubDark">
                    Liste Officielle des Licenciés du Club
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-muted-foreground">
                    Classement complet de l'ensemble des 141 joueurs enregistrés à la Fédération.
                  </CardDescription>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Filtrer la liste..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-input border-clubPrimary/40 text-xs md:text-sm text-clubDark rounded-lg"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 md:p-6 pt-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-clubPrimary mb-3" />
                  <p className="text-sm font-semibold text-clubDark">Chargement de la liste officielle...</p>
                </div>
              ) : (
                <div className="overflow-x-auto border-t sm:border border-border sm:rounded-xl shadow-sm">
                  <Table className="min-w-full">
                    {renderTableHead()}
                    <TableBody>
                      {filteredPlayers.map((player, index) => renderPlayerRow(player, index))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================================================================== */}
        {/* --- ONGLET 3 : PROGRESSION MENSUELLE --- */}
        {/* ==================================================================== */}
        <TabsContent value="mensuelle" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Calendar className="h-4 w-4 text-clubPrimary" /> Période
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-extrabold text-clubPrimary">
                  Dernier Mois
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Zap className="h-4 w-4 text-yellow-400" /> Bilan
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-bold text-white">
                  Points Mensuels FFTT / Pingpocket
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <BarChart3 className="h-4 w-4 text-emerald-400" /> Format
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-extrabold text-emerald-400">
                  Tableau Natif
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-clubLight shadow-xl rounded-2xl border border-border overflow-hidden">
            <CardHeader className="p-4 md:p-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-clubDark">
                    Classement par Progression Mensuelle
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-muted-foreground">
                    Liste dynamique triée par la progression de points enregistrée sur le mois.
                  </CardDescription>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Rechercher un joueur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-input border-clubPrimary/40 text-xs md:text-sm text-clubDark rounded-lg"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 md:p-6 pt-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-clubPrimary mb-3" />
                  <p className="text-sm font-semibold text-clubDark">Chargement des progressions mensuelles...</p>
                </div>
              ) : (
                <div className="overflow-x-auto border-t sm:border border-border sm:rounded-xl shadow-sm">
                  <Table className="min-w-full">
                    {renderTableHead('mens')}
                    <TableBody>
                      {monthlySortedPlayers.map((player, index) => renderPlayerRow(player, index, 'mens'))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================================================================== */}
        {/* --- ONGLET 4 : PROGRESSION ANNUELLE --- */}
        {/* ==================================================================== */}
        <TabsContent value="annuelle" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <TrendingUp className="h-4 w-4 text-clubPrimary" /> Période
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-extrabold text-clubPrimary">
                  Saison Annuelle
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Trophy className="h-4 w-4 text-yellow-400" /> Objectif
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-bold text-white">
                  Palmarès Annuel
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Sparkles className="h-4 w-4 text-emerald-400" /> Format
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-extrabold text-emerald-400">
                  Tableau Natif
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-clubLight shadow-xl rounded-2xl border border-border overflow-hidden">
            <CardHeader className="p-4 md:p-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-clubDark">
                    Classement par Progression Annuelle
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-muted-foreground">
                    Palmarès des plus fortes progressions accumulées sur toute la saison.
                  </CardDescription>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Rechercher un joueur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-input border-clubPrimary/40 text-xs md:text-sm text-clubDark rounded-lg"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 md:p-6 pt-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-clubPrimary mb-3" />
                  <p className="text-sm font-semibold text-clubDark">Chargement des progressions annuelles...</p>
                </div>
              ) : (
                <div className="overflow-x-auto border-t sm:border border-border sm:rounded-xl shadow-sm">
                  <Table className="min-w-full">
                    {renderTableHead('ans')}
                    <TableBody>
                      {annualSortedPlayers.map((player, index) => renderPlayerRow(player, index, 'ans'))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================================================================== */}
        {/* --- ONGLET 5 : PAR CATÉGORIE D'ÂGE --- */}
        {/* ==================================================================== */}
        <TabsContent value="categorie" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <UserCheck className="h-4 w-4 text-clubPrimary" /> Tranches d'Âge
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-extrabold text-clubPrimary">
                  Jeunes & Séniors
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Users className="h-4 w-4 text-yellow-400" /> Organisation
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-bold text-white">
                  Groupes FFTT
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-xl border-none rounded-xl">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5 font-medium">
                  <Award className="h-4 w-4 text-emerald-400" /> Format
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-extrabold text-emerald-400">
                  Tableau Natif
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-clubLight shadow-xl rounded-2xl border border-border overflow-hidden">
            <CardHeader className="p-4 md:p-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-clubDark">
                    Licenciés par Catégorie d'Âge
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-muted-foreground">
                    Consultez les effectifs regroupés par catégorie officielle FFTT.
                  </CardDescription>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Filtrer par nom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-input border-clubPrimary/40 text-xs md:text-sm text-clubDark rounded-lg"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6 space-y-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-clubPrimary mb-3" />
                  <p className="text-sm font-semibold text-clubDark">Chargement des catégories d'âge...</p>
                </div>
              ) : Object.keys(groupedByCat).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm italic">
                  Aucun joueur ne correspond à vos filtres.
                </div>
              ) : (
                Object.entries(groupedByCat).map(([catName, catPlayers]) => (
                  <div key={catName} className="space-y-3">
                    <div className="flex items-center gap-3 bg-clubSection p-3 rounded-xl border border-border">
                      <Badge className="bg-clubPrimary text-white font-bold text-xs px-3 py-1">
                        Catégorie {catName}
                      </Badge>
                      <span className="text-xs font-semibold text-clubDark">
                        {catPlayers.length} joueur(s)
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-border rounded-xl shadow-sm">
                      <Table className="min-w-full">
                        {renderTableHead()}
                        <TableBody>
                          {catPlayers.map((player, index) => renderPlayerRow(player, index))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassementJoueurs;