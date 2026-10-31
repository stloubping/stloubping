import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clubAddress, directionsFrom, localFaqs, localHeading, localIntro, localTownGuides, localTrainingProfiles } from "@/data/localSeo.mjs";

export default function TennisLocal() {
  return <div className="container mx-auto px-4 py-8 text-clubDark md:py-12">
    <nav aria-label="Fil d’Ariane" className="mb-6 text-sm text-muted-foreground"><Link to="/" className="underline underline-offset-4">Accueil</Link><span aria-hidden="true"> / </span>Le ping près de chez vous</nav>
    <section className="grid overflow-hidden rounded-2xl bg-clubDark text-white lg:grid-cols-2">
      <div className="p-6 md:p-10">
        <p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Un club, des voisins, une même passion</p>
        <h1 className="mt-4 text-3xl font-black leading-tight md:text-4xl">{localHeading}</h1>
        <p className="mt-5 leading-7 text-white/85">{localIntro}</p>
        <p className="mt-4 border-l-2 border-clubPrimary pl-4 text-sm leading-6 text-white/85">Une seule salle, à Saint-Loubès. Les groupes sont ouverts aux habitants de toutes les communes voisines.</p>
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
        <p className="mt-4 leading-7">Choisissez votre commune pour retrouver les informations pratiques et ouvrir un itinéraire jusqu’à notre salle. Vous n’avez pas besoin de résider à Saint-Loubès pour rejoindre le club.</p>
        <address className="mt-5 border-l-4 border-clubPrimary pl-4 not-italic"><p className="font-bold">Saint-Loub’Ping</p><p className="mt-1">{clubAddress}</p><a href="tel:+33688466859" className="mt-3 inline-flex items-center gap-2 font-semibold underline underline-offset-4"><Phone className="h-4 w-4" aria-hidden="true" />06 88 46 68 59</a></address>
        <p className="mt-4 text-sm text-muted-foreground">Les itinéraires s’ouvrent dans Google Maps. Aucun temps de trajet n’est garanti.</p>
      </div>
      <ul className="divide-y rounded-xl border bg-white px-5">
        {localTownGuides.map(({ town, id }) => <li key={id}><a href={`#${id}`} className="flex min-h-16 items-center justify-between gap-3 py-4 font-semibold hover:text-clubPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-clubPrimary"><span className="flex items-center gap-3"><MapPin className="h-5 w-5 shrink-0 text-clubPrimary" aria-hidden="true" />{town}</span><ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" /></a></li>)}
      </ul>
    </section>

    <section className="my-12" aria-labelledby="depuis-votre-commune">
      <aside className="mb-8 border-l-4 border-clubPrimary bg-clubSection/20 p-5"><h2 className="text-xl font-bold">Vous venez d’Izon ?</h2><p className="mt-2 leading-7">Izon ne fait pas partie des six communes des Rives de la Laurence, mais ses habitants sont aussi les bienvenus à Saint-Loubès.</p><Link to="/ou-jouer-au-ping-pong-a-izon" className="mt-3 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">Où jouer au ping-pong quand on habite Izon ?</Link></aside>
      <p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Les Rives de la Laurence</p>
      <h2 id="depuis-votre-commune" className="mt-2 text-2xl font-bold md:text-3xl">Depuis votre commune, jusqu’à la table</h2>
      <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
        {localTownGuides.map(guide => <article key={guide.id} id={guide.id} className="scroll-mt-24 border-t-2 border-clubPrimary/50 py-5">
          <h3 className="text-xl font-bold">{guide.heading}</h3>
          <p className="mt-3 leading-7">{guide.text}</p>
          <p className="mt-3 border-l-2 border-border pl-4 text-sm leading-6 text-muted-foreground">{guide.tip}</p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <a href={directionsFrom(guide.town)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4 hover:text-clubPrimary">Itinéraire depuis {guide.town}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
            <a href="#creneaux-par-profil" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-clubPrimary">Choisir mon créneau</a>
          </div>
        </article>)}
      </div>
    </section>

    <section id="creneaux-par-profil" className="my-12 scroll-mt-24 rounded-2xl border bg-clubSection/20 p-5 md:p-8" aria-labelledby="titre-creneaux">
      <p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Saison 2026–2027</p>
      <h2 id="titre-creneaux" className="mt-2 text-2xl font-bold md:text-3xl">Trouvez votre créneau</h2>
      <p className="mt-4 max-w-3xl leading-7">Ces horaires sont les mêmes pour tous les habitants des Rives de la Laurence. Repérez votre profil, puis demandez une séance d’essai : le club confirmera le groupe adapté à votre âge et à votre niveau.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {localTrainingProfiles.map(profile => <article key={profile.id} className="rounded-xl border bg-white p-5">
          <h3 className="text-lg font-bold">{profile.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{profile.description}</p>
          <ul className="mt-4 space-y-3">{profile.slots.map(slot => <li key={`${slot.day}-${slot.time}`} className="border-t pt-3 text-sm"><p className="font-semibold">{slot.day}{profile.id === 'competition' ? ` · ${slot.label}` : ''}</p><p className="mt-1 flex items-center gap-2 font-bold"><Clock3 className="h-4 w-4 shrink-0 text-clubPrimary" aria-hidden="true" />{slot.time}</p></li>)}</ul>
        </article>)}
      </div>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">Planning habituel : vérifiez auprès du club les séances pendant les vacances scolaires, les jours fériés et les événements. L’inscription à un groupe reste à confirmer avec l’entraîneur.</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2"><Link to="/horaires" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">Consulter le planning hebdomadaire complet</Link><Link to="/competitions-equipes" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">Découvrir nos équipes</Link></div>
    </section>


    <section className="my-12 grid gap-6 rounded-2xl bg-clubDark p-6 text-white md:grid-cols-[1.5fr_1fr] md:p-9" aria-labelledby="essai-pres-de-chez-vous">
      <div><p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Votre première séance</p><h2 id="essai-pres-de-chez-vous" className="mt-3 text-2xl font-bold">Envie d’essayer le ping-pong ?</h2><p className="mt-4 leading-7 text-white/85">Enfant, adolescent ou adulte, débutant ou joueur en reprise : indiquez votre âge, votre niveau et vos disponibilités dans le formulaire. Le club pourra vous orienter vers une séance à Saint-Loubès.</p></div>
      <div className="flex flex-col justify-center gap-4"><Button asChild className="min-h-12 whitespace-normal bg-clubPrimary px-5 text-white hover:bg-clubPrimary/90"><Link to="/essai-gratuit">Demander mon essai gratuit</Link></Button><Link to="/adhesions" className="py-2 text-center text-sm font-semibold underline underline-offset-4">Voir les tarifs et les documents d’adhésion</Link><a href="tel:+33688466859" className="py-2 text-center text-sm text-white/85 underline underline-offset-4">Une question ? 06 88 46 68 59</a></div>
    </section>

    <section className="my-10 max-w-4xl" aria-labelledby="questions-locales">
      <h2 id="questions-locales" className="mb-5 text-2xl font-bold">Avant votre première séance</h2>
      {localFaqs.map(({ question, answer }) => <details key={question} className="border-b py-4"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 leading-7 text-muted-foreground">{answer}</p></details>)}
    </section>
  </div>;
}
