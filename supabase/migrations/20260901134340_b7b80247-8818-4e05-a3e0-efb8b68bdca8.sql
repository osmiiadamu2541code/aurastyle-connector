CREATE TABLE public.wardrobe_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile TEXT NOT NULL,
  name TEXT NOT NULL,
  name_am TEXT,
  name_om TEXT,
  icon TEXT NOT NULL DEFAULT '👕',
  color TEXT NOT NULL DEFAULT 'sand',
  season TEXT NOT NULL DEFAULT 'allseason',
  occasion TEXT NOT NULL DEFAULT 'casual',
  fabric_care TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wardrobe_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wardrobe_items TO authenticated;
GRANT ALL ON public.wardrobe_items TO service_role;

ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view wardrobe items" ON public.wardrobe_items FOR SELECT USING (true);
CREATE POLICY "Anyone can add wardrobe items" ON public.wardrobe_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update wardrobe items" ON public.wardrobe_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can remove wardrobe items" ON public.wardrobe_items FOR DELETE USING (true);

INSERT INTO public.wardrobe_items (profile, name, name_am, name_om, icon, color, season, occasion, fabric_care) VALUES
('usman','Linen Cream Shirt','የበፍታ ክሬም ሸሚዝ','Shamiizii liinan kiriimii','👔','sand','summer','work','Cold machine wash, hang dry in shade, iron on medium while slightly damp.'),
('usman','Navy Wool Blazer','ሰማያዊ የሱፍ ጃኬት','Jaakkeetii suufii cuquliisa','🧥','dusk','winter','formal','Dry clean only. Brush after each wear, store on a wide hanger.'),
('usman','Charcoal Chinos','የከሰል ቀለም ሱሪ','Kofoo daaraa','👖','stone','allseason','work','Machine wash cold inside out, tumble dry low, iron medium heat.'),
('usman','White Cotton Tee','ነጭ የጥጥ ቲሸርት','Tiishartii jirbii adii','👕','cream','summer','casual','Wash warm with whites, avoid bleach, tumble dry low.'),
('usman','Rain Shell Jacket','የዝናብ ጃኬት','Jaakkeetii bokkaa','🧥','sky','rainy','casual','Rinse off mud, machine wash cold with tech detergent, never iron.'),
('usman','Brown Leather Loafers','ቡናማ የቆዳ ጫማ','Kophee gogaa magaala','👞','clay','allseason','work','Wipe with damp cloth, polish monthly, use cedar shoe trees.'),
('usman','Grey Knit Sweater','ግራጫ የሱፍ ሹራብ','Sweetarii huccuu bifa daaraa','🧶','stone','winter','casual','Hand wash cool, never wring, dry flat to keep the shape.'),
('usman','Black Formal Suit','ጥቁር መደበኛ ልብስ','Suudii gurraacha','🤵','dusk','allseason','event','Dry clean twice a year, steam between wears, keep in a garment bag.'),
('usman','Woven Summer Cap','የበጋ ኮፍያ','Kofiyaa bonaa','🧢','honey','summer','casual','Spot clean with mild soap, air dry away from sunlight.'),
('wife','Coral Chiffon Blouse','ኮራል ሺፎን ሸሚዝ','Shamiizii shiifoonii koraalii','👚','coral','summer','work','Hand wash cold, no wringing, iron on low with a cloth between.'),
('wife','Habesha Kemis','የሀበሻ ቀሚስ','Uffata Habashaa','👗','cream','allseason','event','Hand wash gently, dry in shade, iron the tibeb border on low heat.'),
('wife','High-Waist Denim','ወገብ ላይ ጂንስ','Deenimii mudhii ol''aanaa','👖','sky','allseason','casual','Wash inside out every 4-5 wears, cold water, hang dry.'),
('wife','Camel Wool Coat','የግመል ቀለም ኮት','Kootii suufii gaalaa','🧥','honey','winter','formal','Dry clean only, brush weekly, store folded with cedar.'),
('wife','Silk Scarf','የሐር ሻርፕ','Sharaafii hariirii','🧣','coral','allseason','formal','Hand wash in cool water with mild shampoo, roll in towel, air dry.'),
('wife','Rain Trench Coat','የዝናብ ካፖርት','Kootii bokkaa','🧥','stone','rainy','work','Machine wash cold, reproof yearly, hang dry fully before storing.'),
('wife','Nude Block Heels','ናዉድ ተረከዝ ጫማ','Kophee kophaa dhiigaa','👠','sand','allseason','event','Wipe with soft cloth, avoid rain, store in a dust bag.'),
('wife','Linen Summer Dress','የበፍታ የበጋ ቀሚስ','Uffata liinan bonaa','👗','honey','summer','casual','Machine wash cold on gentle, line dry, iron while damp.'),
('wife','Knit Cardigan','የሹራብ ካርዲጋን','Kaardigaanii huccuu','🧶','clay','winter','casual','Hand wash cool, dry flat, de-pill gently with a fabric comb.'),
('mother','Warm Netela Shawl','ሞቅ ያለ ነጠላ','Netelaa ho''aa','🧣','cream','winter','event','Hand wash cold separately, dry flat in shade, iron low on the border.'),
('mother','Quilted House Robe','የቤት ልብስ','Uffata mana ho''aa','🥼','clay','winter','casual','Machine wash warm, tumble dry low, shake out to keep the loft.'),
('mother','Long Cotton Skirt','ረጅም የጥጥ ቀሚስ','Wandaboo jirbii dheeraa','👗','sand','summer','casual','Wash cold, hang dry, iron medium for a crisp pleat.'),
('mother','Soft Orthopedic Shoes','ምቹ ጫማ','Kophee mijataa','👟','stone','allseason','casual','Wipe with damp cloth weekly, remove insoles to air out.'),
('mother','Woollen Prayer Shawl','የጸሎት ሻሽ','Sharaafii kadhannaa suufii','🧣','honey','winter','event','Hand wash cool with wool soap, dry flat, never tumble dry.'),
('mother','Padded Rain Jacket','የዝናብ ጃኬት','Jaakkeetii bokkaa qal''aa','🧥','sky','rainy','casual','Machine wash cold, low tumble to refresh the padding.'),
('mother','Embroidered Blouse','ጥልፍ ያለው ሸሚዝ','Shamiizii faayaa','👚','coral','allseason','formal','Hand wash inside out, iron on the reverse over a towel.'),
('mother','Wide Sun Hat','የፀሐይ ኮፍያ','Kofiyaa aduu','👒','honey','summer','casual','Spot clean only, keep the brim shaped, store upside down.'),
('mother','Cashmere Cardigan','የካሽሚር ካርዲጋን','Kaardigaanii kaashmirii','🧶','dusk','winter','formal','Hand wash cool, press water out with a towel, dry flat.'),
('kids','Rainbow Raincoat','ቀስተ ደመና የዝናብ ልብስ','Uffata bokkaa sabbata waaqaa','🧥','coral','rainy','casual','Rinse after muddy play, machine wash cold, never tumble dry.'),
('kids','School Uniform Set','የትምህርት ቤት ልብስ','Uffata mana barumsaa','👕','sky','allseason','work','Wash warm, treat stains right away, iron medium heat.'),
('kids','Cotton Play Shorts','የጥጥ ቁምጣ','Kofoo gabaabaa jirbii','🩳','honey','summer','casual','Machine wash warm, tumble dry low, no fabric softener.'),
('kids','Fleece Hoodie','ፍሊስ ሁዲ','Huudii fleesii','🧥','stone','winter','casual','Wash cold inside out, tumble low, avoid high heat.'),
('kids','Velcro Sneakers','ቬልክሮ ስኒከር','Kophee veelkiroo','👟','clay','allseason','casual','Remove laces, hand wash with brush, air dry away from heat.'),
('kids','Holiday Party Dress','የበዓል ቀሚስ','Uffata ayyaanaa','👗','coral','allseason','event','Hand wash cold, hang dry, steam gently instead of ironing.'),
('kids','Warm Woollen Mittens','ሞቅ ያሉ ጓንቶች','Golboo suufii ho''aa','🧤','dusk','winter','casual','Hand wash cool, reshape while damp, dry flat.'),
('kids','Sun Protection Tee','የፀሐይ መከላከያ ቲሸርት','Tiishartii aduu ittisu','👕','cream','summer','casual','Wash cold, line dry, skip softener to keep UV protection.'),
('kids','Little Formal Shirt','አነስተኛ መደበኛ ሸሚዝ','Shamiizii xiqqaa sirrii','👔','sand','allseason','formal','Wash warm, hang immediately, iron collar and cuffs first.');