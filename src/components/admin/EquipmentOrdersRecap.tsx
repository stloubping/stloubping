import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, PackageCheck, Pencil, RotateCcw, Save, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { EditableEquipmentItem } from "@/components/admin/EquipmentOrderEditor";

type Order = { id: string; created_at: string; first_name: string; last_name: string; items: EditableEquipmentItem[]; status: string };
type Draft = { first_name: string; last_name: string; order_number: string; total: string };
const statuses = ["ordered", "available", "delivered"];
const previousStatus: Record<string, { value: string; label: string }> = {
  ordered: { value: "confirmed", label: "Confirmée" },
  available: { value: "ordered", label: "Commandée au fournisseur" },
  delivered: { value: "available", label: "Arrivée au club" },
};
const money = (value: number) => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const numberOf = (order: Order) => order.items[0]?.supplier_order_number || order.id.split("-")[0].toUpperCase();
const totalOf = (order: Order) => order.items[0]?.supplier_total ?? order.items.reduce((sum, item) => sum + (item.unit_price ?? 0) * item.quantity * (1 - (item.discount_rate ?? 20) / 100), 0);

const EquipmentOrdersRecap = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const [arrivingId, setArrivingId] = useState<string | null>(null);
  const ordersTotal = orders.reduce((sum, order) => sum + totalOf(order), 0);
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("equipment_orders").select("id, created_at, first_name, last_name, items, status").in("status", statuses).order("created_at", { ascending: false });
    if (error) { console.error(error); toast.error("Le récapitulatif n’a pas pu être chargé."); } else setOrders((data ?? []) as Order[]);
    setLoading(false);
  }, []);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const edit = (order: Order) => { setEditingId(order.id); setDraft({ first_name: order.first_name, last_name: order.last_name, order_number: numberOf(order), total: totalOf(order).toFixed(2) }); };
  const save = async (order: Order) => {
    if (!draft) return;
    const total = Number(draft.total.replace(",", "."));
    if (!draft.first_name.trim() || !draft.last_name.trim() || !draft.order_number.trim()) { toast.error("Le nom, le prénom et le numéro sont obligatoires."); return; }
    if (!Number.isFinite(total) || total < 0) { toast.error("Saisissez un montant valide."); return; }
    if (orders.some((entry) => entry.id !== order.id && numberOf(entry).toLowerCase() === draft.order_number.trim().toLowerCase())) { toast.error("Ce numéro de commande est déjà utilisé."); return; }
    const items = order.items.map((item, index) => index === 0 ? { ...item, supplier_order_number: draft.order_number.trim(), supplier_total: total } : item);
    setSaving(true);
    const { error } = await supabase.from("equipment_orders").update({ first_name: draft.first_name.trim(), last_name: draft.last_name.trim(), items }).eq("id", order.id);
    if (error) { console.error(error); toast.error("Les modifications n’ont pas pu être enregistrées."); }
    else { setOrders((current) => current.map((entry) => entry.id === order.id ? { ...entry, first_name: draft.first_name.trim(), last_name: draft.last_name.trim(), items } : entry)); setEditingId(null); setDraft(null); toast.success("Récapitulatif mis à jour."); }
    setSaving(false);
  };

  const markAsArrived = async (order: Order) => {
    setArrivingId(order.id);
    const { error } = await supabase.from("equipment_orders").update({ status: "available" }).eq("id", order.id);
    if (error) { console.error(error); toast.error("La commande n’a pas pu être marquée comme arrivée au club."); }
    else {
      setOrders((current) => current.map((entry) => entry.id === order.id ? { ...entry, status: "available" } : entry));
      toast.success("Commande marquée « Arrivée au club ».");
    }
    setArrivingId(null);
  };
  const revertStatus = async (order: Order) => {
    const previous = previousStatus[order.status];
    if (!previous) return;
    setRevertingId(order.id);
    const { error } = await supabase.from("equipment_orders").update({ status: previous.value }).eq("id", order.id);
    if (error) { console.error(error); toast.error("Le statut précédent n’a pas pu être restauré."); }
    else {
      if (previous.value === "confirmed") setOrders((current) => current.filter((entry) => entry.id !== order.id));
      else setOrders((current) => current.map((entry) => entry.id === order.id ? { ...entry, status: previous.value } : entry));
      toast.success(`Commande replacée au statut « ${previous.label} ».`);
    }
    setRevertingId(null);
  };
  return <div className="min-h-screen bg-clubLight">
    <section className="bg-clubDark px-4 py-8 text-white"><div className="container mx-auto"><Button asChild variant="ghost" className="mb-4 -ml-4 text-white hover:bg-white/10 hover:text-white"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" /> Retour aux commandes</Link></Button><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-clubPrimary">Commandes fournisseur</p><h1 className="mt-2 text-3xl font-black md:text-4xl">Récapitulatif des commandes</h1><p className="mt-2 text-white/65">Commandes transmises au fournisseur, arrivées au club ou déjà remises.</p></div></section>
    <main className="container mx-auto px-4 py-8">{loading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div> : orders.length === 0 ? <Card><CardContent className="py-14 text-center text-muted-foreground">Aucune commande transmise au fournisseur.</CardContent></Card> : <div className="space-y-4">
      <Card className="border-clubPrimary/30 bg-clubPrimary/5"><CardContent className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Total des commandes</p><p className="text-sm text-muted-foreground">{orders.length} commande{orders.length > 1 ? "s" : ""} dans le récapitulatif</p></div><p className="text-3xl font-black text-clubPrimary">{money(ordersTotal)}</p></CardContent></Card>
      <Card className="overflow-hidden">
      <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,.75fr)_minmax(0,1fr)_minmax(0,1.8fr)] gap-4 bg-clubDark px-5 py-4 text-sm font-bold text-white md:grid"><span>Nom</span><span>Prénom</span><span>Somme</span><span>N° de commande</span><span>Action</span></div>
      <div className="divide-y">{orders.map((order) => { const editingDraft = editingId === order.id ? draft : null; return <div key={order.id} className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,.75fr)_minmax(0,1fr)_minmax(0,1.8fr)] md:items-center">{editingDraft ? <>
        <Input aria-label="Nom" value={editingDraft.last_name} onChange={(e) => setDraft({ ...editingDraft, last_name: e.target.value })} /><Input aria-label="Prénom" value={editingDraft.first_name} onChange={(e) => setDraft({ ...editingDraft, first_name: e.target.value })} /><Input aria-label="Somme" type="number" min={0} step="0.01" value={editingDraft.total} onChange={(e) => setDraft({ ...editingDraft, total: e.target.value })} /><Input aria-label="Numéro de commande" value={editingDraft.order_number} onChange={(e) => setDraft({ ...editingDraft, order_number: e.target.value })} /><div className="flex gap-2"><Button size="icon" onClick={() => save(order)} disabled={saving} aria-label="Enregistrer">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}</Button><Button size="icon" variant="outline" onClick={() => { setEditingId(null); setDraft(null); }} disabled={saving} aria-label="Annuler"><X className="h-4 w-4" /></Button></div>
      </> : <><p><Label text="Nom" /><strong>{order.last_name}</strong></p><p><Label text="Prénom" />{order.first_name}</p><p className="font-black text-clubPrimary"><Label text="Somme" />{money(totalOf(order))}</p><p className="break-all font-mono font-bold"><Label text="N°" />{numberOf(order)}</p><div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"><Button variant="outline" size="sm" onClick={() => edit(order)}><Pencil className="mr-2 h-4 w-4" /> Modifier</Button>{order.status === "ordered" && <Button size="sm" onClick={() => markAsArrived(order)} disabled={arrivingId === order.id} className="whitespace-nowrap bg-clubPrimary font-bold hover:bg-clubPrimary/90">{arrivingId === order.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackageCheck className="mr-2 h-4 w-4" />} Arrivée au club</Button>}<Button variant="outline" size="sm" onClick={() => revertStatus(order)} disabled={revertingId === order.id} className="whitespace-nowrap">{revertingId === order.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />} Revenir à « {previousStatus[order.status]?.label} »</Button></div></>}</div>; })}</div>
      </Card>
    </div>}</main>
  </div>;
};
const Label = ({ text }: { text: string }) => <span className="mr-2 text-xs font-bold uppercase text-muted-foreground md:hidden">{text}</span>;
export default EquipmentOrdersRecap;
