import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Loader2, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Stage = { id: string; name: string; slug: string; start_date: string | null; end_date: string | null; created_at: string };
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const formatDate = (value: string | null) => value ? new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR") : "Dates à préciser";

const StagesAdmin = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const load = async () => { setLoading(true); const { data, error } = await supabase.from("stages").select("id,name,slug,start_date,end_date,created_at").order("created_at"); if (error) toast.error("Impossible de charger les stages."); else setStages((data ?? []) as Stage[]); setLoading(false); };
  useEffect(() => { void load(); }, []);
  const createStage = async (event: FormEvent) => { event.preventDefault(); const cleanName = name.trim(); if (!cleanName) return; setSaving(true); const { data, error } = await supabase.from("stages").insert({ name: cleanName, slug: `${slugify(cleanName)}-${Date.now().toString(36)}`, start_date: startDate || null, end_date: endDate || null }).select("id,name,slug,start_date,end_date,created_at").single(); if (error) toast.error(error.code === "23505" ? "Ce stage existe déjà." : "Le stage n’a pas pu être créé."); else { setStages((current) => [...current, data as Stage]); setName(""); setStartDate(""); setEndDate(""); toast.success("Stage ajouté."); } setSaving(false); };
  const removeStage = async (stage: Stage) => { if (stage.slug === "stage-aout") return toast.error("Le stage août ne peut pas être supprimé."); if (!window.confirm(`Supprimer « ${stage.name} » de l’historique ?`)) return; const { error } = await supabase.from("stages").delete().eq("id", stage.id); if (error) toast.error("Le stage n’a pas pu être supprimé."); else { setStages((current) => current.filter((item) => item.id !== stage.id)); toast.success("Stage supprimé."); } };
  return <section className="min-h-[70vh] bg-clubLight px-4 py-10"><div className="mx-auto max-w-5xl"><Button asChild variant="ghost" className="mb-4"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" />Retour au tableau de bord</Link></Button><Card className="overflow-hidden border-0 shadow-xl"><CardHeader className="bg-clubDark text-white"><div className="flex items-center gap-3"><CalendarDays className="h-8 w-8 text-clubPrimary" /><div><p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Espace stages</p><CardTitle className="text-3xl">Stages</CardTitle><p className="mt-1 text-sm text-white/70">Retrouvez chaque stage et conservez l’historique des saisons précédentes.</p></div></div></CardHeader><CardContent className="space-y-6 p-5 md:p-7"><div className="grid gap-4 sm:grid-cols-2">{loading ? <div className="flex justify-center py-10 sm:col-span-2"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div> : stages.map((stage) => <Card key={stage.id} className="border-border"><CardContent className="flex items-center justify-between gap-4 p-5"><div><p className="text-lg font-black text-clubDark">{stage.name}</p><p className="text-sm text-muted-foreground">{formatDate(stage.start_date)}{stage.end_date ? ` – ${formatDate(stage.end_date)}` : ""}</p></div><div className="flex gap-2"><Button asChild className="bg-clubPrimary font-bold"><Link to={stage.slug === "stage-aout" ? "/administration/stage-aout" : `/administration/stage/${stage.slug}`}>Ouvrir</Link></Button>{stage.slug !== "stage-aout" && <Button variant="ghost" size="icon" onClick={() => void removeStage(stage)} aria-label={`Supprimer ${stage.name}`}><Trash2 className="h-4 w-4 text-red-600" /></Button>}</div></CardContent></Card>)}</div><Card className="border-dashed"><CardHeader><CardTitle className="text-xl">Ajouter un stage</CardTitle></CardHeader><CardContent><form onSubmit={createStage} className="grid gap-4 sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-end"><label className="text-sm font-bold">Nom du stage<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Stage de Toussaint" required /></label><label className="text-sm font-bold">Début<Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label><label className="text-sm font-bold">Fin<Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label><Button type="submit" disabled={saving} className="bg-clubPrimary font-bold">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}Ajouter</Button></form></CardContent></Card></CardContent></Card></div></section>;
};
export default StagesAdmin;


