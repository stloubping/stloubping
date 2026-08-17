import { allNewsItems, type NewsItem } from "@/data/news";
import { supabase } from "@/integrations/supabase/client";

type HomeNewsRow = {
  id: string;
  title: string;
  published_at: string;
  location: string;
  description: string;
  link: string;
  image_url: string;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const toNewsItem = (row: HomeNewsRow): NewsItem => ({
  id: row.id,
  title: row.title,
  date: dateFormatter.format(new Date(`${row.published_at}T12:00:00`)),
  location: row.location,
  description: row.description,
  link: row.link,
  image: row.image_url,
});

export const fallbackHomeNewsItems = allNewsItems.slice(0, 3);

export const fetchHomeNewsItems = async () => {
  const { data, error } = await supabase
    .from("home_news_items")
    .select("id,title,published_at,location,description,link,image_url")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw error;
  return (data as HomeNewsRow[]).map(toNewsItem);
};
