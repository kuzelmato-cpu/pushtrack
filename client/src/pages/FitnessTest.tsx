// PushTrack — Fitness Test Screen
// Design: Minimal Dark Precision / Sports Analytics

import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Zap, Award, TrendingUp } from "lucide-react";
import { saveFitnessTest, detectFitnessLevel, suggestMonthlyGoal } from "../lib/fitness";
import { usePushTrack } from "../contexts/PushTrackContext";
import { toast } from "sonner";

const LEVEL_COLORS = {
  beginner: { bg: "#FF5252", light: "oklch(0.65 0.22 25 / 15%)" },
  intermediate: { bg: "#FFD166", light: "oklch(0.82 0.16 85 / 15%)" },
  beast: { bg: "#4FFFB0", light: "oklch(0.88 0.18 155 / 15%)" },
};

const LEVEL_DESCRIPTIONS = {
  beginner: "Just starting out. Build a solid foundation.",
  intermediate: "You've got some endurance. Time to push harder.",
  beast: "You're a machine. Dominate the month.",
};

export default function FitnessTest() {
  const [, navigate] = useLocation();
  const { setGoal, refresh } = usePushTrack();

  const [maxReps, setMaxReps] = useState("");
  const [result, setResult] = useState<{
    level: "beginner" | "intermediate" | "beast";
    suggestedGoal: number;
  } | null>(null);

  function handleTest() {
    const n = parseInt(maxReps);
    if (!n || n < 1) {
      toast.error("Enter a valid number (at least 1)");
      return;
    }

    const test = saveFitnessTest(n);
    setResult({ level: test.level, suggestedGoal: test.suggestedGoal });
  }

  function acceptGoal() {
    if (!result) return;
    setGoal(result.suggestedGoal);
    toast.success(`Goal set: ${result.suggestedGoal.toLocaleString()} pushups this month!`);
    refresh();
    navigate("/");
  }

  if (result) {
    const colors = LEVEL_COLORS[result.level];
    const levelLabel = result.level.charAt(0).toUpperCase() + result.level.slice(1);

    return (
      <div className="page-content bg-background">
        <div className="container pt-8 pb-4 space-y-6">
          {/* Back button */}
          <button
            onClick={() => navigate("/goals")}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Result Card */}
          <div
            className="pt-card p-8 text-center rounded-2xl"
            style={{ background: `linear-gradient(135deg, ${colors.light} 0%, oklch(0.155 0.012 265) 100%)` }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: colors.light }}
            >
              <Award size={32} style={{ color: colors.bg }} />
            </div>

            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Your Level</p>
            <p className="stat-number text-4xl mb-1" style={{ color: colors.bg }}>
              {levelLabel}
            </p>
            <p className="text-muted-foreground text-sm">{LEVEL_DESCRIPTIONS[result.level]}</p>
          </div>

          {/* Suggested Goal */}
          <div className="pt-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} style={{ color: "#4FFFB0" }} />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Suggested Monthly Goal</p>
            </div>
            <div className="text-center">
              <p className="stat-number text-5xl text-foreground mb-1">
                {result.suggestedGoal.toLocaleString()}
              </p>
              <p className="text-muted-foreground text-sm">pushups for this month</p>
              <p className="text-xs text-muted-foreground mt-2">
                That's about {Math.round(result.suggestedGoal / 30)} per day
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="pt-card p-4 bg-opacity-50" style={{ background: "oklch(1 0 0 / 5%)" }}>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This goal is personalized to your fitness level. You can adjust it anytime in the Goals screen. The real
              challenge is consistency — log every day and watch yourself improve.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={acceptGoal}
              className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ background: "#4FFFB0", color: "#0F1117" }}
            >
              <Zap size={18} strokeWidth={2.5} />
              Accept Goal & Start
            </button>
            <button
              onClick={() => navigate("/goals")}
              className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ background: "oklch(1 0 0 / 8%)", color: "oklch(0.75 0.01 265)" }}
            >
              Set Custom Goal Instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content bg-background">
      <div className="container pt-8 pb-4 space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/goals")}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-xl text-foreground">Fitness Test</h1>
            <p className="text-xs text-muted-foreground">Find your level</p>
          </div>
        </div>

        {/* Info Card */}
        <div
          className="pt-card p-6 rounded-2xl"
          style={{ background: "linear-gradient(135deg, #1A1D27 0%, #1E2235 100%)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.88 0.18 155 / 15%)" }}
            >
              <Award size={20} style={{ color: "#4FFFB0" }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">How It Works</p>
              <p className="font-semibold text-foreground mt-0.5">Do your max set once</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Do as many pushups as you can in one set — no breaks, no stopping. We'll detect your fitness level and
            suggest a personalized monthly goal. You can always change it later.
          </p>
        </div>

        {/* Input */}
        <div className="pt-card p-5">
          <label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
            Max Pushups (One Set)
          </label>
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "oklch(1 0 0 / 6%)", border: "1px solid oklch(1 0 0 / 12%)" }}
          >
            <input
              type="number"
              min="1"
              value={maxReps}
              onChange={(e) => setMaxReps(e.target.value)}
              placeholder="e.g. 35"
              className="flex-1 bg-transparent stat-number text-4xl text-foreground outline-none placeholder:text-muted-foreground"
              inputMode="numeric"
              style={{ color: maxReps ? "#4FFFB0" : undefined }}
            />
            <span className="text-muted-foreground text-sm">reps</span>
          </div>
        </div>

        {/* Levels Reference */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground px-1">Fitness Levels</p>
          <div className="grid grid-cols-3 gap-2">
            {(["beginner", "intermediate", "beast"] as const).map((level) => {
              const colors = LEVEL_COLORS[level];
              const label = level.charAt(0).toUpperCase() + level.slice(1);
              const range = level === "beginner" ? "< 20" : level === "intermediate" ? "20–50" : "50+";
              return (
                <div
                  key={level}
                  className="pt-card p-3 text-center"
                  style={{ background: colors.light }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: colors.bg }}>
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{range} reps</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Test Button */}
        <button
          onClick={handleTest}
          className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ background: "#4FFFB0", color: "#0F1117" }}
        >
          <Zap size={18} strokeWidth={2.5} />
          Test My Max
        </button>

        {/* Skip */}
        <button
          onClick={() => navigate("/goals")}
          className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ background: "oklch(1 0 0 / 8%)", color: "oklch(0.75 0.01 265)" }}
        >
          Skip for Now
        </button>

      </div>
    </div>
  );
}
