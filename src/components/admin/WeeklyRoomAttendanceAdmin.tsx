import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CalendarCheck, Loader2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentWeekLabel, getRoomAttendanceWeekDays } from "@/lib/weekAttendance";

type AttendanceDay = { is_open: boolean; player_count: number; key_holder_count: number };

const WeeklyRoomAttendanceAdmin = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [week, setWeek] = useState(() => getRoomAttendanceWeekDays(0));
  const [days, setDays] = useState<Record<string, AttendanceDay>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from("weekly_room_attendance_counts")
      .select("attendance_date,is_open,player_count,key_holder_count")
      .gte("attendance_date", week[0].dateKey).lte("attendance_date", week[6].dateKey);
    if (error) toast.error("Impossible de charger les ouvertures.");
    if (data) setDays(Object.fromEntries(data.map((day) => [day.attendance_date, {
      is_open: Boolean(day.is_open), player_count: Number(day.player_count) || 0, key_holder_count: Number(day.key_holder_count) || 0,
    }])));
    setLoading(false);
  }, [week]);

  useEffect(() => { void refresh(); }, [refresh]);

  const toggleDisplayedWeek = () => {
    const nextOffset = weekOffset === 0 ? 1 : 0;
    setWeekOffset(nextOffset);
    setWeek(getRoomAttendanceWeekDays(nextOffset));
    setLoading(true);
  };

  const save = async (dates: string[], isOpen: boolean) => {
    setSaving(dates.length === 1 ? dates[0] : "all");
    const { error } = await supabase.from("weekly_room_days").upsert(
      dates.map((attendance_date) => ({ attendance_date, is_open: isOpen, updated_at: new Date().toISOString() })),
      { onConflict: "attendance_date" },
    );
    if (error) toast.error("La modification n’a pas pu être enregistrée.");
    else { await refresh(); toast.success(isOpen ? "Salle ouverte." : "Salle fermée."); }
    setSaving(null);
  };

  return <section className="min-h-[70vh] bg-clubLight px-4 py-10"><div className="mx-auto max-w-5xl">
    <Button asChild variant="ghost" className="mb-4"><Link to="/administration"><ArrowLeft className="mr-2 h-4 w-4" />Retour au tableau de bord</Link></Button>
    <Card className="overflow-hidden border-0 shadow-xl">
      <CardHeader className="bg-clubDark text-white"><div className="flex items-center justify-between gap-4"><div>
        <p className="mb-1 text-sm font-bold uppercase tracking-widest text-clubPrimary">Présences à la salle</p>
        <CardTitle className="text-2xl">Ouvertures de la semaine</CardTitle><p className="mt-1 text-sm text-white/65">{getCurrentWeekLabel(week)}</p>
      </div><CalendarCheck className="h-9 w-9 text-clubPrimary" /></div></CardHeader>
      <CardContent className="space-y-5 p-4 md:p-6">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" disabled={saving !== null} onClick={toggleDisplayedWeek}>{weekOffset === 0 ? "Voir la semaine suivante" : "Revenir à la semaine en cours"}</Button>
          <Button disabled={saving !== null} onClick={() => void save(week.map((day) => day.dateKey), true)}>Ouvrir toute la semaine</Button>
          <Button disabled={saving !== null} variant="outline" onClick={() => void save(week.map((day) => day.dateKey), false)}>Fermer toute la semaine</Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">{week.map((day) => {
          const value = days[day.dateKey] || { is_open: false, player_count: 0, key_holder_count: 0 };
          const busy = saving === day.dateKey || saving === "all";
          return <div key={day.dateKey} className="flex items-center justify-between rounded-xl border bg-white p-4">
            <div><p className="font-bold text-clubDark">{day.label} <span className="font-normal text-muted-foreground">{day.shortDate} &middot; {day.timeLabel}</span></p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-4 w-4" />{value.player_count} joueur{value.player_count > 1 ? "s" : ""} &middot; {value.key_holder_count} avec les cl&eacute;s</p></div>
            <div className="flex items-center gap-3"><span className={`text-sm font-semibold ${value.is_open ? "text-emerald-600" : "text-muted-foreground"}`}>{value.is_open ? "Ouvert" : "Fermé"}</span>
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Switch checked={value.is_open} disabled={loading || saving !== null} onCheckedChange={(checked) => void save([day.dateKey], checked)} aria-label={`${value.is_open ? "Fermer" : "Ouvrir"} le ${day.label}`} />}</div>
          </div>;
        })}</div>
      </CardContent>
    </Card>
  </div></section>;
};

export default WeeklyRoomAttendanceAdmin;
