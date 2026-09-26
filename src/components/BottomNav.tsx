import { Link } from "@tanstack/react-router";

import { useApp } from "@/lib/app-context";

export function BottomNav() {
  const { t } = useApp();

  const tabs = [
    { to: "/", icon: "🏡", label: t("navHome") },
    { to: "/wardrobe", icon: "🧺", label: t("navWardrobe") },
    { to: "/aurafit", icon: "🧘", label: t("navFit") },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors"
            activeOptions={{ exact: tab.to === "/" }}
            activeProps={{ className: "!text-primary" }}
          >
            {({ isActive }) => (
              <>
                <span
                  className={`grid h-8 w-14 place-items-center rounded-full text-base transition-colors ${
                    isActive ? "bg-primary/12" : ""
                  }`}
                >
                  {tab.icon}
                </span>
                {tab.label}
              </>
            )}
          </Link>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
