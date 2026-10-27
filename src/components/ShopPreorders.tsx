import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { articlePrice, boutiqueOrderIds, formatArticlePrice, shopArticles } from "@/data/shopArticles";

const orderProducts = boutiqueOrderIds.map(id => shopArticles.find(article => article.id === id)!);

const sizes = [
  "2 ans", "4 ans", "6 ans", "8 ans", "10 ans", "12 ans", "14 ans",
  "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL",
  "7XL", "8XL", "9XL", "10XL",
];

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
  size: z.string().refine(value => sizes.includes(value), "Choisissez une taille."),
  quantity: z.coerce.number().int().min(1).max(10),
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
  productId: string;
  onProductChange: (productId: string) => void;
};

const ShopPreorders = ({ productId, onProductChange }: ShopPreordersProps) => {
  const [preorders, setPreorders] = useState<PublicPreorder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const product = orderProducts.find(article => article.id === productId);
  const unitPrice = product ? articlePrice(product) : null;

  const form = useForm<PreorderForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      size: "",
      quantity: 1,
      notes: "",
      consent: false,
      website: "",
    },
  });

  const quantity = Number(form.watch("quantity"));
  const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= 10;
  const totalPrice = useMemo(() => unitPrice !== null && validQuantity ? unitPrice * quantity : null, [quantity, unitPrice, validQuantity]);

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
    if (!product || unitPrice === null) return toast.error("Choisissez un article de la boutique.");
    setIsSubmitting(true);
    try {
      const priceSummary = `Tarif indicatif : ${formatArticlePrice(unitPrice)} TTC × ${values.quantity} = ${formatArticlePrice(unitPrice * values.quantity)} TTC.`;
      const { error } = await supabase.from("shop_preorders").insert({
        ...values,
        product_name: product.id === 'maillot-officiel' ? 'Maillot Officiel du Club' : product.name,
        notes: [priceSummary, values.notes].filter(Boolean).join("\n"),
        status: "received",
      });
      if (error) throw error;
      toast.success("Bon de commande enregistré ! Le club vous recontactera pour le confirmer.");
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
              Choisissez l’un des trois articles, votre taille et la quantité. Le club vous contactera pour confirmer les disponibilités et le règlement. Aucun paiement en ligne.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-6">
                <fieldset disabled={isSubmitting} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="boutique-article" className="text-sm font-medium">Article à commander</label>
                  <select id="boutique-article" value={productId} onChange={event => onProductChange(event.target.value)} className="flex min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {orderProducts.map(article => <option key={article.id} value={article.id}>{article.name} — {formatArticlePrice(articlePrice(article))} TTC{article.priceUnit === 'ensemble' ? ' / ensemble' : ''}</option>)}
                  </select>
                  {product && <p className="text-sm text-muted-foreground">{product.priceUnit === 'ensemble' ? 'Ensemble veste + pantalon. Pour des tailles différentes, précisez-les dans la remarque.' : 'Prix à la pièce.'} Tailles souhaitées sous réserve de confirmation par le club.</p>}
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
                  <FormField control={form.control} name="size" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taille souhaitée</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Choisir une taille" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sizes.map((size) => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantité</FormLabel>
                      <FormControl><Input type="number" min={1} max={10} {...field} /></FormControl>
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
                    <p className="font-bold">{product?.name}</p>
                    <p className="text-sm text-white/70">{formatArticlePrice(unitPrice)} TTC × {validQuantity ? quantity : '—'} · Total estimé TTC</p>
                    <p className="text-3xl font-black text-clubPrimary">{totalPrice === null ? '—' : formatArticlePrice(totalPrice)}</p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !product || !validQuantity}
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
