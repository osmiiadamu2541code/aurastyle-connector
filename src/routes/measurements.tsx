import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AvatarPicker } from "@/components/AvatarPicker";
import { useApp } from "@/lib/app-context";
import {
  fetchMeasurements,
  localizedMeasurementNotes,
  PREFERRED_FITS,
  saveMeasurements,
  type MeasurementsDraft,
} from "@/lib/measurements";

export const Route = createFileRoute("/measurements")({
  head: () => ({
    meta: [
      { title: "Size & Fit — AuraStyle AI" },
      {
        name: "description",
        content:
          "Keep gentle, private size and fit details for every family member — height, measurements, preferred fit, comfort needs and posture notes — so every outfit suggestion truly fits.",
      },
      { property: "og:title", content: "Size & Fit — AuraStyle AI" },
      {
        property: "og:description",
        content: "Per-profile measurements, preferred fit and comfort notes that shape every outfit suggestion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MeasurementsPage,
});

const EMPTY: MeasurementsDraft = {
  height_cm: null,
  weight_kg: null,
  chest_cm: null,
  waist_cm: null,
  hips_cm: null,
  shoulder_cm: null,
  inseam_cm: null,
  preferred_fit: "regular",
  comfort_needs: "",
  posture_notes: "",
  mobility_notes: "",
};

function MeasurementsPage() {
  const { t, lang, profile, profileName } = useApp();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<MeasurementsDraft>(EMPTY);

  const { data, isLoading } = useQuery({
    queryKey: ["measurements", profile],
    queryFn: () => fetchMeasurements(profile),
  });

  useEffect(() => {
    if (data) {
      const shown = localizedMeasurementNotes(data, profile, lang);
      setDraft({ height_cm: shown.height_cm, weight_kg: shown.weight_kg, chest_cm: shown.chest_cm, waist_cm: shown.waist_cm, hips_cm: shown.hips_cm, shoulder_cm: shown.shoulder_cm, inseam_cm: shown.inseam_cm, preferred_fit: shown.preferred_fit, comfort_needs: shown.comfort_needs, posture_notes: shown.posture_notes, mobility_notes: shown.mobility_notes });
    } else {
      setDraft(EMPTY);
    }
  }, [data, lang, profile]);

  const save = useMutation({
    mutationFn: () => saveMeasurements(profile, draft),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["measurements", profile] });
      toast.success(t("fitSaved"));
    },
    onError: () => toast.error(t("somethingWrong")),
  });

  const numberField = (key: keyof MeasurementsDraft, label: string, unit: string, optional = false) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {label} <span className="text-[10px] opacity-70">({optional ? `${t("optional")} · ` : ""}{unit})</span>
      </label>
      <input
        inputMode="decimal"
        value={draft[key] === null ? "" : String(draft[key])}
        onChange={(e) => {
          const v = e.target.value.trim();
          setDraft({ ...draft, [key]: v === "" ? null : Number(v) });
        }}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </div>
  );

  const textArea = (key: keyof MeasurementsDraft, label: string, placeholder: string) => (
    <div className="mt-3">
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {label} <span className="text-[10px] opacity-70">({t("optional")})</span>
      </label>
      <textarea
        rows={3}
        value={String(draft[key] ?? "")}
        placeholder={placeholder}
        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </div>
  );

  return (
    <div className="px-4 py-4">
      <h1 className="font-display text-2xl font-semibold">{t("measurementsTitle")}</h1>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {profileName()} · {t("measurementsSub")}
      </p>

      <p className="mt-3 rounded-3xl border border-primary/25 bg-primary/8 p-4 text-sm leading-relaxed text-foreground/85">
        {t("measurementsIntro")}
      </p>

      <AvatarPicker />

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{t("loading")}</p>
      ) : (
        <div className="mt-4 rounded-3xl border border-border bg-card p-4 shadow-warm">
          <div className="grid grid-cols-2 gap-3">
            {numberField("height_cm", t("height"), t("cmUnit"))}
            {numberField("weight_kg", t("weight"), t("kgUnit"), true)}
            {numberField("chest_cm", t("chest"), t("cmUnit"), true)}
            {numberField("waist_cm", t("waist"), t("cmUnit"), true)}
            {numberField("hips_cm", t("hips"), t("cmUnit"), true)}
            {numberField("shoulder_cm", t("shoulder"), t("cmUnit"), true)}
            {numberField("inseam_cm", t("inseam"), t("cmUnit"), true)}
          </div>

          <p className="mt-4 mb-1.5 text-xs font-medium text-muted-foreground">{t("preferredFit")}</p>
          <div className="flex gap-2">
            {PREFERRED_FITS.map((f) => (
              <button
                key={f}
                onClick={() => setDraft({ ...draft, preferred_fit: f })}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                  draft.preferred_fit === f
                    ? "border-primary bg-primary/12 text-primary"
                    : "border-border bg-secondary text-muted-foreground"
                }`}
              >
                {t(f)}
              </button>
            ))}
          </div>

          {textArea("comfort_needs", t("comfortNeeds"), t("comfortPlaceholder"))}
          {textArea("posture_notes", t("postureNotes"), t("posturePlaceholder"))}
          {textArea("mobility_notes", t("mobilityNotes"), t("mobilityPlaceholder"))}

          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{t("editHint")}</p>

          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="mt-3 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-warm disabled:opacity-60"
          >
            {save.isPending ? t("savingFit") : t("saveFit")}
          </button>
        </div>
      )}
    </div>
  );
}
