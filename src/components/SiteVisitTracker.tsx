import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "stloubping-visit-session";
const recordedKey = (path: string) => `stloubping-visit-recorded:${path}`;

export default function SiteVisitTracker() {
  useEffect(() => {
    const path = window.location.pathname || "/";
    if (sessionStorage.getItem(recordedKey(path))) return;

    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }

    void supabase.from("site_visits").insert({ page_path: path, session_id: sessionId }).then(({ error }) => {
      if (!error) sessionStorage.setItem(recordedKey(path), "1");
    });
  }, []);

  return null;
}
