import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Contact</h1>

      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Nos Coordonnées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-clubLight-foreground">
            <div className="flex items-center">
              <MapPin className="mr-3 h-5 w-5 text-clubPrimary" />
              <div>
                <p className="font-semibold">Adresse du Club :</p>
                <p>123 Rue du Service</p>
                <p>69000 Ville, France</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="mr-3 h-5 w-5 text-clubPrimary" />
              <div>
                <p className="font-semibold">Téléphone :</p>
                <p><span className="font-semibold">07 62 27 56 96</span></p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="mr-3 h-5 w-5 text-clubPrimary" />
              <div>
                <p className="font-semibold">Email :</p>
                <p><span className="font-semibold">saintloubping@laposte.net</span></p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              N'hésitez pas à nous contacter pour toute question ou information.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Où Nous Trouver ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916253000003!2d2.29229261567499!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddb8076a4ce876b!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1678912345678!5m2!1sfr!2sfr"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation du club"
                className="rounded-lg"
              ></iframe>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Notre salle est facilement accessible en transports en commun et dispose d'un parking.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
          <CardTitle className="text-2xl text-clubDark mb-6 text-center">Formulaire de Contact</CardTitle>
          <CardContent>
            <form className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-clubLight-foreground">Nom Complet</Label>
                <Input id="name" type="text" placeholder="Votre nom" className="mt-1 bg-input text-clubLight-foreground" />
              </div>
              <div>
                <Label htmlFor="email" className="text-clubLight-foreground">Adresse Email</Label>
                <Input id="email" type="email" placeholder="Votre email" className="mt-1 bg-input text-clubLight-foreground" />
              </div>
              <div>
                <Label htmlFor="subject" className="text-clubLight-foreground">Sujet</Label>
                <Input id="subject" type="text" placeholder="Sujet de votre message" className="mt-1 bg-input text-clubLight-foreground" />
              </div>
              <div>
                <Label htmlFor="message" className="text-clubLight-foreground">Votre Message</Label>
                <Textarea id="message" placeholder="Écrivez votre message ici..." rows={5} className="mt-1 bg-input text-clubLight-foreground" />
              </div>
              <Button type="submit" className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground py-3 text-lg rounded-md shadow-lg">
                Envoyer le Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Contact;