import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, Loader2, Printer, Shirt } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AdminHelpBubble from "@/components/admin/AdminHelpBubble";
import { supabase } from "@/integrations/supabase/client";

type ConfirmedShirtOrder = {
  id: string;
  first_name: string;
  last_name: string;
  product_name: string;
  size: string;
  quantity: number;
  notes: string | null;
};

type AggregatedShirtOrder = {
  productName: string;
  size: string;
  quantity: number;
  customers: string[];
  notes: string[];
};

type ShirtOrderSlipProps = {
  session: Session;
};

const ShirtOrderSlip = ({ session }: ShirtOrderSlipProps) => {
  const [orders, setOrders] = useState<ConfirmedShirtOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add("shirt-order-slip-page");
    return () => document.body.classList.remove("shirt-order-slip-page");
  }, []);

  useEffect(() => {
    const fetchConfirmedOrders = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("shop_preorders")
        .select("id, first_name, last_name, product_name, size, quantity, notes")
        .eq("status", "confirmed")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        toast.error("Impossible de charger les commandes de maillots confirmées.");
      } else {
        setOrders((data ?? []) as ConfirmedShirtOrder[]);
      }
      setIsLoading(false);
    };

    fetchConfirmedOrders();
  }, []);

  const groupedOrders = useMemo<AggregatedShirtOrder[]>(() => {
    const grouped = new Map<string, AggregatedShirtOrder>();

    orders.forEach((order) => {
      const key = JSON.stringify([order.product_name, order.size]);
      const customer = `${order.first_name} ${order.last_name}`;
      const existing = grouped.get(key);
      const customerNote = order.notes ? `${customer} : ${order.notes}` : null;

      if (existing) {
        existing.quantity += order.quantity;
        if (!existing.customers.includes(customer)) existing.customers.push(customer);
        if (customerNote) existing.notes.push(customerNote);
      } else {
        grouped.set(key, {
          productName: order.product_name,
          size: order.size,
          quantity: order.quantity,
          customers: [customer],
          notes: customerNote ? [customerNote] : [],
        });
      }
    });

    return Array.from(grouped.values())
      .map((order) => ({
        ...order,
        customers: order.customers.sort((a, b) => a.localeCompare(b, "fr")),
      }))
      .sort((a, b) => a.productName.localeCompare(b.productName, "fr") || a.size.localeCompare(b.size, "fr", { numeric: true }));
  }, [orders]);

  const totalQuantity = groupedOrders.reduce((sum, order) => sum + order.quantity, 0);
  const generatedAt = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });

  return (
    <div className="min-h-screen bg-clubLight px-4 py-8 md:py-10">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center print:hidden">
          <Button asChild variant="outline">
            <Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord</Link>
          </Button>
          <Button onClick={() => window.print()} className="bg-clubPrimary font-bold">
            <Printer className="mr-2 h-4 w-4" /> Imprimer le bordereau
          </Button>
        </div>

        <section id="shirt-order-slip" className="overflow-hidden rounded-2xl bg-white shadow-xl print:rounded-none print:shadow-none">
          <header className="bg-clubDark px-6 py-8 text-white md:px-10">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-clubPrimary">Saint Loub Ping</p>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="text-3xl font-black md:text-4xl">Bordereau de commande maillots</h1>
              <AdminHelpBubble
                label="Contenu du bordereau"
                text="Ce document reprend uniquement les commandes au statut « Confirmée ». Les maillots sont regroupés par modèle et par taille avant impression."
                className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-clubDark print:hidden"
                side="bottom"
              />
            </div>
            <p className="mt-2 text-sm text-white/65">Commandes confirmées · généré le {generatedAt}</p>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-9 w-9 animate-spin text-clubPrimary" /></div>
          ) : groupedOrders.length === 0 ? (
            <div className="p-10 text-center md:p-16">
              <Shirt className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h2 className="mt-4 text-2xl font-black text-clubDark">Aucune commande confirmée</h2>
              <p className="mt-2 text-muted-foreground">Les maillots apparaîtront ici dès que leur statut sera « Confirmée ».</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 border-b bg-clubSection/20 p-6 sm:grid-cols-3 md:px-10">
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Commandes</p><p className="mt-1 text-2xl font-black">{orders.length}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Modèles / tailles</p><p className="mt-1 text-2xl font-black">{groupedOrders.length}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Maillots au total</p><p className="mt-1 text-2xl font-black text-clubPrimary">{totalQuantity}</p></div>
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-clubDark/95 text-left text-white">
                    <tr>
                      <th className="px-5 py-4">Produit</th>
                      <th className="px-5 py-4">Taille</th>
                      <th className="px-5 py-4">Joueurs</th>
                      <th className="px-5 py-4">Remarques</th>
                      <th className="px-5 py-4 text-center">Quantité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {groupedOrders.map((order) => (
                      <tr key={`${order.productName}-${order.size}`} className="align-top">
                        <td className="px-5 py-4 font-bold text-clubDark">{order.productName}</td>
                        <td className="px-5 py-4 text-lg font-black">{order.size}</td>
                        <td className="px-5 py-4 text-muted-foreground">{order.customers.join(", ")}</td>
                        <td className="px-5 py-4 text-muted-foreground">{order.notes.join(" · ") || "—"}</td>
                        <td className="px-5 py-4 text-center text-xl font-black text-clubPrimary">{order.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y md:hidden">
                {groupedOrders.map((order) => (
                  <div key={`${order.productName}-${order.size}`} className="p-5">
                    <div className="flex justify-between gap-4">
                      <div><p className="font-bold text-clubDark">{order.productName}</p><p className="mt-1 text-sm font-black">Taille {order.size}</p></div>
                      <p className="text-xl font-black text-clubPrimary">× {order.quantity}</p>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground"><strong>Joueurs :</strong> {order.customers.join(", ")}</p>
                    {order.notes.length > 0 && <p className="mt-2 text-sm text-muted-foreground"><strong>Remarques :</strong> {order.notes.join(" · ")}</p>}
                  </div>
                ))}
              </div>

              <footer className="border-t-2 border-clubDark bg-clubSection/25 p-6 md:px-10">
                <div className="ml-auto flex max-w-md justify-between text-2xl font-black">
                  <span>Total des maillots</span><span>{totalQuantity}</span>
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

export default ShirtOrderSlip;
