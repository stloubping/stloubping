import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Keep Select for potential future use or if user wants it back
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const individualTableaux = [
  { id: 't1', time: '8h30', points: '500-799 pts', remaining: 30 },
  { id: 't2', time: '9h30', points: '500-1399 pts', remaining: 30 },
  { id: 't3', time: '10h30', points: '500-999 pts', remaining: 30 },
  { id: 't4', time: '11h30', points: '500-1599 pts', remaining: 30 },
  { id: 't5', time: '13h30', points: '500-1199 pts', remaining: 30 },
  { id: 't6', time: '14h30', points: '500-Non Num FR', remaining: 30 },
];

const doublesTableau = { id: 'd1', time: '16h00', points: 'Doubles <2800 pts', remaining: 30 };

const TournamentRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenceNumber: '',
    club: '',
    selectedTableaux: [] as string[], // Array to store selected tableau IDs
    doublesPartner: '',
    consent: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleTableauChange = (tableauId: string, checked: boolean) => {
    setFormData(prev => {
      const newSelectedTableaux = checked
        ? [...prev.selectedTableaux, tableauId]
        : prev.selectedTableaux.filter(id => id !== tableauId);
      return { ...prev, selectedTableaux: newSelectedTableaux };
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, consent: checked }));
  };

  const calculateTotalFee = () => {
    let individualCount = 0;
    let hasDoubles = false;

    formData.selectedTableaux.forEach(id => {
      if (id === doublesTableau.id) {
        hasDoubles = true;
      } else {
        individualCount++;
      }
    });

    let fee = 0;
    if (individualCount === 1) fee = 8;
    else if (individualCount === 2) fee = 15;
    else if (individualCount >= 3) fee = 20;

    if (hasDoubles) {
      fee += 3; // 3€ per player for doubles
    }
    return fee;
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, licenceNumber, club, selectedTableaux, consent } = formData;
    return firstName && lastName && email && phone && licenceNumber && club && selectedTableaux.length > 0 && consent;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validateForm()) {
      console.log("Form Data Submitted:", formData);
      showSuccess("Inscription envoyée avec succès ! Paiement à effectuer sur place.");
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenceNumber: '',
        club: '',
        selectedTableaux: [],
        doublesPartner: '',
        consent: false,
      });
      setFormSubmitted(false);
    } else {
      showError("Veuillez remplir tous les champs obligatoires, sélectionner au moins un tableau et accepter les conditions.");
    }
  };

  const totalFee = calculateTotalFee();

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <Card className="max-w-3xl mx-auto bg-clubLight shadow-lg rounded-xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-clubDark mb-2">Inscription au Tournoi Régional Saint-Loub'Ping 2026</CardTitle>
          <CardDescription className="text-clubLight-foreground">
            Remplissez le formulaire ci-dessous pour vous inscrire à notre tournoi annuel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src="/images/actualites/tournoi-2026-affiche.png"
            alt="Affiche du Tournoi Régional Saint-Loub'Ping 2026"
            className="w-full h-auto object-cover rounded-lg mb-8 shadow-md"
          />

          {/* Informations Clés du Tournoi */}
          <Card className="mb-8 bg-clubSection shadow-md rounded-lg p-6">
            <CardTitle className="text-2xl font-semibold text-clubDark mb-4">Informations Clés du Tournoi</CardTitle>
            <div className="space-y-3 text-clubLight-foreground">
              <p><span className="font-semibold">Dates :</span> Samedi 11 Avril 2026</p>
              <p><span className="font-semibold">Lieu :</span> Complexe Sportif, Impasse Max Linder, 33450 Saint-Loubès, France</p>
              <p><span className="font-semibold">Tarifs :</span> 1 tableau : 8€, 2 tableaux : 15€, 3 tableaux : 20€, Doubles : 3€/joueur.</p>
              <p><span className="font-semibold">Limite de classement :</span> Doubles &lt; 2800 pts.</p>
              <p><span className="font-semibold">Commentaire / Partenaires :</span> Veuillez indiquer vos partenaires pour le tableau Doubles dans le champ 'Partenaire de double'.</p>
              <p>
                <span className="font-semibold">Règlement :</span> Consultez le <Link to="/reglement-tournoi" className="text-clubPrimary hover:underline">règlement du tournoi</Link>.
              </p>
            </div>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-clubLight-foreground">Prénom*</Label>
                <Input id="firstName" placeholder="Votre prénom" value={formData.firstName} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.firstName && "border-destructive")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-clubLight-foreground">Nom*</Label>
                <Input id="lastName" placeholder="Votre nom" value={formData.lastName} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.lastName && "border-destructive")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-clubLight-foreground">Email*</Label>
              <Input id="email" type="email" placeholder="Votre adresse email" value={formData.email} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.email && "border-destructive")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-clubLight-foreground">Téléphone*</Label>
              <Input id="phone" type="tel" placeholder="Votre numéro de téléphone" value={formData.phone} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.phone && "border-destructive")} />
              <p className="text-sm text-muted-foreground flex items-center">
                <Info className="h-4 w-4 mr-1" /> Nous pourrions vous contacter en cas d'urgence ou de modification de dernière minute.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="licenceNumber" className="text-clubLight-foreground">Numéro de licence FFTT*</Label>
                <Input id="licenceNumber" placeholder="Ex: 1234567" value={formData.licenceNumber} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.licenceNumber && "border-destructive")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="club" className="text-clubLight-foreground">Club*</Label>
                <Input id="club" placeholder="Votre club" value={formData.club} onChange={handleInputChange} required className={cn("bg-input text-clubLight-foreground", formSubmitted && !formData.club && "border-destructive")} />
              </div>
            </div>

            {/* 2. Choix des Tableaux */}
            <Card className="bg-clubSection shadow-md rounded-lg p-6">
              <CardTitle className="text-2xl font-semibold text-clubDark mb-4">2. Choix des Tableaux</CardTitle>
              <CardDescription className="text-clubLight-foreground mb-4">
                Max 3 tableaux individuels + 1 tableau Doubles
              </CardDescription>

              <h3 className="text-lg font-semibold text-clubDark mb-3">Jeu du Samedi</h3>
              <div className="space-y-3">
                {individualTableaux.map((tableau) => (
                  <div key={tableau.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={tableau.id}
                      checked={formData.selectedTableaux.includes(tableau.id)}
                      onCheckedChange={(checked) => handleTableauChange(tableau.id, checked as boolean)}
                      disabled={tableau.remaining <= 0}
                    />
                    <Label htmlFor={tableau.id} className="text-clubLight-foreground cursor-pointer">
                      {tableau.time} - {tableau.points} ({tableau.remaining} places restantes)
                    </Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id={doublesTableau.id}
                    checked={formData.selectedTableaux.includes(doublesTableau.id)}
                    onCheckedChange={(checked) => handleTableauChange(doublesTableau.id, checked as boolean)}
                    disabled={doublesTableau.remaining <= 0}
                  />
                  <Label htmlFor={doublesTableau.id} className="text-clubLight-foreground cursor-pointer">
                    {doublesTableau.time} - {doublesTableau.points} ({doublesTableau.remaining} places restantes)
                  </Label>
                </div>
              </div>
              {formSubmitted && formData.selectedTableaux.length === 0 && <p className="text-destructive text-sm mt-4">Veuillez sélectionner au moins un tableau.</p>}
            </Card>

            <div className="space-y-2">
              <Label htmlFor="doublesPartner" className="text-clubLight-foreground">Partenaire de double (si applicable)</Label>
              <Input id="doublesPartner" placeholder="Nom et prénom du partenaire" value={formData.doublesPartner} onChange={handleInputChange} className="bg-input text-clubLight-foreground" />
              <p className="text-sm text-muted-foreground flex items-center">
                <Info className="h-4 w-4 mr-1" /> Veuillez indiquer vos partenaires pour le tableau Doubles dans ce champ. Laissez vide si vous ne participez pas au double ou n'avez pas de partenaire.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={handleCheckboxChange}
                className={cn(formSubmitted && !formData.consent && "border-destructive")}
              />
              <label
                htmlFor="consent"
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  formSubmitted && !formData.consent && "text-destructive"
                )}
              >
                J'accepte les <Link to="/reglement-tournoi" className="text-clubPrimary hover:underline">conditions et le règlement du tournoi</Link>.*
              </label>
            </div>
            {formSubmitted && !formData.consent && <p className="text-destructive text-sm mt-1">Vous devez accepter les conditions.</p>}

            {/* 3. Récapitulatif et Paiement */}
            <Card className="bg-clubSection shadow-md rounded-lg p-6">
              <CardTitle className="text-2xl font-semibold text-clubDark mb-4">3. Récapitulatif et Paiement</CardTitle>
              <div className="space-y-2 text-clubLight-foreground mb-4">
                <p className="font-semibold">Votre Sélection :</p>
                <ul className="list-disc list-inside ml-4">
                  {formData.selectedTableaux.length > 0 ? (
                    formData.selectedTableaux.map(id => {
                      const tableau = individualTableaux.find(t => t.id === id) || (id === doublesTableau.id ? doublesTableau : null);
                      return tableau ? <li key={id}>{tableau.time} - {tableau.points}</li> : null;
                    })
                  ) : (
                    <li>Aucun tableau sélectionné</li>
                  )}
                </ul>
                <p className="text-xl font-bold mt-4">Frais d'inscription : {totalFee}€</p>
              </div>
              <p className="text-sm text-clubLight-foreground mb-4">
                En validant ce formulaire, vous déclarez avoir pris connaissance et accepté le règlement du tournoi.
                Vous recevrez une confirmation par mail, pensez à vérifier dans vos courriers indésirables !
              </p>
              <Button type="submit" className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-white text-lg py-6">
                Valider et payer {totalFee}€ sur place
              </Button>
            </Card>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentRegistration;