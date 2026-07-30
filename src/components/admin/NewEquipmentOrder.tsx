import { type FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchClubPlayers, type Player } from "@/services/ffttService";
import { supabase } from "@/integrations/supabase/client";

type Item = { reference: string; designation: string; quantity: number; unit_price: number | null; color: string; thickness: string; handle: string; size: string; shoe_size: string; discount_rate: number };
const newItem = (): Item => ({ reference: "", designation: "", quantity: 1, unit_price: null, color: "", thickness: "", handle: "", size: "", shoe_size: "", discount_rate: 20 });
const money = (value: number) => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const Field = ({ label, children }: { label: string; children: ReactNode }) => <div><label className="mb-2 block text-sm font-bold">{label}</label>{children}</div>;

const NewEquipmentOrder = () => {
  const navigate = useNavigate();
  const [orderId] = useState(() => crypto.randomUUID());
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [licence, setLicence] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Item[]>([newItem()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchClubPlayers().then((data) => setPlayers([...data].sort((a, b) => a.nom.localeCompare(b.nom, "fr") || a.prenom.localeCompare(b.prenom, "fr")))).catch(() => toast.error("La liste des joueurs FFTT n’a pas pu être chargée.")).finally(() => setLoadingPlayers(false)); }, []);
  const player = players.find((entry) => entry.licence === licence);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.unit_price ?? 0) * item.quantity, 0), [items]);
  const discountAmount = useMemo(() => items.reduce((sum, item) => sum + (item.unit_price ?? 0) * item.quantity * (item.discount_rate / 100), 0), [items]);
  const total = subtotal - discountAmount;
  const updateItem = <K extends keyof Item>(index: number, key: K, value: Item[K]) => setItems((current) => current.map((item, i) => i === index ? { ...item, [key]: value } : item));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!player) { toast.error("Sélectionnez le joueur qui a passé la commande."); return; }
    if (items.some((item) => !item.reference.trim() || !item.designation.trim())) { toast.error("Renseignez la référence et la désignation de chaque article."); return; }
    setSaving(true);
    const cleanItems = items.map((item) => ({ reference: item.reference.trim(), designation: item.designation.trim(), quantity: item.quantity, unit_price: item.unit_price, color: item.color.trim() || null, thickness: item.thickness.trim() || null, handle: item.handle.trim() || null, size: item.size.trim() || null, shoe_size: item.shoe_size.trim() || null, discount_rate: item.discount_rate }));
    const { error } = await supabase.from("equipment_orders").insert({ id: orderId, first_name: player.prenom, last_name: player.nom, email: email.trim(), phone: phone.trim(), items: cleanItems, notes: notes.trim() || null, consent: true, status: "received" });
    if (error) { console.error(error); toast.error("La commande n’a pas pu être enregistrée."); setSaving(false); return; }
    toast.success(`Commande n° ${orderId.split("-")[0].toUpperCase()} enregistrée.`);
    navigate("/administration");
  };

  return <div className="min-h-screen bg-clubLight">
    <section className="bg-clubDark px-4 py-8 text-white"><div className="container mx-auto">
      <Button asChild variant="ghost" className="mb-4 -ml-4 text-white hover:bg-white/10 hover:text-white"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" /> Retour aux commandes</Link></Button>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-clubPrimary">Gestion du club</p><h1 className="mt-2 text-3xl font-black md:text-4xl">Nouvelle commande de matériel</h1></div><div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3"><p className="text-xs uppercase tracking-wider text-white/60">Numéro unique</p><p className="font-mono text-xl font-black">{orderId.split("-")[0].toUpperCase()}</p></div></div>
    </div></section>
    <main className="container mx-auto px-4 py-8"><form onSubmit={submit} className="mx-auto max-w-5xl space-y-6">
      <Card><CardHeader><CardTitle>1. Joueur</CardTitle></CardHeader><CardContent className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2"><Field label="Nom du joueur *"><Select value={licence} onValueChange={setLicence} disabled={loadingPlayers}><SelectTrigger><SelectValue placeholder={loadingPlayers ? "Chargement des joueurs…" : "Sélectionner un joueur"} /></SelectTrigger><SelectContent className="max-h-80">{players.map((entry) => <SelectItem key={entry.licence} value={entry.licence}>{entry.nom} {entry.prenom} · {entry.licence}</SelectItem>)}</SelectContent></Select></Field></div>
        <Field label="E-mail *"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field><Field label="Téléphone *"><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} minLength={6} required /></Field>
      </CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between gap-4"><CardTitle>2. Articles demandés</CardTitle><Button type="button" variant="outline" onClick={() => setItems((current) => [...current, newItem()])} disabled={items.length >= 20}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button></CardHeader><CardContent className="space-y-5">
        {items.map((item, index) => <div key={index} className="rounded-xl border bg-clubSection/20 p-4 md:p-5"><div className="mb-4 flex items-center justify-between"><p className="font-black">Article {index + 1}</p>{items.length > 1 && <Button type="button" size="icon" variant="ghost" onClick={() => setItems((current) => current.filter((_, i) => i !== index))} aria-label={`Supprimer l’article ${index + 1}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Référence *"><Input value={item.reference} onChange={(e) => updateItem(index, "reference", e.target.value)} required /></Field><div className="sm:col-span-2"><Field label="Désignation *"><Input value={item.designation} onChange={(e) => updateItem(index, "designation", e.target.value)} required /></Field></div>
          <Field label="Quantité *"><Input type="number" min={1} max={99} value={item.quantity} onChange={(e) => updateItem(index, "quantity", Math.max(1, Number(e.target.value) || 1))} required /></Field><Field label="Prix unitaire (€)"><Input type="number" min={0} step="0.01" value={item.unit_price ?? ""} onChange={(e) => updateItem(index, "unit_price", e.target.value === "" ? null : Math.max(0, Number(e.target.value)))} /></Field><label className="flex items-center gap-3 rounded-lg border p-3 text-sm font-bold"><input type="checkbox" checked={item.discount_rate === 20} onChange={(e) => updateItem(index, "discount_rate", e.target.checked ? 20 : 0)} className="h-4 w-4 accent-clubPrimary" /> Remise club de 20 %</label>
          <Field label="Couleur"><Input value={item.color} onChange={(e) => updateItem(index, "color", e.target.value)} /></Field><Field label="Épaisseur"><Input value={item.thickness} onChange={(e) => updateItem(index, "thickness", e.target.value)} /></Field><Field label="Manche"><Input value={item.handle} onChange={(e) => updateItem(index, "handle", e.target.value)} /></Field><Field label="Taille"><Input value={item.size} onChange={(e) => updateItem(index, "size", e.target.value)} /></Field><Field label="Pointure"><Input value={item.shoe_size} onChange={(e) => updateItem(index, "shoe_size", e.target.value)} /></Field>
        </div></div>)}
        <div className="rounded-xl bg-clubDark p-5 text-white"><div className="flex justify-between text-sm text-white/65"><span>Sous-total</span><span>{money(subtotal)}</span></div><div className="mt-2 flex justify-between text-sm text-clubPrimary"><span>Remises appliquées par article</span><span>− {money(discountAmount)}</span></div><div className="mt-3 flex justify-between border-t border-white/15 pt-3 text-lg font-black"><span>Total indicatif</span><span>{money(total)}</span></div></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>3. Remarque</CardTitle></CardHeader><CardContent><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} rows={4} placeholder="Informations utiles pour cette commande…" /></CardContent></Card>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button asChild variant="outline"><Link to="/administration">Annuler</Link></Button><Button type="submit" disabled={saving || loadingPlayers} className="bg-clubPrimary font-bold hover:bg-clubPrimary/90">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Enregistrer la commande</Button></div>
    </form></main>
  </div>;
};
export default NewEquipmentOrder;
