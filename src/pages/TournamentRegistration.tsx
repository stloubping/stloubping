import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Mail, Info } from 'lucide-react';

const TournamentRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    licenceNumber: '',
    club: '',
    category: '',
    doublesPartner: '',
    consent: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, consent: checked }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, licenceNumber, club, category, consent } = formData;
    return firstName && lastName && email && licenceNumber && club && category && consent;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validateForm()) {
      // Here you would typically send the data to a backend service
      console.log("Form Data Submitted:", formData);
      toast.success("Inscription envoyée avec succès !");
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        licenceNumber: '',
        club: '',
        category: '',
        doublesPartner: '',
        consent: false,
      });
      setFormSubmitted(false);
    } else {
      toast.error("Veuillez remplir tous les champs obligatoires et accepter les conditions.");
    }
  };

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

            <div className="space-y-2">
              <Label htmlFor="category" className="text-clubLight-foreground">Catégorie de tableau souhaitée*</Label>
              <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
                <SelectTrigger className={cn("w-full bg-input text-clubLight-foreground", formSubmitted && !formData.category && "border-destructive")}>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-clubLight text-clubLight-foreground">
                  <SelectItem value="senior-a">Senior A (Classement > 1500)</SelectItem>
                  <SelectItem value="senior-b">Senior B (Classement 1000-1500)</SelectItem>
                  <SelectItem value="senior-c">Senior C (Classement &lt; 1000)</SelectItem>
                  <SelectItem value="junior">Junior (-18 ans)</SelectItem>
                  <SelectItem value="veteran">Vétéran (+40 ans)</SelectItem>
                </SelectContent>
              </Select>
              {formSubmitted && !formData.category && <p className="text-destructive text-sm mt-1">Veuillez sélectionner une catégorie.</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="doublesPartner" className="text-clubLight-foreground">Partenaire de double (si applicable)</Label>
              <Input id="doublesPartner" placeholder="Nom et prénom du partenaire" value={formData.doublesPartner} onChange={handleInputChange} className="bg-input text-clubLight-foreground" />
              <p className="text-sm text-muted-foreground flex items-center">
                <Info className="h-4 w-4 mr-1" /> Laissez vide si vous ne participez pas au double ou n'avez pas de partenaire.
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

            <Button type="submit" className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-white text-lg py-6">
              S'inscrire au Tournoi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentRegistration;