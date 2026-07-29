import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, Loader2, PackageCheck, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type EquipmentItem = {
  reference: string;
  designation: string;
  quantity: number;
  unit_price: number | null;
  color?: string | null;
  thickness?: string | null;
  handle?: string | null;
  size?: string | null;
  shoe_size?: string | null;
  option?: string | null;
};

type ConfirmedOrder = {
  id: string;
  first_name: string;
  last_name: string;
  items: EquipmentItem[];
};

type AggregatedItem = EquipmentItem & {
  customers: string[];
  lineTotal: number;
};

const formatPrice = (value: number) => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const optionDetails = (item: EquipmentItem) => [
  item.color && `Couleur : ${item.color}`,
  item.thickness && `Épaisseur : ${item.thickness}`,
  item.handle && `Manche : ${item.handle}`,
  item.size && `Taille : ${item.size}`,
  item.shoe_size && `Pointure : ${item.shoe_size}`,
  item.option,
].filter(Boolean);

const itemGroupingKey = (item: EquipmentItem) => JSON.stringify([
  item.reference,
  item.designation,
  item.unit_price,
  item.color,
  item.thickness,
  item.handle,
  item.size,
  item.shoe_size,
  item.option,
]);

type EquipmentOrderSlipProps = {
  session: Session;
};

const EquipmentOrderSlip = ({ session }: EquipmentOrderSlipProps) => {
  const [orders, setOrders] = useState<ConfirmedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add("equipment-order-slip-page");
    return () => document.body.classList.remove("equipment-order-slip-page");
  }, []);

  useEffect(() => {
    const fetchConfirmedOrders = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("equipment_orders")
        .select("id, first_name, last_name, items")
        .eq("status", "confirmed")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        toast.error("Impossible de charger les commandes confirmées.");
      } else {
        setOrders((data ?? []) as ConfirmedOrder[]);
      }
      setIsLoading(false);
    };

    fetchConfirmedOrders();
  }, []);

  const aggregatedItems = useMemo<AggregatedItem[]>(() => {
    const grouped = new Map<string, EquipmentItem & { customers: Set<string> }>();

    orders.forEach((order) => {
      const customer = `${order.first_name} ${order.last_name}`;
      order.items.forEach((item) => {
        const key = itemGroupingKey(item);
        const existing = grouped.get(key);
        if (existing) {
          existing.quantity += item.quantity;
          existing.customers.add(customer);
        } else {
          grouped.set(key, { ...item, customers: new Set([customer]) });
        }
      });
    });

    return Array.from(grouped.values())
      .map((item) => ({
        ...item,
        customers: Array.from(item.customers).sort((a, b) => a.localeCompare(b, "fr")),
        lineTotal: (item.unit_price ?? 0) * item.quantity,
      }))
      .sort((a, b) => a.designation.localeCompare(b.designation, "fr"));
  }, [orders]);

  const totalQuantity = aggregatedItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = aggregatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const generatedAt = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });

  return (
    <div className="min-h-screen bg-clubLight px-4 py-8 md:py-10">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center print:hidden">
          <Button asChild variant="outline"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord</Link></Button>
          <Button onClick={() => window.print()} className="bg-clubPrimary font-bold"><Printer className="mr-2 h-4 w-4" /> Imprimer le bordereau</Button>
        </div>

        <section id="equipment-order-slip" className="overflow-hidden rounded-2xl bg-white shadow-xl print:rounded-none print:shadow-none">
          <header className="bg-clubDark px-6 py-8 text-white md:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-clubPrimary">Saint Loub Ping</p>
                <h1 className="mt-2 text-3xl font-black md:text-4xl">Bordereau de commande matériel</h1>
                <p className="mt-2 text-sm text-white/65">Commandes confirmées · généré le {generatedAt}</p>
              </div>
            </div>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-9 w-9 animate-spin text-clubPrimary" /></div>
          ) : aggregatedItems.length === 0 ? (
            <div className="p-10 text-center md:p-16">
              <PackageCheck className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h2 className="mt-4 text-2xl font-black text-clubDark">Aucune commande confirmée</h2>
              <p className="mt-2 text-muted-foreground">Les commandes apparaîtront ici dès que leur statut sera « Confirmée ».</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 border-b bg-clubSection/20 p-6 sm:grid-cols-3 md:px-10">
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Commandes</p><p className="mt-1 text-2xl font-black">{orders.length}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Articles</p><p className="mt-1 text-2xl font-black">{totalQuantity}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Total du bordereau</p><p className="mt-1 text-2xl font-black">{formatPrice(orderTotal)}</p></div>
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-clubDark/95 text-left text-white">
                    <tr>
                      <th className="px-5 py-4">Référence / article</th>
                      <th className="px-5 py-4">Options</th>
                      <th className="px-5 py-4">Joueurs</th>
                      <th className="px-5 py-4 text-center">Qté</th>
                      <th className="px-5 py-4 text-right">Prix unitaire</th>
                      <th className="px-5 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {aggregatedItems.map((item) => (
                      <tr key={itemGroupingKey(item)} className="align-top">
                        <td className="px-5 py-4"><p className="font-bold text-clubDark">{item.designation}</p><p className="mt-1 text-xs text-muted-foreground">Réf. {item.reference}</p></td>
                        <td className="px-5 py-4 text-muted-foreground">{optionDetails(item).join(" · ") || "—"}</td>
                        <td className="px-5 py-4 text-muted-foreground">{item.customers.join(", ")}</td>
                        <td className="px-5 py-4 text-center font-black">{item.quantity}</td>
                        <td className="px-5 py-4 text-right">{formatPrice(item.unit_price ?? 0)}</td>
                        <td className="px-5 py-4 text-right font-black text-clubPrimary">{formatPrice(item.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y md:hidden">
                {aggregatedItems.map((item) => (
                  <div key={itemGroupingKey(item)} className="p-5">
                    <div className="flex justify-between gap-4"><div><p className="font-bold text-clubDark">{item.designation}</p><p className="text-xs text-muted-foreground">Réf. {item.reference}</p></div><p className="text-lg font-black">× {item.quantity}</p></div>
                    {optionDetails(item).length > 0 && <p className="mt-3 text-sm text-muted-foreground">{optionDetails(item).join(" · ")}</p>}
                    <p className="mt-2 text-sm text-muted-foreground"><strong>Joueurs :</strong> {item.customers.join(", ")}</p>
                    <div className="mt-4 flex justify-between border-t pt-3"><span className="text-sm text-muted-foreground">Total de la ligne</span><span className="font-black text-clubPrimary">{formatPrice(item.lineTotal)}</span></div>
                  </div>
                ))}
              </div>

              <footer className="border-t-2 border-clubDark bg-clubSection/25 p-6 md:px-10">
                <div className="ml-auto max-w-md space-y-3">
                  <div className="flex justify-between border-t-2 border-clubDark pt-3 text-2xl font-black"><span>Total du bordereau</span><span>{formatPrice(orderTotal)}</span></div>
                </div>
                <p className="mt-8 text-xs text-muted-foreground">Bordereau réservé à la gestion du club · {session.user.email}</p>
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default EquipmentOrderSlip;