import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { stageDays, type StageDayCounts } from "@/lib/stageCapacity";

export const useStageDayCounts = (stageId: string | null | undefined) => useQuery({
  queryKey: ["stage-daily-counts", stageId],
  enabled: Boolean(stageId),
  refetchInterval: 30_000,
  queryFn: async (): Promise<StageDayCounts> => {
    const { data, error } = await supabase.from("stage_daily_counts")
      .select("monday,tuesday,wednesday,thursday,friday").eq("stage_id", stageId).single();
    if (error) throw error;
    return Object.fromEntries(stageDays.map(({ key }) => [key, Number(data[key])])) as StageDayCounts;
  },
});
