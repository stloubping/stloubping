import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleHelp,
  Loader2,
  PackageCheck,
  PackagePlus,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const orderItemSchema = z.object({
  reference: z
    .string()
    .trim()
    .regex(/^(\d{7}|\d{10})$/, "La référence doit contenir 7 ou 10 chiffres."),
  designation: z.string().trim().min(2, "Indiquez le nom du produit.").max(150),
  quantity: z.number().int().min(1).max(20),
  color: z.string().trim().max(80).optional(),
  thickness: z.string().trim().max(80).optional(),
  handle: z.string().trim().max(80).optional(),
  size: z.string().trim().max(80).optional(),
  shoe_size: z.string().trim().max(80).optional(),
  option: z.string().trim().max(150).optional(),
  discount_applied: z.boolean(),
  unit_price: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d+([,.]\d{1,2})?$/.test(value),
      "Prix invalide.",
    )
    .optional(),
});

const equipmentOrderSchema = z.object({
  first_name: z.string().trim().min(2, "Le prénom est requis.").max(80),
  last_name: z.string().trim().min(2, "Le nom est requis.").max(80),
  email: z.string().trim().email("L’adresse e-mail est invalide."),
  phone: z.string().trim().min(6, "Le téléphone est requis.").max(30),
  items: z.array(orderItemSchema).min(1).max(20),
  notes: z.string().trim().max(1000, "Maximum 1 000 caractères.").optional(),
  consent: z.boolean().refine(Boolean, "Votre accord est obligatoire."),
  website: z.string().max(0).optional(),
});

type EquipmentOrderForm = z.infer<typeof equipmentOrderSchema>;

type PublicEquipmentOrder = {
  id: string;
  created_at: string;
  first_name: string;
  last_name_initial: string;
  item_count: number;
  status: string;
};

const statusLabels: Record<string, string> = {
  received: "Reçue",
  confirmed: "Confirmée",
  ordered: "Commandée",
  available: "Disponible",
  delivered: "Remise",
};

const emptyItem = {
  reference: "",
  designation: "",
  quantity: 1,
  color: "",
  thickness: "",
  handle: "",
  size: "",
  shoe_size: "",
  option: "",
  unit_price: "",
  discount_applied: true,
};

const Materiels = () => {
  const [orders, setOrders] = useState<PublicEquipmentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EquipmentOrderForm>({
    resolver: zodResolver(equipmentOrderSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      items: [{ ...emptyItem }],
      notes: "",
      consent: false,
      website: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = useWatch({
    control: form.control,
    name: "items",
  }) ?? [];
  const estimatedTotal = watchedItems.reduce((total, item) => {
    const normalizedPrice = (item.unit_price || "0")
      .replace(/\s/g, "")
      .replace(",", ".");
    const price = Number(normalizedPrice);
    const quantity = Number(item.quantity) || 0;
    return total + (Number.isFinite(price) ? price * quantity * (item.discount_applied ? 0.8 : 1) : 0);
  }, 0);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("equipment_orders_public")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Impossible de charger les commandes de matériel :", error);
    } else {
      setOrders((data ?? []) as PublicEquipmentOrder[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onSubmit = async (values: EquipmentOrderForm) => {
    setIsSubmitting(true);
    const items = values.items.map((item) => ({
      reference: item.reference,
      designation: item.designation,
      quantity: item.quantity,
      color: item.color || null,
      thickness: item.thickness || null,
      handle: item.handle || null,
      size: item.size || null,
      shoe_size: item.shoe_size || null,
      option: item.option || null,
      discount_rate: item.discount_applied ? 20 : 0,
      unit_price: item.unit_price
        ? Number(item.unit_price.replace(",", "."))
        : null,
    }));

    const orderId = crypto.randomUUID();
    const { error } = await supabase.from("equipment_orders").insert({
      id: orderId,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      items,
      notes: values.notes || null,
      consent: values.consent,
      website: values.website?.trim() || "",
      status: "received",
    });

    if (error) {
      console.error(error);
      toast.error("La commande n’a pas pu être enregistrée. Réessayez dans un instant.");
    } else {
      const { error: emailError } = await supabase.functions.invoke(
        "equipment-order-email",
        {
          body: { order_id: orderId },
        },
      );

      if (emailError) {
        console.error("Commande enregistrée, mais e-mail non envoyé :", emailError);
        toast.warning(
          "Commande enregistrée, mais l’e-mail de confirmation n’a pas pu être envoyé.",
        );
      } else {
        toast.success(
          "Commande transmise ! Un e-mail de confirmation vient de vous être envoyé.",
        );
      }
      form.reset({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        items: [{ ...emptyItem }],
        notes: "",
        consent: false,
        website: "",
      });
      await fetchOrders();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-clubLight">
      <section className="bg-clubDark px-4 py-12 text-white md:py-16">
        <div className="container mx-auto grid items-center gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-clubPrimary">
              Boutique Â· Matériels
            </p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">
              Commande groupée Wack Sport
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
              Transmettez au club vos références de bois, revêtements, balles,
              chaussures ou accessoires. Nous regroupons les demandes avant de
              passer commande chez notre partenaire.
            </p>
            <Button asChild className="mt-6 bg-clubPrimary font-bold text-white">
              <a href="https://wsport.fr/" target="_blank" rel="noopener noreferrer">
                Rechercher un produit sur Wack Sport
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <Card className="border-white/10 bg-white/5 text-white">
            <CardContent className="space-y-4 p-6">
              <div className="flex gap-3">
                <Search className="mt-0.5 h-5 w-5 shrink-0 text-clubPrimary" />
                <p className="text-sm text-white/80">
                  Relevez la référence à <strong className="text-white">7 ou 10 chiffres</strong>
                  indiquée sur la fiche Wack Sport.
                </p>
              </div>
              <div className="flex gap-3">
                <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-clubPrimary" />
                <p className="text-sm text-white/80">
                  Précisez la taille, la couleur, l’épaisseur ou tout autre choix nécessaire.
                </p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-clubPrimary" />
                <p className="text-sm text-white/80">
                  Le prix final, les remises éventuelles et le règlement seront confirmés par le club.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <main className="container mx-auto space-y-12 px-4 py-10">
        <Card className="mx-auto max-w-5xl border-clubPrimary/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-clubPrimary/10">
              <PackagePlus className="h-6 w-6 text-clubPrimary" />
            </div>
            <CardTitle className="text-3xl text-clubDark">Votre commande de matériel</CardTitle>
            <CardDescription>
              Vous pouvez ajouter jusqu’à 20 références dans une seule demande.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-8">
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-10000px] h-px w-px opacity-0" {...form.register("website")} />
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField control={form.control} name="first_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl><Input autoComplete="given-name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="last_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl><Input autoComplete="family-name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl><Input type="email" autoComplete="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl><Input type="tel" autoComplete="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-clubDark">Articles demandés</h2>
                      <p className="text-sm text-muted-foreground">
                        Copiez les informations depuis la fiche produit Wack Sport.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ ...emptyItem })}
                      disabled={fields.length >= 20}
                      className="border-clubPrimary text-clubPrimary"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Ajouter une référence
                    </Button>
                  </div>

                  {fields.map((item, index) => (
                    <Card key={item.id} className="border-clubPrimary/20 bg-clubSection/20">
                      <CardContent className="p-4 sm:p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-bold text-clubDark">Article {index + 1}</h3>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="mr-1 h-4 w-4" /> Supprimer
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
                          <FormField control={form.control} name={`items.${index}.reference`} render={({ field }) => (
                            <FormItem className="lg:col-span-3">
                              <FormLabel>Référence Wack Sport</FormLabel>
                              <FormControl>
                                <Input inputMode="numeric" placeholder="7 ou 10 chiffres" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`items.${index}.designation`} render={({ field }) => (
                            <FormItem className="lg:col-span-5">
                              <FormLabel>Désignation</FormLabel>
                              <FormControl><Input placeholder="Ex. Revêtement, bois, chaussuresâ€¦" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                              <FormLabel>Quantité</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={20}
                                  {...field}
                                  onChange={(event) => field.onChange(Number(event.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`items.${index}.unit_price`} render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                              <FormLabel>Prix indicatif</FormLabel>
                              <FormControl><Input inputMode="decimal" placeholder="0,00 â‚¬" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`items.${index}.discount_applied`} render={({ field }) => (
                            <FormItem className="flex items-center gap-3 rounded-lg border p-3 lg:col-span-2">
                              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                              <FormLabel className="!mt-0 cursor-pointer">Appliquer la remise club de 20 %</FormLabel>
                            </FormItem>
                          )} />                          <FormField control={form.control} name={`items.${index}.color`} render={({ field }) => (
                            <FormItem className="lg:col-span-3">
                              <FormLabel>Couleur <span className="font-normal text-muted-foreground">(facultatif)</span></FormLabel>
                              <FormControl><Input placeholder="Ex. rouge" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`items.${index}.thickness`} render={({ field }) => (
                            <FormItem className="lg:col-span-3">
                              <FormLabel>&Eacute;paisseur <span className="font-normal text-muted-foreground">(facultatif)</span></FormLabel>
                              <FormControl><Input placeholder="Ex. 2,0 mm" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`items.${index}.handle`} render={({ field }) => (
                            <FormItem className="lg:col-span-3">
                              <FormLabel>Manche <span className="font-normal text-muted-foreground">(facultatif)</span></FormLabel>
                              <FormControl><Input placeholder="Ex. concave" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`items.${index}.size`} render={({ field }) => (
                            <FormItem className="lg:col-span-3">
                              <FormLabel>Taille <span className="font-normal text-muted-foreground">(facultatif)</span></FormLabel>
                              <FormControl><Input placeholder="Ex. M" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`items.${index}.shoe_size`} render={({ field }) => (
                            <FormItem className="lg:col-span-3">
                              <FormLabel>Pointure <span className="font-normal text-muted-foreground">(facultatif)</span></FormLabel>
                              <FormControl><Input inputMode="decimal" placeholder="Ex. 43" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`items.${index}.option`} render={({ field }) => (
                            <FormItem className="md:col-span-2 lg:col-span-9">
                              <FormLabel>Autre pr&eacute;cision <span className="font-normal text-muted-foreground">(facultatif)</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Ex. montage souhait&eacute; ou autre d&eacute;tail" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarque générale</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Montage de raquette, délai souhaité ou autre précisionâ€¦"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="consent" render={({ field }) => (
                  <FormItem className="flex items-start gap-3 space-y-0 rounded-xl bg-clubSection/30 p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div>
                      <FormLabel>
                        J’accepte que mes coordonnées soient utilisées par le club pour gérer cette commande.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />

                <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-clubDark p-5 text-white sm:flex-row">
                  <div>
                    <p className="text-sm text-white/70">Total indicatif saisi</p>
                    <p className="text-3xl font-black text-clubPrimary">
                      {estimatedTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} â‚¬
                    </p>
                    <p className="mt-1 text-xs text-white/60">Le montant définitif sera confirmé par le club.</p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-clubPrimary px-8 py-6 text-lg font-bold text-white sm:w-auto"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Envoiâ€¦</>
                    ) : (
                      <><PackageCheck className="mr-2 h-5 w-5" />Transmettre la commande</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <section className="mx-auto max-w-5xl">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-clubDark">Commandes reçues</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Les coordonnées et le détail des articles restent privés.
            </p>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-7 w-7 animate-spin text-clubPrimary" />
            </div>
          ) : orders.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-muted-foreground">
                Aucune commande de matériel enregistrée pour le moment.
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="hidden grid-cols-[1.4fr_.8fr_.8fr_.8fr] gap-4 bg-clubDark px-5 py-3 text-sm font-semibold text-white sm:grid">
                <span>Joueur</span><span>Date</span><span>Articles</span><span>État</span>
              </div>
              <div className="divide-y">
                {orders.map((order) => (
                  <div key={order.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1.4fr_.8fr_.8fr_.8fr] sm:items-center sm:gap-4">
                    <p className="font-semibold text-clubDark">{order.first_name} {order.last_name_initial}</p>
                    <p className="text-sm">{new Date(order.created_at).toLocaleDateString("fr-FR")}</p>
                    <p className="text-sm">{order.item_count} référence{order.item_count > 1 ? "s" : ""}</p>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Materiels;
