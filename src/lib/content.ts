import type { Lang, ProfileId } from "./i18n";

export type Condition = "sunny" | "rainy" | "chilly";

export type Weather = {
  condition: Condition;
  icon: string;
  temp: number;
  feels: number;
  humidity: number;
  wind: number;
};

const CONDITIONS: { condition: Condition; icon: string; temp: number; feels: number; humidity: number; wind: number }[] = [
  { condition: "sunny", icon: "☀️", temp: 27, feels: 29, humidity: 38, wind: 9 },
  { condition: "rainy", icon: "🌧️", temp: 19, feels: 17, humidity: 82, wind: 21 },
  { condition: "chilly", icon: "🌤️", temp: 14, feels: 12, humidity: 55, wind: 14 },
];

/** Deterministic "today" weather so server and client always agree. */
export function getTodayWeather(date = new Date()): Weather {
  const dayOfYear = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 0)) /
      86400000,
  );
  return CONDITIONS[dayOfYear % CONDITIONS.length]!;
}

export const CONDITION_LABEL: Record<Lang, Record<Condition, string>> = {
  en: { sunny: "Warm and sunny", rainy: "Rainy and breezy", chilly: "Cool and cloudy" },
  am: { sunny: "ሞቃታማና ፀሐያማ", rainy: "ዝናባማና ነፋሻማ", chilly: "ቀዝቃዛና ደመናማ" },
  om: { sunny: "Ho'aa fi aduu", rainy: "Bokkaa fi qilleensa", chilly: "Qabbanaa fi duumessa" },
};

type Advice = { pieces: string[]; why: string; note: string };

export const OUTFIT: Record<Lang, Record<ProfileId, Record<Condition, Advice>>> = {
  en: {
    usman: {
      sunny: {
        pieces: ["Cream linen shirt, sleeves rolled", "Charcoal chinos", "Brown leather loafers", "Woven summer cap"],
        why: "Linen breathes and lets the heat escape, while the charcoal chinos keep you looking put together at work without holding the sun's warmth the way dark denim would.",
        note: "Drink water before you leave, my love. And roll those sleeves — no need to suffer for smartness.",
      },
      rainy: {
        pieces: ["White cotton tee", "Rain shell jacket, zipped", "Charcoal chinos", "Closed shoes, not the loafers"],
        why: "The shell keeps the rain off your shoulders and the cotton tee underneath stays soft against your skin. Leather loafers stain in puddles, so save them for tomorrow.",
        note: "Take the small towel from the drawer. Coming home damp is how colds begin.",
      },
      chilly: {
        pieces: ["Grey knit sweater over a white tee", "Navy wool blazer", "Charcoal chinos", "Brown leather loafers"],
        why: "Two light layers hold warm air better than one thick coat, and the blazer over knit reads formal enough for meetings while you stay cosy.",
        note: "Cover your chest in the morning wind. You always forget, and I always remind you.",
      },
    },
    wife: {
      sunny: {
        pieces: ["Linen summer dress", "Silk scarf, loose at the neck", "Nude block heels", "Light shoulder bag"],
        why: "Loose linen lets air move around you all day, and the scarf shields your neck from the sun without adding heat.",
        note: "You work so hard, habibti — wear something that lets you breathe today.",
      },
      rainy: {
        pieces: ["Coral chiffon blouse", "High-waist denim", "Rain trench coat, belted", "Flat closed shoes"],
        why: "Denim dries faster than a skirt hem in the wet, and the belted trench keeps the wind from pulling rain up under your coat.",
        note: "Leave the heels at home today. Slippery stones don't forgive pretty shoes.",
      },
      chilly: {
        pieces: ["Knit cardigan over the chiffon blouse", "Camel wool coat", "High-waist denim", "Silk scarf tucked in"],
        why: "The cardigan traps warmth close, the wool coat blocks the wind, and the coral blouse peeking out keeps the whole thing bright instead of heavy.",
        note: "That camel coat looks beautiful on you. Wear it and let the cold be someone else's problem.",
      },
    },
    mother: {
      sunny: {
        pieces: ["Long cotton skirt", "Embroidered blouse", "Wide sun hat", "Soft orthopedic shoes"],
        why: "Cotton against the skin stays cool and gentle, the long skirt shades your legs, and the wide hat keeps the midday sun off your face.",
        note: "Sit in the shade between errands, Emaye. The sun can wait for you.",
      },
      rainy: {
        pieces: ["Padded rain jacket", "Long cotton skirt", "Warm netela over the shoulders", "Soft orthopedic shoes with good grip"],
        why: "The padding keeps the damp chill out of your joints, and shoes with real grip matter more than anything else on a wet morning.",
        note: "Walk slowly on the wet steps. I would rather you arrive late than not at all.",
      },
      chilly: {
        pieces: ["Cashmere cardigan", "Woollen prayer shawl", "Long cotton skirt", "Quilted house robe for indoors"],
        why: "Cashmere is light but very warm, so your shoulders don't carry weight, and the shawl doubles for prayer without needing a second layer.",
        note: "Keep your knees and feet warm tonight and drink something hot before bed.",
      },
    },
    kids: {
      sunny: {
        pieces: ["Sun protection tee", "Cotton play shorts", "Velcro sneakers", "Cap and a water bottle"],
        why: "The UV tee covers little shoulders so nothing burns during play, and velcro shoes mean they can run off without waiting for laces.",
        note: "Pack an extra tee in the bag — playgrounds and clean shirts have never been friends.",
      },
      rainy: {
        pieces: ["Rainbow raincoat with the hood up", "School uniform set underneath", "Velcro sneakers", "Dry socks in the bag"],
        why: "The hood keeps rain off the neck, and dry spare socks are the difference between a happy afternoon and a sniffly one.",
        note: "Let them jump in one puddle. Just one. Childhood is short and socks are washable.",
      },
      chilly: {
        pieces: ["Fleece hoodie", "School uniform set", "Warm woollen mittens", "Velcro sneakers with thick socks"],
        why: "Fleece warms up fast and is easy to pull off indoors, so they won't overheat in a warm classroom.",
        note: "Mittens in the coat pocket, not in the bag. That's how they come home again.",
      },
    },
  },
  am: {
    usman: {
      sunny: {
        pieces: ["ክሬም የበፍታ ሸሚዝ፣ እጅጌ ተጠቅልሎ", "የከሰል ቀለም ሱሪ", "ቡናማ የቆዳ ጫማ", "የበጋ ኮፍያ"],
        why: "በፍታ አየር ስለሚያሳልፍ ሙቀቱ ይወጣል፤ ሱሪውም ለሥራ የተስተካከለ መልክ ይሰጥሃል ጸሐዩንም አይይዝም።",
        note: "ከመውጣትህ በፊት ውሃ ጠጣ ውዴ። እጅጌህንም ጠቅልል — ለውበት መሰቃየት አያስፈልግም።",
      },
      rainy: {
        pieces: ["ነጭ የጥጥ ቲሸርት", "የዝናብ ጃኬት፣ ተዘግቶ", "የከሰል ቀለም ሱሪ", "የተዘጋ ጫማ"],
        why: "ጃኬቱ ዝናቡን ከትከሻህ ይከላከላል፤ የጥጡ ቲሸርት ደግሞ ከውስጥ ለስላሳ ሆኖ ይቆያል። የቆዳ ጫማ በጭቃ ስለሚበላሽ ለነገ ይቆይ።",
        note: "ከመሳቢያው ትንሿን ፎጣ ውሰድ። እርጥብ ሆኖ መግባት ጉንፋን ያመጣል።",
      },
      chilly: {
        pieces: ["ግራጫ ሹራብ በቲሸርት ላይ", "ሰማያዊ የሱፍ ጃኬት", "የከሰል ቀለም ሱሪ", "ቡናማ የቆዳ ጫማ"],
        why: "ሁለት ቀጫጭን ልብሶች ከአንድ ወፍራም ኮት በላይ ሙቀት ይይዛሉ፤ ጃኬቱም ለስብሰባ የሚመጥን መልክ ይሰጥሃል።",
        note: "የጠዋቱን ነፋስ ደረትህን ሸፍነህ ተቀበል። አንተ ትረሳዋለህ፣ እኔ አስታውስሃለሁ።",
      },
    },
    wife: {
      sunny: {
        pieces: ["የበፍታ የበጋ ቀሚስ", "የሐር ሻርፕ በአንገት ላይ", "ናዉድ ተረከዝ ጫማ", "ቀላል ቦርሳ"],
        why: "ሰፊው በፍታ ቀኑን ሙሉ አየር እንዲዘዋወር ያደርጋል፤ ሻርፑም አንገትሽን ከፀሐይ ይጠብቃል።",
        note: "በጣም ትደክሚያለሽ ውዴ — ዛሬ የሚያስተነፍስሽን ልበሽ።",
      },
      rainy: {
        pieces: ["ኮራል ሺፎን ሸሚዝ", "ወገብ ላይ ጂንስ", "የዝናብ ካፖርት፣ በቀበቶ", "ጠፍጣፋ የተዘጋ ጫማ"],
        why: "ጂንስ ከቀሚስ ጫፍ በበለጠ በፍጥነት ይደርቃል፤ የታሰረው ካፖርትም ነፋሱ ዝናብ ወደ ውስጥ እንዳያስገባ ይከላከላል።",
        note: "ተረከዝ ጫማውን ዛሬ ቤት አስቀምጪው። ተንሸራታች መንገድ አይምርም።",
      },
      chilly: {
        pieces: ["ካርዲጋን በሺፎን ሸሚዝ ላይ", "የግመል ቀለም ኮት", "ወገብ ላይ ጂንስ", "የሐር ሻርፕ ተጠቅልሎ"],
        why: "ካርዲጋኑ ሙቀት ይይዛል፣ ኮቱ ነፋስን ይከለክላል፤ ኮራሉ ሸሚዝ ደግሞ ብርሃን ይጨምራል።",
        note: "ያ የግመል ቀለም ኮት በጣም ያምርብሻል። ልበሺውና ብርዱን ተይው።",
      },
    },
    mother: {
      sunny: {
        pieces: ["ረጅም የጥጥ ቀሚስ", "ጥልፍ ያለው ሸሚዝ", "የፀሐይ ኮፍያ", "ምቹ ጫማ"],
        why: "ጥጥ ከቆዳ ጋር ለስላሳና ቀዝቃዛ ነው፤ ረጅሙ ቀሚስ እግርሽን ይሸፍናል፤ ኮፍያውም ፊትሽን ከፀሐይ ይጠብቃል።",
        note: "እማዬ፣ በመሃል በጥላ ተቀመጪ። ፀሐይ ትጠብቅሻለች።",
      },
      rainy: {
        pieces: ["የተለሰለሰ የዝናብ ጃኬት", "ረጅም የጥጥ ቀሚስ", "ነጠላ በትከሻ ላይ", "የማይንሸራተት ምቹ ጫማ"],
        why: "የጃኬቱ ውፍረት ብርዱ ወደ መገጣጠሚያዎችሽ እንዳይገባ ይከላከላል፤ በእርጥብ ቀን ደግሞ የማይንሸራተት ጫማ ከሁሉ ይበልጣል።",
        note: "በእርጥቡ ደረጃ ቀስ ብለሽ ተራመጂ። ዘግይተሽ ብትደርሺ ይሻላል።",
      },
      chilly: {
        pieces: ["የካሽሚር ካርዲጋን", "የጸሎት ሻሽ", "ረጅም የጥጥ ቀሚስ", "ለቤት ውስጥ ሞቅ ያለ ልብስ"],
        why: "ካሽሚር ቀላል ሆኖ በጣም ያሞቃል፤ ትከሻሽም ክብደት አይሰማውም። ሻሹም ለጸሎት ይሆናል።",
        note: "ዛሬ ማታ ጉልበትሽንና እግርሽን አሙቂ፤ ከመተኛትሽ በፊትም ሞቅ ያለ ነገር ጠጪ።",
      },
    },
    kids: {
      sunny: {
        pieces: ["የፀሐይ መከላከያ ቲሸርት", "የጥጥ ቁምጣ", "ቬልክሮ ስኒከር", "ኮፍያና የውሃ ጠርሙስ"],
        why: "ቲሸርቱ ትንንሽ ትከሻዎችን ከፀሐይ ይከላከላል፤ ቬልክሮ ጫማም ያለ ማሰሪያ በፍጥነት ይለበሳል።",
        note: "በቦርሳው ውስጥ ተጨማሪ ቲሸርት አስገቢ — መጫወቻ ቦታና ንጹህ ልብስ ጓደኛሞች አይደሉም።",
      },
      rainy: {
        pieces: ["ቀስተ ደመና የዝናብ ልብስ ከኮፍያ ጋር", "የትምህርት ቤት ልብስ ከውስጥ", "ቬልክሮ ስኒከር", "ደረቅ ካልሲ በቦርሳ"],
        why: "ኮፍያው ዝናቡን ከአንገት ይከላከላል፤ ተጨማሪ ደረቅ ካልሲም ደስተኛ ከሰዓት ያመጣል።",
        note: "አንድ ጊዜ ውሃ ውስጥ እንዲዘሉ ፍቀጂላቸው። አንድ ጊዜ ብቻ። ልጅነት አጭር ነው።",
      },
      chilly: {
        pieces: ["ፍሊስ ሁዲ", "የትምህርት ቤት ልብስ", "ሞቅ ያሉ ጓንቶች", "ቬልክሮ ስኒከር ከወፍራም ካልሲ ጋር"],
        why: "ፍሊስ በፍጥነት ያሞቃል፤ በክፍል ውስጥም በቀላሉ ስለሚወልቅ አይሞቃቸውም።",
        note: "ጓንቶቹን በኮቱ ኪስ አድርጊ፤ በቦርሳ ውስጥ አይደለም። እንዲህ ነው ተመልሰው የሚመጡት።",
      },
    },
  },
  om: {
    usman: {
      sunny: {
        pieces: ["Shamiizii liinan kiriimii, harkisaa maramee", "Kofoo daaraa", "Kophee gogaa magaala", "Kofiyaa bonaa"],
        why: "Liinan qilleensa dabarsa waan ta'eef ho'i ni ba'a; kofoon daaraas hojiif si tolcha, aduus hin qabatu.",
        note: "Utuu hin ba'in bishaan dhugi, jaalallee koo. Harkisaas maradhu — bareedinaaf dhiphachuun hin barbaachisu.",
      },
      rainy: {
        pieces: ["Tiishartii jirbii adii", "Jaakkeetii bokkaa, cufamee", "Kofoo daaraa", "Kophee cufamaa"],
        why: "Jaakkeetichi bokkaa gatiittii kee irraa ittisa; tiishartiin jirbii keessaan immoo laafaa ta'ee tura. Kopheen gogaa dhoqqeedhaan bada.",
        note: "Waaraabbii xiqqaa sanduuqa keessaa fudhadhu. Jiidhaan galuun utaalloo fida.",
      },
      chilly: {
        pieces: ["Sweetarii daaraa tiishartii irratti", "Jaakkeetii suufii cuquliisa", "Kofoo daaraa", "Kophee gogaa magaala"],
        why: "Uffanni lama qal'aan kootii tokko furdaa caalaa ho'a qaba; jaakkeetichis walga'iif si tolcha.",
        note: "Ganama qilleensa keessatti laphee kee haguugi. Ati ni irraanfatta, ani immoo si yaadachiisa.",
      },
    },
    wife: {
      sunny: {
        pieces: ["Uffata liinan bonaa", "Sharaafii hariirii morma irratti", "Kophee kophaa dhiigaa", "Boorsaa salphaa"],
        why: "Liinan bal'aan guyyaa guutuu qilleensa naanneessa; sharaafichis morma kee aduu irraa eega.",
        note: "Baay'ee dadhabdaa jirta, jaalallee koo — har'a waan si boqochiisu uffadhu.",
      },
      rainy: {
        pieces: ["Shamiizii shiifoonii koraalii", "Deenimii mudhii ol'aanaa", "Kootii bokkaa sabbataan hidhame", "Kophee diriiraa cufamaa"],
        why: "Deenimiin handaara uffataa caalaa dafee goga; kootiin sabbataan hidhames qilleensi bokkaa keessa akka hin galchine ittisa.",
        note: "Kophee kophaa dhiigaa har'a mana dhiisi. Karaan mucucaataan hin araaramu.",
      },
      chilly: {
        pieces: ["Kaardigaanii shamiizii irratti", "Kootii suufii gaalaa", "Deenimii mudhii ol'aanaa", "Sharaafii hariirii keessa naqame"],
        why: "Kaardigaaniin ho'a qabata, kootiin qilleensa ittisa; koraaliin mul'atus ifa dabala.",
        note: "Kootiin gaalaa sun sitti baay'ee bareeda. Uffadhuutii qorra dagadhu.",
      },
    },
    mother: {
      sunny: {
        pieces: ["Wandaboo jirbii dheeraa", "Shamiizii faayaa", "Kofiyaa aduu", "Kophee mijataa"],
        why: "Jirbiin gogaa irratti qabbanaa'aa fi laafaa dha; wandaboon dheeraan miilla kee gaaddiseessa; kofiyaanis fuula kee eega.",
        note: "Haadha koo, gidduutti gaaddisa jala taa'i. Aduun si eeguu dandeessi.",
      },
      rainy: {
        pieces: ["Jaakkeetii bokkaa furdaa", "Wandaboo jirbii dheeraa", "Netelaa gatiittii irratti", "Kophee hin mucucanne"],
        why: "Furdinni jaakkeetichaa qorra buusaa kee irraa ittisa; guyyaa jiidhaa immoo kopheen hin mucucanne hunda caala.",
        note: "Gulantaa jiidhaa irra suuta deemi. Turtee dhufuun caala.",
      },
      chilly: {
        pieces: ["Kaardigaanii kaashmirii", "Sharaafii kadhannaa suufii", "Wandaboo jirbii dheeraa", "Uffata mana ho'aa",],
        why: "Kaashmiriin salphaa ta'ee garuu baay'ee ho'a; gatiittiin kee ulfaatina hin dhagahu. Sharaafichis kadhannaaf ni ta'a.",
        note: "Har'a galgala jilbaa fi miilla kee ho'isi, rafuu kee dura waan ho'aa dhugi.",
      },
    },
    kids: {
      sunny: {
        pieces: ["Tiishartii aduu ittisu", "Kofoo gabaabaa jirbii", "Kophee veelkiroo", "Kofiyaa fi qaruuraa bishaanii"],
        why: "Tiishartichi gatiittii xiqqoo aduu irraa eega; kopheen veelkiroos hidhaa malee dafee uffatama.",
        note: "Boorsaa keessa tiishartii dabalataa kaa'i — dirreen taphaa fi uffanni qulqulluun firooma hin qaban.",
      },
      rainy: {
        pieces: ["Uffata bokkaa sabbata waaqaa mataa haguuggii waliin", "Uffata mana barumsaa keessaan", "Kophee veelkiroo", "Sokisii goggogaa boorsaa keessa"],
        why: "Haguuggiin bokkaa morma irraa ittisa; sokisiin goggogaan dabalataas waaree gammachiisaa taasisa.",
        note: "Al tokko bishaan keessa akka utaalan heyyami. Al tokko qofa. Ijoollummaan gabaabduudha.",
      },
      chilly: {
        pieces: ["Huudii fleesii", "Uffata mana barumsaa", "Golboo suufii ho'aa", "Kophee veelkiroo sokisii furdaa waliin"],
        why: "Fleesiin dafee ho'isa; kutaa barnootaa keessattis salphaatti waan baafamuuf itti hin ho'u.",
        note: "Golboo kiisha kootii keessa kaa'i, boorsaa keessa miti. Akkasitti manatti deebi'u.",
      },
    },
  },
};

export type PostureGuide = { id: string; icon: string; title: string; intro: string; steps: string[]; tips: string[] };
export type Workout = {
  id: string;
  icon: string;
  title: string;
  duration: string;
  level: string;
  intro: string;
  exercises: { name: string; dose: string; how: string }[];
};

export const POSTURE: Record<Lang, PostureGuide[]> = {
  en: [
    {
      id: "desk",
      icon: "💺",
      title: "Desk posture that saves your back",
      intro: "For the long hours you spend sitting. Set this up once in the morning and your evening will thank you.",
      steps: [
        "Sit all the way back so your lower back touches the chair, then place a small cushion or rolled towel behind your waist.",
        "Lower the chair until both feet rest flat on the floor and your knees sit level with your hips.",
        "Pull the chair in close so your elbows hang at your sides and bend at about a right angle over the keyboard.",
        "Raise the screen until the top of it is level with your eyebrows, about an arm's length away.",
        "Let your shoulders drop away from your ears, unclench your jaw, and take one slow breath.",
      ],
      tips: [
        "Stand up every 30 minutes, even for 20 seconds. Movement matters more than the perfect chair.",
        "If your feet dangle, put a book under them. Nobody needs to see it.",
        "Keep your phone off your lap while at the desk — that's where the neck ache begins.",
      ],
    },
    {
      id: "standing",
      icon: "🧍",
      title: "Standing tall without stiffness",
      intro: "For market days, teaching, cooking, and long queues. Standing well is standing softly, not standing frozen.",
      steps: [
        "Place your feet hip-width apart with your weight spread evenly across both heels and the balls of your feet.",
        "Unlock your knees — keep them soft, never pushed back hard.",
        "Gently draw your belly in about ten percent, as if tightening a loose belt.",
        "Stack your ribs over your hips instead of letting your chest jut forward.",
        "Imagine a thread lifting the crown of your head, and let your chin settle level.",
      ],
      tips: [
        "Shift your weight from foot to foot every couple of minutes rather than locking in place.",
        "If you stand for hours, rest one foot on a low step and swap sides often.",
        "Flat, cushioned shoes will do more for your back than any exercise.",
      ],
    },
    {
      id: "phone",
      icon: "📱",
      title: "Undoing phone neck",
      intro: "Looking down at a screen puts the weight of a watermelon on your neck. Here is how we take it off.",
      steps: [
        "Lift the phone up to chest or chin height instead of bending your head down to it.",
        "Tuck your chin straight back, making a gentle double chin, and hold for 5 seconds. Repeat 8 times.",
        "Roll your shoulders backwards 10 times, slowly, breathing out as they drop.",
        "Clasp your hands behind your back and lift them slightly to open your chest for 15 seconds.",
        "Turn your head slowly to each side, hold 10 seconds, and feel the stretch — never force it.",
      ],
      tips: [
        "Do the chin tucks every time you finish a call. It becomes a habit within a week.",
        "Use a pillow under your elbow when scrolling in bed so your arm can stay lifted.",
        "Any ache that spreads down your arm needs a doctor, not a stretch.",
      ],
    },
  ],
  am: [
    {
      id: "desk",
      icon: "💺",
      title: "ጀርባህን የሚጠብቅ የመቀመጫ አቋቋም",
      intro: "ለረጅም ሰዓት ለምትቀመጥበት ጊዜ። ጠዋት አንዴ አስተካክለው፣ ማታ ታመሰግናለህ።",
      steps: [
        "ወደ ኋላ ጠጋ ብለህ ተቀመጥ፤ ወገብህ ወንበሩን እንዲነካ አድርግ፤ ከወገብህ ጀርባ ትንሽ ትራስ አድርግ።",
        "ሁለቱ እግሮችህ መሬት ላይ እስኪያርፉና ጉልበቶችህ ከዳሌህ ጋር እኩል እስኪሆኑ ወንበሩን ዝቅ አድርግ።",
        "ክርኖችህ በጎንህ ወርደው በቀኝ ማዕዘን እንዲታጠፉ ወንበሩን ወደ ጠረጴዛው አስጠጋ።",
        "የስክሪኑ ጫፍ ከቅንድብህ ጋር እኩል እስኪሆን ድረስ ከፍ አድርገው፤ ርቀቱ አንድ ክንድ ያህል ይሁን።",
        "ትከሻዎችህ ከጆሮህ እንዲርቁ ልቀቅ፣ መንጋጋህን አዝናና፣ አንድ ጥልቅ ትንፋሽ ውሰድ።",
      ],
      tips: [
        "በየ30 ደቂቃው ተነሳ፤ ለ20 ሰከንድ ቢሆንም። እንቅስቃሴ ከወንበር ይበልጣል።",
        "እግርህ መሬት ካልደረሰ ከስሩ መጽሐፍ አስቀምጥ። ማንም አያየውም።",
        "ጠረጴዛ ላይ ሆነህ ስልክህን ጭንህ ላይ አታስቀምጥ — የአንገት ህመም እዚያ ይጀምራል።",
      ],
    },
    {
      id: "standing",
      icon: "🧍",
      title: "ሳትደነድን ቀጥ ብሎ መቆም",
      intro: "ለገበያ ቀን፣ ለማስተማር፣ ለምግብ ማብሰልና ለረጅም ሰልፍ። መልካም አቋቋም ማለት ልል ብሎ መቆም ነው።",
      steps: [
        "እግሮችህን በዳሌ ስፋት ልክ አራርቅ፤ ክብደትህ በሁለቱም ተረከዞችና የእግር ኳሶች ላይ እኩል ይከፋፈል።",
        "ጉልበቶችህን አትቆልፍ — ልል አድርገህ ያዛቸው።",
        "ሆድህን በቀስታ ወደ ውስጥ ትንሽ ሳብ፣ ልል ቀበቶ እንደምታጠብቅ።",
        "ደረትህን ወደፊት ከመግፋት ይልቅ የጎድን አጥንቶችህን ከዳሌህ በላይ አስቀምጥ።",
        "ከራስህ ላይ ክር እንደሚስብህ አስብ፤ አገጭህም እኩል ይቁም።",
      ],
      tips: [
        "በየሁለት ደቂቃው ክብደትህን ከአንዱ እግር ወደ ሌላው አዙር።",
        "ለሰዓታት የምትቆም ከሆነ አንድ እግርህን ዝቅ ባለ ደረጃ ላይ አሳርፍና እየቀያየርክ ቁም።",
        "ጠፍጣፋና ለስላሳ ጫማ ከማንኛውም ልምምድ በላይ ጀርባህን ይጠቅማል።",
      ],
    },
    {
      id: "phone",
      icon: "📱",
      title: "የስልክ አንገት ማስተካከያ",
      intro: "ወደታች አቀርቅሮ ስልክ ማየት በአንገትህ ላይ ከባድ ሸክም ያሳርፋል። እንዲህ እናቃልለው።",
      steps: [
        "ጭንቅላትህን ወደታች ከማጎንበስ ይልቅ ስልኩን እስከ ደረት ወይም አገጭ ከፍታ አንሳው።",
        "አገጭህን ቀጥታ ወደ ኋላ ሳብ፣ ለ5 ሰከንድ ያዝ። 8 ጊዜ ድገመው።",
        "ትከሻህን ወደ ኋላ 10 ጊዜ በቀስታ አሽከርክር፤ ስትለቅ ተንፍስ።",
        "እጆችህን ከጀርባህ አስተሳስረህ ትንሽ አንሳቸው፤ ደረትህ ይከፈታል፣ ለ15 ሰከንድ ያዝ።",
        "ጭንቅላትህን በቀስታ ወደ ግራና ቀኝ አዙር፣ ለ10 ሰከንድ ያዝ — በኃይል አታድርገው።",
      ],
      tips: [
        "ስልክ ጨርሰህ ሁሌ የአገጭ ልምምዱን አድርግ። በሳምንት ውስጥ ልማድ ይሆናል።",
        "አልጋ ላይ ስትጠቀም ከክርንህ ስር ትራስ አድርግ።",
        "ወደ ክንድህ የሚወርድ ህመም ካለ ወደ ሐኪም ሂድ፤ ልምምድ አይበቃም።",
      ],
    },
  ],
  om: [
    {
      id: "desk",
      icon: "💺",
      title: "Dhaabbii teessumaa dugda kee eegu",
      intro: "Yeroo dheeraa taa'uuf. Ganama al tokko qindeessi, galgala ni galateeffatta.",
      steps: [
        "Guutummaatti duubatti taa'i, mudhiin kee barcuma haa tuqu, boodas boraatii xiqqaa mudhii kee duuba kaa'i.",
        "Hanga miilli lamaanuu lafa irra ciisanii jilbi mudhii wajjin wal qixxaatutti barcuma gadi buusi.",
        "Ciqileen kee cinaacha keetti rarra'ee kofa sirrii akka ta'utti barcuma dhiheessi.",
        "Fiixeen iskiriinii baallee ija keetii wajjin hanga wal qixxaatutti ol kaasi; fageenyi harka tokko haa ta'u.",
        "Gatiittii kee gurra irraa gadi dhiisi, afaan kee laaffisi, hafuura tokko suuta baafadhu.",
      ],
      tips: [
        "Daqiiqaa 30 hunda ka'i, sekondii 20 taanaan illee. Sochiin barcuma caala.",
        "Miilli kee lafa yoo hin geenye jala kitaaba kaa'i. Namni tokko hin argu.",
        "Minjaala biratti bilbila gudeeda irra hin kaa'in — dhukkubbiin morma achitti jalqaba.",
      ],
    },
    {
      id: "standing",
      icon: "🧍",
      title: "Osoo hin dhaabbatin qajeelaa dhaabbachuu",
      intro: "Guyyaa gabaa, barsiisuu, nyaata bilcheessuu fi sararaa dheeraaf. Sirriitti dhaabbachuun suuta dhaabbachuudha.",
      steps: [
        "Miilla kee hamma bal'ina mudhii adda baasi; ulfaatinni kee koomee fi fiixee miilla irratti wal qixa haa qoodamu.",
        "Jilba kee hin cufin — laafaa godhi.",
        "Garaa kee suuta xiqqoo ol harkisi, akka sabbata laafaa dhiphistu.",
        "Laphee gara fuulduraatti dhiibuu mannaa cinaacha kee mudhii kee irratti kaa'i.",
        "Akka waan kirriin mataa kee ol harkisuutti yaadi; areeda kees wal qixa dhaabi.",
      ],
      tips: [
        "Daqiiqaa lamaan lamaan ulfaatina kee miilla tokko irraa gara kaaniitti jijjiiri.",
        "Sa'aatii dheeraa yoo dhaabbatte, miilla tokko gulantaa gabaabaa irra kaa'ii jijjiiraa turi.",
        "Kopheen diriiraa fi laafaan shaakala kamiyyuu caalaa dugda kee gargaara.",
      ],
    },
    {
      id: "phone",
      icon: "📱",
      title: "Morma bilbilaan dhiphate fayyisuu",
      intro: "Gadi jedhanii bilbila ilaaluun morma kee irratti ba'aa guddaa kaa'a. Haala kanaan gadi buufna.",
      steps: [
        "Mataa gadi qabuu mannaa bilbila hanga laphee ykn areedaatti ol kaasi.",
        "Areeda kee kallattiidhaan duubatti harkisi, sekondii 5 qabi. Si'a 8 irra deebi'i.",
        "Gatiittii kee suuta duubatti si'a 10 naanneessi; yeroo gad dhiiftu hafuura baasi.",
        "Harka kee dugda duubatti wal qabsiisii xiqqoo ol kaasi; laphee kee bani, sekondii 15 qabi.",
        "Mataa kee suuta gara mirgaa fi bitaatti naanneessi, sekondii 10 qabi — humnaan hin godhin.",
      ],
      tips: [
        "Yeroo bilbila xumurtu hunda shaakala areedaa godhi. Torbee tokko keessatti amala ta'a.",
        "Siree irratti yeroo fayyadamtu ciqilee jala boraatii kaa'i.",
        "Dhukkubbiin harka keetti gadi bu'u yoo jiraate, doktora bira dhaqi.",
      ],
    },
  ],
};

export const WORKOUTS: Record<Lang, Workout[]> = {
  en: [
    {
      id: "morning",
      icon: "🌅",
      title: "Gentle morning wake-up",
      duration: "12 minutes",
      level: "Easy — good for every body",
      intro: "No jumping, no noise, nothing that wakes the whole house. Just enough to loosen the night out of your joints.",
      exercises: [
        { name: "Neck half-circles", dose: "6 each side", how: "Drop your chin and roll it slowly from shoulder to shoulder. Never roll backwards." },
        { name: "Shoulder rolls", dose: "10 back, 10 forward", how: "Big, slow circles. Breathe out as the shoulders drop." },
        { name: "Standing side bends", dose: "8 each side", how: "One hand on your hip, the other overhead, lean gently sideways." },
        { name: "Cat-cow on the bed", dose: "10 slow rounds", how: "On hands and knees, arch and round your back with your breath." },
        { name: "Chair-supported squats", dose: "2 sets of 8", how: "Touch the chair with your seat, then stand. Keep your knees behind your toes." },
        { name: "Standing march", dose: "60 seconds", how: "Lift each knee to hip height, arms swinging softly." },
      ],
    },
    {
      id: "strength",
      icon: "💪",
      title: "Living-room strength, no equipment",
      duration: "25 minutes",
      level: "Moderate — 3 times a week",
      intro: "Strong legs and a strong back carry you through everything else. Rest 45 seconds between sets and don't rush.",
      exercises: [
        { name: "Bodyweight squats", dose: "3 sets of 12", how: "Feet hip-width, sit back as if reaching for a low stool, chest proud." },
        { name: "Incline push-ups on a table", dose: "3 sets of 10", how: "Hands wider than shoulders, body in one straight line, lower slowly." },
        { name: "Reverse lunges", dose: "3 sets of 8 each leg", how: "Step back, drop the back knee toward the floor, push through the front heel." },
        { name: "Glute bridges", dose: "3 sets of 15", how: "Lie on your back, feet flat, lift hips and squeeze for one second at the top." },
        { name: "Superman holds", dose: "3 holds of 20 seconds", how: "Face down, lift chest and thighs slightly, look at the floor not forward." },
        { name: "Forearm plank", dose: "3 holds of 30 seconds", how: "Elbows under shoulders, hips level, breathe steadily throughout." },
      ],
    },
    {
      id: "evening",
      icon: "🌙",
      title: "Evening unwind stretch",
      duration: "15 minutes",
      level: "Easy — perfect before bed",
      intro: "For the day that sat too long in your shoulders. Dim the light, breathe slowly, and let each stretch soften.",
      exercises: [
        { name: "Seated forward fold", dose: "Hold 45 seconds", how: "Legs straight, hinge from the hips, let your head hang heavy." },
        { name: "Figure-four hip stretch", dose: "45 seconds each side", how: "Lying down, cross one ankle over the opposite knee and pull the thigh in." },
        { name: "Child's pose", dose: "Hold 60 seconds", how: "Knees wide, hips to heels, arms stretched forward, forehead resting down." },
        { name: "Doorway chest opener", dose: "30 seconds each side", how: "Forearm on the frame, step gently forward until you feel the chest open." },
        { name: "Supine spinal twist", dose: "45 seconds each side", how: "On your back, drop both knees to one side, turn your head the other way." },
        { name: "Legs up the wall", dose: "3 minutes", how: "Hips close to the wall, legs resting up it, hands on your belly, slow breaths." },
      ],
    },
  ],
  am: [
    {
      id: "morning",
      icon: "🌅",
      title: "ረጋ ያለ የጠዋት መቀስቀሻ",
      duration: "12 ደቂቃ",
      level: "ቀላል — ለሁሉም ሰው",
      intro: "መዝለል የለም፣ ጫጫታ የለም። መገጣጠሚያዎችህን ለማላላት የሚበቃ ብቻ።",
      exercises: [
        { name: "የአንገት ግማሽ ክብ", dose: "በእያንዳንዱ ጎን 6", how: "አገጭህን ዝቅ አድርገህ ከትከሻ ወደ ትከሻ በቀስታ አሽከርክር። ወደ ኋላ አታዙር።" },
        { name: "የትከሻ ማሽከርከር", dose: "10 ወደ ኋላ፣ 10 ወደ ፊት", how: "ትልቅና ቀስተኛ ክብ። ትከሻው ሲወርድ ተንፍስ።" },
        { name: "ወደ ጎን መታጠፍ", dose: "በእያንዳንዱ ጎን 8", how: "አንድ እጅ ወገብ ላይ፣ ሌላው ከራስ በላይ፤ በቀስታ ወደ ጎን ዘንበል በል።" },
        { name: "የድመት-ላም እንቅስቃሴ", dose: "10 ዙር በቀስታ", how: "በእጅና በጉልበት ላይ ሆነህ ጀርባህን ከትንፋሽህ ጋር አጎብጥና አስተካክል።" },
        { name: "በወንበር ድጋፍ ቁጭ-ቁም", dose: "2 ዙር በ8", how: "መቀመጫህ ወንበሩን ነክቶ ተነስ። ጉልበቶችህ ከጣቶችህ አይለፉ።" },
        { name: "በቦታ መራመድ", dose: "60 ሰከንድ", how: "እያንዳንዱን ጉልበት እስከ ዳሌ ከፍታ አንሳ፤ እጆችህ በቀስታ ይወዛወዙ።" },
      ],
    },
    {
      id: "strength",
      icon: "💪",
      title: "የቤት ውስጥ ጥንካሬ፣ ያለ መሣሪያ",
      duration: "25 ደቂቃ",
      level: "መካከለኛ — በሳምንት 3 ጊዜ",
      intro: "ጠንካራ እግርና ጀርባ ሁሉንም ነገር ይሸከሙልሃል። በዙሮች መካከል 45 ሰከንድ አረፍ በል።",
      exercises: [
        { name: "ቁጭ-ቁም (ስኳት)", dose: "3 ዙር በ12", how: "እግሮች በዳሌ ስፋት፤ ዝቅ ወዳለ ወንበር እንደምትቀመጥ ወደ ኋላ ውረድ።" },
        { name: "ጠረጴዛ ላይ ፑሽ አፕ", dose: "3 ዙር በ10", how: "እጆች ከትከሻ ሰፋ ብለው፤ ሰውነት ቀጥ ብሎ፤ በቀስታ ውረድ።" },
        { name: "ወደ ኋላ ላንጅ", dose: "3 ዙር በ8 ለእያንዳንዱ እግር", how: "ወደ ኋላ ራመድ፣ የኋላውን ጉልበት ወደ መሬት አውርድ፣ በፊተኛው ተረከዝ ተገፍተህ ተነስ።" },
        { name: "ግሉት ብሪጅ", dose: "3 ዙር በ15", how: "ጀርባህ ላይ ተኝተህ እግሮችህን አጣፍ፣ ዳሌህን አንስተህ ለአንድ ሰከንድ ጨብጥ።" },
        { name: "ሱፐርማን", dose: "3 ጊዜ ለ20 ሰከንድ", how: "በሆድህ ተኝተህ ደረትህንና ጭንህን ትንሽ አንሳ፤ ወደ መሬት ተመልከት።" },
        { name: "ፕላንክ", dose: "3 ጊዜ ለ30 ሰከንድ", how: "ክርኖች ከትከሻ በታች፣ ዳሌ እኩል፣ በእርጋታ ተንፍስ።" },
      ],
    },
    {
      id: "evening",
      icon: "🌙",
      title: "የማታ ማዝናኛ ዝርጋታ",
      duration: "15 ደቂቃ",
      level: "ቀላል — ከመተኛት በፊት",
      intro: "ቀኑ በትከሻህ ላይ ላሳረፈው ድካም። መብራቱን ቀንስ፣ በቀስታ ተንፍስ።",
      exercises: [
        { name: "ተቀምጦ ወደፊት መታጠፍ", dose: "45 ሰከንድ ያዝ", how: "እግሮች ቀጥ ብለው፤ ከወገብ ታጠፍ፤ ጭንቅላትህ ይንጠልጠል።" },
        { name: "የዳሌ ዝርጋታ", dose: "በእያንዳንዱ ጎን 45 ሰከንድ", how: "ተኝተህ አንዱን ቁርጭምጭሚት በሌላው ጉልበት ላይ አድርገህ ጭኑን ወደ አንተ ሳብ።" },
        { name: "የልጅ አቀማመጥ", dose: "60 ሰከንድ ያዝ", how: "ጉልበቶች ተራርቀው፣ ዳሌ ወደ ተረከዝ፣ እጆች ወደፊት ተዘርግተው።" },
        { name: "በበር የደረት መክፈቻ", dose: "በእያንዳንዱ ጎን 30 ሰከንድ", how: "ክንድህን በበሩ ጠርዝ ላይ አድርገህ በቀስታ ወደፊት ራመድ።" },
        { name: "የጀርባ ጠመዝማዛ", dose: "በእያንዳንዱ ጎን 45 ሰከንድ", how: "ጀርባህ ላይ ተኝተህ ሁለቱን ጉልበት ወደ አንድ ጎን አውርድ፤ ጭንቅላትህን ወደ ተቃራኒው አዙር።" },
        { name: "እግር ግድግዳ ላይ", dose: "3 ደቂቃ", how: "ዳሌ ከግድግዳው ጠጋ፣ እግሮች ወደ ላይ ተደግፈው፣ በቀስታ ተንፍስ።" },
      ],
    },
  ],
  om: [
    {
      id: "morning",
      icon: "🌅",
      title: "Dammaqsaa ganamaa suutaa",
      duration: "Daqiiqaa 12",
      level: "Salphaa — nama hundaaf",
      intro: "Utaaluun hin jiru, sagaleen hin jiru. Buusaa kee laaffisuuf gahaadha.",
      exercises: [
        { name: "Naannessa morma walakkaa", dose: "Gama tokkoon 6", how: "Areeda gadi buusii gatiittii tokko irraa gara kaaniitti suuta naanneessi. Duubatti hin naanneessin." },
        { name: "Naannessa gatiittii", dose: "10 duubatti, 10 fuulduratti", how: "Geengoo guddaa fi suutaa. Yeroo gatiittiin gad bu'u hafuura baasi." },
        { name: "Cinaachatti jaachuu", dose: "Gama tokkoon 8", how: "Harka tokko mudhii irra, kaan mataa ol; suuta cinaachatti jaadhu." },
        { name: "Adurree-sa'a", dose: "Marsaa 10 suutaan", how: "Harkaa fi jilba irratti dugda kee hafuura waliin ol qabiitii gad dhiisi." },
        { name: "Iskuwaatii barcumaan deggaramte", dose: "Marsaa 2 x 8", how: "Teessuma keetiin barcuma tuqiitii ka'i. Jilbi quba miillaa hin darbin." },
        { name: "Iddootti deemuu", dose: "Sekondii 60", how: "Jilba tokkoon tokkoon hanga mudhiitti ol kaasi; harki suuta haa raafamu." },
      ],
    },
    {
      id: "strength",
      icon: "💪",
      title: "Jabina mana keessaa, meeshaa malee",
      duration: "Daqiiqaa 25",
      level: "Giddu-galeessa — torbeetti si'a 3",
      intro: "Miilli fi dugdi jabaan waan hunda si baata. Marsaa gidduutti sekondii 45 boqodhu.",
      exercises: [
        { name: "Iskuwaatii", dose: "Marsaa 3 x 12", how: "Miilla bal'ina mudhii; akka barcuma gabaabaa irra teessuutti duubatti gadi bu'i." },
        { name: "Push-up minjaala irratti", dose: "Marsaa 3 x 10", how: "Harka gatiittii caalaa bal'isi; qaamni sarara tokko haa ta'u; suuta gadi bu'i." },
        { name: "Laanjii duubaa", dose: "Marsaa 3 x 8 miilla tokkoon", how: "Duubatti tarkaanfadhu, jilba duubaa gara lafaatti buusi, koomee fuulduraatiin dhiibi." },
        { name: "Riqicha mudhii", dose: "Marsaa 3 x 15", how: "Dugda irra ciisi, miilla dhaabi, mudhii ol kaasii sekondii tokko qabi." },
        { name: "Supermaan", dose: "Si'a 3, sekondii 20", how: "Gombifamtee laphee fi tafa xiqqoo ol kaasi; lafa ilaali." },
        { name: "Pilaankii", dose: "Si'a 3, sekondii 30", how: "Ciqilee gatiittii jala, mudhii wal qixa, hafuura sirriitti baafadhu." },
      ],
    },
    {
      id: "evening",
      icon: "🌙",
      title: "Diriirsa galgalaa boqonnaaf",
      duration: "Daqiiqaa 15",
      level: "Salphaa — rafuu dura",
      intro: "Guyyaa gatiittii kee irratti ulfaateef. Ifa gadi buusi, suuta hafuura baafadhu.",
      exercises: [
        { name: "Taa'anii fuulduratti jaachuu", dose: "Sekondii 45 qabi", how: "Miilla qajeelchi, mudhii irraa jaadhu, mataan kee haa rarra'u." },
        { name: "Diriirsa mudhii lakkoofsa afurii", dose: "Gama tokkoon sekondii 45", how: "Ciiftee kolaa tokko jilba kaanii irra kaa'iitii tafa harkisi." },
        { name: "Teessuma daa'imaa", dose: "Sekondii 60 qabi", how: "Jilba bal'isi, mudhii koomeetti, harka fuulduratti diriirsi, adda lafa irra kaa'i." },
        { name: "Banaa laphee balbala irratti", dose: "Gama tokkoon sekondii 30", how: "Ciqilee balbala irra kaa'iitii suuta fuulduratti tarkaanfadhu." },
        { name: "Micciirama dugdaa", dose: "Gama tokkoon sekondii 45", how: "Dugda irra ciiftee jilba lamaan gama tokkotti buusi; mataa gama biraatti garagalchi." },
        { name: "Miilla keenyan manaa irra", dose: "Daqiiqaa 3", how: "Mudhii keenyan manaatti dhiheessi, miilla ol kaa'i, suuta hafuura baafadhu." },
      ],
    },
  ],
};
