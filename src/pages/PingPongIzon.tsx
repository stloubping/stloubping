import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clubAddress, directionsFrom, localPagePath, localTrainingProfiles } from '@/data/localSeo.mjs';
import { izonFaqs, izonHeading, izonIntro, izonSections } from '@/data/izonSeo.mjs';

export default function PingPongIzon() {
  return <div className="container mx-auto px-4 py-8 text-clubDark md:py-12">
    <nav aria-label="Fil d’Ariane" className="mb-6 flex flex-wrap gap-2 text-sm text-muted-foreground"><Link to="/" className="underline underline-offset-4">Accueil</Link><span aria-hidden="true">/</span><Link to={localPagePath} className="underline underline-offset-4">Le ping près de chez vous</Link><span aria-hidden="true">/</span><span>Izon</span></nav>
    <section className="grid overflow-hidden rounded-2xl bg-clubDark text-white lg:grid-cols-2">
      <div className="p-6 md:p-10">
        <p className="text-sm font-bold uppercase tracking-widest text-clubPrimary">Depuis Izon · destination Saint-Loubès</p>
        <h1 className="mt-4 text-3xl font-black leading-tight [text-wrap:balance] md:text-4xl">{izonHeading}</h1>
        <p className="mt-5 leading-7 text-white/85">{izonIntro}</p>
        <div className="mt-7 flex flex-wrap gap-3"><Button asChild className="bg-clubPrimary text-white hover:bg-clubPrimary/90"><Link to="/essai-gratuit">Demander mon essai gratuit</Link></Button><Button asChild variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white hover:text-clubDark"><a href="#venir-depuis-izon">Préparer mon trajet</a></Button></div>
      </div>
      <img src="/images/hero/club-training.jpg" alt="La salle d’entraînement de Saint-Loub’Ping à Saint-Loubès" width="1200" height="800" className="h-full max-h-[460px] min-h-64 w-full object-cover" />
    </section>
    <section id="venir-depuis-izon" className="my-12 scroll-mt-24 grid gap-6 md:grid-cols-[1.5fr_1fr]">
      <div><h2 className="text-2xl font-bold">{izonSections[0].title}</h2><p className="mt-4 leading-7">{izonSections[0].text}</p></div>
      <div className="rounded-xl border-l-4 border-clubPrimary bg-clubSection/20 p-6"><MapPin className="mb-3 h-6 w-6 text-clubPrimary" aria-hidden="true" /><address className="not-italic"><strong>Saint-Loub’Ping</strong><p className="mt-2 leading-6">{clubAddress}</p></address><a href={directionsFrom('Izon')} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4">Itinéraire depuis Izon<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a><a href="tel:+33688466859" className="block py-3 font-semibold underline underline-offset-4">06 88 46 68 59</a></div>
    </section>
    <section className="my-12" aria-labelledby="choisir-creneau-izon">
      <h2 id="choisir-creneau-izon" className="text-2xl font-bold">{izonSections[1].title}</h2><p className="mt-4 max-w-4xl leading-7">{izonSections[1].text}</p>
      <p className="mt-5 text-sm font-bold uppercase tracking-widest text-clubPrimary">Repères horaires · saison 2026–2027</p>
      <div className="mt-4 grid gap-5 md:grid-cols-3">{localTrainingProfiles.filter(profile => ['enfants', 'adolescents', 'adultes-loisir'].includes(profile.id)).map(profile => <article key={profile.id} className="rounded-xl border p-5"><h3 className="text-lg font-bold">{profile.title}</h3><ul className="mt-4 space-y-3">{profile.slots.map(slot => <li key={`${slot.day}-${slot.time}`} className="border-t pt-3 text-sm"><p>{slot.day}</p><p className="mt-1 font-bold">{slot.time}</p></li>)}</ul></article>)}</div>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">Planning habituel, à confirmer avec le club pendant les vacances, les jours fériés et les événements. Pour le perfectionnement et la compétition, consultez le planning complet puis échangez avec l’entraîneur.</p><Link to="/horaires" className="mt-2 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">Voir tous les horaires</Link>
    </section>
    <section className="my-12 rounded-2xl bg-clubDark p-6 text-white md:p-9"><h2 className="text-2xl font-bold">{izonSections[2].title}</h2><p className="mt-4 max-w-4xl leading-7 text-white/85">{izonSections[2].text}</p><Button asChild className="mt-6 bg-clubPrimary text-white hover:bg-clubPrimary/90"><Link to="/essai-gratuit">Demander une séance d’essai</Link></Button></section>
    <section className="my-12 max-w-4xl"><h2 className="text-2xl font-bold">{izonSections[3].title}</h2><p className="mt-4 leading-7">{izonSections[3].text}</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">{[['/adhesions', 'Tarifs et documents d’adhésion'], ['/competitions-equipes', 'Les équipes du club'], ['/contact', 'Contacter le club']].map(([path, label]) => <Link key={path} to={path} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{label}</Link>)}</div></section>
    <section className="my-10 max-w-4xl"><h2 className="text-2xl font-bold">Vos questions avant de venir d’Izon</h2>{izonFaqs.map(faq => <details key={faq.question} className="border-b py-4"><summary className="cursor-pointer font-semibold">{faq.question}</summary><p className="mt-3 leading-7 text-muted-foreground">{faq.answer}</p></details>)}</section>
  </div>;
}
