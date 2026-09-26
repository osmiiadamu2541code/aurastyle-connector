ALTER TABLE public.profile_measurements ADD COLUMN IF NOT EXISTS avatar_url text NOT NULL DEFAULT '';

DROP POLICY IF EXISTS "wardrobe photos select" ON storage.objects;
DROP POLICY IF EXISTS "wardrobe photos insert" ON storage.objects;
DROP POLICY IF EXISTS "wardrobe photos update" ON storage.objects;
DROP POLICY IF EXISTS "wardrobe photos delete" ON storage.objects;

CREATE POLICY "wardrobe photos select" ON storage.objects FOR SELECT
  USING (bucket_id = 'wardrobe-photos' AND (storage.foldername(name))[1] IN ('usman','wife','mother','kids'));
CREATE POLICY "wardrobe photos insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wardrobe-photos' AND (storage.foldername(name))[1] IN ('usman','wife','mother','kids'));
CREATE POLICY "wardrobe photos update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'wardrobe-photos' AND (storage.foldername(name))[1] IN ('usman','wife','mother','kids'));
CREATE POLICY "wardrobe photos delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'wardrobe-photos' AND (storage.foldername(name))[1] IN ('usman','wife','mother','kids'));

CREATE POLICY "profile avatars select" ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-avatars');
CREATE POLICY "profile avatars insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-avatars' AND (storage.foldername(name))[1] IN ('usman','wife','mother','kids'));
CREATE POLICY "profile avatars update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-avatars' AND (storage.foldername(name))[1] IN ('usman','wife','mother','kids'));
CREATE POLICY "profile avatars delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'profile-avatars' AND (storage.foldername(name))[1] IN ('usman','wife','mother','kids'));