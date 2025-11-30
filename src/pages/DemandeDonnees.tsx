import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom complet est requis." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  requestType: z.enum(["access", "rectification", "erasure", "portability", "opposition", "other"], {
    errorMap: () => ({ message: "Veuillez sélectionner un type de demande." }),
  }),
  details: z.string().min(10, { message: "Veuillez fournir plus de détails sur votre demande." }),
});

const DemandeDonnees = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      requestType: "access",
      details: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Ici, vous enverriez les données à votre backend ou par email.
    // Pour cet exemple, nous allons juste simuler un envoi.
    console.log("Demande de données soumise:", values);
    toast.success("Votre demande a été envoyée. Nous vous contacterons bientôt.");
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Demande de Données Personnelles (RGPD)</h1>

      <Card className="max-w-3xl mx-auto bg-clubLight shadow-lg rounded-xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-clubPrimary mb-2">Exercez vos droits RGPD</CardTitle>
          <CardDescription className="text-clubLight-foreground/80">
            Utilisez ce formulaire pour demander l'accès, la rectification, la suppression ou la portabilité de vos données personnelles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom Complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom et prénom" {...field} className="bg-input text-clubLight-foreground" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Votre email" {...field} className="bg-input text-clubLight-foreground" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de Demande</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-input text-clubLight-foreground"
                      >
                        <option value="access">Droit d'accès (obtenir une copie de mes données)</option>
                        <option value="rectification">Droit de rectification (corriger mes données)</option>
                        <option value="erasure">Droit à l'effacement (supprimer mes données)</option>
                        <option value="portability">Droit à la portabilité (récupérer mes données)</option>
                        <option value="opposition">Droit d'opposition (s'opposer à un traitement)</option>
                        <option value="other">Autre demande</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Détails de votre demande</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez votre demande en détail..." rows={5} {...field} className="bg-input text-clubLight-foreground" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground py-3 text-lg rounded-md shadow-lg">
                Envoyer la Demande
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemandeDonnees;