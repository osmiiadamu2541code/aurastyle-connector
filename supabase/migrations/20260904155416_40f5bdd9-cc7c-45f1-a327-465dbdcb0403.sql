CREATE POLICY "wardrobe photos readable" ON storage.objects FOR SELECT USING (bucket_id = 'wardrobe-photos');
CREATE POLICY "wardrobe photos insertable" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wardrobe-photos');
CREATE POLICY "wardrobe photos updatable" ON storage.objects FOR UPDATE USING (bucket_id = 'wardrobe-photos');
CREATE POLICY "wardrobe photos deletable" ON storage.objects FOR DELETE USING (bucket_id = 'wardrobe-photos');