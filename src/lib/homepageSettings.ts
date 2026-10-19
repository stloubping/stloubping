import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const attendanceVisibilityKey = ["homepage-room-attendance-visibility"];

export const useAttendanceVisibility = () => useQuery({
  queryKey: attendanceVisibilityKey,
  queryFn: async (): Promise<boolean> => {
    const { data, error } = await supabase.from("homepage_settings")
      .select("room_attendance_visible").eq("id", true).single();
    if (error) throw error;
    return data.room_attendance_visible === true;
  },
  refetchInterval: 30_000,
});

export const saveAttendanceVisibility = async (visible: boolean): Promise<boolean> => {
  const { data, error } = await supabase.from("homepage_settings")
    .update({ room_attendance_visible: visible }).eq("id", true)
    .select("room_attendance_visible").single();
  if (error) throw error;
  return data.room_attendance_visible === true;
};
