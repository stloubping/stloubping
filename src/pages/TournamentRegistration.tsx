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

interface TableauCount {
  tableau_id: string;
  current_registrations: number;
}

const formSchema = z.object({
  first_name: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  last_name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  phone: z.string().optional(),
  licence_number: z.string()
    .min(1, { message: "Le numéro de licence est requis." })
    .regex(/^\d+$/, { message: "Le numéro de licence doit contenir uniquement des chiffres." }),
  points: z.string().min(1, { message: "Veuillez indiquer vos points (classement)." }),
  club: z.string().min(2, { message: "Le nom du club doit contenir au moins 2 caractères." }),
  selected_tableaux: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins un tableau." })
    .refine((tableaux) => {
      const individualTableaux = tableaux.filter(id => id !== "d1");
      return individualTableaux.length <= MAX_INDIVIDUAL_TABLEAUX;
    }, {
      message: `Vous ne pouvez pas sélectionner plus de ${MAX_INDIVIDUAL_TABLEAUX} tableaux individuels.`,
      path: ["selected_tableaux"],
    }),
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
      points: "",
      club: "",
      selected_tableaux: [],
      doubles_partner: "",
      consent: false,
    },
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [tableauCounts, setTableauCounts] = useState<Map<string, number>>(new Map());
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [isFetchingPoints, setIsFetchingPoints] = useState(false);
  const selectedTableaux = form.watch("selected_tableaux");
  const licenceNumber = form.watch("licence_number");
  const { openLightbox } = useLightbox();
  const navigate = useNavigate();

  const fetchTableauCounts = async () => {
    setLoadingCounts(true);
    const { data, error } = await supabase
      .from('tableau_counts')
      .select('*');

    if (error) {
      console.error("Error fetching tableau counts:", error);
    } else {
      const countsMap = new Map<string, number>();
      data.forEach((item: TableauCount) => {
        countsMap.set(item.tableau_id, item.current_registrations);
      });
      setTableauCounts(countsMap);
    }
    setLoadingCounts(false);
  };

  useEffect(() => {
    fetchTableauCounts();
  }, []);

  useEffect(() => {
    let currentTotal = 0;
    const individualTableaux = selectedTableaux.filter(id => id !== "d1");
    const numIndividualTableaux = individualTableaux.length;

    if (numIndividualTableaux === 1) {
      currentTotal += 9;
    } else if (numIndividualTableaux === 2) {
      currentTotal += 15;
    } else if (numIndividualTableaux >= 3) {
      currentTotal += 20;
    }

    if (selectedTableaux.includes("d1")) {
      const doublesOption = tableauxOptions.find(opt => opt.id === "d1");
      if (doublesOption) {
        currentTotal += doublesOption.price || 0;
      }
    }

    setTotalPrice(currentTotal);
  }, [selectedTableaux]);

  const fetchPlayerInfo = async () => {
    if (!licenceNumber || licenceNumber.length < 5) {
      toast.error("Veuillez entrer un numéro de licence valide.");
      return;
    }

    setIsFetchingPoints(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-player-points', {
        body: { licence: licenceNumber }
      });

      if (error) throw error;

      if (data.points) {
        form.setValue("points", data.points.toString());
        if (data.club) form.setValue("club", data.club);
        toast.success(`Données récupérées pour ${data.name}`);
      } else {
        toast.warning("Licence trouvée mais points non disponibles.");
      }
    } catch (err: any) {
      console.error("Erreur récupération points:", err);
      toast.error("Impossible de récupérer les points automatiquement.");
    } finally {
      setIsFetchingPoints(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from("tournament_registrations")
        .insert([values]);

      if (error) throw error;

      toast.success("Inscription enregistrée avec succès !");
      form.reset();
      navigate('/tournoi/inscrits-live');
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error.message);
      toast.error("Erreur lors de l'inscription. Veuillez vérifier vos informations.");
    }
  };

  const showDoublesPartner = selectedTableaux.includes("d1");
  const currentIndividualTableaux = selectedTableaux.filter(id => id !== "d1");
  const canSelectMoreIndividual = currentIndividualTableaux.length < MAX_INDIVIDUAL_TABLEAUX;

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
            src="/images/actualites/tournoi-regional-2026-affiche.png"
            alt="Affiche du Tournoi"
            className="w-full h-auto object-cover rounded-lg mb-8 shadow-md cursor-zoom-in"
            onClick={() => openLightbox("/images/actualites/tournoi-regional-2026-affiche.png")}
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
                        <Input placeholder="Votre prénom" {...field} className="bg-input text-clubLight-foreground border-clubPrimary" />
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
                        <Input placeholder="Votre nom" {...field} className="bg-input text-clubLight-foreground border-clubPrimary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Votre email" {...field} className="bg-input text-clubLight-foreground border-clubPrimary" />
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
                      <FormLabel>Téléphone (facultatif)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Votre numéro" {...field} className="bg-input text-clubLight-foreground border-clubPrimary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="licence_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de licence FFTT</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Votre numéro de licence" {...field} className="bg-input text-clubLight-foreground border-clubPrimary" />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white"
                          onClick={fetchPlayerInfo}
                          disabled={isFetchingPoints}
                        >
                          {isFetchingPoints ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points (Classement)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1245" {...field} className="bg-input text-clubLight-foreground border-clubPrimary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="club"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre club" {...field} className="bg-input text-clubLight-foreground border-clubPrimary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="selected_tableaux"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tableaux sélectionnés</FormLabel>
                    {loadingCounts ? (
                      <div className="flex items-center text-clubDark">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chargement des places...
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {tableauxOptions.map((item) => {
                          const currentRegistrations = tableauCounts.get(item.id) || 0;
                          const placesLeft = MAX_REGISTRATIONS_PER_TABLEAU - currentRegistrations;
                          const isFull = placesLeft <= 0;
                          const isIndividualTableau = item.id !== "d1";
                          const isAlreadySelected = field.value?.includes(item.id);
                          const isDisabled = isFull || (isIndividualTableau && !canSelectMoreIndividual && !isAlreadySelected);

                          return (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={isAlreadySelected}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(field.value?.filter((value) => value !== item.id));
                                  }}
                                  disabled={isDisabled}
                                  className="border-clubPrimary data-[state=checked]:bg-clubPrimary data-[state=checked]:text-clubDark-foreground"
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-clubLight-foreground">
                                {item.label}
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({isFull ? "Complet" : `${placesLeft} places`})
                                </span>
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                      </div>
                    )}
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
                        <Input placeholder="Nom et Prénom du partenaire" {...field} className="bg-input text-clubLight-foreground border-clubPrimary" />
                      </FormControl>
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
                        J'accepte les conditions de participation.
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-8 p-4 bg-clubSection rounded-md text-center">
                <p className="text-lg font-semibold text-clubDark">
                  Coût total : <span className="text-clubPrimary">{totalPrice}€</span>
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