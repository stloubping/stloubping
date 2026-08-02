import CompetitionCalendar from "@/components/CompetitionCalendar";

const CalendrierCompetitions = () => (
  <div className="min-h-screen bg-clubLight text-clubLight-foreground">
    <section className="bg-clubDark px-4 py-10 text-white">
      <div className="container mx-auto text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-clubPrimary">Saison 2026–2027</p>
        <h1 className="mt-2 text-3xl font-black md:text-5xl">Calendrier des compétitions</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 md:text-base">Retrouvez toutes les dates de la saison, filtrez les compétitions et ajoutez les rendez-vous importants à votre agenda.</p>
      </div>
    </section>
    <main className="container mx-auto px-4 py-8 md:py-10">
      <CompetitionCalendar />
    </main>
  </div>
);

export default CalendrierCompetitions;
