import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { OutfitVisualizer } from "@/components/OutfitVisualizer";
import { useApp } from "@/lib/app-context";
import { fetchAvatar } from "@/lib/avatars";
import { fetchWardrobe } from "@/lib/wardrobe";
import { CONDITION_LABEL, getTodayWeather, OUTFIT } from "@/lib/content";
import {
  bottomSize,
  fetchMeasurements,
  FIT_COPY,
  fitLabelKey,
  LAYERING_COPY,
  topSize,
  type PreferredFit,
} from "@/lib/measurements";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AuraStyle AI — Your caring daily stylist" },
      {
        name: "description",
        content:
          "Warm, motherly outfit advice for today's weather, a smart family wardrobe, and gentle posture and workout guides — in English, Amharic and Afaan Oromoo.",
      },
      { property: "og:title", content: "AuraStyle AI — Your caring daily stylist" },
      {
        property: "og:description",
        content: "Daily weather-aware outfit advice with the warmth of a mother's care.",
      },
    ],
  }),
  component: Home,
});

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return "greetingMorning";
  if (h < 18) return "greetingAfternoon";
  return "greetingEvening";
}

function Home() {
  const { t, lang, profile, profileName } = useApp();
  const weather = getTodayWeather();
  const advice = OUTFIT[lang][profile][weather.condition];
  const { data: fit } = useQuery({
    queryKey: ["measurements", profile],
    queryFn: () => fetchMeasurements(profile),
  });
  const fitKey = fitLabelKey(fit?.preferred_fit ?? "regular") as PreferredFit;
  const copy = FIT_COPY[lang][profile];
  const layering = LAYERING_COPY[lang][weather.condition][fitKey];
  const { data: avatar } = useQuery({ queryKey: ["avatar", profile], queryFn: () => fetchAvatar(profile) });
  const { data: closet } = useQuery({ queryKey: ["wardrobe", profile], queryFn: () => fetchWardrobe(profile) });

  const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 3);
  const board = advice.pieces.slice(0, 3).map((piece, i) => {
    const pw = words(piece);
    let best: { photo: string | null; icon: string } | null = null;
    let bestScore = 0;
    for (const item of closet ?? []) {
      const iw = words(`${item.name} ${item.name_am ?? ""} ${item.name_om ?? ""}`);
      const score = iw.filter((w) => pw.includes(w)).length;
      if (score > bestScore) {
        bestScore = score;
        best = { photo: item.photo_url ?? null, icon: item.icon };
      }
    }
    return {
      key: `${piece}-${i}`,
      label: piece,
      photo: best?.photo ?? null,
      icon: best?.icon ?? ["👕", "🧥", "👟"][i % 3],
    };
  });

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <p className="font-display text-2xl leading-snug font-semibold text-foreground">
          {t(greetingKey())} 🤍
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {profileName()} · {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-primary/90 to-accent p-5 text-primary-foreground shadow-warm-lg">
        <p className="text-[11px] font-medium tracking-widest uppercase opacity-80">{t("todayWeather")}</p>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="font-display text-4xl font-semibold">{weather.temp}°C</p>
            <p className="truncate text-sm opacity-90">{CONDITION_LABEL[lang][weather.condition]}</p>
          </div>
          <span className="shrink-0 text-5xl">{weather.icon}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
          {[
            [t("feelsLike"), `${weather.feels}°C`],
            [t("humidity"), `${weather.humidity}%`],
            [t("wind"), `${weather.wind} km/h`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-primary-foreground/15 px-2 py-2">
              <p className="opacity-80">{label}</p>
              <p className="mt-0.5 text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-primary/25 bg-linear-to-br from-cream to-sand/40 p-5 shadow-warm">
        <h2 className="font-display text-lg font-semibold">{t("styleBoard")}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{t("styleBoardHint")}</p>
        <div className="mt-4 flex items-start gap-3">
          <div className="shrink-0 text-center">
            {avatar?.url ? (
              <img
                src={avatar.url}
                alt={profileName()}
                className="h-20 w-20 rounded-3xl border-2 border-primary/40 object-cover shadow-warm"
              />
            ) : (
              <Link
                to="/measurements"
                className="grid h-20 w-20 place-items-center rounded-3xl border-2 border-dashed border-primary/40 bg-card text-2xl"
              >
                📷
              </Link>
            )}
            <p className="mt-1.5 max-w-20 truncate text-[11px] font-medium text-muted-foreground">
              {avatar?.url ? profileName() : t("addYourPhoto")}
            </p>
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-3 gap-2">
            {board.map((tile) => (
              <div key={tile.key} className="min-w-0">
                <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-linear-to-br from-honey/40 to-sand/50">
                  {tile.photo ? (
                    <img src={tile.photo} alt={tile.label} className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-2xl">{tile.icon}</span>
                  )}
                </div>
                <p className="mt-1 truncate text-[10px] text-muted-foreground">{tile.label}</p>
                <p className="truncate text-[9px] text-primary">
                  {tile.photo ? t("fromCloset") : t("suggestedPiece")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OutfitVisualizer pieces={advice.pieces} items={closet ?? []} avatarUrl={avatar?.url ?? null} />

      <section className="rounded-3xl border border-border bg-card p-5 shadow-warm">
        <h2 className="font-display text-lg font-semibold">{t("outfitTitle")}</h2>
        <ul className="mt-3 space-y-2">
          {advice.pieces.map((piece) => (
            <li key={piece} className="flex items-start gap-2.5 rounded-2xl bg-secondary px-3 py-2.5 text-sm">
              <span className="mt-0.5 text-base">🧷</span>
              <span className="leading-relaxed">{piece}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {t("whyTitle")}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{advice.why}</p>

        <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/8 p-4">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">{t("motherNote")}</p>
          <p className="mt-1.5 text-sm leading-relaxed italic text-foreground/85">{advice.note}</p>
        </div>

        <Link
          to="/wardrobe"
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-warm"
        >
          {t("navWardrobe")} →
        </Link>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-warm">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">{t("fitCardTitle")}</h2>
          <Link
            to="/measurements"
            className="shrink-0 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-medium text-primary"
          >
            {t("editFit")}
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-secondary px-2 py-2">
            <p className="text-[10px] text-muted-foreground">{t("suggestedFit")}</p>
            <p className="mt-0.5 text-sm font-semibold">{t(fitKey)}</p>
          </div>
          <div className="rounded-2xl bg-secondary px-2 py-2">
            <p className="text-[10px] text-muted-foreground">{t("sizeTop")}</p>
            <p className="mt-0.5 text-sm font-semibold">{topSize(fit ?? null) ?? "—"}</p>
          </div>
          <div className="rounded-2xl bg-secondary px-2 py-2">
            <p className="text-[10px] text-muted-foreground">{t("sizeBottom")}</p>
            <p className="mt-0.5 text-sm font-semibold">{bottomSize(fit ?? null) ?? "—"}</p>
          </div>
        </div>

        {[
          [t("silhouette"), copy.silhouette],
          [t("postureFriendly"), copy.posture],
          [t("comfortFirst"), copy.comfort],
          [t("layeringToday"), layering],
        ].map(([label, body]) => (
          <div key={label} className="mt-4">
            <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{label}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{body}</p>
          </div>
        ))}

        {fit && (fit.comfort_needs || fit.posture_notes || fit.mobility_notes) ? (
          <ul className="mt-4 space-y-2">
            {[fit.comfort_needs, fit.posture_notes, fit.mobility_notes]
              .filter(Boolean)
              .map((line) => (
                <li key={line} className="flex items-start gap-2 rounded-2xl bg-secondary px-3 py-2.5 text-sm leading-relaxed">
                  <span className="mt-0.5">🤍</span>
                  <span>{line}</span>
                </li>
              ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">{t("noMeasurements")}</p>
        )}
      </section>
    </div>
  );
}
