import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, KeyRound, Loader2, LockKeyhole, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentWeekDays, getCurrentWeekLabel } from "@/lib/weekAttendance";

type AttendanceDay = { is_open: boolean; player_count: number; key_holder_count: number };
const TOKEN_KEY = "stloubping-room-visitor-token";
const DAYS_KEY = "stloubping-room-attendance";

const visitorToken = () => {
  const saved = localStorage.getItem(TOKEN_KEY);
  if (saved) return saved;
  const token = crypto.randomUUID();
  localStorage.setItem(TOKEN_KEY, token);
  return token;
};

const savedDays = () => {
  try { return new Set<string>(JSON.parse(localStorage.getItem(DAYS_KEY) || "[]")); }
  catch { return new Set<string>(); }
};

const WeeklyRoomAttendance = () => {
  const week = useMemo(() => getCurrentWeekDays(), []);
  const [days, setDays] = useState<Record<string, AttendanceDay>>({});
  const [registered, setRegistered] = useState<Set<string>>(savedDays);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data } = await supabase.from("weekly_room_attendance_counts")
      .select("attendance_date,is_open,player_count,key_holder_count")
      .gte("attendance_date", week[0].dateKey).lte("attendance_date", week[6].dateKey);
    if (data) setDays(Object.fromEntries(data.map((day) => [day.attendance_date, {
      is_open: Boolean(day.is_open), player_count: Number(day.player_count) || 0, key_holder_count: Number(day.key_holder_count) || 0,
    }])));
    setLoading(false);
  }, [week]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const attend = async (date: string, hasKeys: boolean) => {
    if (!days[date]?.is_open || registered.has(date)) return;
    setSubmitting(date);
    const { error } = await supabase.from("weekly_room_attendance").insert({ attendance_date: date, visitor_token: visitorToken(), has_keys: hasKeys });
    if (!error || error.code === "23505") {
      const next = new Set(registered).add(date);
      setRegistered(next);
      localStorage.setItem(DAYS_KEY, JSON.stringify([...next]));
      await refresh();
      toast.success("Votre venue est comptabilisée.");
    } else toast.error("Impossible d’enregistrer votre venue pour le moment.");
    setSubmitting(null);
  };

  return <section className="mb-12" aria-labelledby="room-attendance-title">
    <div className="mb-6 text-center">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-clubPrimary">Cette semaine</p>
      <h2 id="room-attendance-title" className="text-2xl font-bold text-clubDark md:text-3xl">Qui vient à la salle ?</h2>
      <p className="mt-2 text-sm text-muted-foreground">{getCurrentWeekLabel()} · Un clic suffit, sans nom ni inscription.</p>
    </div>
    <Card className="border-0 shadow-lg"><CardContent className="p-3 md:p-5">
      <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">{week.map((day) => {
        const value = days[day.dateKey] || { is_open: false, player_count: 0, key_holder_count: 0 };
        const done = registered.has(day.dateKey);
        return <article key={day.dateKey} className={`rounded-xl border p-3 text-center ${value.is_open ? "border-clubPrimary/25 bg-clubPrimary/5" : "bg-muted/40"}`}>
          <p className="font-bold text-clubDark">{day.label}</p><p className="mb-3 text-xs text-muted-foreground">{day.shortDate}</p>
          <div className="mb-3 flex items-center justify-center gap-1.5 font-bold"><Users className="h-4 w-4 text-clubPrimary" />{loading ? "–" : value.player_count}</div>
          <p className="mb-3 mt-1 text-[11px] text-muted-foreground"><KeyRound className="mr-1 inline h-3 w-3" />{value.key_holder_count} avec les cl&eacute;s</p>
          <Button size="sm" className="min-h-9 h-auto w-full whitespace-normal px-2 text-xs" variant={done ? "outline" : "default"} disabled={loading || done || !value.is_open || submitting === day.dateKey} onClick={() => void attend(day.dateKey, false)}>
            {submitting === day.dateKey ? <Loader2 className="h-4 w-4 animate-spin" /> : done ? <><Check className="mr-1 h-4 w-4" />Je viens</> : value.is_open ? "Je viens" : <><LockKeyhole className="mr-1 h-3.5 w-3.5" />Fermé</>}
          </Button>
          {value.is_open && !done && <Button size="sm" className="mt-2 min-h-9 h-auto w-full whitespace-normal px-2 text-xs" variant="outline" disabled={loading || submitting === day.dateKey} onClick={() => void attend(day.dateKey, true)}><KeyRound className="mr-1 h-3.5 w-3.5 shrink-0" />J&apos;ai les cl&eacute;s</Button>}
        </article>;
      })}</div>
    </CardContent></Card>
  </section>;
};

export default WeeklyRoomAttendance;
