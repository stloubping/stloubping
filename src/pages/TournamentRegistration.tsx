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
import { Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tableauxOptions = [
  { id: "t1", label: "Tableau 1 : 500-799 (Début 8h30)" },
  { id: "t2", label: "Tableau 2 : 500-1399 (Début 9h30)" },
  { id: "t3", label: "Tableau 3 : 500-999 (Début 10h30)" },
  { id: "t4", label: "Tableau 4 : 500-1599 (Début 11h30)" },
  { id: "t5", label: "Tableau 5 : 500-1199 (Début 13h30)" },
  { id: "t6", label: "Tableau 6 : 500-Non Num FR (Début 14h30)" },
  { id: "d1", label: "Tableau 7 : Doubles <2800 Pts (Début 16h00)", price: 3 },
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "", last_name: "", email: "", phone: "",
      licence_number: "", points: "", club: "",
      selected_tableaux: [], doubles_partner: "", consent: false,
    },
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  
  const selectedTableaux = form.watch("selected_tableaux");
  const licenceNumber = form.watch("licence_number");
  const navigate = useNavigate();

  useEffect(() => {
    let currentTotal = 0;
    const individualTableaux = selectedTableaux.filter(id => id !== "d1");
    if (individualTableaux.length === 1) currentTotal += 9;
    else if (individualTableaux.length === 2) currentTotal += 15;
    else if (individualTableaux.length >= 3) currentTotal += 20;
    if (selectedTableaux.includes("d1")) currentTotal += 3;
    setTotalPrice(currentTotal);
  }, [selectedTableaux]);

  const fetchPlayerInfo = async () => {
    if (!licenceNumber || licenceNumber.length < 4) {
      toast.error("Veuillez saisir un numéro de licence valide.");
      return;
    }

    setIsFetching(true);
    
    try {
      // Utilisation de la méthode officielle invoke() au lieu de fetch()
      const { data, error } = await supabase.functions.invoke('get-player-points', {
        body: { licence: licenceNumber },
      });

      if (error) throw error;

      if (data) {
        if (data.points) form.setValue("points", data.points.toString());
        if (data.club) form.setValue("club", data.club);
        if (data.first_name) form.setValue("first_name", data.first_name);
        if (data.last_name) form.setValue("last_name", data.last_name);
        
        toast.success(`Fiche récupérée : ${data.first_name} ${data.last_name}`);
      }
    } catch (err) {
      console.error("Erreur recherche:", err);
      toast.error("Joueur non trouvé. Veuillez remplir manuellement.");
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from("tournament_registrations").insert([values]);
    if (error) {
      toast.error("Erreur lors de l'inscription.");
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
          <CardDescription>Saisissez votre licence pour pré-remplir votre fiche.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-clubSection/30 p-4 rounded-lg border border-clubPrimary/10 mb-6">
                <FormField control={form.control} name="licence_number" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-clubDark font-bold">Numéro de licence FFTT</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          placeholder="Ex: 3312345" 
                          {...field} 
                          className="bg-white border-clubPrimary focus-visible:ring-clubPrimary" 
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        onClick={fetchPlayerInfo} 
                        disabled={isFetching} 
                        className="bg-clubPrimary hover:bg-clubPrimary/90 text-white min-w-[120px]"
                      >
                        {isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                        Rechercher
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

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
                <FormField control={form.control} name="points" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points mensuels</FormLabel>
                    <FormControl><Input placeholder="Ex: 1245" {...field} className="bg-input border-clubPrimary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="club" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club</FormLabel>
                    <FormControl><Input {...field} className="bg-input border-clubPrimary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (pour confirmation)</FormLabel>
                  <FormControl><Input type="email" placeholder="votre@email.com" {...field} className="bg-input border-clubPrimary" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="selected_tableaux" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-clubDark">Choix des Tableaux (Max 3 individuels)</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {tableauxOptions.map((item) => (
                      <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 p-2 rounded-md hover:bg-clubSection/50 transition-colors">
                        <FormControl>
                          <Checkbox
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
                        <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
                      </FormItem>
                    ))}
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

              <Button type="submit" className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-white py-8 text-xl font-bold shadow-lg">
                Valider mon inscription
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentRegistration;