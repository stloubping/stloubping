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
import { useLightbox } from '@/context/LightboxContext';
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

const MAX_INDIVIDUAL_TABLEAUX = 3;
const MAX_REGISTRATIONS_PER_TABLEAU = 48;

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
  const { openLightbox } = useLightbox();
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
    if (!licenceNumber || licenceNumber.length < 5) {
      toast.error("Numéro de licence trop court.");
      return;
    }

    setIsFetching(true);
    try {
      // Utilisation de l'URL complète comme requis
      const response = await fetch('https://svwsqioytvvpqbxpekwm.supabase.co/functions/v1/get-player-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licence: licenceNumber })
      });

      if (!response.ok) throw new Error('Erreur lors de la récupération');

      const data = await response.json();
      if (data.points) {
        form.setValue("points", data.points.toString());
        if (data.club) form.setValue("club", data.club);
        toast.success(`Points récupérés : ${data.points}`);
      } else {
        toast.warning("Joueur trouvé mais points non disponibles.");
      }
    } catch (err) {
      toast.error("Impossible de récupérer les points. Saisie manuelle nécessaire.");
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from("tournament_registrations").insert([values]);
    if (error) {
      toast.error("Erreur lors de l'inscription. Vérifiez que tous les champs sont remplis.");
    } else {
      toast.success("Inscription réussie !");
      navigate('/tournoi/inscrits-live');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto bg-clubLight shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-clubPrimary">Inscription au Tournoi</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="licence_number" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de licence</FormLabel>
                    <div className="flex gap-2">
                      <FormControl><Input placeholder="Licence" {...field} className="bg-input border-clubPrimary" /></FormControl>
                      <Button type="button" variant="outline" onClick={fetchPlayerInfo} disabled={isFetching}>
                        {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="points" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl><Input placeholder="Ex: 1245" {...field} className="bg-input border-clubPrimary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="first_name" render={({ field }) => (
                  <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} className="bg-input border-clubPrimary" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="last_name" render={({ field }) => (
                  <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} className="bg-input border-clubPrimary" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="club" render={({ field }) => (
                <FormItem><FormLabel>Club</FormLabel><FormControl><Input {...field} className="bg-input border-clubPrimary" /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} className="bg-input border-clubPrimary" /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="selected_tableaux" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tableaux</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tableauxOptions.map((item) => (
                      <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => checked ? field.onChange([...field.value, item.id]) : field.onChange(field.value?.filter((v) => v !== item.id))}
                            className="border-clubPrimary"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item.label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="consent" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-clubPrimary" /></FormControl>
                  <FormLabel>J'accepte les conditions de participation.</FormLabel>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="p-4 bg-clubSection rounded-md text-center font-bold">Total : {totalPrice}€</div>
              <Button type="submit" className="w-full bg-clubPrimary text-white">S'inscrire</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentRegistration;