import { type FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClubOrdersDashboard from "@/components/admin/ClubOrdersDashboard";
import EquipmentOrderSlip from "@/components/admin/EquipmentOrderSlip";
import ShirtOrderSlip from "@/components/admin/ShirtOrderSlip";
import NewEquipmentOrder from "@/components/admin/NewEquipmentOrder";
import EquipmentOrdersRecap from "@/components/admin/EquipmentOrdersRecap";
import CompletedEquipmentOrders from "@/components/admin/CompletedEquipmentOrders";
import WackSportOrders from "@/components/admin/WackSportOrders";
import WeeklyRoomAttendanceAdmin from "@/components/admin/WeeklyRoomAttendanceAdmin";
import AugustStageAdmin from "@/components/admin/AugustStageAdmin";
import StagesAdmin from "@/components/admin/StagesAdmin";
import GenericStageAdmin from "@/components/admin/GenericStageAdmin";
import HomeNewsAdmin from "@/components/admin/HomeNewsAdmin";
import CompetitionCalendarAdmin from "@/components/admin/CompetitionCalendarAdmin";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const Administration = () => {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("saintloubping@laposte.net");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "forgot" | "reset">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setIsAuthLoading(false);
      if (event === "PASSWORD_RECOVERY") {
        setAuthMode("reset");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user.id) {
      setIsAdmin(false);
      return;
    }
    const checkAccess = async () => {
      const { data, error } = await supabase.from("club_admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
      if (error || !data) {
        setIsAdmin(false);
        toast.error("Ce compte n’est pas autorisé à gérer le club.");
        return;
      }
      setIsAdmin(true);
    };
    checkAccess();
  }, [session?.user.id]);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      console.error(error);
      toast.error("Adresse e-mail ou mot de passe incorrect.");
    }
    setIsSubmitting(false);
  };

  const sendPasswordReset = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/administration`,
    });
    if (error) {
      console.error(error);
      toast.error("L’e-mail de réinitialisation n’a pas pu être envoyé.");
    } else {
      toast.success("Consultez la boîte e-mail du club pour définir un nouveau mot de passe.");
      setAuthMode("login");
    }
    setIsSubmitting(false);
  };

  const updatePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error(error);
      toast.error("Le mot de passe n’a pas pu être enregistré.");
    } else {
      toast.success("Votre nouveau mot de passe est enregistré.");
      setPassword("");
      setPasswordConfirmation("");
      setAuthMode("login");
    }
    setIsSubmitting(false);
  };

  if (isAuthLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center bg-clubLight"><Loader2 className="h-8 w-8 animate-spin text-clubPrimary" /></div>;
  }

  if (authMode === "reset" || !session || !isAdmin) {
    return (
      <section className="min-h-[70vh] bg-clubLight px-4 py-16">
        <Card className="mx-auto max-w-lg overflow-hidden border-0 shadow-xl">
          <CardHeader className="space-y-4 bg-clubDark text-center text-white">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clubPrimary/20"><ShieldCheck className="h-7 w-7 text-clubPrimary" /></div>
            <CardTitle className="text-3xl">{authMode === "reset" ? "Nouveau mot de passe" : authMode === "forgot" ? "Mot de passe oublié" : "Gestion du club"}</CardTitle>
            <p className="text-sm text-white/70">Accès réservé aux membres autorisés du bureau.</p>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {authMode === "reset" ? (
              <form onSubmit={updatePassword} className="space-y-5">
                <p className="text-sm text-muted-foreground">Choisissez un nouveau mot de passe d’au moins 8 caractères.</p>
                <div>
                  <label htmlFor="admin-new-password" className="mb-2 block text-sm font-bold">Nouveau mot de passe</label>
                  <Input id="admin-new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
                </div>
                <div>
                  <label htmlFor="admin-password-confirmation" className="mb-2 block text-sm font-bold">Confirmer le mot de passe</label>
                  <Input id="admin-password-confirmation" type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} autoComplete="new-password" minLength={8} required />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-clubPrimary py-6 text-base font-bold">
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <KeyRound className="mr-2 h-5 w-5" />}
                  Enregistrer mon mot de passe
                </Button>
              </form>
            ) : authMode === "forgot" ? (
              <form onSubmit={sendPasswordReset} className="space-y-5">
                <p className="text-sm text-muted-foreground">Un lien sécurisé sera envoyé à l’adresse du compte administrateur.</p>
                <div>
                  <label htmlFor="admin-reset-email" className="mb-2 block text-sm font-bold">Adresse e-mail</label>
                  <Input id="admin-reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-clubPrimary py-6 text-base font-bold">
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <KeyRound className="mr-2 h-5 w-5" />}
                  Envoyer le lien de réinitialisation
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setAuthMode("login")}>Retour à la connexion</Button>
              </form>
            ) : (
              <form onSubmit={signIn} className="space-y-5">
                <div>
                  <label htmlFor="admin-email" className="mb-2 block text-sm font-bold">Adresse e-mail</label>
                  <Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                </div>
                <div>
                  <label htmlFor="admin-password" className="mb-2 block text-sm font-bold">Mot de passe</label>
                  <div className="relative">
                    <Input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="pr-11" required />
                    <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-clubDark" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-clubPrimary py-6 text-base font-bold">
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <KeyRound className="mr-2 h-5 w-5" />}
                  Se connecter
                </Button>
                <button type="button" className="w-full text-center text-sm font-semibold text-clubPrimary hover:underline" onClick={() => setAuthMode("forgot")}>Mot de passe oublié ?</button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    );
  }

  if (location.pathname === "/administration/bordereau-commande") {
    return <EquipmentOrderSlip session={session} />;
  }

  if (location.pathname === "/administration/bordereau-maillots") {
    return <ShirtOrderSlip session={session} />;
  }

  if (location.pathname === "/administration/nouvelle-commande-materiel") {
    return <NewEquipmentOrder />;
  }

  if (location.pathname === "/administration/recap-commandes-materiel") {
    return <EquipmentOrdersRecap />;
  }

  if (location.pathname === "/administration/commandes-terminees") {
    return <CompletedEquipmentOrders />;
  }

  if (location.pathname === "/administration/wacksport") {
    return <WackSportOrders />;
  }

  if (location.pathname === "/administration/presences-salle") {
    return <WeeklyRoomAttendanceAdmin />;
  }


  if (location.pathname === "/administration/stage-aout") {
    return <AugustStageAdmin />;
  }

  if (location.pathname === "/administration/stage") {
    return <StagesAdmin />;
  }

  if (location.pathname.startsWith("/administration/stage/")) {
    return <GenericStageAdmin slug={location.pathname.split("/").pop() || ""} />;
  }

  if (location.pathname === "/administration/actualites") {
    return <HomeNewsAdmin />;
  }

  if (location.pathname === "/administration/calendrier-competitions") {
    return <CompetitionCalendarAdmin />;
  }

  return <ClubOrdersDashboard session={session} onSignOut={() => supabase.auth.signOut()} />;
};

export default Administration;
