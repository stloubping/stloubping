import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const MAX_REGISTRATIONS = 48;

const tableauxOptions = [
  { id: "t1", label: "Tableau 1 : 500-799 (8h30)" },
  { id: "t2", label: "Tableau 2 : 500-1399 (9h30)" },
  { id: "t3", label: "Tableau 3 : 500-999 (10h30)" },
  { id: "t4", label: "Tableau 4 : 500-1599 (11h30)" },
  { id: "t5", label: "Tableau 5 : 500-1199 (13h30)" },
  { id: "t6", label: "Tableau 6 : 500-Non Num FR (14h30)" },
  { id: "d1", label: "Tableau 7 : Doubles <2800 Pts (16h00)" },
];

const formSchema = z.object({
  first_name: z.string().min(2, { message: "Le prénom est requis." }),
  last_name: z.string().min(2, { message: "Le nom est requis." }),
  email: z.string().email({ message: "Email invalide." }),
  phone: z.string().optional(),
  licence_number: z.string().min(1, { message: "Licence requise." }),
  points: z.string().min(1, { message: "Points requis." }),
  club: z.string().min(2, { message: "Club requis." }),
  selected_tableaux: z.array(z.string()).min(1, { message: "Sélectionnez au moins un tableau." }),
  doubles_partner: z.string().optional(),
  consent: z.boolean().refine(val => val === true, { message: "Obligatoire." }),
});

const TournamentRegistration = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "", last_name: "", email: "", phone: "",
      licence_number: "", points: "", club: "",
      selected_tableaux: [], doubles_partner: "", consent: false,
    },
  });

  const selectedTableaux = form.watch("selected_tableaux");

  useEffect(() => {
    const fetchCounts = async () => {
      const { data, error } = await supabase.from('tableau_counts').select('*');
      if (!error && data) {
        const countsMap = data.reduce((acc: any, curr: any) => {
          acc[curr.tableau_id] = curr.current_registrations;
          return acc;
        }, {});
        setCounts(countsMap);
      }
      setLoadingCounts(false);
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    let currentTotal = 0;
    const individualTableaux = selectedTableaux.filter(id => id !== "d1");
    if (individualTableaux.length === 1) currentTotal += 9;
    else if (individualTableaux.length === 2) currentTotal += 15;
    else if (individualTableaux.length >= 3) currentTotal += 20;
    if (selectedTableaux.includes("d1")) currentTotal += 3;
    setTotalPrice(currentTotal);
  }, [selectedTableaux]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const { error } = await supabase.from("tournament_registrations").insert([values]);
    
    if (error) {
      toast.error(error.message || "Erreur lors de l'inscription.");
      setIsSubmitting(false);
    } else {
      toast.success("Inscription réussie !");
      navigate('/tournoi/inscrits-live');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto bg-clubLight shadow-lg border-clubPrimary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-clubPrimary">Inscription au Tournoi</CardTitle>
          <CardDescription>Veuillez remplir le formulaire ci-dessous pour valider votre inscription.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="last_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl><Input {...field} className="bg-input border-clubPrimary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="first_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl><Input {...field} className="bg-input border-clubPrimary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="licence_number" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de licence FFTT</FormLabel>
                    <FormControl><Input placeholder="Ex: 3312345" {...field} className="bg-input border-clubPrimary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="points" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points officiels</FormLabel>
                    <FormControl><Input placeholder="Ex: 1245" {...field} className="bg-input border-clubPrimary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="club" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club</FormLabel>
                    <FormControl><Input {...field} className="bg-input border-clubPrimary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="votre@email.com" {...field} className="bg-input border-clubPrimary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="selected_tableaux" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-clubDark">Choix des Tableaux (Max 3 individuels)</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {tableauxOptions.map((item) => {
                      const currentCount = counts[item.id] || 0;
                      const remaining = MAX_REGISTRATIONS - currentCount;
                      const isFull = remaining <= 0;

                      return (
                        <FormItem key={item.id} className={`flex flex-row items-start space-x-3 space-y-0 p-2 rounded-md transition-colors ${isFull ? 'opacity-50 bg-gray-100' : 'hover:bg-clubSection/50'}`}>
                          <FormControl>
                            <Checkbox
                              disabled={isFull}
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, item.id]);
                                } else {
                                  field.onChange(current.filter((v) => v !== item.id));
                                }
                              }}
                              className="border-clubPrimary data-[state=checked]:bg-clubPrimary"
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel className={`font-normal ${isFull ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                              {item.label}
                            </FormLabel>
                            <span className={`text-[10px] font-bold ${remaining <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                              {isFull ? "COMPLET" : `${remaining} places restantes`}
                            </span>
                          </div>
                        </FormItem>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              {selectedTableaux.includes("d1") && (
                <FormField control={form.control} name="doubles_partner" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du partenaire de double</FormLabel>
                    <FormControl><Input placeholder="Nom et Prénom du partenaire" {...field} className="bg-input border-clubPrimary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              <FormField control={form.control} name="consent" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-clubSection/20 rounded-lg">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-clubPrimary" /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      J'accepte le règlement du tournoi et l'utilisation de mes données pour l'organisation.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="p-6 bg-clubDark text-white rounded-xl text-center shadow-inner">
                <p className="text-sm opacity-80 mb-1">Montant total estimé</p>
                <p className="text-4xl font-black text-clubPrimary">{totalPrice}€</p>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-white py-8 text-xl font-bold shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  "Valider mon inscription"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentRegistration;