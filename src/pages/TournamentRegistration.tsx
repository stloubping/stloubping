"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, DollarSign, Users, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Tableau {
  id: string;
  day: 'saturday'; // Only Saturday for 2026 edition
  time: string;
  label: string;
  maxPoints?: string;
  remainingSpots: number;
  isDoubles?: boolean; // To identify doubles tables for pricing
}

const tournamentInfo = {
  name: "Tournoi Régional Saint-Loub'Ping",
  dates: "Samedi 11 Avril 2026",
  location: "Complexe Sportif, Impasse Max Linder, 33450 Saint-Loubès, France",
  tariffs: "1 tableau : 8€, 2 tableaux : 15€, 3 tableaux : 20€, Doubles : 3€/joueur.",
  rankingLimit: "Doubles <2800 pts.",
  commentPartners: "Veuillez indiquer vos partenaires pour le tableau Doubles dans le champ 'commentaire'.",
  regulationsLink: "#", // Placeholder for actual regulations link
};

const saturdayTables: Tableau[] = [
  { id: "sat-1", day: "saturday", time: "8h30", label: "500-799 pts", maxPoints: "500-799 pts", remainingSpots: 30 },
  { id: "sat-2", day: "saturday", time: "9h30", label: "500-1399 pts", maxPoints: "500-1399 pts", remainingSpots: 30 },
  { id: "sat-3", day: "saturday", time: "10h30", label: "500-999 pts", maxPoints: "500-999 pts", remainingSpots: 30 },
  { id: "sat-4", day: "saturday", time: "11h30", label: "500-1599 pts", maxPoints: "500-1599 pts", remainingSpots: 30 },
  { id: "sat-5", day: "saturday", time: "13h30", label: "500-1199 pts", maxPoints: "500-1199 pts", remainingSpots: 30 },
  { id: "sat-6", day: "saturday", time: "14h30", label: "500-Non Num FR", maxPoints: "500-Non Num FR", remainingSpots: 30 },
  { id: "sat-7", day: "saturday", time: "16h00", label: "Doubles <2800 pts", maxPoints: "<2800 pts", remainingSpots: 30, isDoubles: true },
];

const allTables = [...saturdayTables]; // Only Saturday tables

const TournamentRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    licenseNumber: '',
    monthlyPoints: '',
    club: '',
    category: '',
    email: '',
    phone: '',
    comment: '',
  });
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [agreedToRegulations, setAgreedToRegulations] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const calculatePrice = () => {
      let price = 0;
      const selectedNonDoublesTables = selectedTableIds.filter(id => {
        const table = allTables.find(t => t.id === id);
        return table && !table.isDoubles;
      });
      const selectedDoublesTables = selectedTableIds.filter(id => {
        const table = allTables.find(t => t.id === id);
        return table && table.isDoubles;
      });

      // Price for non-doubles tables
      if (selectedNonDoublesTables.length === 1) {
        price += 8;
      } else if (selectedNonDoublesTables.length === 2) {
        price += 15;
      } else if (selectedNonDoublesTables.length >= 3) {
        price += 20;
      }

      // Price for doubles tables (3€ per player per doubles tableau)
      price += selectedDoublesTables.length * 3;

      setTotalPrice(price);
    };

    calculatePrice();
  }, [selectedTableIds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleTableChange = (tableId: string, checked: boolean) => {
    setSelectedTableIds((prev) => {
      if (checked) {
        return [...prev, tableId];
      } else {
        return prev.filter((id) => id !== tableId);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Basic validation
    const requiredFields = ['firstName', 'lastName', 'gender', 'dob', 'licenseNumber', 'monthlyPoints', 'club', 'email', 'phone'];
    const isValid = requiredFields.every(field => formData[field as keyof typeof formData]);

    if (!isValid) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (selectedTableIds.length === 0) {
      alert("Veuillez sélectionner au moins un tableau.");
      return;
    }

    if (!agreedToRegulations) {
      alert("Vous devez accepter le règlement du tournoi.");
      return;
    }

    console.log("Formulaire soumis:", {
      formData,
      selectedTableIds,
      totalPrice,
    });
    alert("Votre inscription a été enregistrée ! Vous recevrez une confirmation par mail.");
    // In a real application, you would send this data to a backend.
  };

  const renderTableCheckbox = (table: Tableau) => (
    <div key={table.id} className="flex items-center space-x-2 py-2">
      <Checkbox
        id={table.id}
        checked={selectedTableIds.includes(table.id)}
        onCheckedChange={(checked) => handleTableChange(table.id, checked as boolean)}
        className="border-clubPrimary data-[state=checked]:bg-clubPrimary data-[state=checked]:text-clubPrimary-foreground"
      />
      <Label htmlFor={table.id} className="text-clubLight-foreground cursor-pointer flex-grow">
        <span className="font-semibold">{table.time}</span> - {table.label} {table.maxPoints && `(${table.maxPoints})`}
        <span className="ml-2 text-sm text-muted-foreground">({table.remainingSpots} places restantes)</span>
      </Label>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      {/* Header Section */}
      <section className="text-center mb-12">
        <img src="/images/tournaments/affiche-2026.png" alt="Affiche Tournoi Régional Saint-Loub'Ping 2026" className="h-48 mx-auto mb-4 object-contain" />
        <h1 className="text-5xl font-extrabold text-clubDark mb-2">Inscription {tournamentInfo.name}</h1>
        <p className="text-xl text-clubPrimary mb-6">{tournamentInfo.dates}</p>
        <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-10 py-6 text-xl rounded-full shadow-lg animate-bounce-slow">
          <a href="#registration-form">S'inscrire Maintenant</a>
        </Button>
      </section>

      {/* Key Information Section */}
      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-clubDark text-center">Informations Clés du Tournoi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-clubLight-foreground">
            <div className="flex items-start p-3 bg-clubSection rounded-lg shadow-sm">
              <Calendar className="h-6 w-6 text-clubPrimary mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-clubDark">Dates</h3>
                <p>{tournamentInfo.dates}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-clubSection rounded-lg shadow-sm">
              <MapPin className="h-6 w-6 text-clubPrimary mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-clubDark">Lieu</h3>
                <p>{tournamentInfo.location}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-clubSection rounded-lg shadow-sm">
              <DollarSign className="h-6 w-6 text-clubPrimary mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-clubDark">Tarifs</h3>
                <p>{tournamentInfo.tariffs}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-clubSection rounded-lg shadow-sm">
              <Users className="h-6 w-6 text-clubPrimary mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-clubDark">Limite de classement</h3>
                <p>{tournamentInfo.rankingLimit}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-clubSection rounded-lg shadow-sm">
              <Info className="h-6 w-6 text-clubPrimary mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-clubDark">Commentaire / Partenaires</h3>
                <p>{tournamentInfo.commentPartners}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-clubSection rounded-lg shadow-sm">
              <AlertCircle className="h-6 w-6 text-clubPrimary mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-clubDark">Règlement</h3>
                <p>Consultez le <a href={tournamentInfo.regulationsLink} target="_blank" rel="noopener noreferrer" className="text-clubPrimary hover:underline">règlement du tournoi</a>.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Registration Form */}
      <section id="registration-form" className="mb-12">
        <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
          <CardTitle className="text-3xl text-clubDark mb-8 text-center">Formulaire d'Inscription</CardTitle>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* A. Informations Personnelles */}
            <div>
              <h2 className="text-2xl font-semibold text-clubDark mb-4">1. Informations Personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-clubLight-foreground">Prénom*</Label>
                  <Input id="firstName" type="text" placeholder="Ex : Eloïse" value={formData.firstName} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.firstName && "border-destructive")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-clubLight-foreground">Nom*</Label>
                  <Input id="lastName" type="text" placeholder="Ex : Goix" value={formData.lastName} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.lastName && "border-destructive")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-clubLight-foreground">Sexe*</Label>
                  <RadioGroup value={formData.gender} onValueChange={handleRadioChange} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="gender-f" className="text-clubPrimary border-clubPrimary" />
                      <Label htmlFor="gender-f" className="text-clubLight-foreground">F</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="gender-m" className="text-clubPrimary border-clubPrimary" />
                      <Label htmlFor="gender-m" className="text-clubLight-foreground">M</Label>
                    </div>
                  </RadioGroup>
                  {formSubmitted && !formData.gender && <p className="text-destructive text-sm">Ce champ est obligatoire.</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-clubLight-foreground">Date de Naissance*</Label>
                  <Input id="dob" type="date" value={formData.dob} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.dob && "border-destructive")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber" className="text-clubLight-foreground">N° de Licence*</Label>
                  <Input id="licenseNumber" type="text" placeholder="Ex : 9458870" value={formData.licenseNumber} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.licenseNumber && "border-destructive")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyPoints" className="text-clubLight-foreground">Points Mensuels (mai)*</Label>
                  <Input id="monthlyPoints" type="number" step="0.01" placeholder="Ex : 1082.38" value={formData.monthlyPoints} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.monthlyPoints && "border-destructive")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="club" className="text-clubLight-foreground">Club*</Label>
                  <Input id="club" type="text" placeholder="Ex : Saint Loub Ping" value={formData.club} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.club && "border-destructive")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-clubLight-foreground">Catégorie</Label>
                  <Input id="category" type="text" placeholder="Ex : JZ" value={formData.category} onChange={handleInputChange} className="bg-input text-clubLight-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-clubLight-foreground">Email*</Label>
                  <Input id="email" type="email" placeholder="Votre email" value={formData.email} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.email && "border-destructive")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-clubLight-foreground">Téléphone*</Label>
                  <Input id="phone" type="tel" placeholder="Votre numéro de téléphone" value={formData.phone} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.phone && "border-destructive")} />
                  <p className="text-sm text-muted-foreground flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Des notifications SMS seront envoyées sur ce numéro pendant la compétition.
                  </p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="comment" className="text-clubLight-foreground">Commentaire (Partenaires Doubles)</Label>
                  <Textarea id="comment" placeholder="Indiquez ici vos partenaires pour le tableau Doubles ou toute autre remarque." rows={3} value={formData.comment} onChange={handleInputChange} className="mt-1 bg-input text-clubLight-foreground" />
                </div>
              </div>
            </div>

            {/* B. Choix des Tableaux */}
            <div>
              <h2 className="text-2xl font-semibold text-clubDark mb-4">2. Choix des Tableaux</h2>
              {formSubmitted && selectedTableIds.length === 0 && <p className="text-destructive text-sm mb-4">Veuillez sélectionner au moins un tableau.</p>}
              <Tabs defaultValue="saturday" className="w-full">
                <TabsList className="grid w-full grid-cols-1 bg-clubSection text-clubLight-foreground"> {/* Only one tab for Saturday */}
                  <TabsTrigger value="saturday" className="data-[state=active]:bg-clubPrimary data-[state=active]:text-clubPrimary-foreground">Jeu du Samedi</TabsTrigger>
                </TabsList>
                <TabsContent value="saturday" className="mt-4 p-4 border rounded-lg bg-clubSection shadow-sm">
                  <p className="text-sm text-muted-foreground mb-4">Max 3 tableaux individuels + 1 tableau Doubles</p>
                  {saturdayTables.map(renderTableCheckbox)}
                </TabsContent>
              </Tabs>
            </div>

            {/* C. Récapitulatif et Paiement */}
            <div>
              <h2 className="text-2xl font-semibold text-clubDark mb-4">3. Récapitulatif et Paiement</h2>
              <Card className="bg-clubSection p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-clubDark mb-4">Votre Sélection :</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-clubLight-foreground">
                  {selectedTableIds.length > 0 ? (
                    selectedTableIds.map((id) => {
                      const table = allTables.find((t) => t.id === id);
                      return <li key={id}>{table?.label} ({table?.day === 'saturday' ? 'Samedi' : 'Dimanche'})</li>;
                    })
                  ) : (
                    <li>Aucun tableau sélectionné</li>
                  )}
                </ul>
                <p className="text-2xl font-bold text-clubPrimary mb-6">Frais d'inscription : {totalPrice}€</p>

                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox
                    id="regulations-agree"
                    checked={agreedToRegulations}
                    onCheckedChange={(checked) => setAgreedToRegulations(checked as boolean)}
                    className="border-clubPrimary data-[state=checked]:bg-clubPrimary data-[state=checked]:text-clubPrimary-foreground"
                  />
                  <Label htmlFor="regulations-agree" className={cn("text-clubLight-foreground cursor-pointer", formSubmitted && !agreedToRegulations && "text-destructive")}>
                    En validant ce formulaire, vous déclarez avoir pris connaissance et accepté le <a href={tournamentInfo.regulationsLink} target="_blank" rel="noopener noreferrer" className="text-clubPrimary hover:underline">règlement du tournoi</a>.
                  </Label>
                </div>
                {formSubmitted && !agreedToRegulations && <p className="text-destructive text-sm mb-4">Vous devez accepter le règlement du tournoi.</p>}


                <p className="text-sm text-muted-foreground mb-6 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Vous recevrez une confirmation par mail, pensez à vérifier dans vos courriers indésirables !
                </p>

                <Button type="submit" className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground py-3 text-lg rounded-md shadow-lg">
                  Valider et payer {totalPrice}€ sur place
                </Button>
              </Card>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
};

export default TournamentRegistration;