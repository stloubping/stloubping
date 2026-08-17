import { type FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Newspaper, Plus, Save, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type HomeNewsItem = {
  id: string;
  title: string;
  published_at: string;
  location: string;
  description: string;
  link: string;
  image_url: string;
};

type NewsDraft = Omit<HomeNewsItem, "id">;

const emptyDraft = (): NewsDraft => ({
  title: "",
  published_at: new Date().toISOString().slice(0, 10),
  location: "",
  description: "",
  link: "#",
  image_url: "/images/hero/club-training.jpg",
});

const HomeNewsAdmin = () => {
  const [items, setItems] = useState<HomeNewsItem[]>([]);
  const [draft, setDraft] = useState<NewsDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("home_news_items")
      .select("id,title,published_at,location,description,link,image_url")
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Impossible de charger les actualités.");
    } else {
      setItems((data ?? []) as HomeNewsItem[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const updateItem = (id: string, field: keyof NewsDraft, value: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const createItem = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.description.trim()) {
      toast.error("Le titre et le contenu sont obligatoires.");
      return;
    }
    setSaving("new");
    const { error } = await supabase.from("home_news_items").insert({
      title: draft.title.trim(),
      published_at: draft.published_at,
      location: draft.location.trim(),
      description: draft.description.trim(),
      link: draft.link.trim() || "#",
      image_url: draft.image_url.trim() || "/images/hero/club-training.jpg",
    });
    if (error) {
      console.error(error);
      toast.error("L’actualité n’a pas pu être créée.");
    } else {
      setDraft(emptyDraft());
      await refresh();
      toast.success("Actualité créée.");
    }
    setSaving(null);
  };

  const saveItem = async (item: HomeNewsItem) => {
    if (!item.title.trim() || !item.description.trim()) {
      toast.error("Le titre et le contenu sont obligatoires.");
      return;
    }
    setSaving(item.id);
    const { error } = await supabase.from("home_news_items").update({
      title: item.title.trim(),
      published_at: item.published_at,
      location: item.location.trim(),
      description: item.description.trim(),
      link: item.link.trim() || "#",
      image_url: item.image_url.trim() || "/images/hero/club-training.jpg",
      updated_at: new Date().toISOString(),
    }).eq("id", item.id);
    if (error) {
      console.error(error);
      toast.error("L’actualité n’a pas pu être enregistrée.");
    } else {
      toast.success("Actualité enregistrée.");
      await refresh();
    }
    setSaving(null);
  };

  const deleteItem = async (item: HomeNewsItem) => {
    if (!window.confirm(`Supprimer l’actualité « ${item.title} » ?`)) return;
    setSaving(item.id);
    const { error } = await supabase.from("home_news_items").delete().eq("id", item.id);
    if (error) {
      console.error(error);
      toast.error("L’actualité n’a pas pu être supprimée.");
    } else {
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      toast.success("Actualité supprimée.");
    }
    setSaving(null);
  };

  const fields = (value: NewsDraft, onChange: (field: keyof NewsDraft, nextValue: string) => void, prefix: string) => <>
    <div className="grid gap-4 md:grid-cols-[1fr_180px]"><label className="grid gap-1.5 text-sm font-bold">Titre<Input value={value.title} onChange={(event) => onChange("title", event.target.value)} maxLength={180} required /></label><label className="grid gap-1.5 text-sm font-bold">Date<input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" type="date" value={value.published_at} onChange={(event) => onChange("published_at", event.target.value)} required /></label></div>
    <label className="grid gap-1.5 text-sm font-bold">Lieu (facultatif)<Input value={value.location} onChange={(event) => onChange("location", event.target.value)} maxLength={160} /></label>
    <label className="grid gap-1.5 text-sm font-bold">Texte de l’actualité<Textarea value={value.description} onChange={(event) => onChange("description", event.target.value)} maxLength={3000} rows={5} required /></label>
    <div className="grid gap-4 md:grid-cols-2"><label className="grid gap-1.5 text-sm font-bold">Lien du bouton (facultatif)<Input value={value.link} onChange={(event) => onChange("link", event.target.value)} placeholder="/adhesions, https://… ou #" /></label><label className="grid gap-1.5 text-sm font-bold">Image (URL ou chemin)<Input value={value.image_url} onChange={(event) => onChange("image_url", event.target.value)} placeholder="/images/actualites/mon-image.jpg" /></label></div>
  </>;

  return <section className="min-h-[70vh] bg-clubLight px-4 py-10"><div className="mx-auto max-w-5xl space-y-6">
    <Button asChild variant="ghost"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" />Retour au tableau de bord</Link></Button>
    <Card className="overflow-hidden border-0 shadow-xl"><CardHeader className="bg-clubDark text-white"><div className="flex items-center gap-3"><Newspaper className="h-8 w-8 text-clubPrimary" /><div><p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Page d’accueil</p><CardTitle className="text-2xl">Actualités à la une</CardTitle><p className="mt-1 text-sm text-white/65">Les trois articles les plus récents sont affichés sur l’accueil.</p></div></div></CardHeader><CardContent className="p-5 md:p-6"><form className="space-y-4" onSubmit={createItem}><h2 className="text-xl font-black text-clubDark">Créer une actualité</h2>{fields(draft, (field, value) => setDraft((current) => ({ ...current, [field]: value })), "new")}<Button type="submit" disabled={saving !== null} className="bg-clubPrimary font-bold">{saving === "new" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}Créer l’actualité</Button></form></CardContent></Card>
    <div><h2 className="text-2xl font-black text-clubDark">Articles enregistrés</h2><p className="mt-1 text-sm text-muted-foreground">Modifiez un article puis cliquez sur Enregistrer. La suppression est définitive.</p></div>
    {loading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div> : items.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">Aucune actualité n’est encore enregistrée.</CardContent></Card> : <div className="space-y-5">{items.map((item) => <Card key={item.id}><CardContent className="space-y-4 p-5">{fields(item, (field, value) => updateItem(item.id, field, value), item.id)}<div className="flex flex-wrap gap-3"><Button type="button" disabled={saving !== null} onClick={() => void saveItem(item)}>{saving === item.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Enregistrer</Button><Button type="button" variant="destructive" disabled={saving !== null} onClick={() => void deleteItem(item)}><Trash2 className="mr-2 h-4 w-4" />Supprimer</Button></div></CardContent></Card>)}</div>}
  </div></section>;
};

export default HomeNewsAdmin;
