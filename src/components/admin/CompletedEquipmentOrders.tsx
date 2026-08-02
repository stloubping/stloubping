import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { EditableEquipmentItem } from "@/components/admin/EquipmentOrderEditor";

type CompletedOrder = { id: string; first_name: string; last_name: string; items: EditableEquipmentItem[]; paid_at: string | null; handed_over_at: string | null; handed_over_by: string | null; status_before_completed: string | null };
const money = (value: number) => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const totalOf = (order: CompletedOrder) => order.items[0]?.supplier_total ?? order.items.reduce((sum, item) => sum + (item.unit_price ?? 0) * item.quantity * (1 - (item.discount_rate ?? 20) / 100), 0);
const numberOf = (order: CompletedOrder) => order.items[0]?.supplier_order_number || order.id.split("-")[0].toUpperCase();
const dateOf = (value: string | null) => value ? new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR") : "—";

const CompletedEquipmentOrders = () => {
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("equipment_orders").select("id, first_name, last_name, items, paid_at, handed_over_at, handed_over_by, status_before_completed").eq("status", "completed").order("created_at", { ascending: false });
    if (error) { console.error(error); toast.error("Les commandes terminées n’ont pas pu être chargées."); } else setOrders((data ?? []) as CompletedOrder[]);
    setLoading(false);
  }, []);
  useEffect(() => { void fetchOrders(); }, [fetchOrders]);
  const restore = async (order: CompletedOrder) => {
    setRestoringId(order.id);
    const { error } = await supabase.from("equipment_orders").update({ status: order.status_before_completed || "delivered", status_before_completed: null }).eq("id", order.id);
    if (error) { console.error(error); toast.error("La commande n’a pas pu être restaurée."); }
    else { setOrders((current) => current.filter((item) => item.id !== order.id)); toast.success("La commande est revenue dans le récapitulatif."); }
    setRestoringId(null);
  };
  return <div className="min-h-screen bg-clubLight"><section className="bg-clubDark px-4 py-8 text-white"><div className="container mx-auto"><Button asChild variant="ghost" className="mb-4 -ml-4 text-white hover:bg-white/10 hover:text-white"><Link to="/administration/recap-commandes-materiel"><ArrowLeft className="mr-2 h-4 w-4" />Retour au récapitulatif</Link></Button><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-clubPrimary">Archives matériel</p><h1 className="mt-2 text-3xl font-black md:text-4xl">Commandes terminées</h1><p className="mt-2 text-white/65">Commandes entièrement traitées et remises aux joueurs.</p></div></section><main className="container mx-auto px-4 py-8">{loading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div> : orders.length === 0 ? <Card><CardContent className="py-14 text-center text-muted-foreground">Aucune commande terminée.</CardContent></Card> : <Card className="overflow-hidden"><div className="overflow-x-auto"><div className="hidden min-w-[980px] grid-cols-[1fr_1fr_.8fr_.9fr_.8fr_.8fr_1fr_auto] gap-4 bg-clubDark px-5 py-4 text-sm font-bold text-white md:grid"><span>Nom</span><span>Prénom</span><span>Somme</span><span>N°</span><span>Payé le</span><span>Donné le</span><span>Donné par</span><span>Action</span></div><div className="divide-y">{orders.map((order) => <div key={order.id} className="grid gap-3 p-5 md:min-w-[980px] md:grid-cols-[1fr_1fr_.8fr_.9fr_.8fr_.8fr_1fr_auto] md:items-center"><p><MobileLabel text="Nom" /><strong>{order.last_name}</strong></p><p><MobileLabel text="Prénom" />{order.first_name}</p><p className="font-black text-clubPrimary"><MobileLabel text="Somme" />{money(totalOf(order))}</p><p className="font-mono font-bold"><MobileLabel text="N°" />{numberOf(order)}</p><p><MobileLabel text="Payé le" />{dateOf(order.paid_at)}</p><p><MobileLabel text="Donné le" />{dateOf(order.handed_over_at)}</p><p><MobileLabel text="Donné par" />{order.handed_over_by || "—"}</p><Button variant="outline" size="sm" onClick={() => restore(order)} disabled={restoringId === order.id}>{restoringId === order.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}Retour</Button></div>)}</div></div></Card>}</main></div>;
};
const MobileLabel = ({ text }: { text: string }) => <span className="mr-2 text-xs font-bold uppercase text-muted-foreground md:hidden">{text}</span>;
export default CompletedEquipmentOrders;
