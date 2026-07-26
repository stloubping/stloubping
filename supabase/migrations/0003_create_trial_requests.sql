CREATE TABLE IF NOT EXISTS public.trial_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('trial', 'pre_registration')),
  first_name TEXT NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 80),
  age SMALLINT NOT NULL CHECK (age BETWEEN 6 AND 99),
  profile TEXT NOT NULL CHECK (
    profile IN ('enfant', 'adolescent', 'adulte-loisir', 'competiteur')
  ),
  level TEXT NOT NULL,
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 30),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  slot_id TEXT,
  slot_label TEXT,
  licence_type TEXT CHECK (licence_type IS NULL OR licence_type IN ('loisir', 'competition')),
  consent BOOLEAN NOT NULL CHECK (consent = TRUE),
  status TEXT NOT NULL DEFAULT 'received' CHECK (
    status IN ('received', 'confirmed', 'attended', 'cancelled', 'converted')
  )
);

ALTER TABLE public.trial_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public trial request submissions"
ON public.trial_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (consent = TRUE AND status = 'received');

GRANT INSERT ON TABLE public.trial_requests TO anon, authenticated;

COMMENT ON TABLE public.trial_requests IS
  'Demandes de séances d’essai et préinscriptions envoyées depuis le site public.';
