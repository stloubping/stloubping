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
  email: z.string().trim().email("L’adresse e-mail est invalide."),
  phone: z.string().trim().min(6, "Le téléphone est requis.").max(30),
  size: z.string().min(1, "Choisissez une taille."),
  quantity: z.coerce.number().int().min(1).max(10),
  notes: z.string().trim().max(500, "Maximum 500 caractères.").optional(),
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
  productName: string;
  unitPrice: number;
};

const ShopPreorders = ({ productName, unitPrice }: ShopPreordersProps) => {
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
      size: "",
      quantity: 1,
      notes: "",
      consent: false,
      website: "",
    },
  });

  const quantity = form.watch("quantity") || 1;
  const totalPrice = useMemo(() => unitPrice * quantity, [quantity, unitPrice]);

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
    setIsSubmitting(true);
    const { error } = await supabase.from("shop_preorders").insert({
      ...values,
      product_name: productName,
      notes: values.notes || null,
      status: "received",
    });

    if (error) {
      toast.error("La précommande n’a pas pu être enregistrée. Réessayez dans un instant.");
      console.error(error);
    } else {
      toast.success("Précommande enregistrée ! Le club vous recontactera pour la confirmer.");
      form.reset();
      await fetchPreorders();
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <section id="precommande" className="mb-12 mt-12 scroll-mt-24">
        <Card className="mx-auto max-w-4xl border-clubPrimary/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-clubPrimary/10">
              <Shirt className="h-6 w-6 text-clubPrimary" />
            </div>
            <CardTitle className="text-3xl text-clubDark">Précommander votre maillot</CardTitle>
            <CardDescription>
              Remplissez ce formulaire. Le club vous contactera pour confirmer la commande et le règlement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-6">
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
                      <FormLabel>Taille</FormLabel>
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
                      <Textarea placeholder="Ex. coupe, remise à un entraîneurâ€¦" rows={3} {...field} />
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
                    <p className="text-sm text-white/70">Total estimé</p>
                    <p className="text-3xl font-black text-clubPrimary">{totalPrice} â‚¬</p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-clubPrimary px-8 py-6 text-lg font-bold text-white sm:w-auto"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Enregistrementâ€¦</>
                    ) : (
                      <><PackageCheck className="mr-2 h-5 w-5" />Précommander</>
                    )}
                  </Button>
                </div>
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
                    <span className="sm:hidden">Taille / quantité : </span>{preorder.size} Â· {preorder.quantity}
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
