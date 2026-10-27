import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle2, Loader2, PackageCheck, Shirt } from "lucide-react";
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
import { articlePrice, formatArticlePrice } from "@/data/shopArticles";
import { createShopOrderItem, shopOrderProducts as orderProducts, shopOrderSizes as sizes, shopOrderTotal } from "@/lib/shopCart";

const statusLabels: Record<string, string> = {
  received: "Reçue",
  confirmed: "Confirmée",
  ready: "Disponible",
  delivered: "Remise",
};

const formSchema = z.object({
  first_name: z.string().trim().min(2, "Le prénom est requis.").max(80),
  last_name: z.string().trim().min(2, "Le nom est requis.").max(80),
  email: z.string().trim().email("L’adresse e-mail est invalide.").max(254),
  phone: z.string().trim().min(6, "Le téléphone est requis.").max(30),
  items: z.array(z.object({ size: z.string(), quantity: z.coerce.number().catch(0) })).length(3),
  notes: z.string().trim().max(400, "Maximum 400 caractères.").optional(),
  consent: z.boolean().refine(Boolean, "Votre accord est obligatoire."),
  website: z.string().max(0).optional(),
});

type PreorderForm = z.infer<typeof formSchema>;

type PublicPreorder = {
  id: string;
  created_at: string;
  first_name: string;
  last_name_initial: string;
  product_name: string;
  size: string;
  quantity: number;
  status: string;
};

type ShopPreordersProps = {
  productIds: string[];
  onProductsChange: (productIds: string[]) => void;
};

const ShopPreorders = ({ productIds, onProductsChange }: ShopPreordersProps) => {
  const [preorders, setPreorders] = useState<PublicPreorder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PreorderForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      items: orderProducts.map(() => ({ size: "", quantity: 1 })),
      notes: "",
      consent: false,
      website: "",
    },
  });

  const draftItems = form.watch("items");
  const selectedProducts = orderProducts.filter(product => productIds.includes(product.id));
  const validQuantities = selectedProducts.every(product => {
    const quantity = Number(draftItems[orderProducts.indexOf(product)]?.quantity);
    return Number.isInteger(quantity) && quantity >= 1 && quantity <= 10;
  });
  const totalPrice = orderProducts.reduce((total, product, index) => productIds.includes(product.id) ? total + articlePrice(product)! * (Number(draftItems[index]?.quantity) || 0) : total, 0);

  const fetchPreorders = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("shop_preorders_public")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Impossible de charger les précommandes :", error);
    } else {
      setPreorders((data ?? []) as PublicPreorder[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPreorders();
  }, [fetchPreorders]);

  const onSubmit = async (values: PreorderForm) => {
    if (!selectedProducts.length) return toast.error("Choisissez au moins un article.");
    let invalid = false;
    for (const product of selectedProducts) {
      const index = orderProducts.indexOf(product);
      if (!sizes.includes(values.items[index].size)) { form.setError(`items.${index}.size`, { message: "Choisissez une taille." }); invalid = true; }
      const quantity = values.items[index].quantity;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) { form.setError(`items.${index}.quantity`, { message: "De 1 à 10 pièces par article." }); invalid = true; }
    }
    if (invalid) return;
    const items = selectedProducts.map(product => {
      const value = values.items[orderProducts.indexOf(product)];
      return createShopOrderItem(product.id, value.size, value.quantity);
    });
    setIsSubmitting(true);
    try {
      const priceSummary = `Total indicatif du bon : ${formatArticlePrice(shopOrderTotal(items))} TTC.`;
      const { error } = await supabase.from("shop_preorders").insert({
        ...values,
        items,
        product_name: items.map(item => item.product_name).join(" · "),
        size: items.map(item => item.size).join(" · "),
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        notes: [priceSummary, values.notes].filter(Boolean).join("\n"),
        status: "received",
      });
      if (error) throw error;
      toast.success("Votre bon de commande a été enregistré avec tous les articles sélectionnés.");
      form.reset();
      await fetchPreorders();
    } catch (error) {
      toast.error("La précommande n’a pas pu être enregistrée. Réessayez dans un instant.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="precommande" className="mb-12 mt-12 scroll-mt-24">
        <Card className="mx-auto max-w-4xl border-clubPrimary/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-clubPrimary/10">
              <Shirt className="h-6 w-6 text-clubPrimary" />
            </div>
            <CardTitle className="text-3xl text-clubDark">Bon de commande boutique</CardTitle>
            <CardDescription>
              Réunissez un, deux ou trois articles sur un seul bon. Choisissez une taille et une quantité pour chacun ; vos coordonnées ne sont saisies qu’une seule fois. Le club confirmera les disponibilités et le règlement. Aucun paiement en ligne.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-6">
                <fieldset disabled={isSubmitting} className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-bold">Articles sur votre bon</h4>
                  {orderProducts.map((product, index) => {
                    const selected = productIds.includes(product.id);
                    return <div key={product.id} className={`rounded-xl border p-4 ${selected ? 'border-clubPrimary/50 bg-clubPrimary/5' : 'bg-muted/20'}`}>
                      <div className="flex items-start gap-3">
                        <Checkbox id={`order-${product.id}`} checked={selected} onCheckedChange={checked => { form.clearErrors(`items.${index}`); onProductsChange(checked === true ? [...productIds, product.id] : productIds.filter(id => id !== product.id)); }} />
                        <label htmlFor={`order-${product.id}`} className="flex-1 cursor-pointer font-bold">{product.name}</label>
                        <span className="whitespace-nowrap font-bold text-clubPrimary">{formatArticlePrice(articlePrice(product))}</span>
                      </div>
                      {selected && <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <FormField control={form.control} name={`items.${index}.size`} render={({ field }) => <FormItem><FormLabel>Taille · {product.name}</FormLabel><FormControl><select {...field} className="flex min-h-11 w-full rounded-md border bg-background px-3 py-2 text-sm"><option value="">Choisir une taille</option>{sizes.map(size => <option key={size} value={size}>{size}</option>)}</select></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => <FormItem><FormLabel>Quantité · {product.name}</FormLabel><FormControl><Input type="number" min={1} max={10} {...field} /></FormControl><FormMessage /></FormItem>} />
                        <div className="self-end"><p className="text-sm text-muted-foreground">Sous-total TTC</p><p className="py-2 text-xl font-bold">{Number.isInteger(Number(draftItems[index]?.quantity)) && Number(draftItems[index]?.quantity) >= 1 && Number(draftItems[index]?.quantity) <= 10 ? formatArticlePrice(articlePrice(product)! * Number(draftItems[index].quantity)) : '—'}</p></div>
                      </div>}
                    </div>;
                  })}
                  <p className="text-sm text-muted-foreground">Tailles souhaitées à confirmer par le club. Pour le survêtement, précisez dans la remarque si la veste et le pantalon nécessitent des tailles différentes.</p>
                </div>
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

                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Précision éventuelle</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex. taille veste et pantalon, remise à un entraîneur…" rows={3} maxLength={400} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="consent" render={({ field }) => (
                  <FormItem className="flex items-start gap-3 space-y-0 rounded-lg bg-clubSection/30 p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div>
                      <FormLabel>
                        J’accepte que mes coordonnées soient utilisées par le club pour gérer cette précommande.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />

                <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-clubDark p-5 text-white sm:flex-row">
                  <div>
                    <p className="font-bold">{selectedProducts.length} article{selectedProducts.length > 1 ? 's' : ''} sur un seul bon</p>
                    <p className="text-sm text-white/70">Total général TTC</p>
                    <p className="text-3xl font-black text-clubPrimary">{validQuantities ? formatArticlePrice(totalPrice) : '—'}</p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedProducts.length || !validQuantities}
                    className="w-full bg-clubPrimary px-8 py-6 text-lg font-bold text-white sm:w-auto"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Enregistrement…</>
                    ) : (
                      <><PackageCheck className="mr-2 h-5 w-5" />Envoyer le bon de commande</>
                    )}
                  </Button>
                </div>
                </fieldset>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-clubDark">Liste des précommandes</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Les coordonnées restent privées. Seuls le prénom et l’initiale du nom sont affichés.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-clubPrimary" />
          </div>
        ) : preorders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">
              Aucune précommande enregistrée pour le moment.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="hidden grid-cols-[1fr_1.4fr_.7fr_.7fr] gap-4 bg-clubDark px-5 py-3 text-sm font-semibold text-white sm:grid">
              <span>Joueur</span><span>Produit</span><span>Taille / Qté</span><span>État</span>
            </div>
            <div className="divide-y">
              {preorders.map((preorder) => (
                <div key={preorder.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_1.4fr_.7fr_.7fr] sm:items-center sm:gap-4">
                  <p className="font-semibold text-clubDark">{preorder.first_name} {preorder.last_name_initial}</p>
                  <p className="text-sm">{preorder.product_name}</p>
                  <p className="text-sm">
                    <span className="sm:hidden">Taille / quantité : </span>{preorder.size} · {preorder.quantity}
                  </p>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      {statusLabels[preorder.status] ?? preorder.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ShopPreorders;
