CREATE TABLE public.profile_measurements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile text NOT NULL UNIQUE,
  height_cm numeric,
  weight_kg numeric,
  chest_cm numeric,
  waist_cm numeric,
  hips_cm numeric,
  shoulder_cm numeric,
  inseam_cm numeric,
  preferred_fit text NOT NULL DEFAULT 'regular',
  comfort_needs text NOT NULL DEFAULT '',
  posture_notes text NOT NULL DEFAULT '',
  mobility_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_measurements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_measurements TO authenticated;
GRANT ALL ON public.profile_measurements TO service_role;

ALTER TABLE public.profile_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view measurements" ON public.profile_measurements FOR SELECT USING (true);
CREATE POLICY "Anyone can add measurements" ON public.profile_measurements FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update measurements" ON public.profile_measurements FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can remove measurements" ON public.profile_measurements FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profile_measurements_updated_at
BEFORE UPDATE ON public.profile_measurements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.wardrobe_items ADD COLUMN fit_note text NOT NULL DEFAULT '';

INSERT INTO public.profile_measurements
  (profile, height_cm, weight_kg, chest_cm, waist_cm, hips_cm, shoulder_cm, inseam_cm, preferred_fit, comfort_needs, posture_notes, mobility_notes)
VALUES
  ('usman', 178, 76, 100, 86, 98, 46, 80, 'regular', 'Prefers breathable cotton and linen; collars must not feel tight after a long day at the desk.', 'Shoulders roll forward from desk work — structured shoulders and a slightly longer back hem help him stand tall.', 'Mild lower-back stiffness in the mornings; avoids very stiff waistbands.'),
  ('wife', 165, 60, 92, 72, 98, 39, 74, 'fitted', 'Loves defined waistlines but needs sleeves she can move in all day.', 'Stands beautifully upright; open necklines and set-in sleeves keep that line.', 'Sensitive to wool directly on the skin — soft linings or cotton layers underneath.'),
  ('mother', 158, 68, 104, 94, 110, 41, 68, 'relaxed', 'Soft, easy fabrics with no scratchy seams; front-opening pieces are easiest to dress in.', 'A gentle forward curve at the upper back — higher backs and softly draped fronts sit most comfortably.', 'Knees ache on cold mornings; skirts and trousers that fall below the knee keep them warm.'),
  ('kids', 132, 29, 70, 62, 74, 32, 58, 'relaxed', 'Room to run and climb; elastic waists and easy-pull necklines they can manage alone.', 'Still growing — nothing that pinches the shoulders or restricts the arms.', 'Sensitive to tags and rough seams; flat seams and tagless labels are best.');