import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { isLang, langInfo, PROFILE_NAMES, tFor, type Lang, type ProfileId } from "./i18n";
import { txFor, type Tx } from "./tx";

type AppState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  profile: ProfileId;
  setProfile: (p: ProfileId) => void;
  t: (key: string) => string;
  /** Translate an English phrase. Supports {var} placeholders. */
  tx: Tx;
  profileName: (p?: ProfileId) => string;
};

const AppContext = createContext<AppState | null>(null);

const PROFILES: ProfileId[] = ["usman", "wife", "mother", "kids"];

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [profile, setProfileState] = useState<ProfileId>("usman");

  useEffect(() => {
    const savedLang = localStorage.getItem("aura.lang");
    const savedProfile = localStorage.getItem("aura.profile") as ProfileId | null;
    if (isLang(savedLang)) setLangState(savedLang);
    if (savedProfile && PROFILES.includes(savedProfile)) setProfileState(savedProfile);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = langInfo(lang).dir;
  }, [lang]);

  // Translations are already in memory; a transition keeps taps responsive while every screen re-renders.
  const setLang = useCallback((l: Lang) => {
    localStorage.setItem("aura.lang", l);
    startTransition(() => setLangState(l));
  }, []);

  const setProfile = useCallback((p: ProfileId) => {
    localStorage.setItem("aura.profile", p);
    startTransition(() => setProfileState(p));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      lang,
      setLang,
      profile,
      setProfile,
      t: tFor(lang),
      tx: txFor(lang),
      profileName: (p?: ProfileId) => PROFILE_NAMES[lang][p ?? profile],
    }),
    [lang, profile, setLang, setProfile],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
