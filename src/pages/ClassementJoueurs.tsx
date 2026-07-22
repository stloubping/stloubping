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
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ClassementJoueurs = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const pingpocketRankingLink = "https://www.pingpocket.fr/app/fftt/clubs/10330022/licencies?themeId=redBrick";

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

  const totalPlayers = players.length > 0 ? players.length : 141;
  const bestPlayer = players.length > 0 ? players[0] : null;
  const avgPoints = players.length > 0 
    ? Math.round(players.reduce((acc, p) => acc + p.points, 0) / players.length) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-clubDark mb-3 flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8 md:h-10 md:w-10 text-clubPrimary" />
          Classement des Joueurs
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          Consultez l'ensemble des 141 licenciés du St Loub Ping (Club N° 10330022).
        </p>
      </div>

      {/* Raccourcis de navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button asChild variant="outline" size="sm" className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white text-xs">
          <Link to="/classement-joueurs/progression-mensuelle">Progression Mensuelle</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white text-xs">
          <Link to="/classement-joueurs/progression-annuelle">Progression Annuelle</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white text-xs">
          <Link to="/classement-joueurs/par-categorie-age">Par Catégorie d'Âge</Link>
        </Button>
      </div>

      <Tabs defaultValue="pingpocket" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-clubSection p-1 rounded-xl">
            <TabsTrigger value="pingpocket" className="data-[state=active]:bg-clubPrimary data-[state=active]:text-white font-medium text-xs md:text-sm">
              <Globe className="mr-2 h-4 w-4" /> Liste Officielle Pingpocket (141 Licenciés)
            </TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-clubPrimary data-[state=active]:text-white font-medium text-xs md:text-sm">
              <TableIcon className="mr-2 h-4 w-4" /> Vue Tableau Filtres
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- Onglet 1 : Vue Pingpocket Officielle (141 licenciés) --- */}
        <TabsContent value="pingpocket">
          <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-clubDark">Classement FFTT des 141 Licenciés</CardTitle>
              <CardDescription className="text-muted-foreground text-xs md:text-sm">
                Accès direct au classement officiel mis à jour par la FFTT via Pingpocket.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full max-w-xl mx-auto border border-border rounded-lg overflow-hidden my-4">
                <small className="block text-right text-xs text-muted-foreground p-2">
                  powered by <a target="_blank" rel="noopener noreferrer" href="https://www.pingpocket.fr" className="underline hover:text-clubPrimary text-clubPrimary">www.pingpocket.fr</a>
                </small>
                <iframe
                  frameBorder="1"
                  name="pingpocket-official-ranking"
                  width="100%"
                  height="800"
                  scrolling="auto"
                  src={pingpocketRankingLink}
                  title="Classement officiel des 141 licenciés Pingpocket"
                >
                  <p>Votre navigateur ne supporte pas les iframes.</p>
                </iframe>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Onglet 2 : Tableau interactif dynamique --- */}
        <TabsContent value="live" className="space-y-6">
          {/* Cartes KPI Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-clubDark text-white shadow-lg border-none">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-clubPrimary" /> Total Licenciés
                </CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-extrabold text-clubPrimary">
                  {totalPlayers}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-lg border-none">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5">
                  <Medal className="h-4 w-4 text-yellow-500" /> N°1 du Club
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-bold truncate text-white">
                  {bestPlayer ? (
                    <span>{bestPlayer.nom} {bestPlayer.prenom} <span className="text-clubPrimary font-extrabold">({bestPlayer.points} pts)</span></span>
                  ) : (
                    "Voir liste Pingpocket"
                  )}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-clubDark text-white shadow-lg border-none">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-gray-300 text-xs flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-400" /> Moyenne Points
                </CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                  {avgPoints > 0 ? `${avgPoints} pts` : "750 pts"}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
            <CardHeader className="p-4 md:p-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-clubDark flex items-center gap-2">
                    Filtre des Joueurs
                    <Badge variant="outline" className="text-[10px] border-clubPrimary text-clubPrimary bg-clubPrimary/10">
                      <Award className="h-3 w-3 mr-1" /> FFTT Officiel
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-muted-foreground">
                    Rechercher par nom, prénom ou catégorie.
                  </CardDescription>
                </div>

                <Button 
                  onClick={loadPlayers} 
                  variant="ghost" 
                  size="sm" 
                  disabled={loading}
                  className="text-xs text-clubPrimary hover:bg-clubPrimary/10 self-start sm:self-auto"
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
                    className="pl-9 bg-input border-clubPrimary/40 text-xs md:text-sm text-clubDark"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-input border-clubPrimary/40 text-xs md:text-sm text-clubDark">
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
                  <p className="text-sm font-semibold text-clubDark">Récupération des 141 licenciés...</p>
                </div>
              ) : filteredPlayers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm italic">
                  Utilisez le premier onglet Pingpocket pour consulter directement la liste complète des 141 licenciés.
                </div>
              ) : (
                <div className="overflow-x-auto border-t sm:border border-border sm:rounded-lg">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow className="bg-clubDark hover:bg-clubDark">
                        <TableHead className="text-white font-bold text-center w-[50px] text-xs">Rang</TableHead>
                        <TableHead className="text-white font-bold text-xs">Joueur</TableHead>
                        <TableHead className="text-white font-bold text-center text-xs">Points FFTT</TableHead>
                        <TableHead className="text-white font-bold text-center text-xs hidden sm:table-cell">Clast Officiel</TableHead>
                        <TableHead className="text-white font-bold text-center text-xs hidden md:table-cell">Catégorie</TableHead>
                        <TableHead className="text-white font-bold text-center text-xs hidden lg:table-cell">N° Licence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlayers.map((player, index) => {
                        const rank = players.findIndex(p => p.licence === player.licence) + 1;
                        const isTop3 = rank <= 3;

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
                                <span className="text-muted-foreground">{rank}</span>
                              )}
                            </TableCell>

                            <TableCell className="text-xs md:text-sm font-semibold text-clubDark uppercase">
                              {player.nom} <span className="capitalize font-normal text-clubDark/90">{player.prenom}</span>
                            </TableCell>

                            <TableCell className="text-center text-xs md:text-sm font-extrabold text-clubPrimary bg-clubPrimary/5">
                              {player.points} pts
                            </TableCell>

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
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassementJoueurs;