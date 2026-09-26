export const FACE_SHAPES = ["round", "oval", "square", "heart"] as const;
export const FABRICS = ["chiffon", "jersey", "satin", "cotton"] as const;
export type FaceShape = (typeof FACE_SHAPES)[number];
export type Fabric = (typeof FABRICS)[number];

export const FACE_LABEL: Record<FaceShape, string> = {
  round: "Round",
  oval: "Oval",
  square: "Square",
  heart: "Heart",
};

export const FACE_TIPS: Record<FaceShape, string> = {
  round: "Add height at the crown and let fabric fall in a gentle V below the chin to lengthen the face.",
  oval: "Almost every style suits you. Try loose side drapes or a simple wrap that shows your balanced features.",
  square: "Soften the jaw with loose folds at the sides and a rounded frame around the forehead.",
  heart: "Keep the top smooth and add volume around the chin and neck to balance a wider forehead.",
};

export const FABRIC_TIPS: Record<Fabric, string> = {
  chiffon: "Light and airy for warm days and events. Use an under-cap so it doesn't slip, and pin gently.",
  jersey: "Stretchy and grippy, so it needs few pins. Best for school runs, work and long days.",
  satin: "Shiny and elegant for weddings and holidays. Pair with a non-slip cap and use magnets or pins.",
  cotton: "Breathable for hot, dry days and everyday wear. Wash cool and iron on medium.",
};

export type HijabVideo = { id: string; title: string; faces: (FaceShape | "all")[]; fabrics: (Fabric | "any")[] };

export const HIJAB_VIDEOS: HijabVideo[] = [
  { id: "zH9cArKUe1E", title: "Best hijab styles for round faces", faces: ["round"], fabrics: ["any"] },
  { id: "LxkrqEhA9BM", title: "Styling a hijab for a round face", faces: ["round"], fabrics: ["any"] },
  { id: "8T1iTnuQHuU", title: "Hijab tutorial for fuller faces", faces: ["round"], fabrics: ["any"] },
  { id: "pCsnPEBHsow", title: "Hijab styles for oval faces", faces: ["oval"], fabrics: ["any"] },
  { id: "7EXnMJ6YJyc", title: "Two ways to frame your face", faces: ["oval", "heart"], fabrics: ["any"] },
  { id: "R2i1vbwfD5w", title: "Hijab tutorial for square face shapes", faces: ["square"], fabrics: ["any"] },
  { id: "3YaC2iuf5AY", title: "Which hijab style suits a square face", faces: ["square"], fabrics: ["any"] },
  { id: "ie9n1fxaV7c", title: "Hijab tutorial for a heart face shape", faces: ["heart"], fabrics: ["any"] },
  { id: "5JbjpJJsros", title: "Everyday hijab styles for every face shape", faces: ["all"], fabrics: ["any"] },
  { id: "zmn7dUPSzmE", title: "Easy, secure, timeless chiffon style", faces: ["all"], fabrics: ["chiffon"] },
  { id: "HYDP-McX2UI", title: "Easy chiffon hijab with magnets", faces: ["all"], fabrics: ["chiffon"] },
  { id: "tGxv-K6jSq4", title: "Simple pleated chiffon hijab", faces: ["oval", "heart"], fabrics: ["chiffon"] },
  { id: "Q746cRBmADE", title: "Styling a jersey hijab", faces: ["all"], fabrics: ["jersey"] },
  { id: "U3F6ZhFxIOU", title: "Quick jersey hijab tutorial", faces: ["all"], fabrics: ["jersey"] },
  { id: "92s3tzS4ifY", title: "Satin hijab tutorial", faces: ["all"], fabrics: ["satin"] },
  { id: "wp1S0RmTsnQ", title: "5 easy satin & silk hijab styles", faces: ["all"], fabrics: ["satin"] },
  { id: "T9dfxIdvXIg", title: "Satin silk hijab for a formal event", faces: ["all"], fabrics: ["satin"] },
  { id: "B0Yy22_QfWw", title: "Styling a cotton hijab step by step", faces: ["all"], fabrics: ["cotton"] },
  { id: "inQMYa9QgjE", title: "Everyday easy cotton hijab", faces: ["all"], fabrics: ["cotton"] },
  { id: "Z5RakT12vbk", title: "Full-coverage modal hijab", faces: ["all"], fabrics: ["cotton", "jersey"] },
];

export const BEARD_STYLES: Record<FaceShape, { name: string; how: string }[]> = {
  round: [
    { name: "Short boxed beard", how: "Keep the cheeks trimmed tight and leave 1–1.5 cm more length on the chin to add angles." },
    { name: "Goatee with stubble", how: "A 3 mm stubble with a fuller chin point makes the face look longer." },
  ],
  oval: [
    { name: "Full classic beard", how: "Even length (1–2 cm) all around; clean neckline two fingers above the Adam's apple." },
    { name: "Designer stubble", how: "Trim every 2–3 days at 3–5 mm; tidy the cheek line with a razor." },
  ],
  square: [
    { name: "Rounded full beard", how: "Keep the sides shorter and round off the chin to soften a strong jaw." },
    { name: "Circle beard", how: "Connect moustache and chin in a soft circle; shave the cheeks clean." },
  ],
  heart: [
    { name: "Fuller chin beard", how: "Let the chin and jaw grow fuller (2 cm) to balance a wider forehead." },
    { name: "Chin strap with moustache", how: "A neat line along the jaw adds weight to the lower face." },
  ],
};

export const HAIR_CUTS: Record<FaceShape, string> = {
  round: "Short sides with height on top (textured quiff or high fade) to lengthen the face.",
  oval: "Most cuts work: a classic taper, crew cut or low fade with a side part.",
  square: "Medium fade with soft texture on top; avoid very sharp, boxy edges.",
  heart: "Medium length on top swept to the side, with slightly fuller sides.",
};

export const GROOMING_ROUTINE = [
  { title: "Daily", steps: ["Wash the beard with a gentle cleanser (not hair shampoo) every other day.", "Apply 3–4 drops of beard oil (argan or jojoba) while the skin is damp.", "Brush downward with a boar-bristle brush to train the hair."] },
  { title: "Weekly", steps: ["Trim the neckline and cheek line; always trim dry, never wet.", "Exfoliate under the beard to prevent itching and ingrown hairs.", "Condition scalp hair with a light leave-in, especially in dry season."] },
  { title: "Monthly", steps: ["Barber visit for a clean fade or taper every 3–4 weeks.", "Clean and oil clippers; replace razor blades.", "Check for dandruff; use a medicated shampoo twice weekly if needed."] },
];

export const HAIR_CARE = [
  { title: "Wash day (weekly)", steps: ["Pre-poo with warm coconut or olive oil for 20 minutes.", "Use a sulfate-free shampoo on the scalp only.", "Deep condition 20 minutes under a warm towel.", "Detangle with a wide-tooth comb from the ends up."] },
  { title: "Moisture (every 2–3 days)", steps: ["Spritz with water or rose water.", "Seal with a light oil or shea butter (LOC method).", "Sleep on a satin pillowcase or bonnet."] },
  { title: "Protective styles", steps: ["Braids, twists or cornrows for 4–6 weeks maximum.", "Avoid tight edges; moisturise the scalp weekly.", "Give hair 1–2 weeks rest between styles."] },
];

export const HAIR_COLORS = [
  { name: "Warm chestnut", swatch: "oklch(0.45 0.09 50)", suits: "Warm and deep skin tones; soft and natural for church and family events.", care: "Use colour-safe shampoo; deep condition weekly for the first month." },
  { name: "Honey brown highlights", swatch: "oklch(0.6 0.11 70)", suits: "Medium brown skin; brightens the face around the cheekbones.", care: "Ask for balayage so regrowth blends; protein treatment every 2 weeks." },
  { name: "Burgundy", swatch: "oklch(0.38 0.12 20)", suits: "Deep skin tones with cool or neutral undertones; festive for holidays.", care: "Red fades fast, so wash in cool water and use a colour-depositing conditioner." },
  { name: "Soft black", swatch: "oklch(0.25 0.02 40)", suits: "Everyone; covers greys gently without looking harsh.", care: "Choose ammonia-free dye; strand test 48 hours before for allergies." },
];

export const COLOR_SAFETY = [
  "Always do a patch test behind the ear 48 hours before colouring.",
  "Never colour and relax or perm hair in the same week — wait at least 2 weeks.",
  "Mothers and elders with sensitive scalps: choose henna or ammonia-free dyes.",
  "Deep condition the day before and a week after colouring.",
];
