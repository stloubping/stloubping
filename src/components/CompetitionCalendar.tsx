"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  MapPin, 
  CalendarPlus, 
  Clock,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { competitions20262027, categoryLabels, CompetitionEvent } from "@/data/competitions20262027";

const months = [
  { value: "all", label: "Toute la saison" },
  { value: "08", label: "Août 2026" },
  { value: "09", label: "Septembre 2026" },
  { value: "10", label: "Octobre 2026" },
  { value: "11", label: "Novembre 2026" },
  { value: "12", label: "Décembre 2026" },
  { value: "01", label: "Janvier 2027" },
  { value: "02", label: "Février 2027" },
  { value: "03", label: "Mars 2027" },
  { value: "04", label: "Avril 2027" },
  { value: "05", label: "Mai 2027" },
  { value: "06", label: "Juin 2027" },
];

const formatDateFr = (dateStr: string, endDateStr?: string) => {
  const startDate = new Date(dateStr);
  const day = startDate.getDate().toString().padStart(2, '0');
  const monthNames = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const month = monthNames[startDate.getMonth()];
  const year = startDate.getFullYear();

  if (endDateStr) {
    const endDate = new Date(endDateStr);
    const endDay = endDate.getDate().toString().padStart(2, '0');
    return `${day}-${endDay} ${month} ${year}`;
  }
  return `${day} ${month} ${year}`;
};

const createGoogleCalendarUrl = (event: CompetitionEvent) => {
  const start = event.date.replace(/-/g, '');
  const end = (event.endDate || event.date).replace(/-/g, '');
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.details || `Événement St Loub Ping : ${event.title}`);
  const location = encodeURIComponent(event.location || "Saint-Loubès");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
};

interface CompetitionCalendarProps {
  initialLimit?: number;
}

const CompetitionCalendar: React.FC<CompetitionCalendarProps> = ({ initialLimit }) => {
  const pdfPath = "/documents/schedule/Competitions-2026-2027.pdf";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredCompetitions = useMemo(() => {
    return competitions20262027
      .filter((item) => {
        // Filtre recherche textuelle
        const matchesSearch = searchQuery === "" || 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.details && item.details.toLowerCase().includes(searchQuery.toLowerCase()));

        // Filtre catégorie
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

        // Filtre mois
        const matchesMonth = selectedMonth === "all" || item.date.split("-")[1] === selectedMonth;

        // Filtre phase
        const matchesPhase = selectedPhase === "all" || item.phase === selectedPhase;

        return matchesSearch && matchesCategory && matchesMonth && matchesPhase;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [searchQuery, selectedCategory, selectedMonth, selectedPhase]);

  const displayedCompetitions = useMemo(() => {
    if (initialLimit && !isExpanded && !searchQuery && selectedCategory === "all" && selectedMonth === "all" && selectedPhase === "all") {
      return filteredCompetitions.slice(0, initialLimit);
    }
    return filteredCompetitions;
  }, [filteredCompetitions, initialLimit, isExpanded, searchQuery, selectedCategory, selectedMonth, selectedPhase]);

  const hasMore = initialLimit && filteredCompetitions.length > initialLimit && !searchQuery && selectedCategory === "all" && selectedMonth === "all" && selectedPhase === "all";

  return (
    <section className="mb-12">
      <Card className="bg-clubLight shadow-xl rounded-2xl border border-border overflow-hidden">
        <CardHeader className="bg-clubDark text-white p-6 md:p-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-clubPrimary/20 text-clubPrimary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 mx-auto">
            <Sparkles className="h-4 w-4" /> Saison 2026 - 2027
          </div>
          <CardTitle className="text-2xl md:text-4xl font-extrabold flex items-center justify-center gap-3">
            <CalendarIcon className="h-8 w-8 text-clubPrimary" />
            Calendrier Interactif des Compétitions
          </CardTitle>
          <CardDescription className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mt-2">
            Recherchez, filtrez et enregistrez directement les dates clés de la saison dans votre agenda.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="interactive" className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <TabsList className="bg-clubSection p-1 rounded-xl">
                <TabsTrigger value="interactive" className="data-[state=active]:bg-clubPrimary data-[state=active]:text-white font-medium text-xs md:text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4" /> Tableau Interactif
                </TabsTrigger>
                <TabsTrigger value="pdf" className="data-[state=active]:bg-clubPrimary data-[state=active]:text-white font-medium text-xs md:text-sm">
                  <FileText className="mr-2 h-4 w-4" /> Vue PDF Officielle
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button asChild variant="outline" size="sm" className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary/10 text-xs">
                  <a href={pdfPath} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> PDF Plein écran
                  </a>
                </Button>
                <Button asChild size="sm" className="bg-clubPrimary hover:bg-clubPrimary/90 text-white text-xs">
                  <a href={pdfPath} download="Competitions-2026-2027.pdf">
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Télécharger PDF
                  </a>
                </Button>
              </div>
            </div>

            <TabsContent value="interactive" className="space-y-6 focus-visible:outline-none">
              {/* --- Barre de filtres --- */}
              <div className="p-4 bg-clubSection/60 rounded-xl border border-border/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Recherche */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une journée, ville..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-white text-xs md:text-sm border-border"
                    />
                  </div>

                  {/* Filtre Mois */}
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="bg-white text-xs md:text-sm border-border">
                      <SelectValue placeholder="Filtrer par mois" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value} className="text-xs md:text-sm">
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Filtre Phase */}
                  <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                    <SelectTrigger className="bg-white text-xs md:text-sm border-border">
                      <SelectValue placeholder="Toutes les phases" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all" className="text-xs md:text-sm">Toutes les phases</SelectItem>
                      <SelectItem value="Phase 1" className="text-xs md:text-sm">Phase 1 (Sept - Déc 2026)</SelectItem>
                      <SelectItem value="Phase 2" className="text-xs md:text-sm">Phase 2 (Janv - Juin 2027)</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Bouton Réinitialiser si filtres actifs */}
                  {(searchQuery || selectedCategory !== "all" || selectedMonth !== "all" || selectedPhase !== "all") && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedMonth("all");
                        setSelectedPhase("all");
                      }}
                      className="text-xs text-clubPrimary hover:text-clubPrimary/80"
                    >
                      Réinitialiser les filtres
                    </Button>
                  )}
                </div>

                {/* Badges de catégories */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-semibold text-clubDark mr-2 flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5 text-clubPrimary" /> Catégorie :
                  </span>
                  <Badge
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    className={`cursor-pointer text-xs ${selectedCategory === "all" ? "bg-clubDark text-white" : "hover:bg-clubSection"}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    Toutes
                  </Badge>
                  {Object.entries(categoryLabels).map(([key, cat]) => (
                    <Badge
                      key={key}
                      className={`cursor-pointer text-[11px] transition-opacity ${
                        selectedCategory === key ? cat.color : "bg-white text-clubDark border border-border hover:opacity-80"
                      }`}
                      onClick={() => setSelectedCategory(key)}
                    >
                      {cat.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* --- Tableau des événements --- */}
              {displayedCompetitions.length === 0 ? (
                <div className="text-center py-12 bg-clubSection/30 rounded-xl border border-dashed border-border">
                  <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-clubDark font-semibold">Aucun événement ne correspond à vos critères.</p>
                  <p className="text-xs text-muted-foreground mt-1">Essayez de modifier votre recherche ou de réinitialiser les filtres.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow className="bg-clubDark text-white hover:bg-clubDark">
                        <TableHead className="text-white font-bold text-xs md:text-sm w-[130px]">Date</TableHead>
                        <TableHead className="text-white font-bold text-xs md:text-sm">Événement</TableHead>
                        <TableHead className="text-white font-bold text-xs md:text-sm hidden sm:table-cell">Catégorie</TableHead>
                        <TableHead className="text-white font-bold text-xs md:text-sm hidden md:table-cell">Lieu / Infos</TableHead>
                        <TableHead className="text-white font-bold text-xs md:text-sm text-center w-[120px]">Agenda</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedCompetitions.map((event) => {
                        const isPast = (event.endDate || event.date) < todayStr;
                        const cat = categoryLabels[event.category];

                        return (
                          <TableRow 
                            key={event.id} 
                            className={`transition-colors hover:bg-clubPrimary/5 ${
                              isPast ? "opacity-75 bg-gray-50/50" : "even:bg-clubSection/20 odd:bg-white"
                            }`}
                          >
                            {/* Date */}
                            <TableCell className="font-semibold text-xs md:text-sm text-clubDark whitespace-nowrap">
                              <div className="flex flex-col">
                                <span>{formatDateFr(event.date, event.endDate)}</span>
                                {event.phase && (
                                  <span className="text-[10px] text-muted-foreground font-normal">{event.phase}</span>
                                )}
                              </div>
                            </TableCell>

                            {/* Intitulé */}
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-bold text-xs md:text-sm text-clubDark flex items-center gap-2">
                                  {event.title}
                                  {isPast && (
                                    <Badge variant="outline" className="text-[9px] py-0 px-1.5 text-muted-foreground border-gray-300">
                                      Passé
                                    </Badge>
                                  )}
                                </div>
                                <div className="sm:hidden flex flex-wrap items-center gap-1.5 mt-1">
                                  <Badge className={`text-[9px] px-1.5 py-0 ${cat.color}`}>{cat.label}</Badge>
                                  {event.location && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                      <MapPin className="h-3 w-3 text-clubPrimary" /> {event.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            {/* Catégorie */}
                            <TableCell className="hidden sm:table-cell">
                              <Badge className={`text-[10px] px-2 py-0.5 ${cat.color}`}>
                                {cat.label}
                              </Badge>
                            </TableCell>

                            {/* Lieu / Infos */}
                            <TableCell className="hidden md:table-cell text-xs text-clubLight-foreground">
                              {event.location && (
                                <div className="flex items-center gap-1 font-medium text-clubDark">
                                  <MapPin className="h-3.5 w-3.5 text-clubPrimary flex-shrink-0" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.details && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">{event.details}</p>
                              )}
                            </TableCell>

                            {/* Action Agenda */}
                            <TableCell className="text-center">
                              <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                className="h-8 px-2 text-xs text-clubPrimary hover:text-white hover:bg-clubPrimary transition-colors"
                              >
                                <a
                                  href={createGoogleCalendarUrl(event)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Ajouter cet événement à Google Calendar"
                                >
                                  <CalendarPlus className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">Ajouter</span>
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Bouton afficher tout / réduire si limite */}
              {hasMore ? (
                <div className="text-center pt-2">
                  <Button
                    onClick={() => setIsExpanded(true)}
                    className="bg-clubPrimary hover:bg-clubPrimary/90 text-white font-medium text-xs md:text-sm px-6 py-2 rounded-full shadow"
                  >
                    Voir toutes les {filteredCompetitions.length} dates de la saison
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : isExpanded && initialLimit ? (
                <div className="text-center pt-2">
                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="outline"
                    className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary/10 font-medium text-xs md:text-sm px-6 py-2 rounded-full"
                  >
                    Réduire aux 10 premières dates
                    <ChevronUp className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : null}

              <div className="text-center text-xs text-muted-foreground pt-1">
                Affichage de {displayedCompetitions.length} compétition(s) sur un total de {competitions20262027.length}.
              </div>
            </TabsContent>

            {/* --- Onglet Vue PDF --- */}
            <TabsContent value="pdf" className="space-y-4 focus-visible:outline-none">
              <div className="w-full h-[650px] border border-border rounded-xl overflow-hidden shadow-inner">
                <iframe
                  src={`${pdfPath}#toolbar=0`}
                  title="Calendrier des Compétitions 2026-2027"
                  className="w-full h-full border-0"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default CompetitionCalendar;