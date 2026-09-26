import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { fetchAllAvatars } from "@/lib/avatars";
import { useApp } from "@/lib/app-context";
import { LANGS, PROFILE_NAMES, type Lang } from "@/lib/i18n";
import { PROFILE_ICONS, PROFILE_ORDER } from "@/lib/profile-icons";

export function AppHeader() {
  const { lang, setLang, profile, setProfile, t } = useApp();
  const { data: avatars } = useQuery({
    queryKey: ["avatars"],
    queryFn: fetchAllAvatars,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-linear-to-b from-cream to-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-2xl px-4 pb-3 pt-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-primary to-accent text-lg shadow-warm">
              ✨
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg leading-tight font-semibold text-foreground">
                {t("appName")}
              </h1>
              <p className="truncate text-[11px] text-muted-foreground">{t("tagline")}</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-1 rounded-full bg-secondary p-1">
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id as Lang)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  lang === l.id
                    ? "bg-primary text-primary-foreground shadow-warm"
                    : "text-secondary-foreground hover:bg-background/60"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{t("profile")}</p>
            <Link
              to="/measurements"
              className="shrink-0 rounded-full border border-primary/30 bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary"
            >
              📏 {t("measurements")}
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PROFILE_ORDER.map((p) => (
              <button
                key={p}
                onClick={() => setProfile(p)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  profile === p
                    ? "border-primary bg-primary/12 text-primary shadow-warm"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {avatars?.[p] ? (
                  <img
                    src={avatars[p]}
                    alt={PROFILE_NAMES[lang][p]}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm">{PROFILE_ICONS[p]}</span>
                )}
                {PROFILE_NAMES[lang][p]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
