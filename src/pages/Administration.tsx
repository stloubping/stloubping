import { type FormEvent, useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Clock3, Loader2, LogOut, Mail, PackageCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const statusLabels: Record<string, string> = {
  received: "Reçue",
  confirmed: "Confirmée",
  ordered: "Commandée",
  available: "Disponible",
  delivered: "Remise",
  cancelled: "Annulée",
};

const formatPrice = (value: number) => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const itemDetails = (item: EquipmentItem) => [
  item.color && `Couleur : ${item.color}`,
  item.thickness && `Épaisseur : ${item.thickness}`,
  item.handle && `Manche : ${item.handle}`,
  item.size && `Taille : ${item.size}`,
  item.shoe_size && `Pointure : ${item.shoe_size}`,
  item.option,
].filter(Boolean);

const Administration = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("saintloubping@laposte.net");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [orders, setOrders] = useState<EquipmentOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    const { data, error } = await supabase
      .from("equipment_orders")
      .select("id, created_at, first_name, last_name, email, phone, items, notes, status")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Impossible de charger les commandes.");
    } else {
      setOrders((data ?? []) as EquipmentOrder[]);
    }
    setIsLoadingOrders(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user.id) {
      setIsAdmin(false);
      return;
    }
    const checkAccess = async () => {
      const { data, error } = await supabase.from("club_admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
      if (error || !data) {
        setIsAdmin(false);
        toast.error("Ce compte n’est pas autorisé à gérer le club.");
        await supabase.auth.signOut();
        return;
      }
      setIsAdmin(true);
      await fetchOrders();
    };
    checkAccess();
  }, [fetchOrders, session?.user.id]);

  const sendMagicLink = async (event: FormEvent) => {
    event.preventDefault();
    setIsSendingLink(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/administration` },
    });
    if (error) {
      console.error(error);
      toast.error("Le lien de connexion n’a pas pu être envoyé.");
    } else {
      toast.success("Lien de connexion envoyé. Consultez la boîte e-mail du club.");
    }
    setIsSendingLink(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    const previousOrders = orders;
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
    const { error } = await supabase.from("equipment_orders").update({ status }).eq("id", orderId);
    if (error) {
      setOrders(previousOrders);
      toast.error("Le statut n’a pas pu être modifié.");
    } else {
      toast.success("Statut de la commande mis à jour.");
    }
  };

  if (isAuthLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center bg-clubLight"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div>;
  }

  if (!session || !isAdmin) {
    return (
      <section className="min-h-[70vh] bg-clubLight px-4 py-16">
        <Card className="mx-auto max-w-lg overflow-hidden border-0 shadow-xl">
          <CardHeader className="space-y-4 bg-clubDark text-center text-white">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clubPrimary/20"><ShieldCheck className="h-7 w-7 text-clubPrimary" /></div>
            <CardTitle className="text-3xl">Gestion du club</CardTitle>
            <p className="text-sm text-white/70">Accès réservé aux membres autorisés du bureau.</p>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={sendMagicLink} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-bold">Adresse e-mail</label>
                <Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              </div>
              <Button type="submit" disabled={isSendingLink} className="w-full bg-clubPrimary py-6 text-base font-bold">
                {isSendingLink ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                Recevoir mon lien de connexion
              </Button>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">Aucun mot de passe à mémoriser : le lien sécurisé est utilisable une seule fois.</p>
            </form>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-clubLight">
      <section className="bg-clubDark px-4 py-10 text-white">
        <div className="container mx-auto flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-clubPrimary">Espace privé</p><h1 className="mt-2 text-4xl font-black">Gestion du club</h1><p className="mt-2 text-white/65">{session.user.email}</p></div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchOrders} className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"><RefreshCw className="mr-2 h-4 w-4" /> Actualiser</Button>
            <Button variant="outline" onClick={() => supabase.auth.signOut()} className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"><LogOut className="mr-2 h-4 w-4" /> Déconnexion</Button>
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card><CardContent className="flex items-center gap-4 p-5"><PackageCheck className="h-8 w-8 text-clubPrimary" /><div><p className="text-3xl font-black">{orders.length}</p><p className="text-sm text-muted-foreground">commandes</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5"><Clock3 className="h-8 w-8 text-amber-500" /><div><p className="text-3xl font-black">{orders.filter((order) => order.status === "received").length}</p><p className="text-sm text-muted-foreground">à traiter</p></div></CardContent></Card>
        </div>
        <div className="mb-6"><h2 className="text-3xl font-black text-clubDark">Commandes de matériel</h2><p className="mt-1 text-sm text-muted-foreground">Coordonnées, articles demandés et suivi de traitement.</p></div>
        {isLoadingOrders ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div> : orders.length === 0 ? <Card><CardContent className="p-10 text-center text-muted-foreground">Aucune commande enregistrée.</CardContent></Card> : (
          <div className="space-y-5">
            {orders.map((order) => {
              const total = order.items.reduce((sum, item) => sum + (item.unit_price ?? 0) * item.quantity, 0);
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="gap-4 bg-white md:flex-row md:items-start md:justify-between">
                    <div><CardTitle>{order.first_name} {order.last_name}</CardTitle><p className="mt-2 text-sm text-muted-foreground">{order.email} · {order.phone}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString("fr-FR")} · n° {order.id.split("-")[0].toUpperCase()}</p></div>
                    <Select value={order.status} onValueChange={(status) => updateStatus(order.id, status)}><SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>
                  </CardHeader>
                  <CardContent className="space-y-4 p-5">
                    {order.items.map((item, index) => <div key={`${order.id}-${item.reference}-${index}`} className="rounded-xl bg-clubSection/30 p-4"><div className="flex flex-col justify-between gap-2 sm:flex-row"><div><p className="font-bold">{item.designation}</p><p className="text-sm text-muted-foreground">Réf. {item.reference} · Quantité {item.quantity}</p></div><p className="font-black text-clubPrimary">{formatPrice((item.unit_price ?? 0) * item.quantity)}</p></div>{itemDetails(item).length > 0 && <p className="mt-3 text-sm text-muted-foreground">{itemDetails(item).join(" · ")}</p>}</div>)}
                    <div className="flex justify-between border-t pt-4 text-lg font-black"><span>Total indicatif</span><span>{formatPrice(total)}</span></div>
                    {order.notes && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><strong>Remarque :</strong> {order.notes}</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Administration;
