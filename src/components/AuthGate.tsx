import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import auraMark from "@/assets/aura-mark.png";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { seedFamily } from "@/lib/family.functions";

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const queryClient = useQueryClient();
  const seed = useServerFn(seedFamily);
  const seededFor = useRef<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "SIGNED_OUT") queryClient.clear();
    });
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);

  useEffect(() => {
    const uid = session?.user.id;
    if (!uid || seededFor.current === uid) return;
    seededFor.current = uid;
    seed()
      .then(() => queryClient.invalidateQueries())
      .catch((e) => console.error("Family setup failed", e));
  }, [session, seed, queryClient]);

  if (session === undefined) {
    return <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!session) return <SignIn />;
  return <>{children}</>;
}

function SignIn() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) toast.success("Check your email to confirm the family account, then sign in.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res?.error) toast.error(res.error.message ?? "Google sign in failed");
  }

  return (
    <div className="px-5 py-8">
      <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6 shadow-warm-lg">
        <img src={auraMark} alt="Aura" width={72} height={72} className="mx-auto h-18 w-18" />
        <h2 className="mt-3 text-center font-display text-2xl font-semibold">Welcome home</h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          One private family account keeps everyone's photos, wardrobe and chats safe.
        </p>
        <button
          onClick={google}
          className="mt-5 w-full rounded-full border border-border bg-background py-2.5 text-sm font-semibold"
        >
          Continue with Google
        </button>
        <div className="my-4 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Family email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <button
            disabled={busy}
            className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-warm disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create family account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="mt-4 w-full text-center text-xs font-medium text-primary"
        >
          {mode === "in" ? "New here? Create the family account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
