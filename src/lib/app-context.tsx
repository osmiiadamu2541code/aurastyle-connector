import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { translate, type Lang, type ProfileId, PROFILE_NAMES } from "./i18n";

type AppState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  profile: ProfileId;
  setProfile: (p: ProfileId) => void;
  t: (key: string) => string;
  profileName: (p?: ProfileId) => string;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [profile, setProfileState] = useState<ProfileId>("usman");

  useEffect(() => {
    const savedLang = localStorage.getItem("aura.lang") as Lang | null;
    const savedProfile = localStorage.getItem("aura.profile") as ProfileId | null;
    if (savedLang) setLangState(savedLang);
    if (savedProfile) setProfileState(savedProfile);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("aura.lang", l);
  }, []);

  const setProfile = useCallback((p: ProfileId) => {
    setProfileState(p);
    localStorage.setItem("aura.profile", p);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      lang,
      setLang,
      profile,
      setProfile,
      t: (key: string) => translate(lang, key),
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
