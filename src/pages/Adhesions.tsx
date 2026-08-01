import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLightbox } from '@/context/LightboxContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarDays, ChevronDown, Clock3, HelpCircle } from 'lucide-react';

type ScheduleTone = "libre" | "jeunes" | "competition" | "adultes";

type ScheduleSlot = {
  time: string;
  label: string;
  tone: ScheduleTone;
};

const trainingSchedule: { day: string; slots: ScheduleSlot[] }[] = [
  {
    day: "Lundi",
    slots: [{ time: "18h00 â€“ 20h00", label: "Entraînement libre", tone: "libre" }],
  },
  {
    day: "Mardi",
    slots: [{ time: "18h00 â€“ 20h00", label: "Entraînement libre", tone: "libre" }],
  },
  {
    day: "Mercredi",
    slots: [
      { time: "15h30 â€“ 16h30", label: "Loisirs 7â€“10 ans", tone: "jeunes" },
      { time: "16h30 â€“ 18h00", label: "Loisirs 11â€“16 ans", tone: "jeunes" },
      { time: "18h00 â€“ 19h30", label: "Jeunes compétitions", tone: "jeunes" },
      { time: "19h30 â€“ 21h00", label: "Adultes compétitions", tone: "adultes" },
    ],
  },
  {
    day: "Jeudi",
    slots: [
      { time: "17h00 â€“ 18h00", label: "Jeunes perfectionnement", tone: "jeunes" },
      { time: "18h00 â€“ 19h30", label: "Loisirs 11â€“16 ans", tone: "jeunes" },
      { time: "19h30 â€“ 21h00", label: "Adultes loisirs", tone: "adultes" },
    ],
  },
  {
    day: "Vendredi",
    slots: [
      { time: "17h00 â€“ 18h00", label: "Jeunes perfectionnement", tone: "jeunes" },
      { time: "18h00 â€“ 20h00", label: "Jeunes compétitions", tone: "jeunes" },
      { time: "20h00 â€“ 00h00", label: "Critérium Gironde", tone: "competition" },
    ],
  },
  {
    day: "Samedi",
    slots: [
      { time: "10h00 â€“ 11h30", label: "Loisirs 7â€“10 ans", tone: "jeunes" },
      { time: "14h00 â€“ 21h00", label: "Championnat par équipe", tone: "competition" },
    ],
  },
];

const scheduleToneClasses: Record<ScheduleTone, string> = {
  libre: "border-lime-300 bg-lime-50 text-lime-950",
  jeunes: "border-sky-300 bg-sky-50 text-sky-950",
  competition: "border-amber-300 bg-amber-50 text-amber-950",
  adultes: "border-rose-300 bg-rose-50 text-rose-950",
};

const scheduleStartRows = [10 * 60, 14 * 60, 15 * 60 + 30, 16 * 60 + 30, 17 * 60, 18 * 60, 19 * 60 + 30, 20 * 60];

const parseScheduleTime = (value: string) => {
  const [hours, minutes] = value.trim().split("h").map(Number);
  return hours * 60 + (minutes || 0);
};

const getScheduleGridPosition = (time: string) => {
  const [startValue, endValue] = time.split("â€“");
  const start = parseScheduleTime(startValue);
  let end = parseScheduleTime(endValue);

  if (end === 0) {
    end = 24 * 60;
  }

  const startRow = scheduleStartRows.indexOf(start) + 1;
  const nextStartAtOrAfterEnd = scheduleStartRows.findIndex((rowStart) => rowStart >= end);
  const endRow = nextStartAtOrAfterEnd === -1
    ? scheduleStartRows.length + 1
    : nextStartAtOrAfterEnd + 1;

  return {
    gridRow: `${startRow} / ${endRow}`,
  };
};

const faqItems = [
  {
    question: "Puis-je effectuer des séances d'essai gratuites avant de m'inscrire ?",
    answer: "Oui, tout à fait ! Le club vous propose 2 séances d'essai gratuites en début de saison. Il vous suffit de vous présenter au gymnase lors d'un créneau adapté à votre catégorie pour tester l'ambiance et les entraînements."
  },
  {
    question: "Quelle est la différence entre la licence Loisir et la licence Compétition ?",
    answer: "La licence Loisir vous donne accès aux entraînements (libres ou dirigés) et aux compétitions amicales ou départementales d'animation. La licence Compétition vous permet en plus de participer aux championnats officiels FFTT par équipes le week-end, ainsi qu'aux tournois individuels régionaux et au Critérium Fédéral."
  },
  {
    question: "Ã€ partir de quel âge mon enfant peut-il s'inscrire ?",
    answer: "Nous accueillons les enfants dès l'âge de 6 ans (section Jeunes Débutants / Loisirs Primaire). Des groupes de niveau sont ensuite constitués pour garantir une progression ludique et adaptée."
  },
  {
    question: "Faut-il apporter sa propre raquette ?",
    answer: "Pour les séances d'essai, le club peut vous prêter une raquette. Pour la suite de la saison, il est recommandé d'acquérir votre propre raquette. Nos entraîneurs et membres du bureau sont à votre disposition pour vous conseiller selon votre style de jeu et votre budget."
  },
  {
    question: "Quels sont les moyens de paiement acceptés et existe-t-il des aides ?",
    answer: "Nous acceptons les règlements par carte bancaire, virement, chèque (possibilité de paiement en plusieurs fois), chèques ANCV / Coupons Sport, ainsi que le Pass'Sport du gouvernement. De plus, une réduction dégressive est appliquée si plusieurs membres d'une même famille s'inscrivent."
  },
  {
    question: "Le certificat médical est-il obligatoire ?",
    answer: "Pour les mineurs, le questionnaire de santé annuel suffit dans la majorité des cas. Pour les majeurs, la présentation d'un certificat médical est requise lors de la première souscription d'une licence compétition, d'une reprise d'activité ou en cas de réponse positive au questionnaire de santé officiel."
  }
];

const Adhesions = () => {
  const { openLightbox } = useLightbox();

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-clubDark">Adhésions Saison 2026-2027</h1>

      {/* Intro */}
      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Devenez Membre de Notre Club !</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Que vous soyez un joueur occasionnel ou un compétiteur aguerri, notre club vous ouvre ses portes.
              Rejoignez une communauté passionnée et bénéficiez d'un encadrement de qualité et d'infrastructures adaptées.
            </p>
            <p className="text-clubLight-foreground">
              L'adhésion à notre club comprend la licence FFTT, l'accès aux entraînements encadrés, 
              l'assurance sportive ainsi que la participation aux événements du club.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Tarifs 2026-2027 */}
      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl border border-border overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Tarifs des Inscriptions 2026-2027</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl mx-auto">
              <img loading="lazy" decoding="async"
                src="/images/adhesions/tarifs-2026-2027.jpg"
                alt="Tarifs des inscriptions saison 2026-2027"
                className="w-full h-auto object-contain rounded-lg shadow-md cursor-zoom-in hover:opacity-90 transition-opacity"
                onClick={() => openLightbox("/images/adhesions/tarifs-2026-2027.jpg")}
              />
              <p className="text-xs text-muted-foreground text-center mt-2">Cliquez sur l'image pour l'agrandir</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Documents d'Inscription */}
      <section className="text-center mb-12">
        <Card className="bg-clubLight shadow-lg p-4 sm:p-8 rounded-xl border border-clubPrimary/30">
          <CardTitle className="text-2xl text-clubDark mb-4">Documents d'Inscription</CardTitle>
          <CardContent className="px-2 sm:px-6">
            <p className="mb-6 text-sm sm:text-base text-clubLight-foreground max-w-xl mx-auto leading-relaxed">
              Pour vous inscrire, téléchargez et remplissez les documents ci-dessous. Remettez-les ensuite à un membre du bureau ou à un entraîneur, ou envoyez-les par mail à <a href="mailto:saintloubping@laposte.net" className="font-semibold text-clubPrimary underline hover:text-clubPrimary/80">saintloubping@laposte.net</a> conjointement à un virement en mettant en référence "licence nom-prénom".
            </p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full sm:w-auto h-auto max-w-full bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-md shadow-lg whitespace-normal leading-snug">
                  <span>Télécharger les documents</span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 inline-block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(100vw-3rem)] sm:w-80 max-w-sm bg-clubLight text-clubLight-foreground border-clubPrimary">
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/26-2-licence.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Formulaire de licence FFTT (2026-2027)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/26-9-certificat.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Certificat médical (2026-2027)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/26-10-2-autoquestionnaire-medical-mineur.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Autoquestionnaire médical mineur (2026-2027)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/droit-a-l-image-et-rgpd.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Droit à l'image et RGPD
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/images/adhesions/rib-stloubping.jpg" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubPrimary font-semibold hover:bg-clubSection">
                    RIB du club (virement bancaire)
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <p className="mt-6 text-xs sm:text-sm text-muted-foreground">
              Pour toute question, vous pouvez nous contacter directement depuis la page Contact.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Horaires 2026-2027 */}
      <section className="mb-12" aria-labelledby="training-schedule-title">
        <Card className="overflow-hidden rounded-2xl border border-border bg-clubLight shadow-lg">
          <CardHeader className="border-b border-border bg-clubDark px-5 py-6 text-white sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-clubPrimary">
                  Saison 2026â€“2027
                </p>
                <CardTitle id="training-schedule-title" className="text-2xl text-white md:text-3xl">
                  Planning des entraînements
                </CardTitle>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <CalendarDays className="h-6 w-6 text-clubPrimary" aria-hidden="true" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {trainingSchedule.map(({ day, slots }) => (
                <article
                  key={day}
                  className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  <h3 className="border-b border-clubPrimary/20 bg-clubPrimary/10 px-4 py-3 text-center text-base font-extrabold uppercase tracking-wide text-clubDark">
                    {day}
                  </h3>
                  <div className="space-y-3 p-3 lg:grid lg:h-[520px] lg:grid-rows-8 lg:gap-1 lg:space-y-0 lg:p-2">
                    {slots.map((slot) => (
                      <div
                        key={`${day}-${slot.time}`}
                        className={`rounded-lg border-l-4 p-3 lg:flex lg:flex-col lg:justify-center lg:px-2 lg:py-1.5 ${scheduleToneClasses[slot.tone]}`}
                        style={getScheduleGridPosition(slot.time)}
                      >
                        <p className="font-bold leading-tight lg:text-xs">{slot.label}</p>
                        <p className="mt-1.5 flex items-center gap-1 text-sm font-semibold lg:text-xs">
                          <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <time>{slot.time}</time>
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3" aria-label="Légende du planning">
              {[
                { label: "Libre", tone: "libre" as const },
                { label: "Jeunes", tone: "jeunes" as const },
                { label: "Compétition", tone: "competition" as const },
                { label: "Adultes", tone: "adultes" as const },
              ].map((item) => (
                <span
                  key={item.tone}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${scheduleToneClasses[item.tone]}`}
                >
                  {item.label}
                </span>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
              Ces horaires sont susceptibles d'ajustements à l'issue des premiers entraînements.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Types de licences */}
      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Types de Licences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-clubSection p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-clubDark">Licence Loisir</h3>
                <p className="mb-4 text-clubLight-foreground">
                  Idéale pour ceux qui souhaitent pratiquer le tennis de table pour le plaisir, avec la possibilité de faire quelques petites compétitions dédiées aux joueurs loisirs.
                </p>
                <ul className="list-disc list-inside mb-4 text-clubLight-foreground space-y-1">
                  <li>Accès aux créneaux de jeu libre</li>
                  <li>Participation aux entraînements dirigés loisirs</li>
                  <li>Assurance FFTT incluse</li>
                  <li className="font-semibold pt-2">Accès compétitions jeunes & adultes :</li>
                  <li>Tournois du Conseil Départemental</li>
                  <li>Rencontres interclubs & Critérium de Gironde</li>
                </ul>
              </div>
              <div className="bg-clubSection p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-clubDark">Licence Compétition</h3>
                <p className="mb-4 text-clubLight-foreground">
                  Pour les joueurs désireux de s'investir dans la compétition et de participer aux championnats par équipes et tournois organisés par la FFTT.
                </p>
                <ul className="list-disc list-inside mb-4 text-clubLight-foreground space-y-1">
                  <li>Accès aux créneaux de jeu libre & entraînements compétition</li>
                  <li>Assurance FFTT & Classement officiel FFTT</li>
                  <li className="font-semibold pt-2">Accès aux compétitions officielles :</li>
                  <li>Championnat par équipes jeunes & séniors</li>
                  <li>Critérium Fédéral, Titres jeunes, Tournois régionaux</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Foire Aux Questions (FAQ) */}
      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-clubDark flex items-center justify-center gap-2">
              <HelpCircle className="text-clubPrimary h-6 w-6" /> Questions Fréquentes (FAQ)
            </CardTitle>
          </CardHeader>
          <CardContent className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b-border">
                  <AccordionTrigger className="text-left font-semibold text-clubDark hover:text-clubPrimary py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-clubLight-foreground text-sm leading-relaxed pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Adhesions;