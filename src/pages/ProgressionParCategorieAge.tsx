"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchClubPlayers, Player } from "@/services/ffttService";
import { 
  Loader2, 
  Search, 
  UserCheck, 
  Users, 
  RefreshCw, 
  Award,
  Filter
} from 'lucide-react';

const ProgressionParCategorieAge = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>("all");

  const loadData = async () => {
    setLoading(true);
    const data = await fetchClubPlayers();
    setPlayers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Liste unique des catégories
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    players.forEach(p => {
      if (p.cat) cats.add(p.cat);
    });
    return Array.from(cats).sort();
  }, [players]);

  // Joueurs filtrés par recherche et par catégorie
  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        p.nom.toLowerCase().includes(query) ||
        p.prenom.toLowerCase().includes(query) ||
        p.licence.toLowerCase().includes(query);

      const matchesCat = selectedCatFilter === "all" || p.cat === selectedCatFilter;

      return matchesSearch && matchesCat;
    });
  }, [players, searchQuery, selectedCatFilter]);

  // Regroupement par catégorie
  const groupedCategories = useMemo(() => {
    const groups: Record<string, Player[]> = {};
    filteredPlayers.forEach(p => {
      const catKey = p.cat || "Non spécifiée";
      if (!groups[catKey]) groups[catKey] = [];
      groups[catKey].push(p);
    });

    // Tri de chaque groupe par points décroissants
    Object.keys(groups).forEach(cat => {
      groups[cat].sort((a, b) => b.points - a.points);
    });

    return groups;
  }, [filteredPlayers]);

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-clubDark mb-3 flex items-center justify-center gap-3">
          <UserCheck className="h-8 w-8 md:h-10 md:w-10 text-clubPrimary" />
          Licenciés par Catégorie d'Âge
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          Retrouvez la répartition de l'ensemble de nos licenciés du St Loub Ping regroupés par catégorie officielle FFTT.
        </p>
      </div>

      {/* Barre de Recherche et Filtres par Badges */}
      <Card className="bg-clubLight shadow-xl rounded-2xl border border-border overflow-hidden mb-8">
        <CardHeader className="p-4 md:p-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-clubDark flex items-center gap-2">
                Filtres & Sélection
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-muted-foreground">
                Sélectionnez une catégorie ou recherchez un joueur.
              </CardDescription>
            </div>

            <Button 
              onClick={loadData} 
              variant="ghost" 
              size="sm" 
              disabled={loading}
              className="text-xs text-clubPrimary hover:bg-clubPrimary/10 rounded-lg"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {/* Input de recherche */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un joueur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-clubPrimary/40 text-xs md:text-sm text-clubDark rounded-lg"
            />
          </div>

          {/* Badges de Catégories */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-semibold text-clubDark mr-2 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-clubPrimary" /> Catégories :
            </span>
            <Badge
              variant={selectedCatFilter === "all" ? "default" : "outline"}
              className={`cursor-pointer text-xs ${selectedCatFilter === "all" ? "bg-clubDark text-white" : "hover:bg-clubSection"}`}
              onClick={() => setSelectedCatFilter("all")}
            >
              Toutes ({players.length})
            </Badge>
            {availableCategories.map(cat => {
              const count = players.filter(p => p.cat === cat).length;
              return (
                <Badge
                  key={cat}
                  className={`cursor-pointer text-xs transition-opacity ${
                    selectedCatFilter === cat 
                      ? "bg-clubPrimary text-white" 
                      : "bg-white text-clubDark border border-border hover:bg-clubSection"
                  }`}
                  onClick={() => setSelectedCatFilter(cat)}
                >
                  {cat} ({count})
                </Badge>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      {/* Contenu par Groupes */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-clubPrimary mb-3" />
          <p className="text-sm font-semibold text-clubDark">Chargement des catégories d'âge...</p>
        </div>
      ) : Object.keys(groupedCategories).length === 0 ? (
        <Card className="bg-clubLight shadow-lg p-8 text-center text-muted-foreground">
          Aucun joueur ne correspond à vos filtres.
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedCategories).map(([catName, catPlayers]) => (
            <Card key={catName} className="bg-clubLight shadow-xl rounded-2xl border border-border overflow-hidden">
              <CardHeader className="bg-clubDark text-white p-4 md:p-5 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className="bg-clubPrimary text-white text-xs md:text-sm font-bold px-3 py-1">
                    Catégorie {catName}
                  </Badge>
                  <CardTitle className="text-base md:text-lg font-bold text-white">
                    {catPlayers.length} joueur(s)
                  </CardTitle>
                </div>

                <Badge variant="outline" className="border-gray-400 text-gray-200 text-[10px]">
                  N°1 : {catPlayers[0]?.nom} ({catPlayers[0]?.points} pts)
                </Badge>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow className="bg-clubSection hover:bg-clubSection">
                        <TableHead className="text-clubDark font-bold text-center w-[60px] text-xs">Rang</TableHead>
                        <TableHead className="text-clubDark font-bold text-xs">Joueur</TableHead>
                        <TableHead className="text-clubDark font-bold text-center text-xs">Points FFTT</TableHead>
                        <TableHead className="text-clubDark font-bold text-center text-xs hidden sm:table-cell">Clast Officiel</TableHead>
                        <TableHead className="text-clubDark font-bold text-center text-xs hidden md:table-cell">Catégorie</TableHead>
                        <TableHead className="text-clubDark font-bold text-center text-xs hidden lg:table-cell">N° Licence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {catPlayers.map((player, index) => {
                        const globalRank = players.findIndex(p => p.licence === player.licence) + 1;
                        return (
                          <TableRow key={player.licence || index} className="even:bg-clubSection/20 odd:bg-white hover:bg-clubPrimary/5 transition-colors">
                            <TableCell className="text-center font-bold text-xs md:text-sm text-clubPrimary">
                              {index + 1}
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
                              <Badge className="bg-clubDark text-white text-[10px]">
                                {player.cat || catName}
                              </Badge>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressionParCategorieAge;