import { type FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Pencil, Plus, Save, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type WackOrder = { id: string; order_number: string; ordered_at: string; received_at: string | null; paid_at: string | null; players_due_at: string | null; amount: number };
type Draft = Omit<WackOrder, "id">;
const emptyDraft = (): Draft => ({ order_number: "", ordered_at: new Date().toISOString().slice(0, 10), received_at: null, paid_at: null, players_due_at: null, amount: 0 });
const dateValue = (value: string | null) => value ?? "";
const nullableDate = (value: string) => value || null;
const money = (value: number) => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const prettyDate = (value: string | null) => value ? new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR") : "—";

const WackSportOrders = () => {
  const [orders, setOrders] = useState<WackOrder[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("wacksport_orders").select("id, order_number, ordered_at, received_at, paid_at, players_due_at, amount").order("ordered_at", { ascending: false });
    if (error) { console.error(error); toast.error("Le suivi Wack Sport n’a pas pu être chargé."); } else setOrders((data ?? []) as WackOrder[]);
    setLoading(false);
  }, []);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const reset = () => { setDraft(emptyDraft()); setEditId(null); };
  const edit = (order: WackOrder) => { setEditId(order.id); setDraft({ order_number: order.order_number, ordered_at: order.ordered_at, received_at: order.received_at, paid_at: order.paid_at, players_due_at: order.players_due_at, amount: Number(order.amount) }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.order_number.trim() || !draft.ordered_at) { toast.error("Le numéro et la date de commande sont obligatoires."); return; }
    setSaving(true);
    const payload = { order_number: draft.order_number.trim(), ordered_at: draft.ordered_at, received_at: draft.received_at, paid_at: draft.paid_at, players_due_at: draft.players_due_at, amount: draft.amount };
    const result = editId ? await supabase.from("wacksport_orders").update(payload).eq("id", editId) : await supabase.from("wacksport_orders").insert(payload);
    if (result.error) {
      console.error("Erreur Wack Sport", result.error);
      const message = result.error.code === "23505"
        ? "Ce numéro de commande existe déjà."
        : result.error.code === "42501"
          ? "Accès refusé par Supabase. Vérifiez les droits du compte administrateur."
          : result.error.code === "PGRST204"
            ? "La structure de la table Wack Sport doit être mise à jour dans Supabase."
            : `Enregistrement impossible : ${result.error.message}`;
      toast.error(message);
    } else { toast.success(editId ? "Suivi Wack Sport modifié." : "Commande Wack Sport ajoutée."); reset(); await fetchOrders(); }
    setSaving(false);
  };

  return <div className="min-h-screen bg-clubLight">
    <section className="bg-clubDark px-4 py-8 text-white"><div className="container mx-auto"><Button asChild variant="ghost" className="mb-4 -ml-4 text-white hover:bg-white/10 hover:text-white"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" /> Retour aux commandes</Link></Button><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-clubPrimary">Suivi fournisseur</p><h1 className="mt-2 text-3xl font-black md:text-4xl">Wack Sport</h1><p className="mt-2 text-white/65">Suivez les dates importantes des commandes passées chez notre partenaire.</p></div></section>
    <main className="container mx-auto space-y-7 px-4 py-8">
      <Card><CardHeader><CardTitle>{editId ? "Modifier la commande Wack Sport" : "Ajouter une commande Wack Sport"}</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Field label="Numéro de commande *"><Input value={draft.order_number} onChange={(e) => setDraft({ ...draft, order_number: e.target.value })} maxLength={80} required /></Field>
        <Field label="Somme (€) *"><Input type="number" min={0} step="0.01" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: Math.max(0, Number(e.target.value) || 0) })} required /></Field>
        <Field label="Date de la commande *"><Input type="date" value={draft.ordered_at} onChange={(e) => setDraft({ ...draft, ordered_at: e.target.value })} required /></Field>
        <Field label="Réceptionnée le"><Input type="date" value={dateValue(draft.received_at)} onChange={(e) => setDraft({ ...draft, received_at: nullableDate(e.target.value) })} /></Field>
        <Field label="Payée le"><Input type="date" value={dateValue(draft.paid_at)} onChange={(e) => setDraft({ ...draft, paid_at: nullableDate(e.target.value) })} /></Field>
        <Field label="Joueurs à payer le"><Input type="date" value={dateValue(draft.players_due_at)} onChange={(e) => setDraft({ ...draft, players_due_at: nullableDate(e.target.value) })} /></Field>
        <div className="flex gap-2 md:col-span-2 xl:col-span-6 xl:justify-end">{editId && <Button type="button" variant="outline" onClick={reset}><X className="mr-2 h-4 w-4" /> Annuler</Button>}<Button type="submit" disabled={saving} className="bg-clubPrimary font-bold hover:bg-clubPrimary/90">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}{editId ? "Enregistrer" : "Ajouter la commande"}</Button></div>
      </form></CardContent></Card>
      <Card className="overflow-hidden"><div className="hidden grid-cols-[1.2fr_1fr_repeat(4,1fr)_auto] gap-4 bg-clubDark px-5 py-4 text-sm font-bold text-white lg:grid"><span>N° de commande</span><span>Somme</span><span>Commandée le</span><span>Réceptionnée le</span><span>Payée le</span><span>Joueurs à payer le</span><span>Action</span></div><div className="divide-y">{loading ? <div className="flex justify-center py-14"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div> : orders.length === 0 ? <p className="p-12 text-center text-muted-foreground">Aucune commande Wack Sport enregistrée.</p> : orders.map((order) => <div key={order.id} className="grid gap-3 p-5 lg:grid-cols-[1.2fr_1fr_repeat(4,1fr)_auto] lg:items-center"><Value label="N°" value={order.order_number} strong /><Value label="Somme" value={money(Number(order.amount))} strong /><Value label="Commandée le" value={prettyDate(order.ordered_at)} /><Value label="Réceptionnée le" value={prettyDate(order.received_at)} /><Value label="Payée le" value={prettyDate(order.paid_at)} /><Value label="Joueurs à payer le" value={prettyDate(order.players_due_at)} /><Button variant="outline" size="sm" onClick={() => edit(order)}><Pencil className="mr-2 h-4 w-4" /> Modifier</Button></div>)}</div></Card>
    </main>
  </div>;
};
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="space-y-2 text-sm font-bold"><span>{label}</span>{children}</label>;
const Value = ({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) => <p className={strong ? "font-black" : ""}><span className="mr-2 text-xs font-bold uppercase text-muted-foreground lg:hidden">{label}</span>{value}</p>;
export default WackSportOrders;
