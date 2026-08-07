import { type FormEvent, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import TeamOneSpace from "@/components/team/TeamOneSpace";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type TeamProfile = {
  display_name: string;
};

export default function TeamOne() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<TeamProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("stloubping@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user.id) {
      setProfile(null);
      setCheckingAccess(false);
      return;
    }

    const checkTeamAccess = async () => {
      setCheckingAccess(true);
      const { data, error } = await supabase
        .from("team_memberships")
        .select("display_name")
        .eq("user_id", session.user.id)
        .eq("team_key", "equipe-1")
        .maybeSingle();

      if (error) {
        console.error(error);
        toast.error("Impossible de vérifier l’accès à l’Équipe 1.");
      }

      setProfile(data ?? null);
      setCheckingAccess(false);
    };

    void checkTeamAccess();
  }, [session?.user.id]);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error(error);
      toast.error("Adresse e-mail ou mot de passe incorrect.");
    }

    setSubmitting(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setPassword("");
  };

  if (loading || checkingAccess) {
    return <div className="flex min-h-[65vh] items-center justify-center bg-clubLight"><Loader2 className="h-9 w-9 animate-spin text-clubPrimary" /></div>;
  }

  if (session && profile) {
    return <TeamOneSpace displayName={profile.display_name} email={session.user.email ?? ""} onSignOut={() => void signOut()} />;
  }

  return (
    <section className="min-h-[75vh] bg-clubLight px-4 py-16">
      <Card className="mx-auto max-w-lg overflow-hidden border-0 shadow-xl">
        <CardHeader className="space-y-4 bg-clubDark text-center text-white">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clubPrimary/20"><ShieldCheck className="h-7 w-7 text-clubPrimary" /></div>
          <CardTitle className="text-3xl">Espace Équipe 1</CardTitle>
          <p className="text-sm text-white/70">Profil privé réservé aux responsables autorisés de l’Équipe 1.</p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {session && !profile ? (
            <div className="space-y-5 text-center">
              <p className="rounded-xl bg-amber-50 p-4 text-sm font-medium text-amber-900">Le compte <strong>{session.user.email}</strong> n’est pas associé à l’Équipe 1.</p>
              <Button type="button" onClick={() => void signOut()} className="w-full bg-clubPrimary py-6 font-bold">Utiliser un autre compte</Button>
            </div>
          ) : (
            <form onSubmit={signIn} className="space-y-5">
              <div>
                <label htmlFor="team-one-email" className="mb-2 block text-sm font-bold">Adresse e-mail</label>
                <Input id="team-one-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              </div>
              <div>
                <label htmlFor="team-one-password" className="mb-2 block text-sm font-bold">Mot de passe</label>
                <div className="relative">
                  <Input id="team-one-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="pr-11" required />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-clubDark" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-clubPrimary py-6 text-base font-bold">
                {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <KeyRound className="mr-2 h-5 w-5" />}
                Se connecter à l’Équipe 1
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
