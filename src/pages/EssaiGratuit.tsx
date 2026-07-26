import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Shirt,
  Sparkles,
  Trophy,
  UsersRound,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Profile = "enfant" | "adolescent" | "adulte-loisir" | "competiteur";
type RequestState = "idle" | "sending" | "success" | "error";

type TrialForm = {
  profile: Profile | "";
  slotId: string;
  firstName: string;
  age: string;
  level: string;
  phone: string;
  email: string;
  consent: boolean;
};

type PreRegistrationForm = {
  firstName: string;
  age: string;
  profile: Profile | "";
  phone: string;
  email: string;
  licenceType: "loisir" | "competition" | "";
  consent: boolean;
};

const profiles: Array<{
  id: Profile;
  label: string;
  detail: string;
  icon: typeof UsersRound;
}> = [
  {
    id: "enfant",
    label: "Enfant",
    detail: "7 à 10 ans",
    icon: Sparkles,
  },
  {
    id: "adolescent",
    label: "Adolescent",
    detail: "11 à 17 ans",
    icon: UsersRound,
  },
  {
    id: "adulte-loisir",
    label: "Adulte loisir",
    detail: "Pour jouer et progresser",
    icon: UsersRound,
  },
  {
    id: "competiteur",
    label: "Compétiteur",
    detail: "Jeune ou adulte",
    icon: Trophy,
  },
];

const trialSlots: Array<{
  id: string;
  day: string;
  time: string;
  label: string;
  profiles: Profile[];
}> = [
  {
    id: "mercredi-1530",
    day: "Mercredi",
    time: "15h30 – 16h30",
    label: "Loisirs 7–10 ans",
    profiles: ["enfant"],
  },
  {
    id: "samedi-1000",
    day: "Samedi",
    time: "10h00 – 11h30",
    label: "Loisirs 7–10 ans",
    profiles: ["enfant"],
  },
  {
    id: "mercredi-1630",
    day: "Mercredi",
    time: "16h30 – 18h00",
    label: "Loisirs 11–16 ans",
    profiles: ["adolescent"],
  },
  {
    id: "jeudi-1700",
    day: "Jeudi",
    time: "17h00 – 18h00",
    label: "Jeunes perfectionnement",
    profiles: ["adolescent", "competiteur"],
  },
  {
    id: "jeudi-1800",
    day: "Jeudi",
    time: "18h00 – 19h30",
    label: "Loisirs 11–16 ans",
    profiles: ["adolescent"],
  },
  {
    id: "vendredi-1700",
    day: "Vendredi",
    time: "17h00 – 18h00",
    label: "Jeunes perfectionnement",
    profiles: ["adolescent", "competiteur"],
  },
  {
    id: "lundi-1800",
    day: "Lundi",
    time: "18h00 – 20h00",
    label: "Entraînement libre",
    profiles: ["adulte-loisir", "competiteur"],
  },
  {
    id: "mardi-1800",
    day: "Mardi",
    time: "18h00 – 20h00",
    label: "Entraînement libre",
    profiles: ["adulte-loisir", "competiteur"],
  },
  {
    id: "mercredi-1800",
    day: "Mercredi",
    time: "18h00 – 19h30",
    label: "Jeunes compétitions",
    profiles: ["competiteur"],
  },
  {
    id: "mercredi-1930",
    day: "Mercredi",
    time: "19h30 – 21h00",
    label: "Adultes compétitions",
    profiles: ["competiteur"],
  },
  {
    id: "jeudi-1930",
    day: "Jeudi",
    time: "19h30 – 21h00",
    label: "Adultes loisirs",
    profiles: ["adulte-loisir"],
  },
  {
    id: "vendredi-1800",
    day: "Vendredi",
    time: "18h00 – 20h00",
    label: "Jeunes compétitions",
    profiles: ["competiteur"],
  },
];

const planning = [
  { day: "Lundi", time: "18h00 – 20h00", group: "Entraînement libre", tone: "libre" },
  { day: "Mardi", time: "18h00 – 20h00", group: "Entraînement libre", tone: "libre" },
  { day: "Mercredi", time: "15h30 – 16h30", group: "Loisirs 7–10 ans", tone: "jeunes" },
  { day: "Mercredi", time: "16h30 – 18h00", group: "Loisirs 11–16 ans", tone: "jeunes" },
  { day: "Mercredi", time: "18h00 – 19h30", group: "Jeunes compétitions", tone: "jeunes" },
  { day: "Mercredi", time: "19h30 – 21h00", group: "Adultes compétitions", tone: "adultes" },
  { day: "Jeudi", time: "17h00 – 18h00", group: "Jeunes perfectionnement", tone: "jeunes" },
  { day: "Jeudi", time: "18h00 – 19h30", group: "Loisirs 11–16 ans", tone: "jeunes" },
  { day: "Jeudi", time: "19h30 – 21h00", group: "Adultes loisirs", tone: "adultes" },
  { day: "Vendredi", time: "17h00 – 18h00", group: "Jeunes perfectionnement", tone: "jeunes" },
  { day: "Vendredi", time: "18h00 – 20h00", group: "Jeunes compétitions", tone: "jeunes" },
  { day: "Vendredi", time: "20h00 – 00h00", group: "Critérium Gironde", tone: "competition" },
  { day: "Samedi", time: "10h00 – 11h30", group: "Loisirs 7–10 ans", tone: "jeunes" },
  { day: "Samedi", time: "14h00 – 21h00", group: "Championnat par équipe", tone: "competition" },
];

const toneClasses: Record<string, string> = {
  libre: "border-lime-300 bg-lime-50 text-lime-900",
  jeunes: "border-sky-300 bg-sky-50 text-sky-900",
  competition: "border-amber-300 bg-amber-50 text-amber-950",
  adultes: "border-rose-300 bg-rose-50 text-rose-950",
};

const initialTrialForm: TrialForm = {
  profile: "",
  slotId: "",
  firstName: "",
  age: "",
  level: "",
  phone: "",
  email: "",
  consent: false,
};

const initialPreRegistration: PreRegistrationForm = {
  firstName: "",
  age: "",
  profile: "",
  phone: "",
  email: "",
  licenceType: "",
  consent: false,
};

const EssaiGratuit = () => {
  const isBranchPreview =
    typeof window !== "undefined" &&
    window.location.hostname.includes("-git-") &&
    window.location.hostname.endsWith(".vercel.app");
  const [trialForm, setTrialForm] = useState<TrialForm>(initialTrialForm);
  const [trialState, setTrialState] = useState<RequestState>("idle");
  const [trialError, setTrialError] = useState("");
  const [confirmedTrial, setConfirmedTrial] = useState<TrialForm | null>(null);
  const [preRegistrationOpen, setPreRegistrationOpen] = useState(false);
  const [preRegistration, setPreRegistration] =
    useState<PreRegistrationForm>(initialPreRegistration);
  const [preRegistrationState, setPreRegistrationState] =
    useState<RequestState>("idle");
  const [preRegistrationError, setPreRegistrationError] = useState("");

  const availableSlots = useMemo(
    () =>
      trialForm.profile
        ? trialSlots.filter((slot) => slot.profiles.includes(trialForm.profile as Profile))
        : [],
    [trialForm.profile],
  );

  const selectedSlot = trialSlots.find((slot) => slot.id === trialForm.slotId);
  const confirmedSlot = trialSlots.find((slot) => slot.id === confirmedTrial?.slotId);

  const selectProfile = (profile: Profile) => {
    setTrialForm((current) => ({ ...current, profile, slotId: "" }));
    setTrialState("idle");
  };

  const handleTrialSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSlot) return;

    setTrialState("sending");
    setTrialError("");

    if (!isBranchPreview) {
      const { error } = await supabase.from("trial_requests").insert({
        request_type: "trial",
        first_name: trialForm.firstName.trim(),
        age: Number(trialForm.age),
        profile: trialForm.profile,
        level: trialForm.level,
        phone: trialForm.phone.trim(),
        email: trialForm.email.trim().toLowerCase(),
        slot_id: selectedSlot.id,
        slot_label: `${selectedSlot.day} ${selectedSlot.time} — ${selectedSlot.label}`,
        consent: trialForm.consent,
      });

      if (error) {
        console.error("[essai-gratuit]", error);
        setTrialError(
          "La réservation n’a pas pu être enregistrée. Réessayez dans quelques instants ou contactez le club.",
        );
        setTrialState("error");
        return;
      }

      const { error: emailError } = await supabase.functions.invoke("trial-request-email", {
        body: {
          request_type: "trial",
          first_name: trialForm.firstName.trim(),
          age: Number(trialForm.age),
          profile: trialForm.profile,
          level: trialForm.level,
          phone: trialForm.phone.trim(),
          email: trialForm.email.trim().toLowerCase(),
          slot_label: `${selectedSlot.day} ${selectedSlot.time} — ${selectedSlot.label}`,
        },
      });

      if (emailError) {
        console.error("[essai-gratuit-email]", emailError);
      }
    }

    setConfirmedTrial({ ...trialForm });
    setPreRegistration({
      firstName: trialForm.firstName,
      age: trialForm.age,
      profile: trialForm.profile,
      phone: trialForm.phone,
      email: trialForm.email,
      licenceType: trialForm.profile === "competiteur" ? "competition" : "loisir",
      consent: false,
    });
    setTrialState("success");
    window.setTimeout(
      () => document.getElementById("confirmation-essai")?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const openPreRegistration = () => {
    setPreRegistrationOpen(true);
    window.setTimeout(
      () => document.getElementById("preinscription")?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const handlePreRegistrationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPreRegistrationState("sending");
    setPreRegistrationError("");

    if (!isBranchPreview) {
      const { error } = await supabase.from("trial_requests").insert({
        request_type: "pre_registration",
        first_name: preRegistration.firstName.trim(),
        age: Number(preRegistration.age),
        profile: preRegistration.profile,
        level: confirmedTrial?.level || "Non renseigné",
        phone: preRegistration.phone.trim(),
        email: preRegistration.email.trim().toLowerCase(),
        licence_type: preRegistration.licenceType,
        consent: preRegistration.consent,
      });

      if (error) {
        console.error("[preinscription]", error);
        setPreRegistrationError(
          "La préinscription n’a pas pu être envoyée. Réessayez ou contactez directement le club.",
        );
        setPreRegistrationState("error");
        return;
      }

      const { error: emailError } = await supabase.functions.invoke("trial-request-email", {
        body: {
          request_type: "pre_registration",
          first_name: preRegistration.firstName.trim(),
          age: Number(preRegistration.age),
          profile: preRegistration.profile,
          level: confirmedTrial?.level || "Non renseigné",
          phone: preRegistration.phone.trim(),
          email: preRegistration.email.trim().toLowerCase(),
          licence_type: preRegistration.licenceType,
        },
      });

      if (emailError) {
        console.error("[preinscription-email]", emailError);
      }
    }

    setPreRegistrationState("success");
  };

  return (
    <div className="min-h-screen bg-clubLight text-clubLight-foreground">
      <section className="relative overflow-hidden bg-clubDark text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.32),transparent_40%)]" />
        <div className="container relative mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-clubPrimary" />
              Deux séances d’essai offertes
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Votre première balle
              <span className="block text-clubPrimary">commence ici.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              Choisissez votre profil et un créneau. Nous vous accueillons à
              Saint-Loubès, quel que soit votre niveau.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto space-y-16 px-4 py-12 md:py-16">
        <section id="reservation" className="scroll-mt-24">
          <div className="mb-8 text-center">
            <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-clubPrimary">
              Réservation
            </span>
            <h2 className="mt-2 text-3xl font-black text-clubDark md:text-4xl">
              Trouvez la séance qui vous ressemble
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              La sélection du profil affiche uniquement les entraînements adaptés.
            </p>
          </div>

          {isBranchPreview && (
            <div className="mx-auto mb-6 max-w-5xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <strong>Mode aperçu :</strong> vous pouvez tester tout le parcours ; aucune donnée personnelle n’est envoyée depuis ce Preview.
            </div>
          )}

          <form onSubmit={handleTrialSubmit} className="mx-auto max-w-5xl space-y-8">
            <fieldset>
              <legend className="mb-4 text-lg font-bold text-clubDark">1. Votre profil</legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {profiles.map((profile) => {
                  const Icon = profile.icon;
                  const selected = trialForm.profile === profile.id;
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => selectProfile(profile.id)}
                      aria-pressed={selected}
                      className={`rounded-2xl border p-5 text-left transition ${
                        selected
                          ? "border-clubPrimary bg-clubPrimary text-white shadow-lg"
                          : "border-border bg-white hover:border-clubPrimary/60 hover:shadow-md"
                      }`}
                    >
                      <Icon className={`mb-4 h-6 w-6 ${selected ? "text-white" : "text-clubPrimary"}`} />
                      <span className="block font-extrabold">{profile.label}</span>
                      <span className={`mt-1 block text-sm ${selected ? "text-white/80" : "text-muted-foreground"}`}>
                        {profile.detail}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset disabled={!trialForm.profile}>
              <legend className="mb-4 text-lg font-bold text-clubDark">2. Votre créneau</legend>
              {!trialForm.profile ? (
                <div className="rounded-2xl border border-dashed border-border bg-white/60 p-6 text-center text-muted-foreground">
                  Choisissez d’abord un profil pour afficher les créneaux disponibles.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {availableSlots.map((slot) => {
                    const selected = trialForm.slotId === slot.id;
                    return (
                      <label
                        key={slot.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                          selected
                            ? "border-clubPrimary bg-clubPrimary/5 ring-1 ring-clubPrimary"
                            : "border-border bg-white hover:border-clubPrimary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot.id}
                          checked={selected}
                          onChange={() =>
                            setTrialForm((current) => ({ ...current, slotId: slot.id }))
                          }
                          className="mt-1 h-4 w-4 accent-clubPrimary"
                          required
                        />
                        <span>
                          <span className="block font-extrabold text-clubDark">
                            {slot.day} · {slot.time}
                          </span>
                          <span className="mt-1 block text-sm text-muted-foreground">{slot.label}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </fieldset>

            <Card className="overflow-hidden border-0 bg-white shadow-xl">
              <CardHeader className="border-b bg-clubDark text-white">
                <CardTitle className="text-xl">3. Vos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 p-5 md:grid-cols-2 md:p-7">
                <div className="space-y-2">
                  <Label htmlFor="trial-first-name">Prénom</Label>
                  <Input
                    id="trial-first-name"
                    value={trialForm.firstName}
                    onChange={(event) =>
                      setTrialForm((current) => ({ ...current, firstName: event.target.value }))
                    }
                    placeholder="Camille"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trial-age">Âge</Label>
                  <Input
                    id="trial-age"
                    type="number"
                    min="6"
                    max="99"
                    value={trialForm.age}
                    onChange={(event) =>
                      setTrialForm((current) => ({ ...current, age: event.target.value }))
                    }
                    placeholder="12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trial-level">Niveau</Label>
                  <select
                    id="trial-level"
                    value={trialForm.level}
                    onChange={(event) =>
                      setTrialForm((current) => ({ ...current, level: event.target.value }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Choisir un niveau</option>
                    <option value="debutant">Débutant, jamais joué en club</option>
                    <option value="loisir">Pratique occasionnelle ou scolaire</option>
                    <option value="club">Déjà joué en club</option>
                    <option value="competition">Expérience en compétition</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trial-phone">Téléphone</Label>
                  <Input
                    id="trial-phone"
                    type="tel"
                    value={trialForm.phone}
                    onChange={(event) =>
                      setTrialForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    placeholder="06 12 34 56 78"
                    autoComplete="tel"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="trial-email">E-mail</Label>
                  <Input
                    id="trial-email"
                    type="email"
                    value={trialForm.email}
                    onChange={(event) =>
                      setTrialForm((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="camille@exemple.fr"
                    autoComplete="email"
                    required
                  />
                </div>
                <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-muted-foreground md:col-span-2">
                  <input
                    type="checkbox"
                    checked={trialForm.consent}
                    onChange={(event) =>
                      setTrialForm((current) => ({ ...current, consent: event.target.checked }))
                    }
                    className="mt-0.5 h-4 w-4 accent-clubPrimary"
                    required
                  />
                  <span>
                    J’accepte que le club utilise ces informations uniquement pour organiser
                    ma séance d’essai et me recontacter à ce sujet.
                  </span>
                </label>

                {trialState === "error" && (
                  <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 md:col-span-2">
                    {trialError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={!trialForm.profile || !trialForm.slotId || trialState === "sending"}
                  className="h-auto bg-clubPrimary py-4 text-base font-bold text-white hover:bg-clubPrimary/90 md:col-span-2"
                >
                  {trialState === "sending"
                    ? "Réservation en cours…"
                    : "Réserver ma séance gratuite"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </section>

        {confirmedTrial && confirmedSlot && (
          <section id="confirmation-essai" className="scroll-mt-24">
            <Card className="mx-auto max-w-4xl overflow-hidden border-emerald-200 bg-emerald-50 shadow-xl">
              <CardContent className="p-6 md:p-9">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <CheckCircle2 className="h-12 w-12 shrink-0 text-emerald-600" />
                  <div className="flex-1">
                    <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                      Demande enregistrée
                    </span>
                    <h2 className="mt-2 text-3xl font-black text-clubDark">
                      À bientôt, {confirmedTrial.firstName} !
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                      Voici votre mémo de séance. Le club dispose de vos coordonnées pour
                      confirmer votre accueil.
                    </p>

                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                      <div className="rounded-xl bg-white p-4">
                        <Clock3 className="mb-2 h-5 w-5 text-clubPrimary" />
                        <strong className="block text-clubDark">{confirmedSlot.day}</strong>
                        <span className="text-sm text-muted-foreground">{confirmedSlot.time}</span>
                      </div>
                      <div className="rounded-xl bg-white p-4">
                        <MapPin className="mb-2 h-5 w-5 text-clubPrimary" />
                        <strong className="block text-clubDark">Gymnase Max Linder</strong>
                        <span className="text-sm text-muted-foreground">
                          Impasse Max Linder, 33450 Saint-Loubès
                        </span>
                      </div>
                      <div className="rounded-xl bg-white p-4">
                        <Shirt className="mb-2 h-5 w-5 text-clubPrimary" />
                        <strong className="block text-clubDark">À apporter</strong>
                        <span className="text-sm text-muted-foreground">
                          Tenue de sport, chaussures propres et gourde. Raquette prêtée si besoin.
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button onClick={openPreRegistration} className="bg-clubPrimary text-white hover:bg-clubPrimary/90">
                        Me préinscrire après mon essai
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button asChild variant="outline">
                        <a href="mailto:saintloubping@laposte.net">
                          <Mail className="mr-2 h-4 w-4" />
                          Contacter le club
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <section>
          <div className="mb-8 text-center">
            <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-clubPrimary">
              Saison 2026–2027
            </span>
            <h2 className="mt-2 text-3xl font-black text-clubDark md:text-4xl">
              Tarifs simples et transparents
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            <Card className="border-0 bg-white shadow-lg">
              <CardContent className="p-7">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Licence jeunes
                </span>
                <div className="mt-3 text-5xl font-black text-clubDark">
                  140 <span className="text-2xl text-clubPrimary">€</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Adhésion, licence fédérale et assurance comprises.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-clubDark text-white shadow-lg">
              <CardContent className="p-7">
                <span className="text-sm font-bold uppercase tracking-wider text-white/65">
                  Licence adultes
                </span>
                <div className="mt-3 text-5xl font-black">
                  160 <span className="text-2xl text-clubPrimary">€</span>
                </div>
                <p className="mt-3 text-sm text-white/70">
                  Adhésion, licence fédérale et assurance comprises.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mx-auto mt-5 max-w-4xl rounded-2xl border border-clubPrimary/20 bg-clubPrimary/5 p-5 text-sm text-clubDark">
            <strong>Tarifs famille :</strong> –5 % pour 2 personnes, –10 % pour 3,
            –15 % pour 4, –20 % à partir de 5. Paiement par virement, chèque,
            carte bancaire, Pass’Sport ou chèques ANCV.
          </div>
        </section>

        <section>
          <div className="mb-8 text-center">
            <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-clubPrimary">
              Tous les entraînements
            </span>
            <h2 className="mt-2 text-3xl font-black text-clubDark md:text-4xl">
              Planning hebdomadaire
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Les horaires peuvent être ajustés à l’issue des premiers entraînements.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {planning.map((item) => (
              <div
                key={`${item.day}-${item.time}`}
                className={`rounded-2xl border p-4 ${toneClasses[item.tone]}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <strong>{item.day}</strong>
                  <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold">
                    {item.time}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold">{item.group}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="preinscription" className="scroll-mt-24">
          <Card className="overflow-hidden border-0 bg-clubDark text-white shadow-2xl">
            <CardContent className="p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-clubPrimary">
                    Après votre essai
                  </span>
                  <h2 className="mt-3 text-3xl font-black md:text-4xl">
                    Prêt à rejoindre le club ?
                  </h2>
                  <p className="mt-4 leading-relaxed text-white/70">
                    La préinscription signale votre souhait au bureau. Le club vous recontacte
                    ensuite pour finaliser la licence et les documents nécessaires.
                  </p>
                  {!preRegistrationOpen && (
                    <Button
                      onClick={openPreRegistration}
                      className="mt-6 bg-clubPrimary text-white hover:bg-clubPrimary/90"
                    >
                      Commencer ma préinscription
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>

                {preRegistrationOpen ? (
                  preRegistrationState === "success" ? (
                    <div className="rounded-2xl bg-white p-7 text-clubDark">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                      <h3 className="mt-4 text-2xl font-black">Préinscription envoyée</h3>
                      <p className="mt-3 text-muted-foreground">
                        Merci {preRegistration.firstName}. Le club vous contactera pour
                        finaliser votre dossier.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handlePreRegistrationSubmit}
                      className="grid gap-4 rounded-2xl bg-white p-5 text-clubDark md:grid-cols-2 md:p-7"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="pre-first-name">Prénom</Label>
                        <Input
                          id="pre-first-name"
                          value={preRegistration.firstName}
                          onChange={(event) =>
                            setPreRegistration((current) => ({
                              ...current,
                              firstName: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pre-age">Âge</Label>
                        <Input
                          id="pre-age"
                          type="number"
                          min="6"
                          max="99"
                          value={preRegistration.age}
                          onChange={(event) =>
                            setPreRegistration((current) => ({
                              ...current,
                              age: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pre-profile">Profil</Label>
                        <select
                          id="pre-profile"
                          value={preRegistration.profile}
                          onChange={(event) =>
                            setPreRegistration((current) => ({
                              ...current,
                              profile: event.target.value as Profile,
                            }))
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Choisir</option>
                          {profiles.map((profile) => (
                            <option key={profile.id} value={profile.id}>
                              {profile.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pre-licence">Licence souhaitée</Label>
                        <select
                          id="pre-licence"
                          value={preRegistration.licenceType}
                          onChange={(event) =>
                            setPreRegistration((current) => ({
                              ...current,
                              licenceType: event.target.value as "loisir" | "competition",
                            }))
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Choisir</option>
                          <option value="loisir">Loisir</option>
                          <option value="competition">Compétition</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pre-phone">Téléphone</Label>
                        <Input
                          id="pre-phone"
                          type="tel"
                          value={preRegistration.phone}
                          onChange={(event) =>
                            setPreRegistration((current) => ({
                              ...current,
                              phone: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pre-email">E-mail</Label>
                        <Input
                          id="pre-email"
                          type="email"
                          value={preRegistration.email}
                          onChange={(event) =>
                            setPreRegistration((current) => ({
                              ...current,
                              email: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-muted-foreground md:col-span-2">
                        <input
                          type="checkbox"
                          checked={preRegistration.consent}
                          onChange={(event) =>
                            setPreRegistration((current) => ({
                              ...current,
                              consent: event.target.checked,
                            }))
                          }
                          className="mt-0.5 h-4 w-4 accent-clubPrimary"
                          required
                        />
                        J’accepte d’être recontacté pour finaliser mon inscription.
                      </label>
                      {preRegistrationState === "error" && (
                        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 md:col-span-2">
                          {preRegistrationError}
                        </p>
                      )}
                      <Button
                        type="submit"
                        disabled={preRegistrationState === "sending"}
                        className="bg-clubPrimary py-5 font-bold text-white hover:bg-clubPrimary/90 md:col-span-2"
                      >
                        {preRegistrationState === "sending"
                          ? "Envoi en cours…"
                          : "Envoyer ma préinscription"}
                      </Button>
                    </form>
                  )
                ) : (
                  <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-white/60">
                    Le formulaire s’ouvrira ici après votre séance d’essai.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default EssaiGratuit;
