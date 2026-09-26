import type { PostureGuide } from "./content";
import type { Lang, ProfileId } from "./i18n";

export type ProfileRoutine = {
  id: string;
  icon: string;
  title: string;
  duration: string;
  level: string;
  intro: string;
  setup: string;
  rest: string;
  exercises: { name: string; dose: string; how: string }[];
  cues: string[];
  safety: string;
};

export type ProfileFit = { posture: PostureGuide; routine: ProfileRoutine };

export const PROFILE_FIT: Record<Lang, Record<ProfileId, ProfileFit>> = {
  en: {
    usman: {
      posture: {
        id: "usman-desk",
        icon: "💼",
        title: "Undoing the long desk day",
        intro:
          "Your shoulders round forward by the afternoon, my dear. This little reset opens the chest again and takes the load off your lower back.",
        steps: [
          "Sit tall, both feet flat, and slide your hips all the way back into the chair before anything else.",
          "Pull your chin straight back — not down — and hold for five slow counts.",
          "Squeeze your shoulder blades together as if holding a coin between them, hold five counts, release.",
          "Stand, place both hands on your lower back and lean gently backwards for three easy breaths.",
          "Roll each shoulder backwards ten times, letting the breath out as they drop.",
        ],
        tips: [
          "Set the screen so the top edge meets your eyes — a stack of books under the laptop is enough.",
          "Every meeting on the phone, take it standing. Your back will thank you by evening.",
          "Keep the wallet out of your back pocket when you sit; it tilts the hips all day long.",
        ],
      },
      routine: {
        id: "usman-mobility",
        icon: "🏃",
        title: "Desk-body mobility reset",
        duration: "18 minutes",
        level: "Moderate — 4 days a week",
        intro:
          "Built for tight hips, a stiff upper back and shoulders that live at the keyboard. Nothing here needs equipment.",
        setup:
          "Clear a mat-sized space, take your shoes off, and have a sturdy chair and a wall within reach.",
        rest: "45 seconds between sets, longer if your breath is short.",
        exercises: [
          {
            name: "Hip flexor lunge stretch",
            dose: "3 sets of 30 seconds each side",
            how: "Kneel on one knee, tuck the tailbone under, then press the hip gently forward until you feel a long stretch at the front of the thigh.",
          },
          {
            name: "Wall angels",
            dose: "3 sets of 10",
            how: "Back and head against the wall, arms bent like goalposts, slide them up and down while keeping wrists touching the wall.",
          },
          {
            name: "Thoracic rotations",
            dose: "3 sets of 8 each side",
            how: "On hands and knees, one hand behind your head, rotate the elbow up toward the ceiling and follow it with your eyes.",
          },
          {
            name: "Glute bridges",
            dose: "3 sets of 15",
            how: "Lie on your back, feet flat and close to your seat, lift the hips and squeeze for one second at the top.",
          },
          {
            name: "Chair-supported calf raises",
            dose: "2 sets of 20",
            how: "Hold the chair, rise onto the balls of both feet, pause at the top, and lower slowly to the count of three.",
          },
        ],
        cues: [
          "Breathe out on the effort — never hold your breath.",
          "Move to the point of a gentle pull, never to sharpness.",
          "Slow down is always better than more repetitions.",
        ],
        safety:
          "If your lower back pinches instead of stretching, shorten the range and keep the tailbone tucked. Stop for the day if anything tingles down a leg.",
      },
    },
    wife: {
      posture: {
        id: "wife-carry",
        icon: "🌸",
        title: "Standing and carrying without strain",
        intro:
          "Bags on one shoulder, long hours upright, a child on the hip — this guide keeps your neck and lower back even.",
        steps: [
          "Stand with feet hip-width and let your weight sit evenly between both heels.",
          "Soften the knees so they are not locked, and stack the ribs directly over the hips.",
          "Swap the bag between shoulders every ten minutes, or carry it across the body instead.",
          "When lifting anything, bend at the knees and hips together and keep the load close to your chest.",
          "Once an hour, stand tall, drop the shoulders and take three slow breaths into the ribs.",
        ],
        tips: [
          "Flat, cushioned shoes for long days; save the heels for the short ones.",
          "If you carry a child, alternate hips — always the same side twists the pelvis.",
          "Warm your shoulders under a shawl on cold mornings before any stretching.",
        ],
      },
      routine: {
        id: "wife-mobility",
        icon: "🕊️",
        title: "Gentle strength and mobility flow",
        duration: "20 minutes",
        level: "Easy to moderate — 3 to 4 days a week",
        intro:
          "A flow for open shoulders, a steady lower back and legs that carry you through a full day without aching.",
        setup: "A soft mat or rug, a scarf or towel in hand, and a wall you can lean on.",
        rest: "30 to 45 seconds between sets, and sip water as you go.",
        exercises: [
          {
            name: "Cat-cow",
            dose: "2 sets of 10 slow rounds",
            how: "On hands and knees, arch and round the spine with your breath, moving one vertebra at a time.",
          },
          {
            name: "Scarf shoulder openers",
            dose: "3 sets of 10",
            how: "Hold a scarf wide with both hands, lift it overhead and gently back, keeping the arms straight but soft.",
          },
          {
            name: "Wall sit",
            dose: "3 holds of 20 seconds",
            how: "Slide down a wall until the knees are above the ankles, back flat, and hold with steady breathing.",
          },
          {
            name: "Side-lying leg lifts",
            dose: "3 sets of 12 each side",
            how: "Lie on your side, lift the top leg to hip height with the toes facing forward, lower with control.",
          },
          {
            name: "Seated figure-four stretch",
            dose: "2 holds of 30 seconds each side",
            how: "Sit tall, cross one ankle over the opposite knee and lean forward from the hips until the outer hip opens.",
          },
        ],
        cues: [
          "Long exhale on every lift — it steadies the whole core.",
          "Keep the shoulders low and away from the ears the entire time.",
          "If a joint complains, make the movement smaller, not faster.",
        ],
        safety:
          "Skip the wall sit on days your knees ache and hold the cat-cow longer instead. Anything that pulls sharply is a signal to stop.",
      },
    },
    mother: {
      posture: {
        id: "mother-balance",
        icon: "🌿",
        title: "Steady balance and an easy back",
        intro:
          "Emaye, this one is about staying steady on your feet and keeping the morning stiffness out of your hips and knees.",
        steps: [
          "Before rising from a chair, slide to the front edge and place both feet under your knees.",
          "Push through the heels and stand with your hands on your thighs — never pull on a doorframe.",
          "Once up, wait three breaths before walking so any dizziness has time to pass.",
          "Walk with your eyes forward, not down at your feet, and let your arms swing gently.",
          "When sitting again, reach back for the chair with both hands and lower yourself slowly.",
        ],
        tips: [
          "Keep a warm shawl on your shoulders in the early hours — warm muscles move far more easily.",
          "Grippy, closed shoes indoors, always. Slippers on smooth floors cause more falls than anything.",
          "Do these near a wall or a sturdy table, so support is always half a step away.",
        ],
      },
      routine: {
        id: "mother-mobility",
        icon: "🍵",
        title: "Chair-based joint care",
        duration: "15 minutes",
        level: "Easy — every morning is perfect",
        intro:
          "Every movement here can be done seated or holding a chair. It warms the knees, hips and shoulders without any strain.",
        setup:
          "A steady chair that does not slide, feet flat on the floor, and a glass of water beside you.",
        rest: "One full minute between sets — there is no hurry at all.",
        exercises: [
          {
            name: "Seated marches",
            dose: "2 sets of 20 (10 each leg)",
            how: "Sit tall and lift each knee just a hand's width off the seat, alternating slowly.",
          },
          {
            name: "Seated knee extensions",
            dose: "2 sets of 10 each leg",
            how: "Straighten one leg until it is level with the hip, hold two seconds, lower with control.",
          },
          {
            name: "Ankle circles",
            dose: "10 each direction, both feet",
            how: "Lift one foot slightly and draw slow circles with the toes to keep the ankles supple.",
          },
          {
            name: "Chair-supported sit-to-stand",
            dose: "2 sets of 8",
            how: "Stand up and sit down using the armrests only as much as you need, keeping the movement slow.",
          },
          {
            name: "Shoulder and neck softener",
            dose: "10 rolls, then 5 slow turns each side",
            how: "Roll the shoulders back, then turn the head gently right and left without forcing the range.",
          },
        ],
        cues: [
          "Breathe out as you rise, in as you lower.",
          "Small and steady beats big and shaky, every single time.",
          "Warm up with the seated marches before anything standing.",
        ],
        safety:
          "Never do the standing work alone if you feel light-headed. Any chest tightness, breathlessness or sharp knee pain means stop and rest, and tell someone.",
      },
    },
    kids: {
      posture: {
        id: "kids-school",
        icon: "🎒",
        title: "School bag and study posture",
        intro:
          "A short, playful check so little backs stay straight through homework and heavy bags.",
        steps: [
          "Wear both bag straps — never one — and tighten them so the bag sits above the waist.",
          "At the desk, sit with the bottom right at the back of the chair and both feet on the floor or a box.",
          "Keep books and tablets tilted up so the chin stays level instead of dropping to the chest.",
          "Every twenty minutes, stand up and reach for the ceiling like picking a mango, five times.",
          "Finish homework with ten big shoulder rolls and a wiggle of the whole body.",
        ],
        tips: [
          "The bag should weigh less than a tenth of the child — pack only today's books.",
          "Make the stand-up break a game with a timer, not a rule.",
          "Screens on the table, never lying on the floor or the bed.",
        ],
      },
      routine: {
        id: "kids-mobility",
        icon: "🤸",
        title: "Playful movement break",
        duration: "12 minutes",
        level: "Easy and fun — every day",
        intro:
          "Animal moves and gentle games that build strength and balance without it ever feeling like exercise.",
        setup:
          "Soft floor, room to stretch out both arms, and a grown-up watching along or joining in.",
        rest: "20 to 30 seconds of shaking out and giggling between rounds.",
        exercises: [
          {
            name: "Bear walks",
            dose: "3 rounds of 10 steps",
            how: "Hands and feet on the floor, knees just off the ground, walk forward slowly like a big soft bear.",
          },
          {
            name: "Flamingo balance",
            dose: "3 holds of 15 seconds each leg",
            how: "Stand on one leg with arms out wide, count out loud, then swap legs.",
          },
          {
            name: "Frog jumps",
            dose: "2 sets of 8",
            how: "Squat down low, spring up with both feet and land softly with bent knees, like a quiet frog.",
          },
          {
            name: "Crab reaches",
            dose: "2 sets of 8 each side",
            how: "Sit with hands behind you, lift the hips, then reach one hand across to the opposite foot.",
          },
          {
            name: "Butterfly and rocket stretch",
            dose: "2 rounds of 20 seconds each",
            how: "Sit with soles together and flap the knees, then stand and stretch up tall like a rocket.",
          },
        ],
        cues: [
          "Land quietly — quiet feet mean gentle knees.",
          "Count out loud, it keeps the breathing going.",
          "Water break at the end, always.",
        ],
        safety:
          "Bare feet or grippy shoes on a non-slip floor, and no jumping on beds or tiles. If anything hurts, stop the game and tell a grown-up straight away.",
      },
    },
  },

  am: {
    usman: {
      posture: {
        id: "usman-desk",
        icon: "💼",
        title: "ረጅሙን የጠረጴዛ ቀን ማስተካከያ",
        intro: "ውዴ፣ ከሰዓት በኋላ ትከሻህ ወደፊት ያዘነብላል። ይህ አጭር ልምምድ ደረትህን ይከፍታል፣ ወገብህንም ያቀላል።",
        steps: [
          "ቀጥ ብለህ ተቀመጥ፣ ሁለቱም እግሮች መሬት ላይ፣ ወገብህን ወደ ወንበሩ ጀርባ አስጠጋ።",
          "አገጭህን ወደታች ሳይሆን ቀጥታ ወደ ኋላ ሳብ፤ አምስት ቆጠራ ያዝ።",
          "ትከሻዎችህን በመሃል ሳንቲም እንደያዝክ አድርገህ አጣብቅ፣ አምስት ቆጥረህ ልቀቅ።",
          "ተነስተህ ሁለቱን እጆች ወገብህ ላይ አድርገህ በቀስታ ወደ ኋላ ዘንበል በል፤ ሦስት ትንፋሽ።",
          "እያንዳንዱን ትከሻ ወደ ኋላ አሥር ጊዜ አሽከርክር፤ ስትለቅ ተንፍስ።",
        ],
        tips: [
          "የስክሪኑ የላይኛው ጫፍ ከዓይንህ ጋር እኩል ይሁን — ከላፕቶፑ ስር መጽሐፍ ማስቀመጥ ይበቃል።",
          "የስልክ ስብሰባዎችን ቆመህ አድርግ። ማታ ጀርባህ ያመሰግንሃል።",
          "ስትቀመጥ ኪስህ ውስጥ ቦርሳ አታስቀምጥ፤ ቀኑን ሙሉ ዳሌህን ያዘነብላል።",
        ],
      },
      routine: {
        id: "usman-mobility",
        icon: "🏃",
        title: "የጠረጴዛ አካል እንቅስቃሴ",
        duration: "18 ደቂቃ",
        level: "መካከለኛ — በሳምንት 4 ቀን",
        intro: "ለጠበቡ ዳሌዎች፣ ለደረቀ ጀርባና ለተጎዱ ትከሻዎች የተዘጋጀ። ምንም መሣሪያ አያስፈልግም።",
        setup: "ትንሽ ቦታ አዘጋጅ፣ ጫማህን አውልቅ፣ ጠንካራ ወንበርና ግድግዳ በአጠገብህ ይኑር።",
        rest: "በዙሮች መካከል 45 ሰከንድ፤ ትንፋሽ ካጠረህ ትንሽ ጨምር።",
        exercises: [
          { name: "የዳሌ መወጠሪያ", dose: "3 ዙር × በየጎኑ 30 ሰከንድ", how: "በአንድ ጉልበት ተንበርከክ፣ ወገብህን ወደ ውስጥ ሰብስብ፣ ዳሌህን በቀስታ ወደፊት ግፋ።" },
          { name: "የግድግዳ ክንፎች", dose: "3 ዙር × 10", how: "ጀርባና ጭንቅላት ግድግዳ ላይ፣ ክንዶች ተጣጥፈው፣ አንጓህ ግድግዳውን ሳይለቅ ወደ ላይና ታች አንሸራትት።" },
          { name: "የጀርባ ማዞሪያ", dose: "3 ዙር × በየጎኑ 8", how: "በእጅና በጉልበት ሆነህ አንድ እጅ ከጭንቅላትህ ጀርባ አድርገህ ክርንህን ወደ ላይ አዙር።" },
          { name: "የዳሌ ማንሻ", dose: "3 ዙር × 15", how: "ጀርባህ ላይ ተኛ፣ እግሮች መሬት ላይ፣ ዳሌህን አንስተህ ለአንድ ሰከንድ አጥብቅ።" },
          { name: "የእግር ጡንቻ ማንሻ", dose: "2 ዙር × 20", how: "ወንበር ይዘህ በእግር ጫፍ ተነስ፣ ላይ ላይ ቆይ፣ ሦስት ቆጥረህ ዝቅ በል።" },
        ],
        cues: ["ጉልበት በሚጠይቀው ጊዜ ተንፍስ — ትንፋሽ አትያዝ።", "እስከ ቀላል መወጠር ብቻ ሂድ፤ ህመም ድረስ አይደለም።", "ከብዛት ይልቅ ቀስታ ይሻላል።"],
        safety: "ወገብህ ከመወጠር ይልቅ ቢወጋ፣ እንቅስቃሴውን አሳንስ። ወደ እግርህ የሚወርድ ስሜት ካለ ለዛሬ አቁም።",
      },
    },
    wife: {
      posture: {
        id: "wife-carry",
        icon: "🌸",
        title: "ያለ ድካም መቆምና መሸከም",
        intro: "ቦርሳ በአንድ ትከሻ፣ ረጅም ሰዓት መቆም፣ ልጅ በዳሌ ላይ — ይህ መመሪያ አንገትሽንና ወገብሽን ያስተካክላል።",
        steps: [
          "እግሮችሽን በዳሌ ስፋት ልክ አድርገሽ ክብደትሽን በሁለቱም ተረከዞች አከፋፍዪ።",
          "ጉልበቶችሽን አትቆልፊ፤ የጎድን አጥንቶችሽ ከዳሌሽ በላይ ይቁሙ።",
          "ቦርሳውን በየአሥር ደቂቃው ከትከሻ ወደ ትከሻ ቀይሪ ወይም በደረት ላይ አሳልፊው።",
          "ማንኛውንም ነገር ስታነሺ በጉልበትና በዳሌ ጎንብሰሽ፣ ሸክሙን ወደ ደረትሽ አስጠጊ።",
          "በየሰዓቱ ቀጥ ብለሽ ቁሚ፣ ትከሻሽን ልቀቂ፣ ሦስት ጥልቅ ትንፋሽ ውሰጂ።",
        ],
        tips: [
          "ለረጅም ቀናት ጠፍጣፋና ለስላሳ ጫማ፤ ተረከዝ ለአጭር ቀን ይቆይ።",
          "ልጅ ስትሸከሚ ጎን እየቀያየርሽ — አንድ ጎን ብቻ ዳሌን ያዛባል።",
          "በቀዝቃዛ ጠዋት ትከሻሽን በሻል አሙቂ፤ ከዚያ ተለጠጪ።",
        ],
      },
      routine: {
        id: "wife-mobility",
        icon: "🕊️",
        title: "ረጋ ያለ የጥንካሬና እንቅስቃሴ ፍሰት",
        duration: "20 ደቂቃ",
        level: "ቀላል እስከ መካከለኛ — በሳምንት 3-4 ቀን",
        intro: "ለተከፈቱ ትከሻዎች፣ ለጠንካራ ወገብና ቀኑን ሙሉ ለሚሸከሙ እግሮች።",
        setup: "ለስላሳ ምንጣፍ፣ ሻርፕ ወይም ፎጣ በእጅሽ፣ እና ልትደገፊበት የምትችይው ግድግዳ።",
        rest: "በዙሮች መካከል 30-45 ሰከንድ፤ ውሃ እየጠጣሽ።",
        exercises: [
          { name: "ድመት-ላም", dose: "2 ዙር × 10 ቀስታ", how: "በእጅና በጉልበት ሆነሽ ከትንፋሽሽ ጋር ጀርባሽን አጥፊና አስተካክዪ።" },
          { name: "በሻርፕ ትከሻ መክፈቻ", dose: "3 ዙር × 10", how: "ሻርፑን በሁለት እጅ ሰፋ አድርገሽ ይዘሽ ወደ ላይና ወደ ኋላ በቀስታ አንሺ።" },
          { name: "የግድግዳ ወንበር", dose: "3 ጊዜ × 20 ሰከንድ", how: "ግድግዳ ላይ ተደግፈሽ ጉልበቶችሽ ከቁርጭምጭሚትሽ በላይ እስኪሆኑ ዝቅ በዪና ያዢ።" },
          { name: "የጎን እግር ማንሻ", dose: "3 ዙር × በየጎኑ 12", how: "በጎንሽ ተኝተሽ የላይኛውን እግር እስከ ዳሌ ከፍታ አንሺና በቁጥጥር አውርጂ።" },
          { name: "የተቀመጠ የዳሌ መወጠሪያ", dose: "2 ጊዜ × በየጎኑ 30 ሰከንድ", how: "ቀጥ ብለሽ ተቀምጠሽ አንድ ቁርጭምጭሚት በሌላው ጉልበት ላይ አድርገሽ ወደፊት ዘንበል በዪ።" },
        ],
        cues: ["በእያንዳንዱ ጥረት ላይ ረጅም ትንፋሽ አውጪ።", "ትከሻሽ ሁሌም ከጆሮሽ ራቅ ብሎ ይቆይ።", "መገጣጠሚያ ካማረረ እንቅስቃሴውን አሳንሺ እንጂ አትፍጠኚ።"],
        safety: "ጉልበትሽ በሚያመው ቀን የግድግዳ ወንበሩን ተይውና ድመት-ላሙን አርዝሚ። በኃይል የሚስብ ስሜት ማቆሚያ ምልክት ነው።",
      },
    },
    mother: {
      posture: {
        id: "mother-balance",
        icon: "🌿",
        title: "የተረጋጋ ሚዛንና ቀላል ጀርባ",
        intro: "እማዬ፣ ይህ በእግርሽ ጠንክረሽ እንድትቆሚና የጠዋቱ ድርቀት ከዳሌና ከጉልበትሽ እንዲወጣ ነው።",
        steps: [
          "ከወንበር ከመነሳትሽ በፊት ወደ ፊተኛው ጫፍ ተንሸራተችና ሁለቱን እግሮች ከጉልበትሽ ስር አድርጊ።",
          "በተረከዝሽ ገፍተሽ እጆችሽን በጭንሽ ላይ አድርገሽ ተነሺ — በበር አትያዢ።",
          "ከተነሳሽ በኋላ ሦስት ትንፋሽ ጠብቂ፤ ማዞር ካለ ያልፋል።",
          "ወደ እግርሽ ሳይሆን ወደፊት እያየሽ ተራመጂ፤ እጆችሽ በቀስታ ይወዛወዙ።",
          "ስትቀመጪ በሁለት እጅ ወንበሩን ይዘሽ በቀስታ ውረጂ።",
        ],
        tips: [
          "በጠዋት ሻል በትከሻሽ ላይ ይኑር — የሞቀ ጡንቻ በቀላሉ ይንቀሳቀሳል።",
          "በቤት ውስጥም የተዘጋና የማይንሸራተት ጫማ አድርጊ።",
          "ግድግዳ ወይም ጠንካራ ጠረጴዛ አጠገብ አድርጊው፤ ድጋፍ ሁሌ በአጠገብሽ ይሁን።",
        ],
      },
      routine: {
        id: "mother-mobility",
        icon: "🍵",
        title: "በወንበር የሚደረግ የመገጣጠሚያ እንክብካቤ",
        duration: "15 ደቂቃ",
        level: "ቀላል — በየጠዋቱ ተስማሚ",
        intro: "እያንዳንዱ እንቅስቃሴ ተቀምጦ ወይም ወንበር ተይዞ ይሠራል። ጉልበት፣ ዳሌና ትከሻን ያሟሙቃል።",
        setup: "የማይንሸራተት ወንበር፣ እግሮች መሬት ላይ፣ አንድ ብርጭቆ ውሃ በአጠገብሽ።",
        rest: "በዙሮች መካከል አንድ ሙሉ ደቂቃ — ችኮላ የለም።",
        exercises: [
          { name: "ተቀምጦ መራመድ", dose: "2 ዙር × 20 (በየእግሩ 10)", how: "ቀጥ ብለሽ ተቀምጠሽ እያንዳንዱን ጉልበት ከወንበሩ ትንሽ ከፍ አድርጊ።" },
          { name: "የጉልበት ማስተካከያ", dose: "2 ዙር × በየእግሩ 10", how: "አንዱን እግር እስከ ዳሌ ከፍታ ዘርጊ፣ ሁለት ሰከንድ ያዢ፣ በቀስታ አውርጂ።" },
          { name: "የቁርጭምጭሚት ክብ", dose: "በየአቅጣጫው 10፣ ሁለቱም እግር", how: "አንድ እግር ትንሽ አንስተሽ በእግር ጣቶችሽ ቀስ ያለ ክብ ሳሊ።" },
          { name: "መቀመጥና መነሳት", dose: "2 ዙር × 8", how: "እንደአስፈላጊነቱ የወንበሩን መደገፊያ ተጠቅመሽ በቀስታ ተነሺና ተቀመጪ።" },
          { name: "የትከሻና አንገት ማለስለሻ", dose: "10 ዙር፣ ከዚያ በየጎኑ 5", how: "ትከሻሽን ወደ ኋላ አሽከርክሪ፣ ከዚያ ጭንቅላትሽን በቀስታ ወደ ግራና ቀኝ አዙሪ።" },
        ],
        cues: ["ስትነሺ ተንፍሺ፣ ስትወርጂ ትንፋሽ ውሰጂ።", "ትንሽና የተረጋጋ ከብዙና ከሚርገበገብ ይሻላል።", "ከመቆም በፊት በተቀመጠ መራመድ አሙቂ።"],
        safety: "ራስሽ የሚዞር ከሆነ የቆሞ እንቅስቃሴ ብቻሽን አታድርጊ። የደረት መጨናነቅ፣ የትንፋሽ ማጠርና የጉልበት ስለት ህመም ካለ አቁመሽ አረፍ በዪ፣ ለሰው ንገሪ።",
      },
    },
    kids: {
      posture: {
        id: "kids-school",
        icon: "🎒",
        title: "የቦርሳና የጥናት አቋቋም",
        intro: "ትንንሽ ጀርባዎች ቀጥ ብለው እንዲቆዩ አጭርና አዝናኝ ልምምድ።",
        steps: [
          "ሁለቱንም የቦርሳ ማንጠልጠያዎች አድርጉ — አንዱን ብቻ አይደለም — ቦርሳውም ከወገብ በላይ ይቀመጥ።",
          "ጠረጴዛ ላይ ጀርባችሁን ወደ ወንበሩ አስጠግታችሁ ሁለቱን እግር መሬት ወይም ሳጥን ላይ አድርጉ።",
          "መጽሐፍና ታብሌት ወደ ላይ አዘንብሉ፤ አገጭ ወደ ደረት አይውረድ።",
          "በየሃያ ደቂቃው ተነስታችሁ ማንጎ እንደምትቀጥፉ አምስት ጊዜ ወደ ላይ ተለጠጡ።",
          "የቤት ሥራ ስትጨርሱ አሥር ጊዜ ትከሻ አሽከርክሩና ሰውነታችሁን አወዛውዙ።",
        ],
        tips: [
          "ቦርሳው ከልጁ ክብደት አንድ አሥረኛ በታች ይሁን — የዛሬውን መጽሐፍ ብቻ ጨምሩ።",
          "የመነሳት እረፍቱን በሰዓት ቆጣሪ ጨዋታ አድርጉት።",
          "ስክሪን ጠረጴዛ ላይ፤ መሬት ወይም አልጋ ላይ ተኝቶ አይሁን።",
        ],
      },
      routine: {
        id: "kids-mobility",
        icon: "🤸",
        title: "አዝናኝ የእንቅስቃሴ እረፍት",
        duration: "12 ደቂቃ",
        level: "ቀላልና አዝናኝ — በየቀኑ",
        intro: "እንደ እንስሳት የሚደረጉ እንቅስቃሴዎች ጥንካሬንና ሚዛንን ይገነባሉ፤ ልምምድም አይመስሉም።",
        setup: "ለስላሳ ወለል፣ ሁለት እጅ የሚዘረጋበት ቦታ፣ እና የሚከታተል ትልቅ ሰው።",
        rest: "በዙሮች መካከል 20-30 ሰከንድ መንቀጥቀጥና መሳቅ።",
        exercises: [
          { name: "የድብ አረማመድ", dose: "3 ዙር × 10 እርምጃ", how: "እጅና እግር መሬት ላይ፣ ጉልበት ትንሽ ከፍ ብሎ፣ እንደ ድብ በቀስታ ተራመዱ።" },
          { name: "የፍላሚንጎ ሚዛን", dose: "3 ጊዜ × በየእግሩ 15 ሰከንድ", how: "በአንድ እግር ቁሙ፣ እጆች ተዘርግተው፣ ጮክ ብላችሁ ቁጠሩ፣ ከዚያ ቀይሩ።" },
          { name: "የእንቁራሪት ዝላይ", dose: "2 ዙር × 8", how: "ዝቅ ብላችሁ ቁጭ በሉና በሁለት እግር ዘልላችሁ በተጣጠፈ ጉልበት በዝግታ አረፉ።" },
          { name: "የሸርጣን ዝርጋታ", dose: "2 ዙር × በየጎኑ 8", how: "እጆች ከጀርባ ሆነው ተቀመጡ፣ ዳሌ አንሱና አንዱን እጅ ወደ ተቃራኒው እግር ዘርጉ።" },
          { name: "ቢራቢሮና ሮኬት", dose: "2 ዙር × 20 ሰከንድ", how: "የእግር ጫማዎቻችሁን አገናኝታችሁ ጉልበት አወዛውዙ፣ ከዚያ ተነስታችሁ እንደ ሮኬት ተለጠጡ።" },
        ],
        cues: ["በዝግታ አርፉ — ጸጥ ያለ እግር ለጉልበት ደግ ነው።", "ጮክ ብላችሁ ቁጠሩ፤ ትንፋሽ እንዲቀጥል ይረዳል።", "መጨረሻ ላይ ውሃ ጠጡ።"],
        safety: "የማይንሸራተት ወለል ላይ ባዶ እግር ወይም ጠንካራ ጫማ፤ አልጋ ወይም ሴራሚክ ላይ አትዝለሉ። የሚያመው ነገር ካለ ወዲያውኑ አቁመው ለትልቅ ሰው ንገሩ።",
      },
    },
  },

  om: {
    usman: {
      posture: {
        id: "usman-desk",
        icon: "💼",
        title: "Guyyaa minjaalaa dheeraa sirreessuu",
        intro:
          "Yaa jaalallee, waaree booda gatiittiin kee gara fuulduraatti gadi jedha. Shaakalli gabaabaan kun laphee bana, mudhii kees ni salphisa.",
        steps: [
          "Qajeelaa taa'i, miilli lamaan lafa irra, mudhii kee guutummaatti barcuma duubatti dhiibi.",
          "Areeda kee gadi utuu hin taane kallattiidhaan duubatti harkisi; shan lakkaa'i.",
          "Akka waan qarshii gidduu qabdutti gatiittii kee walitti dhiibi, shan lakkaa'ii gad dhiisi.",
          "Ka'ii harka lamaan mudhii kee irra kaa'ii suuta duubatti gadi jedhi; hafuura sadii.",
          "Gatiittii tokkoon tokkoon isaanii duubatti si'a kudhan naanneessi; yeroo gad dhiiftu hafuura baasi.",
        ],
        tips: [
          "Fiixeen iskiriinii ija kee wajjin wal qixa haa ta'u — laaptooppii jalatti kitaaba kaa'uun ni ga'a.",
          "Walga'ii bilbilaa dhaabbattee godhi. Galgala dugdi kee si galateeffata.",
          "Yeroo teessu boorsaa kee kiisha duubaa keessaa baasi; guyyaa guutuu mudhii kee jal'isa.",
        ],
      },
      routine: {
        id: "usman-mobility",
        icon: "🏃",
        title: "Sochii qaama minjaalaa deebisu",
        duration: "Daqiiqaa 18",
        level: "Giddu galeessa — torbeetti guyyaa 4",
        intro: "Mudhii dhiphateef, dugda gogeef fi gatiittii kompiitara irra jiraatuuf qophaa'e. Meeshaan hin barbaachisu.",
        setup: "Bakka xiqqoo qulqulleessi, kophee kee baasi, barcuma jabaa fi keenyan manaa dhihoo qabaadhu.",
        rest: "Marsaa gidduu sekondii 45; hafuurri yoo si hanqate dabali.",
        exercises: [
          { name: "Diriirsa mudhii lunjii", dose: "Marsaa 3 × cinaacha tokkoon sekondii 30", how: "Jilba tokkoon jilbeenfadhu, mudhii keessatti hammadhu, mudhii suuta gara fuulduraatti dhiibi." },
          { name: "Ergamtoota keenyan manaa", dose: "Marsaa 3 × 10", how: "Dugdaa fi mataan keenyan irra, harki akka utubaatti dabame, harka keenyan irraa osoo hin fuudhin ol gadi oofi." },
          { name: "Naanna'uu dugda ol'aanaa", dose: "Marsaa 3 × cinaacha tokkoon 8", how: "Harkaa fi jilbaan, harka tokko mataa duuba kaa'ii ciqilee gara samiitti naanneessi, ijaanis hordofi." },
          { name: "Riqicha mudhii", dose: "Marsaa 3 × 15", how: "Dugda kee irra ciisi, miilli lafa irra, mudhii ol kaasii sekondii tokkoof dhiibi." },
          { name: "Ol ka'iinsa luka", dose: "Marsaa 2 × 20", how: "Barcuma qabadhuu fiixee miillaa irratti ol ka'i, gubbaatti turi, sadii lakkaa'ii gadi bu'i." },
        ],
        cues: ["Yeroo humna baastu hafuura baasi — hafuura hin qabin.", "Hamma harkifannaa laafaatti qofa deemi.", "Baay'ina caalaa suuta ta'uun gaarii dha."],
        safety: "Mudhiin kee yoo waraanuu jalqabe, sochii gabaabsi. Miilla keetti wanti si dhukkubu yoo jiraate guyyaa sana dhaabi.",
      },
    },
    wife: {
      posture: {
        id: "wife-carry",
        icon: "🌸",
        title: "Osoo hin dadhabin dhaabbachuu fi baachuu",
        intro: "Boorsaa gatiittii tokko irra, sa'aatii dheeraa dhaabbachuu, mucaa mudhii irratti — qajeelfamni kun morma fi mudhii kee wal qixxeessa.",
        steps: [
          "Miilla hamma bal'ina mudhii adda baasii ulfaatina koomee lamaan irratti qoodi.",
          "Jilba hin cufin; cinaachi kee mudhii kee irratti haa dhaabbatu.",
          "Boorsaa daqiiqaa kudhan hunda gatiittii jijjiiri ykn qaama kee irra dabarsi.",
          "Yeroo waa ol fuutu jilbaa fi mudhiin gadi jedhi, ba'aa laphee keetti dhiheessi.",
          "Sa'aatii hunda qajeelaa dhaabadhu, gatiittii gad dhiisi, hafuura sadii suuta fudhu.",
        ],
        tips: [
          "Guyyaa dheeraaf kophee diriiraa fi laafaa; kan koomee dheeraa guyyaa gabaabaaf.",
          "Mucaa yoo baattu cinaacha jijjiiraa — tokkuma irratti baachuun mudhii jal'isa.",
          "Ganama qorraan gatiittii kee shaalliin ho'isi, achumaan diriirsi.",
        ],
      },
      routine: {
        id: "wife-mobility",
        icon: "🕊️",
        title: "Yaa'insa jabinaa fi sochii suutaa",
        duration: "Daqiiqaa 20",
        level: "Salphaa hanga giddu galeessaa — torbeetti guyyaa 3-4",
        intro: "Gatiittii banaaf, mudhii jabaataaf fi miilla guyyaa guutuu si baatuuf.",
        setup: "Afata laafaa, shaalii ykn haguuggii harkatti, fi keenyan itti irkattu.",
        rest: "Marsaa gidduu sekondii 30-45; bishaan dhugaa deemi.",
        exercises: [
          { name: "Adurree-sa'a", dose: "Marsaa 2 × 10 suuta", how: "Harkaa fi jilbaan, hafuura kee wajjin dugda ol kaasii gad deebisi." },
          { name: "Banaa gatiittii shaaliin", dose: "Marsaa 3 × 10", how: "Shaalii harka lamaan bal'isii qabi, mataa ol kaasii suuta duubatti oofi." },
          { name: "Teessuma keenyanii", dose: "Si'a 3 × sekondii 20", how: "Keenyan irra gadi seeni hanga jilbi koronyoo ol ta'utti, dugda diriiraan qabi." },
          { name: "Ol ka'iinsa miilla cinaachaan", dose: "Marsaa 3 × cinaacha tokkoon 12", how: "Cinaacha kee irra ciisii miilla gubbaa hanga mudhiitti ol kaasi, to'annaadhaan gadi buusi." },
          { name: "Diriirsa lakkoofsa afurii teessee", dose: "Si'a 2 × cinaacha tokkoon sekondii 30", how: "Qajeelaa taa'ii koronyoo tokko jilba faallaa irra kaa'ii mudhiidhaan gara fuulduraatti gadi jedhi." },
        ],
        cues: ["Yeroo hunda humna yeroo baastu hafuura dheeraa baasi.", "Gatiittiin gurra irraa fagaatee haa turu.", "Buusaan yoo dhukkube sochii xiqqeessi malee hin ariifatin."],
        safety: "Guyyaa jilbi si dhukkubu teessuma keenyanii dhiisii adurree-sa'a dheeressi. Wanti humnaan si harkisu mallattoo dhaabuuti.",
      },
    },
    mother: {
      posture: {
        id: "mother-balance",
        icon: "🌿",
        title: "Madaallii tasgabbaa'aa fi dugda salphaa",
        intro: "Yaa haadha koo, kun miilla kee irratti akka jabaattee dhaabbattuu fi gogiinsi ganamaa mudhii fi jilba kee keessaa akka ba'uufi.",
        steps: [
          "Barcuma irraa ka'uu dura fuulduraatti siqi, miilla lamaan jilba kee jala kaa'i.",
          "Koomee keetiin dhiibi, harka gudeeda irra kaa'ii ka'i — balbala hin harkisin.",
          "Erga ka'tee hafuura sadii eegi; mataa naanna'uun yoo jiraate ni darba.",
          "Miilla kee gadi ilaaluu mannaa fuulduratti ilaalii deemi; harki kee suuta haa raafamu.",
          "Yeroo deebitee teessu harka lamaan barcuma qabadhuutii suuta gadi bu'i.",
        ],
        tips: [
          "Ganama barii shaalii ho'aa gatiittii kee irra kaa'i — maashaan ho'e salphaatti socho'a.",
          "Mana keessattis kophee cufaa fi hin mucucaanne kaa'i.",
          "Keenyan ykn minjaala jabaa bira godhi; gargaarsi yeroo hunda si bira haa jiraatu.",
        ],
      },
      routine: {
        id: "mother-mobility",
        icon: "🍵",
        title: "Kunuunsa buusaa barcuma irratti",
        duration: "Daqiiqaa 15",
        level: "Salphaa — ganama hunda gaarii dha",
        intro: "Sochiin hundi taa'anii ykn barcuma qabatanii hojjetama. Jilba, mudhii fi gatiittii ni ho'isa.",
        setup: "Barcuma hin mucucanne, miilli lafa irra, bishaan bira kaa'i.",
        rest: "Marsaa gidduu daqiiqaa guutuu tokko — ariifachuun hin jiru.",
        exercises: [
          { name: "Deemsa taa'anii", dose: "Marsaa 2 × 20 (miilla tokkoon 10)", how: "Qajeelaa taa'ii jilba tokkoon tokkoon isaa barcuma irraa xiqqoo ol kaasi." },
          { name: "Diriirsa jilbaa", dose: "Marsaa 2 × miilla tokkoon 10", how: "Miilla tokko hanga mudhiitti diriirsi, sekondii lama qabi, suuta gadi buusi." },
          { name: "Naanna'uu koronyoo", dose: "Kallattii tokkoon 10, miilla lamaan", how: "Miilla tokko xiqqoo ol kaasii fiixee miillaatiin geengoo suutaa kaasi." },
          { name: "Taa'anii ka'uu", dose: "Marsaa 2 × 8", how: "Hamma si barbaachisu qofa irkoo barcumaa fayyadamii suuta ka'ii teessu." },
          { name: "Laaffisa gatiittii fi mormaa", dose: "Naannessa 10, achiis cinaacha tokkoon 5", how: "Gatiittii duubatti naanneessi, achiis mataa suuta gara mirgaa fi bitaatti garagalchi." },
        ],
        cues: ["Yeroo oltu hafuura baasi, yeroo gadi buutu fudhadhu.", "Xiqqaa fi tasgabbaa'aan guddaa raafamaa caala.", "Dhaabbachuu dura deemsa taa'aniin ho'isi."],
        safety: "Yoo mataan si naanna'e sochii dhaabbatanii kophaa hin godhin. Dhiphinni laphee, hafuura hanqachuu ykn dhukkubbiin jilbaa cimaan yoo jiraate dhaabii boqodhu, namattis himi.",
      },
    },
    kids: {
      posture: {
        id: "kids-school",
        icon: "🎒",
        title: "Dhaabbii boorsaa fi barnootaa",
        intro: "Dugdi xiqqoon qajeelaa akka turuuf, mirkaneessa gabaabaa fi taphaan guutame.",
        steps: [
          "Hidhaa boorsaa lamaanuu godhadhaa — tokko qofa miti — boorsaanis mudhii ol haa taa'u.",
          "Minjaala biratti dugda barcuma duubatti dhiheessaatii miilla lamaan lafa ykn saanduqa irra kaa'aa.",
          "Kitaabaa fi taableetii ol jal'isaa; areedni gara laphee gadi hin bu'in.",
          "Daqiiqaa digdama hunda ka'aatii akka maangoo cirtanitti si'a shan ol diriiraa.",
          "Hojii manaa yeroo xumurtan si'a kudhan gatiittii naanneessaatii qaama keessan raasaa.",
        ],
        tips: [
          "Boorsaan ulfaatina mucaa harka kudhan keessaa tokko gadi haa ta'u — kitaaba har'aa qofa kaa'aa.",
          "Boqonnaa ka'umsaa sa'aatii qabuun tapha godhaa.",
          "Iskiriinii minjaala irra; lafa ykn siree irra ciisanii hin ilaalinaa.",
        ],
      },
      routine: {
        id: "kids-mobility",
        icon: "🤸",
        title: "Boqonnaa sochii taphaa",
        duration: "Daqiiqaa 12",
        level: "Salphaa fi gammachiisaa — guyyaa hunda",
        intro: "Sochiin bineensotaa jabinaa fi madaallii ijaara, taphaan malee shaakala hin fakkaatu.",
        setup: "Lafa laafaa, bakka harka lamaan diriirsan, fi nama guddaan waliin jiru.",
        rest: "Marsaa gidduu sekondii 20-30 raafamuu fi kolfa.",
        exercises: [
          { name: "Deemsa amaaketaa", dose: "Marsaa 3 × tarkaanfii 10", how: "Harkaa fi miilla lafa irra, jilbi xiqqoo ol ka'ee, akka amaaketaa suuta deemaa." },
          { name: "Madaallii filaamingoo", dose: "Si'a 3 × miilla tokkoon sekondii 15", how: "Miilla tokkoon dhaabadhaa, harka bal'isaa, sagalee guddaan lakkaa'aatii jijjiiraa." },
          { name: "Utaalcha fattee", dose: "Marsaa 2 × 8", how: "Gadi taa'aatii miilla lamaan utaalaa, jilba dabsitanii suuta lafa qabadhaa." },
          { name: "Diriirsa qocaa", dose: "Marsaa 2 × cinaacha tokkoon 8", how: "Harka duuba keessanitti kaa'aa taa'aa, mudhii ol kaasaatii harka tokko miilla faallaatti diriirsaa." },
          { name: "Bilaacha fi rookeetii", dose: "Marsaa 2 × sekondii 20", how: "Faana miillaa walitti qabaatii jilba raasaa, achiis ka'aatii akka rookeetii ol diriiraa." },
        ],
        cues: ["Suuta lafa qabadhaa — miilli calluu jilbaaf gaarii dha.", "Sagalee guddaan lakkaa'aa, hafuurri akka itti fufu.", "Dhuma irratti bishaan dhugaa."],
        safety: "Lafa hin mucucanne irratti miilla duwwaa ykn kophee cimaa; siree ykn seeraamikaa irratti hin utaalinaa. Wanti isin dhukkubu yoo jiraate taphicha dhaabaatii nama guddaatti himaa.",
      },
    },
  },
};
