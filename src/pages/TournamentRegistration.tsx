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
import { useLightbox } from '@/context/LightboxContext'; // Import useLightbox

const tableauxOptions = [
  { id: "t1", label: "Tableau 1 : 8h30 (500-799)" },
  { id: "t2", label: "Tableau 2 : 9h30 (500-1399)" },
  { id: "t3", label: "Tableau 3 : 10h30 (500-999)" },
  { id: "t4", label: "Tableau 4 : 11h30 (500-1599)" },
  { id: "t5", label: "Tableau 5 : 13h30 (500-1199)" },
  { id: "t6", label: "Tableau 6 : 14h30 (500-Non Num FR)" },
  { id: "d1", label: "Tableau 7 : 16h00 (Doubles <2800)", price: 3 }, // Prix spécifique pour les doubles
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

  const [totalPrice, setTotalPrice] = useState(0);
  const selectedTableaux = form.watch("selected_tableaux");
  const { openLightbox } = useLightbox(); // Use the lightbox hook

  useEffect(() => {
    let currentTotal = 0;
    const individualTableaux = selectedTableaux.filter(id => id !== "d1");
    const numIndividualTableaux = individualTableaux.length;

    // Logique de prix dégressifs pour les tableaux individuels
    if (numIndividualTableaux === 1) {
      currentTotal += 8;
    } else if (numIndividualTableaux === 2) {
      currentTotal += 15;
    } else if (numIndividualTableaux >= 3) {
      currentTotal += 20; // 20€ pour 3 tableaux ou plus
    }

    // Ajout du prix pour le tableau de doubles si sélectionné
    if (selectedTableaux.includes("d1")) {
      const doublesOption = tableauxOptions.find(opt => opt.id === "d1");
      if (doublesOption) {
        currentTotal += doublesOption.price;
      }
    }

    setTotalPrice(currentTotal);
  }, [selectedTableaux]);

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

  const showDoublesPartner = selectedTableaux.includes("d1");

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto bg-clubLight text-clubLight-foreground shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-clubPrimary">Inscription au Tournoi</CardTitle>
          <CardDescription className="text-clubLight-foreground/80 mt-2">
            Remplissez le formulaire ci-dessous pour vous inscrire à notre tournoi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src="/images/actualites/Gemini_Generated_Image_mlgzatmlgzatmlgz.png"
            alt="Affiche du Tournoi Régional Saint-Loub'Ping 2026"
            className="w-full h-auto object-cover rounded-lg mb-8 shadow-md cursor-zoom-in"
            onClick={() => openLightbox("/images/actualites/Gemini_Generated_Image_mlgzatmlgzatmlgz.png")} // Open lightbox on image click
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
                    <FormDescription className="text-clubLight-foreground/70">
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
                                <FormLabel className="font-normal text-clubLight-foreground">
                                  {item.label} {item.id === "d1" && <span className="font-semibold">({item.price}€)</span>}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription className="text-clubLight-foreground/70">
                      Tarifs : 1 tableau = 8€, 2 tableaux = 15€, 3 tableaux et plus = 20€. Doubles = 3€ en supplément.
                    </FormDescription>
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
                      <FormDescription className="text-clubLight-foreground/70">
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
                      <FormLabel className="text-clubLight-foreground">
                        J'accepte les conditions de participation et le règlement du tournoi.
                      </FormLabel>
                      <FormDescription className="text-clubLight-foreground/70">
                        (Les conditions sont affichées sur l'affiche ci-dessus)
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Affichage du prix total */}
              <div className="mt-8 p-4 bg-clubSection rounded-md text-center">
                <p className="text-lg font-semibold text-clubDark">
                  Coût total de votre inscription : <span className="text-clubPrimary">{totalPrice}€</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Le paiement sera effectué sur place le jour du tournoi.
                </p>
              </div>

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