
DROP FUNCTION IF EXISTS public.seed_family_data();
CREATE OR REPLACE FUNCTION public.seed_family_data(_uid uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _uid IS NULL THEN RETURN; END IF;
  IF NOT EXISTS (SELECT 1 FROM wardrobe_items WHERE user_id = _uid) THEN
    INSERT INTO wardrobe_items (profile, name, name_am, name_om, icon, color, season, occasion, fabric_care, fit_note, image_url, user_id)
    SELECT profile, name, name_am, name_om, icon, color, season, occasion, fabric_care, fit_note, '', _uid FROM wardrobe_items WHERE user_id IS NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM profile_measurements WHERE user_id = _uid) THEN
    INSERT INTO profile_measurements (profile, height_cm, weight_kg, chest_cm, waist_cm, hips_cm, shoulder_cm, inseam_cm, preferred_fit, comfort_needs, posture_notes, mobility_notes, target_weight_kg, avatar_url, user_id)
    SELECT profile, height_cm, weight_kg, chest_cm, waist_cm, hips_cm, shoulder_cm, inseam_cm, preferred_fit, comfort_needs, posture_notes, mobility_notes, target_weight_kg, '', _uid FROM profile_measurements WHERE user_id IS NULL;
  END IF;
END; $$;
REVOKE EXECUTE ON FUNCTION public.seed_family_data(uuid) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.seed_family_data(uuid) TO service_role;
