import { useCallback, useEffect, useState } from "react";
import { Check, Clock3, KeyRound, Loader2, LockKeyhole, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentWeekLabel, getRoomAttendanceWeekDays } from "@/lib/weekAttendance";

type AttendanceDay = { is_open: boolean; player_count: number; key_holder_count: number };
const TOKEN_KEY = "stloubping-room-visitor-token";
const DAYS_KEY = "stloubping-room-attendance";
const KEY_DAYS_KEY = "stloubping-room-key-days";

const visitorToken = () => {
  const saved = localStorage.getItem(TOKEN_KEY);
  if (saved) return saved;
  const token = crypto.randomUUID();
  localStorage.setItem(TOKEN_KEY, token);
  return token;
};

const savedSet = (key: string) => {
  try { return new Set<string>(JSON.parse(localStorage.getItem(key) || "[]")); }
  catch { return new Set<string>(); }
};

const persistSet = (key: string, value: Set<string>) => localStorage.setItem(key, JSON.stringify([...value]));

const WeeklyRoomAttendance = () => {
  const [week, setWeek] = useState(getRoomAttendanceWeekDays);
  const [days, setDays] = useState<Record<string, AttendanceDay>>({});
  const [registered, setRegistered] = useState<Set<string>>(() => savedSet(DAYS_KEY));
  const [keyDays, setKeyDays] = useState<Set<string>>(() => savedSet(KEY_DAYS_KEY));
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
    const refreshTimer = window.setInterval(refresh, 30_000);
    const weekTimer = window.setInterval(() => {
      const nextWeek = getRoomAttendanceWeekDays();
      setWeek((current) => current[0].dateKey === nextWeek[0].dateKey ? current : nextWeek);
    }, 60_000);
    return () => { window.clearInterval(refreshTimer); window.clearInterval(weekTimer); };
  }, [refresh]);

  const saveChoice = async (date: string, attending: boolean, hasKeys: boolean) => {
    if (attending && days[date]?.is_open === false) return;
    setSubmitting(date);
    const { error } = await supabase.rpc("set_weekly_room_attendance", {
      p_attendance_date: date,
      p_visitor_token: visitorToken(),
      p_attending: attending,
      p_has_keys: attending && hasKeys,
    });

    if (!error) {
      const nextRegistered = new Set(registered);
      const nextKeyDays = new Set(keyDays);
      if (attending) nextRegistered.add(date); else nextRegistered.delete(date);
      if (attending && hasKeys) nextKeyDays.add(date); else nextKeyDays.delete(date);
      setRegistered(nextRegistered);
      setKeyDays(nextKeyDays);
      persistSet(DAYS_KEY, nextRegistered);
      persistSet(KEY_DAYS_KEY, nextKeyDays);
      await refresh();
      toast.success(attending ? "Votre choix est enregistr\u00e9." : "Votre venue est annul\u00e9e.");
    } else toast.error("Impossible d'enregistrer votre choix pour le moment.");
    setSubmitting(null);
  };

  return <section className="mb-12" aria-labelledby="room-attendance-title">
    <div className="mb-6 text-center">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-clubPrimary">Cette semaine</p>
      <h2 id="room-attendance-title" className="text-2xl font-bold text-clubDark md:text-3xl">Qui vient &agrave; la salle ?</h2>
      <p className="mt-2 text-sm text-muted-foreground">{getCurrentWeekLabel(week)} &middot; Un clic suffit, sans nom ni inscription.</p>
    </div>
    <Card className="border-0 shadow-lg"><CardContent className="p-3 md:p-5">
      <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">{week.map((day) => {
        const value = days[day.dateKey] || { is_open: true, player_count: 0, key_holder_count: 0 };
        const attending = registered.has(day.dateKey);
        const hasKeys = keyDays.has(day.dateKey);
        const busy = submitting === day.dateKey;
        return <article key={day.dateKey} className={`rounded-xl border p-3 text-center ${value.is_open ? "border-clubPrimary/25 bg-clubPrimary/5" : "bg-muted/40"}`}>
          <p className="font-bold text-clubDark">{day.label}</p><p className="text-xs text-muted-foreground">{day.shortDate}</p>
          <p className="mb-3 mt-1 flex items-center justify-center gap-1 text-xs font-bold text-clubPrimary"><Clock3 className="h-3.5 w-3.5" />{day.timeLabel}</p>
          <div className="flex items-center justify-center gap-1.5 font-bold"><Users className="h-4 w-4 text-clubPrimary" />{loading ? "-" : value.player_count}</div>
          <p className="mb-3 mt-1 text-[11px] text-muted-foreground"><KeyRound className="mr-1 inline h-3 w-3" />{value.key_holder_count} avec les cl&eacute;s</p>
          <Button size="sm" className="min-h-9 h-auto w-full whitespace-normal px-2 text-xs" variant={attending ? "outline" : "default"} disabled={loading || busy || (!value.is_open && !attending)} onClick={() => void saveChoice(day.dateKey, !attending, false)}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : attending ? <><X className="mr-1 h-4 w-4" />Annuler ma venue</> : value.is_open ? <><Check className="mr-1 h-4 w-4" />Je viens</> : <><LockKeyhole className="mr-1 h-3.5 w-3.5" />Ferm&eacute;</>}
          </Button>
          <Button size="sm" className={`mt-2 min-h-9 h-auto w-full whitespace-normal px-2 text-xs ${hasKeys ? "border-amber-500 bg-amber-50 text-amber-800 hover:bg-amber-100" : ""}`} variant="outline" disabled={loading || busy || !value.is_open} onClick={() => void saveChoice(day.dateKey, true, !hasKeys)}>
            <KeyRound className="mr-1 h-3.5 w-3.5 shrink-0" />{hasKeys ? "Je n'ai plus les cl\u00e9s" : "J'ai les cl\u00e9s"}
          </Button>
        </article>;
      })}</div>
    </CardContent></Card>
  </section>;
};

export default WeeklyRoomAttendance;