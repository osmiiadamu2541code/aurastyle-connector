
-- Ownership columns
ALTER TABLE public.wardrobe_items ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE public.profile_measurements ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE public.profile_measurements DROP CONSTRAINT IF EXISTS profile_measurements_profile_key;
ALTER TABLE public.profile_measurements ADD CONSTRAINT profile_measurements_user_profile_key UNIQUE (user_id, profile);
ALTER TABLE public.profile_measurements ADD COLUMN IF NOT EXISTS target_weight_kg numeric;
ALTER TABLE public.profile_measurements ADD COLUMN IF NOT EXISTS face_shape text NOT NULL DEFAULT '';
ALTER TABLE public.profile_measurements ADD COLUMN IF NOT EXISTS hair_type text NOT NULL DEFAULT '';
UPDATE public.profile_measurements SET target_weight_kg = 60 WHERE profile = 'usman' AND user_id IS NULL;

-- Replace open policies
DROP POLICY IF EXISTS "Anyone can view wardrobe items" ON public.wardrobe_items;
DROP POLICY IF EXISTS "Anyone can add wardrobe items" ON public.wardrobe_items;
DROP POLICY IF EXISTS "Anyone can update wardrobe items" ON public.wardrobe_items;
DROP POLICY IF EXISTS "Anyone can remove wardrobe items" ON public.wardrobe_items;
DROP POLICY IF EXISTS "Anyone can view measurements" ON public.profile_measurements;
DROP POLICY IF EXISTS "Anyone can add measurements" ON public.profile_measurements;
DROP POLICY IF EXISTS "Anyone can update measurements" ON public.profile_measurements;
DROP POLICY IF EXISTS "Anyone can remove measurements" ON public.profile_measurements;
REVOKE ALL ON public.wardrobe_items FROM anon;
REVOKE ALL ON public.profile_measurements FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wardrobe_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_measurements TO authenticated;
GRANT ALL ON public.wardrobe_items TO service_role;
GRANT ALL ON public.profile_measurements TO service_role;
CREATE POLICY "Family manages own wardrobe" ON public.wardrobe_items FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Family manages own measurements" ON public.profile_measurements FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Seed a new family account from the template rows (user_id IS NULL)
CREATE OR REPLACE FUNCTION public.seed_family_data()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN; END IF;
  IF NOT EXISTS (SELECT 1 FROM wardrobe_items WHERE user_id = uid) THEN
    INSERT INTO wardrobe_items (profile, name, name_am, name_om, icon, color, season, occasion, fabric_care, fit_note, image_url, user_id)
    SELECT profile, name, name_am, name_om, icon, color, season, occasion, fabric_care, fit_note, '', uid FROM wardrobe_items WHERE user_id IS NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM profile_measurements WHERE user_id = uid) THEN
    INSERT INTO profile_measurements (profile, height_cm, weight_kg, chest_cm, waist_cm, hips_cm, shoulder_cm, inseam_cm, preferred_fit, comfort_needs, posture_notes, mobility_notes, target_weight_kg, avatar_url, user_id)
    SELECT profile, height_cm, weight_kg, chest_cm, waist_cm, hips_cm, shoulder_cm, inseam_cm, preferred_fit, comfort_needs, posture_notes, mobility_notes, target_weight_kg, '', uid FROM profile_measurements WHERE user_id IS NULL;
  END IF;
END; $$;
REVOKE EXECUTE ON FUNCTION public.seed_family_data() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.seed_family_data() TO authenticated;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Events
CREATE TABLE public.family_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  profile text NOT NULL,
  title text NOT NULL,
  event_type text NOT NULL DEFAULT 'celebration',
  event_date date NOT NULL,
  notes text NOT NULL DEFAULT '',
  suggestions jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_events TO authenticated;
GRANT ALL ON public.family_events TO service_role;
ALTER TABLE public.family_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family manages own events" ON public.family_events FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER family_events_updated BEFORE UPDATE ON public.family_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Aura chat
CREATE TABLE public.aura_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  profile text NOT NULL,
  message_id text NOT NULL,
  role text NOT NULL,
  parts jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, profile, message_id)
);
CREATE INDEX aura_messages_lookup ON public.aura_messages (user_id, profile, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aura_messages TO authenticated;
GRANT ALL ON public.aura_messages TO service_role;
ALTER TABLE public.aura_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family manages own messages" ON public.aura_messages FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.aura_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  profile text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aura_memories TO authenticated;
GRANT ALL ON public.aura_memories TO service_role;
ALTER TABLE public.aura_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family manages own memories" ON public.aura_memories FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.aura_guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  profile text NOT NULL,
  guideline text NOT NULL,
  reason text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aura_guidelines TO authenticated;
GRANT ALL ON public.aura_guidelines TO service_role;
ALTER TABLE public.aura_guidelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family manages own guidelines" ON public.aura_guidelines FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- AI images
CREATE TABLE public.generated_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  profile text NOT NULL,
  kind text NOT NULL,
  view text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_images TO authenticated;
GRANT ALL ON public.generated_images TO service_role;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family manages own images" ON public.generated_images FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Storage: private per family account (first folder = account id)
DROP POLICY IF EXISTS "wardrobe photos readable" ON storage.objects;
DROP POLICY IF EXISTS "wardrobe photos insertable" ON storage.objects;
DROP POLICY IF EXISTS "wardrobe photos updatable" ON storage.objects;
DROP POLICY IF EXISTS "wardrobe photos deletable" ON storage.objects;
DROP POLICY IF EXISTS "wardrobe photos select" ON storage.objects;
DROP POLICY IF EXISTS "wardrobe photos insert" ON storage.objects;
DROP POLICY IF EXISTS "wardrobe photos update" ON storage.objects;
DROP POLICY IF EXISTS "wardrobe photos delete" ON storage.objects;
DROP POLICY IF EXISTS "profile avatars select" ON storage.objects;
DROP POLICY IF EXISTS "profile avatars insert" ON storage.objects;
DROP POLICY IF EXISTS "profile avatars update" ON storage.objects;
DROP POLICY IF EXISTS "profile avatars delete" ON storage.objects;
CREATE POLICY "family photos select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('wardrobe-photos','profile-avatars','ai-images') AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "family photos insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('wardrobe-photos','profile-avatars','ai-images') AND (storage.foldername(name))[1] = auth.uid()::text AND (storage.foldername(name))[2] IN ('usman','wife','mother','kids'));
CREATE POLICY "family photos update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('wardrobe-photos','profile-avatars','ai-images') AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "family photos delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('wardrobe-photos','profile-avatars','ai-images') AND (storage.foldername(name))[1] = auth.uid()::text);
