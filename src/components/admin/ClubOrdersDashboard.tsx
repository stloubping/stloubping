import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { ClipboardList, Clock3, Loader2, LogOut, PackageCheck, RefreshCw, Shirt, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type EquipmentOrder = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  items: EquipmentItem[];
  notes: string | null;
  status: string;
};

type ShirtOrder = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  product_name: string;
  size: string;
  quantity: number;
  notes: string | null;
  status: string;
};

type OrderSection = "equipment" | "shirts";

const equipmentStatusLabels: Record<string, string> = {
  received: "Reçue",
  confirmed: "Confirmée",
  ordered: "Commandée au fournisseur",
  available: "Disponible au club",
  delivered: "Remise",
  cancelled: "Annulée",
};

const shirtStatusLabels: Record<string, string> = {
  received: "Reçue",
  confirmed: "Confirmée",
  ready: "Disponible au club",
  delivered: "Remise",
  cancelled: "Annulée",
};

const formatPrice = (value: number) => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const formatOrderDate = (value: string) => new Date(value).toLocaleString("fr-FR");
const shortOrderId = (value: string) => value.split("-")[0].toUpperCase();

const itemDetails = (item: EquipmentItem) => [
  item.color && `Couleur : ${item.color}`,
  item.thickness && `Épaisseur : ${item.thickness}`,
  item.handle && `Manche : ${item.handle}`,
  item.size && `Taille : ${item.size}`,
  item.shoe_size && `Pointure : ${item.shoe_size}`,
  item.option,
].filter(Boolean);

type ClubOrdersDashboardProps = {
  session: Session;
  onSignOut: () => void;
};

const ClubOrdersDashboard = ({ session, onSignOut }: ClubOrdersDashboardProps) => {
  const [activeSection, setActiveSection] = useState<OrderSection>("equipment");
  const [equipmentOrders, setEquipmentOrders] = useState<EquipmentOrder[]>([]);
  const [shirtOrders, setShirtOrders] = useState<ShirtOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const [equipmentResult, shirtResult] = await Promise.all([
      supabase
        .from("equipment_orders")
        .select("id, created_at, first_name, last_name, email, phone, items, notes, status")
        .order("created_at", { ascending: false }),
      supabase
        .from("shop_preorders")
        .select("id, created_at, first_name, last_name, email, phone, product_name, size, quantity, notes, status")
        .order("created_at", { ascending: false }),
    ]);

    if (equipmentResult.error) {
      console.error(equipmentResult.error);
      toast.error("Impossible de charger les commandes de matériel.");
    } else {
      setEquipmentOrders((equipmentResult.data ?? []) as EquipmentOrder[]);
    }

    if (shirtResult.error) {
      console.error(shirtResult.error);
      toast.error("Impossible de charger les commandes de maillots.");
    } else {
      setShirtOrders((shirtResult.data ?? []) as ShirtOrder[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateEquipmentStatus = async (orderId: string, status: string) => {
    const previousOrders = equipmentOrders;
    setEquipmentOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
    const { error } = await supabase.from("equipment_orders").update({ status }).eq("id", orderId);
    if (error) {
      setEquipmentOrders(previousOrders);
      toast.error("Le statut de la commande matériel n’a pas pu être modifié.");
    } else {
      toast.success("Statut de la commande matériel mis à jour.");
    }
  };

  const updateShirtStatus = async (orderId: string, status: string) => {
    const previousOrders = shirtOrders;
    setShirtOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
    const { error } = await supabase.from("shop_preorders").update({ status }).eq("id", orderId);
    if (error) {
      setShirtOrders(previousOrders);
      toast.error("Le statut de la commande maillot n’a pas pu être modifié.");
    } else {
      toast.success("Statut de la commande maillot mis à jour.");
    }
  };

  const equipmentPending = equipmentOrders.filter((order) => order.status === "received").length;
  const shirtsPending = shirtOrders.filter((order) => order.status === "received").length;
  const totalOrders = equipmentOrders.length + shirtOrders.length;
  const totalPending = equipmentPending + shirtsPending;

  return (
    <div className="min-h-screen bg-clubLight">
      <section className="bg-clubDark px-4 py-10 text-white">
        <div className="container mx-auto flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-clubPrimary">Espace privé</p>
            <h1 className="mt-2 text-4xl font-black">Tableau de bord du club</h1>
            <p className="mt-2 text-white/65">{session.user.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={fetchOrders} className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
            </Button>
            <Button variant="outline" onClick={onSignOut} className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 md:py-10">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <ShoppingBag className="h-8 w-8 text-clubPrimary" />
              <div><p className="text-3xl font-black">{totalOrders}</p><p className="text-sm text-muted-foreground">commandes au total</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <Clock3 className="h-8 w-8 text-amber-500" />
              <div><p className="text-3xl font-black">{totalPending}</p><p className="text-sm text-muted-foreground">commandes à traiter</p></div>
            </CardContent>
          </Card>
          <button type="button" className="text-left" onClick={() => setActiveSection("equipment")}>
            <Card className={`h-full transition ${activeSection === "equipment" ? "border-clubPrimary ring-2 ring-clubPrimary/20" : "hover:border-clubPrimary/40"}`}>
              <CardContent className="flex items-center gap-4 p-5">
                <PackageCheck className="h-8 w-8 text-blue-600" />
                <div><p className="text-3xl font-black">{equipmentOrders.length}</p><p className="text-sm text-muted-foreground">commandes matériel · {equipmentPending} à traiter</p></div>
              </CardContent>
            </Card>
          </button>
          <button type="button" className="text-left" onClick={() => setActiveSection("shirts")}>
            <Card className={`h-full transition ${activeSection === "shirts" ? "border-clubPrimary ring-2 ring-clubPrimary/20" : "hover:border-clubPrimary/40"}`}>
              <CardContent className="flex items-center gap-4 p-5">
                <Shirt className="h-8 w-8 text-clubPrimary" />
                <div><p className="text-3xl font-black">{shirtOrders.length}</p><p className="text-sm text-muted-foreground">commandes maillots · {shirtsPending} à traiter</p></div>
              </CardContent>
            </Card>
          </button>
        </div>

        <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as OrderSection)}>
          <TabsList className="mb-7 grid h-auto w-full grid-cols-2 rounded-xl bg-white p-1.5 shadow-sm md:max-w-xl">
            <TabsTrigger value="equipment" className="gap-2 py-3 text-sm font-bold sm:text-base">
              <PackageCheck className="h-4 w-4" /> Matériel <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs">{equipmentOrders.length}</span>
            </TabsTrigger>
            <TabsTrigger value="shirts" className="gap-2 py-3 text-sm font-bold sm:text-base">
              <Shirt className="h-4 w-4" /> Maillots <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs">{shirtOrders.length}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="mt-0">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-black text-clubDark">Commandes de matériel</h2>
                <p className="mt-1 text-sm text-muted-foreground">Articles Wack Sport, options demandées et suivi de traitement.</p>
              </div>
              <Button asChild className="bg-clubDark font-bold hover:bg-clubDark/90">
                <Link to="/administration/bordereau-commande"><ClipboardList className="mr-2 h-4 w-4" /> Bordereau de commande</Link>
              </Button>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div>
            ) : equipmentOrders.length === 0 ? (
              <Card><CardContent className="p-10 text-center text-muted-foreground">Aucune commande de matériel enregistrée.</CardContent></Card>
            ) : (
              <div className="space-y-5">
                {equipmentOrders.map((order) => {
                  const subtotal = order.items.reduce((sum, item) => sum + (item.unit_price ?? 0) * item.quantity, 0);
                  const discountAmount = subtotal * 0.2;
                  const indicativeTotal = subtotal - discountAmount;
                  return (
                    <Card key={order.id} className="overflow-hidden border-l-4 border-l-blue-500">
                      <CardHeader className="gap-4 bg-white md:flex-row md:items-start md:justify-between">
                        <div>
                          <CardTitle>{order.first_name} {order.last_name}</CardTitle>
                          <p className="mt-2 text-sm text-muted-foreground">{order.email} · {order.phone}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{formatOrderDate(order.created_at)} · n° {shortOrderId(order.id)}</p>
                        </div>
                        <Select value={order.status} onValueChange={(status) => updateEquipmentStatus(order.id, status)}>
                          <SelectTrigger className="w-full md:w-56"><SelectValue /></SelectTrigger>
                          <SelectContent>{Object.entries(equipmentStatusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                        </Select>
                      </CardHeader>
                      <CardContent className="space-y-4 p-5">
                        {order.items.map((item, index) => (
                          <div key={`${order.id}-${item.reference}-${index}`} className="rounded-xl bg-clubSection/30 p-4">
                            <div className="flex flex-col justify-between gap-2 sm:flex-row">
                              <div><p className="font-bold">{item.designation}</p><p className="text-sm text-muted-foreground">Réf. {item.reference} · Quantité {item.quantity}</p></div>
                              <p className="font-black text-clubPrimary">{formatPrice((item.unit_price ?? 0) * item.quantity)}</p>
                            </div>
                            {itemDetails(item).length > 0 && <p className="mt-3 text-sm text-muted-foreground">{itemDetails(item).join(" · ")}</p>}
                          </div>
                        ))}
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between text-sm text-muted-foreground"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div>
                          <div className="flex justify-between text-sm font-bold text-clubPrimary"><span>Remise club (20 %)</span><span>− {formatPrice(discountAmount)}</span></div>
                          <div className="flex justify-between border-t pt-2 text-lg font-black"><span>Total indicatif</span><span>{formatPrice(indicativeTotal)}</span></div>
                        </div>
                        {order.notes && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><strong>Remarque :</strong> {order.notes}</p>}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shirts" className="mt-0">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-clubDark">Commandes de maillots</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tailles, quantités, coordonnées et suivi des précommandes du club.</p>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div>
            ) : shirtOrders.length === 0 ? (
              <Card><CardContent className="p-10 text-center text-muted-foreground">Aucune commande de maillot enregistrée.</CardContent></Card>
            ) : (
              <div className="space-y-5">
                {shirtOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden border-l-4 border-l-clubPrimary">
                    <CardHeader className="gap-4 bg-white md:flex-row md:items-start md:justify-between">
                      <div>
                        <CardTitle>{order.first_name} {order.last_name}</CardTitle>
                        <p className="mt-2 text-sm text-muted-foreground">{order.email} · {order.phone}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatOrderDate(order.created_at)} · n° {shortOrderId(order.id)}</p>
                      </div>
                      <Select value={order.status} onValueChange={(status) => updateShirtStatus(order.id, status)}>
                        <SelectTrigger className="w-full md:w-56"><SelectValue /></SelectTrigger>
                        <SelectContent>{Object.entries(shirtStatusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                      </Select>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="grid gap-4 rounded-xl bg-clubSection/30 p-4 sm:grid-cols-3">
                        <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Produit</p><p className="mt-1 font-bold">{order.product_name}</p></div>
                        <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Taille</p><p className="mt-1 text-lg font-black">{order.size}</p></div>
                        <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Quantité</p><p className="mt-1 text-lg font-black">{order.quantity}</p></div>
                      </div>
                      {order.notes && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><strong>Remarque :</strong> {order.notes}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClubOrdersDashboard;