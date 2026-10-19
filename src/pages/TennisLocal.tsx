import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clubAddress, directionsFrom, localFaqs, localHeading, localIntro, localTowns } from "@/data/localSeo.mjs";

export default function TennisLocal() {
  return <div className="container mx-auto px-4 py-8 text-clubDark md:py-12">
    <nav aria-label="Fil d’Ariane" className="mb-6 text-sm text-muted-foreground"><Link to="/" className="underline underline-offset-4">Accueil</Link><span aria-hidden="true"> / </span>Le ping près de chez vous</nav>
    <section className="grid overflow-hidden rounded-2xl bg-clubDark text-white lg:grid-cols-2">
      <div className="p-6 md:p-10">
        <p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Un club, des voisins, une même passion</p>
        <h1 className="mt-4 text-3xl font-black leading-tight md:text-4xl">{localHeading}</h1>
        <p className="mt-5 leading-7 text-white/85">{localIntro}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild className="bg-clubPrimary text-white hover:bg-clubPrimary/90"><Link to="/essai-gratuit">Réserver mon essai gratuit</Link></Button>
          <Button asChild variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white hover:text-clubDark"><Link to="/horaires">Voir les horaires</Link></Button>
        </div>
      </div>
      <img src="/images/hero/club-training.jpg" alt="Entraînement dans la salle de tennis de table de Saint-Loub’Ping à Saint-Loubès" className="h-full max-h-[460px] min-h-64 w-full object-cover" width="1200" height="800" />
    </section>

    <section className="my-12 grid gap-8 lg:grid-cols-[1fr_1.3fr]" aria-labelledby="venir-au-club">
      <div>
        <h2 id="venir-au-club" className="text-2xl font-bold">Votre itinéraire jusqu’à la salle</h2>
        <p className="mt-4 leading-7">Vous venez d’une des six communes des Rives de la Laurence ? Notre salle est située à Saint-Loubès : choisissez votre commune de départ pour préparer votre trajet.</p>
        <address className="mt-5 border-l-4 border-clubPrimary pl-4 not-italic"><p className="font-bold">Saint-Loub’Ping</p><p className="mt-1">{clubAddress}</p><a href="tel:+33688466859" className="mt-3 inline-flex items-center gap-2 font-semibold underline underline-offset-4"><Phone className="h-4 w-4" aria-hidden="true" />06 88 46 68 59</a></address>
        <p className="mt-4 text-sm text-muted-foreground">Les itinéraires s’ouvrent dans Google Maps. Aucun temps de trajet n’est garanti.</p>
      </div>
      <ul className="divide-y rounded-xl border bg-white px-5">
        {localTowns.map((town) => <li key={town}><a href={directionsFrom(town)} target="_blank" rel="noopener noreferrer" className="flex min-h-16 items-center justify-between gap-3 py-4 font-semibold hover:text-clubPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-clubPrimary" aria-label={`Itinéraire depuis ${town} vers la salle de Saint-Loub’Ping`}><span className="flex items-center gap-3"><MapPin className="h-5 w-5 shrink-0 text-clubPrimary" aria-hidden="true" />{town}</span><ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" /></a></li>)}
      </ul>
    </section>

    <section className="border-y py-8" aria-labelledby="pratiquer-le-ping">
      <h2 id="pratiquer-le-ping" className="text-2xl font-bold">Débuter, reprendre ou jouer en compétition</h2>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
        <div><h3 className="text-lg font-bold">Enfants et adolescents</h3><p className="mt-2 leading-7">Découvrir les gestes, progresser et partager un sport avec d’autres jeunes. Le club propose des groupes d’entraînement selon l’âge et le niveau.</p></div>
        <div><h3 className="text-lg font-bold">Adultes loisir</h3><p className="mt-2 leading-7">Envie d’une activité sportive près de chez vous ? Le ping se pratique aussi pour le plaisir, que l’on débute ou que l’on reprenne la raquette.</p></div>
        <div><h3 className="text-lg font-bold">Compétition</h3><p className="mt-2 leading-7">Pour celles et ceux qui aiment les rencontres et l’esprit d’équipe, retrouvez la vie sportive et les résultats de <Link to="/competitions-equipes" className="font-semibold underline underline-offset-4">nos équipes</Link>.</p></div>
      </div>
      <p className="mt-6 leading-7">Consultez les <Link to="/horaires" className="font-semibold underline underline-offset-4">horaires des entraînements</Link> et les <Link to="/adhesions" className="font-semibold underline underline-offset-4">tarifs et documents d’adhésion</Link>, ou <Link to="/contact" className="font-semibold underline underline-offset-4">contactez le club</Link> pour choisir votre créneau.</p>
    </section>

    <section className="my-10 max-w-4xl" aria-labelledby="questions-locales">
      <h2 id="questions-locales" className="mb-5 text-2xl font-bold">Avant votre première séance</h2>
      {localFaqs.map(({ question, answer }) => <details key={question} className="border-b py-4"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 leading-7 text-muted-foreground">{answer}</p></details>)}
    </section>
  </div>;
}
