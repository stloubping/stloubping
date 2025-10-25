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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const tableauxOptions = [
  { id: "tableau1", label: "Tableau 1 : 500-799" },
  { id: "tableau2", label: "Tableau 2 : 500-1399" },
  { id: "tableau3", label: "Tableau 3 : 500-999" },
  { id: "tableau4", label: "Tableau 4 : 500-1599" },
  { id: "tableau5", label: "Tableau 5 : 500-1199" },
  { id: "tableau6", label: "Tableau 6 : 500-NON NUM FR" },
  { id: "tableau7", label: "Tableau 7 : Doubles <2800 PTS" },
];

const formSchema = z.object({
  first_name: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  last_name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, { message: "Veuillez entrer un numéro de téléphone français valide." }),
  licence_number: z.string().min(7, { message: "Le numéro de licence doit contenir au moins 7 caractères." }),
  club: z.string().min(2, { message: "Le nom du club doit contenir au moins 2 caractères." }),
  selected_tableaux: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins un tableau." }),
  doubles_partner: z.string().optional(),
  consent: z.boolean().refine(val => val === true, { message: "Vous devez accepter les conditions pour vous inscrire." }),
});

const TournamentRegistration = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      licence_number: "",
      club: "",
      selected_tableaux: [],
      doubles_partner: "",
      consent: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase
        .from("tournament_registrations")
        .insert([values]);

      if (error) {
        throw error;
      }

      toast.success("Inscription enregistrée avec succès !");
      form.reset();
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error.message);
      toast.error("Erreur lors de l'inscription: " + error.message);
    }
  };

  const selectedTableaux = form.watch("selected_tableaux");
  const showDoublesPartner = selectedTableaux.includes("tableau7");

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto bg-clubLight text-clubDark-foreground shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-clubPrimary">Inscription au Tournoi</CardTitle>
          <CardDescription className="text-clubDark-foreground/80 mt-2">
            Remplissez le formulaire ci-dessous pour vous inscrire à notre tournoi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src="/images/actualites/Gemini_Generated_Image_mlgzatmlgzatmlgz.png"
            alt="Affiche du Tournoi Régional Saint-Loub'Ping 2026"
            className="w-full h-auto object-cover rounded-lg mb-8 shadow-md"
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} className="bg-clubDark text-clubDark-foreground border-clubPrimary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} className="bg-clubDark text-clubDark-foreground border-clubPrimary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Votre email" {...field} className="bg-clubDark text-clubDark-foreground border-clubPrimary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Votre numéro de téléphone" {...field} className="bg-clubDark text-clubDark-foreground border-clubPrimary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licence_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de licence FFTT</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre numéro de licence" {...field} className="bg-clubDark text-clubDark-foreground border-clubPrimary" />
                    </FormControl>
                    <FormDescription className="text-clubDark-foreground/70">
                      Ex: 1234567A (7 caractères minimum)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="club"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre club" {...field} className="bg-clubDark text-clubDark-foreground border-clubPrimary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="selected_tableaux"
                render={() => (
                  <FormItem>
                    <FormLabel>Tableaux sélectionnés</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tableauxOptions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="selected_tableaux"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                    className="border-clubPrimary data-[state=checked]:bg-clubPrimary data-[state=checked]:text-clubDark-foreground"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-clubDark-foreground">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showDoublesPartner && (
                <FormField
                  control={form.control}
                  name="doubles_partner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom et Prénom du partenaire de double</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom et Prénom du partenaire" {...field} className="bg-clubDark text-clubDark-foreground border-clubPrimary" />
                      </FormControl>
                      <FormDescription className="text-clubDark-foreground/70">
                        Uniquement si vous participez au tableau de doubles.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-clubPrimary data-[state=checked]:bg-clubPrimary data-[state=checked]:text-clubDark-foreground"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-clubDark-foreground">
                        J'accepte les conditions de participation et le règlement du tournoi.
                      </FormLabel>
                      <FormDescription className="text-clubDark-foreground/70">
                        (Les conditions sont affichées sur l'affiche ci-dessus)
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-clubDark-foreground">
                S'inscrire
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentRegistration;