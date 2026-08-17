"use client";

import { useEffect, useMemo, useState } from "react";
import { Newspaper, Search } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import { Input } from "@/components/ui/input";
import { allNewsItems } from "@/data/news";
import { fetchAllManagedNewsItems } from "@/lib/homeNews";

const normalize = (value = "") =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr-FR");

const Actualites = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newsItems, setNewsItems] = useState(allNewsItems);

  useEffect(() => {
    fetchAllManagedNewsItems()
      .then((managedItems) => setNewsItems([...managedItems, ...allNewsItems.slice(3)]))
      .catch((error) => console.error("Impossible de charger les actualités administrables.", error));
  }, []);

  const filteredNews = useMemo(() => {
    const query = normalize(searchQuery.trim());
    if (!query) return newsItems;

    return newsItems.filter((news) =>
      normalize(
        `${news.title} ${news.description} ${news.location} ${news.date}`,
      ).includes(query),
    );
  }, [newsItems, searchQuery]);

  return (
    <div className="min-h-screen bg-clubLight text-clubLight-foreground">
      <section className="bg-clubDark text-white">
        <div className="container mx-auto px-4 py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]">
            <Newspaper className="h-4 w-4 text-clubPrimary" />
            La vie du club
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
            Actualités
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75 md:text-lg">
            Retrouvez toutes les informations, les événements et les moments
            forts du St Loub Ping.
          </p>
          <p className="mt-5 text-sm font-semibold text-white/60">
            {newsItems.length} article
            {newsItems.length > 1 ? "s" : ""} publié
            {newsItems.length > 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-clubPrimary">
              Tous les articles
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-clubDark md:text-4xl">
              Les dernières nouvelles du club
            </h2>
          </div>

          <label className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une actualité, une date, un lieu…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-12 rounded-md border-slate-200 bg-white pl-10 focus-visible:ring-clubPrimary"
              aria-label="Rechercher dans les actualités"
            />
          </label>
        </div>

        <div className="mb-5 text-sm font-semibold text-muted-foreground">
          {filteredNews.length} résultat
          {filteredNews.length > 1 ? "s" : ""}
        </div>

        {filteredNews.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center text-muted-foreground">
            Aucun article ne correspond à « {searchQuery} ».
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {filteredNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Actualites;
