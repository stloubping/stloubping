import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import HeroSection from "@/components/HeroSection";
import TrainingSchedule from "@/components/TrainingSchedule"; // Import the new TrainingSchedule component
import { useLightbox } from '@/context/LightboxContext'; // Import useLightbox

const LeClub = () => {
  const { openLightbox } = useLightbox(); // Use the lightbox hook

  return (
    <div className="bg-clubLight text-clubLight-foreground">
      <HeroSection
        title="Le Club"
        description="Découvrez l'histoire, les valeurs, les infrastructures et l'équipe qui font la richesse de notre club de tennis de table."
        imageUrl="/images/hero/FB_IMG_1759672983725.jpg" // Updated to use the uploaded image
        imageAlt="Vue d'overview du club de tennis de table"
      />

      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">Notre Histoire et Nos Valeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-clubLight-foreground">
                Fondé en <span className="font-semibold">1976</span>, le St Loub Ping est bien plus qu'un simple club de tennis de table. C'est un lieu de rencontre, de partage et de dépassement de soi. Depuis nos débuts, nous nous engageons à promouvoir ce sport passionnant auprès de tous les publics, des plus jeunes aux vétérans, des débutants aux compétiteurs de haut niveau.
              </p>
              <p className="mb-4 text-clubLight-foreground">
                Nos valeurs fondamentales sont le respect, l'esprit sportif, la persévérance, la <span className="font-semibold">convivialité, la solidarité et l'esprit d'équipe</span>. Nous croyons fermement que le sport est un formidable vecteur de lien social et de développement personnel. Chaque membre est encouragé à donner le meilleur de lui-même tout en s'épanouissant dans une ambiance chaleureuse et solidaire.
              </p>
              <p className="text-clubLight-foreground">
                Rejoignez la grande famille du St Loub Ping et venez partager notre passion pour la petite balle !
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">Chiffres Clés du Club</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-clubSection rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-clubDark">Licenciés</h3>
                  <p className="text-3xl font-bold text-clubPrimary">157</p>
                  <p className="text-sm text-clubLight-foreground">30% compétiteurs</p>
                  <p className="text-sm text-clubLight-foreground">60% jeunes</p>
                  <p className="text-sm text-clubLight-foreground">9 féminines</p>
                </div>
                <div className="p-4 bg-clubSection rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-clubDark">Équipes Adultes</h3>
                  <p className="text-3xl font-bold text-clubPrimary">6</p>
                  <p className="text-sm text-clubLight-foreground">en championnat</p>
                </div>
                <div className="p-4 bg-clubSection rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-clubDark">Équipes Jeunes</h3>
                  <p className="text-3xl font-bold text-clubPrimary">4</p>
                  <p className="text-sm text-clubLight-foreground">en championnat</p>
                  <p className="text-sm text-clubLight-foreground">3 en critérium Gironde</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">Notre Projet Sportif</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 mb-6 text-clubLight-foreground">
                <li>Promouvoir le tennis de table auprès des jeunes en bénéficiant de l'effet JO & frères Lebrun.</li>
                <li>Organisation d'un tournoi régional annuel accueillant environ 150 participants répartis dans 6 tableaux.</li>
                <li>Organisation de 3 tournois internes au club par an.</li>
                <li>Participations à des événements de la commune.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">Palmarès 2024-2025</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2 text-clubDark">Compétitions par équipes :</h3>
              <ul className="list-disc list-inside space-y-2 mb-6 text-clubLight-foreground">
                <li>Vice-champions de Régionale 3 Nouvelle Aquitaine</li>
                <li>Champions de Division 1 Gironde</li>
                <li>Vainqueur du critérium de Gironde Excellence</li>
                <li>Vice-champions de Gironde en catégorie Benjamin Elite</li>
                <li>Vice-champions de Gironde en catégorie Minime Elite</li>
              </ul>
              <h3 className="text-xl font-semibold mb-2 text-clubDark">Autres distinctions :</h3>
              <ul className="list-disc list-inside space-y-2 text-clubLight-foreground">
                <li>4ème place Nationale 2 Junior Féminine</li>
                <li>9ème place Régional Benjamin</li>
                <li>Club 4ème au Tournoi du Conseil Dep.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">Nos Infrastructures et Moyens</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-clubLight-foreground">
                Notre club dispose d'installations modernes et adaptées pour la pratique du tennis de table dans les meilleures conditions :
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6 text-clubLight-foreground">
                <li>Une salle principale spacieuse équipée de <span className="font-semibold">10 tables</span> de compétition homologuées.</li>
                <li>Un espace d'entraînement dédié équipé de robots lance-balles et de tables d'échauffement.</li>
                <li>Des vestiaires modernes et des douches pour le confort de tous.</li>
                <li>Un Club House convivial pour les moments de détente, les réunions et les événements du club.</li>
                <li>Un parking facile d'accès et sécurisé.</li>
              </ul>
              <p className="mb-4 text-clubLight-foreground">
                Pour l'encadrement, nous bénéficions de :
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6 text-clubLight-foreground">
                <li><span className="font-semibold">10 créneaux d'entraînements dirigés</span>.</li>
                <li><span className="font-semibold">2 créneaux d'entraînement libres</span>.</li>
                <li><span className="font-semibold">1 entraîneur à 17h00 / semaine annualisé</span>.</li>
              </ul>
              <img
                src="/images/club/FB_IMG_1759672880255.jpg"
                alt="Infrastructure du club"
                className="mt-6 rounded-lg shadow-md w-full object-cover cursor-zoom-in"
                onClick={() => openLightbox("/images/club/FB_IMG_1759672880255.jpg")} // Open lightbox on image click
              />
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">Nos Besoins de Financement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-clubLight-foreground">
                Pour continuer à offrir les meilleures conditions de pratique à nos membres et développer nos activités, le club a des besoins de financement pour :
              </p>
              <ul className="list-disc list-inside space-y-2 text-clubLight-foreground">
                <li>L'achat et le renouvellement de matériel : nos tables actuelles ont entre 30 et 40 ans.</li>
                <li>L'acquisition de filets récupérateurs de balles pour optimiser les entraînements.</li>
                <li>Le financement de stages et de formations pour nos jeunes et nos entraîneurs.</li>
                <li>L'organisation d'événements et de compétitions.</li>
              </ul>
              <p className="mt-4 text-clubLight-foreground">
                Toute aide ou partenariat est la bienvenue pour nous aider à atteindre ces objectifs.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">L'Équipe Dirigeante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-clubLight-foreground text-center">
                Notre club est géré par une équipe de bénévoles passionnés, dévoués au développement du tennis de table et au bien-être de nos membres.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=102"
                    alt="Président"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=102")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Philippe Roux</h4>
                  <p className="text-sm text-muted-foreground">Président</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Visionnaire et pilier du club, il assure la direction générale.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=103"
                    alt="Vice-Président"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=103")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Yves Mounde</h4>
                  <p className="text-sm text-muted-foreground">Vice-Président</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Soutient le président et participe à la gestion du club.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=104"
                    alt="Trésorier"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=104")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Patrice Gigaud</h4>
                  <p className="text-sm text-muted-foreground">Trésorier</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Responsable des finances et de la gestion budgétaire.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=105"
                    alt="Trésorier adjoint"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=105")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Sandra Thuault</h4>
                  <p className="text-sm text-muted-foreground">Trésorier adjoint</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Assiste le trésorier dans ses fonctions.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=106"
                    alt="Secrétaire"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=106")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Olivier Goux</h4>
                  <p className="text-sm text-muted-foreground">Secrétaire</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Gère l'administration et la communication interne.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=107"
                    alt="Secrétaire adjoint"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=107")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Jérémie Monteignies</h4>
                  <p className="text-sm text-muted-foreground">Secrétaire adjoint</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Assiste le secrétaire dans ses tâches.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=108"
                    alt="Membre du bureau"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=108")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Dominique</h4>
                  <p className="text-sm text-muted-foreground">Membre du bureau</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Contribue activement à la vie du club.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=109"
                    alt="Membre du bureau"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=109")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Wesley</h4>
                  <p className="text-sm text-muted-foreground">Membre du bureau</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Contribue activement à la vie du club.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=110"
                    alt="Membre du bureau"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=110")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Vincent</h4>
                  <p className="text-sm text-muted-foreground">Membre du bureau</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Contribue activement à la vie du club.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=111"
                    alt="Membre du bureau"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=111")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Michel</h4>
                  <p className="text-sm text-muted-foreground">Membre du bureau</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Contribue activement à la vie du club.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=112"
                    alt="Membre du bureau"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=112")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Yann</h4>
                  <p className="text-sm text-muted-foreground">Membre du bureau</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Contribue activement à la vie du club.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=113"
                    alt="Membre du bureau"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=113")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Antoine</h4>
                  <p className="text-sm text-muted-foreground">Membre du bureau</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Contribue activement à la vie du club.</p>
                </div>
                {/* Nouveaux membres ajoutés ici */}
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=114"
                    alt="Membre du bureau"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=114")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Yanick</h4>
                  <p className="text-sm text-muted-foreground">Membre du bureau</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Contribue activement à la vie du club.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img
                    src="https://picsum.photos/150/150?random=115"
                    alt="Membre du bureau"
                    className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary cursor-zoom-in"
                    onClick={() => openLightbox("https://picsum.photos/150/150?random=115")}
                  />
                  <h4 className="font-semibold text-lg text-clubDark">Pierre</h4>
                  <p className="text-sm text-muted-foreground">Membre du bureau</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Contribue activement à la vie du club.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default LeClub;