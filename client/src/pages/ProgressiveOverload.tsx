// PushTrack — Progressive Overload Setup Screen
// Design: Minimal Dark Precision / Sports Analytics

import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, TrendingUp, Zap, AlertCircle } from "lucide-react";
import { createProgressiveOverloadPlan, getProgressiveOverloadPlan } from "../lib/progressive";
import { usePushTrack } from "../contexts/PushTrackContext";
import { toast } from "sonner";

const PRESET_PLANS = [
  { name: "Beginner Ramp", starting: 20, increment: 5, weeks: 4, desc: "Start at 20, add 5 each week" },
  { name: "Intermediate", starting: 40, increment: 10, weeks: 4, desc: "Start at 40, add 10 each week" },
  { name: "Advanced", starting: 60, increment: 15, weeks: 4, desc: "Start at 60, add 15 each week" },
  { name: "Beast Mode", starting: 100, increment: 20, weeks: 4, desc: "Start at 100, add 20 each week" },
];

export default function ProgressiveOverload() {
  const [, navigate] = useLocation();
  const { refresh } = usePushTrack();

  const existing = getProgressiveOverloadPlan();
  const [mode, setMode] = useState<"choose" | "custom">("choose");
  const [starting, setStarting] = useState("");
  const [increment, setIncrement] = useState("");
  const [weeks, setWeeks] = useState("4");

  function handlePreset(plan: typeof PRESET_PLANS[0]) {
    const result = createProgressiveOverloadPlan(plan.starting, plan.increment, plan.weeks);
    toast.success(`${plan.name} activated! Total: ${(plan.starting * 7 + plan.starting * 7 * 3 + plan.increment * 7 * 6 + plan.increment * 7 * 9 + plan.increment * 7 * 12).toLocaleString()} pushups`);
    refresh();
    navigate("/");
  }

  function handleCustom() {
    const s = parseInt(starting);
    const inc = parseInt(increment);
    const w = parseInt(weeks);

    if (!s || s < 1 || !inc || inc < 1 || !w || w < 1 || w > 12) {
      toast.error("Invalid values. Check your inputs.");
      return;
    }

    const result = createProgressiveOverloadPlan(s, inc, w);
    const total = Array.from({ length: w }, (_, i) => (s + i * inc) * 7).reduce((a, b) => a + b, 0);
    toast.success(`Progressive plan created! Total: ${total.toLocaleString()} pushups over ${w} weeks`);
    refresh();
    navigate("/");
  }

  if (existing && existing.active) {
    return (
      <div className="page-content bg-background">
        <div className="container pt-6 pb-4 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/goals")}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 8%)" }}
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="font-display text-xl text-foreground">Progressive Overload</h1>
          </div>

          {/* Active Plan Info */}
          <div
            className="pt-card p-6 rounded-2xl"
            style={{ background: "linear-gradient(135deg, oklch(0.88 0.18 155 / 15%) 0%, #1A1D27 100%)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.88 0.18 155 / 25%)" }}
              >
                <TrendingUp size={20} style={{ color: "#4FFFB0" }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Active Plan</p>
                <p className="font-semibold text-foreground mt-0.5">Progressive Overload Running</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Starting Daily</span>
                <span className="stat-number text-2xl" style={{ color: "#4FFFB0" }}>
                  {existing.startingDaily}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weekly Increment</span>
                <span className="stat-number text-2xl" style={{ color: "#FFD166" }}>
                  +{existing.weeklyIncrement}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="stat-number text-2xl" style={{ color: "#4FFFB0" }}>
                  {existing.weeks} weeks
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full mt-4 py-3 rounded-xl font-semibold transition-all active:scale-95"
              style={{ background: "#4FFFB0", color: "#0F1117" }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content bg-background">
      <div className="container pt-6 pb-4 space-y-4">

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
            <h1 className="font-display text-xl text-foreground">Progressive Overload</h1>
            <p className="text-xs text-muted-foreground">Week-by-week scaling</p>
          </div>
        </div>

        {/* Info Card */}
        <div
          className="pt-card p-4 flex gap-3 rounded-xl"
          style={{ background: "oklch(1 0 0 / 5%)", border: "1px solid oklch(0.88 0.18 155 / 20%)" }}
        >
          <AlertCircle size={18} style={{ color: "#4FFFB0", flexShrink: 0, marginTop: "2px" }} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Instead of a flat goal, your daily target increases each week. Week 1 is easier, week 4 is the challenge. This is how real athletes train.
          </p>
        </div>

        {mode === "choose" ? (
          <>
            {/* Preset Plans */}
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground px-1">Pre-built Plans</p>
              {PRESET_PLANS.map((plan) => {
                const total = Array.from({ length: plan.weeks }, (_, i) => (plan.starting + i * plan.increment) * 7).reduce((a, b) => a + b, 0);
                return (
                  <button
                    key={plan.name}
                    onClick={() => handlePreset(plan)}
                    className="pt-card p-4 w-full text-left rounded-xl hover:border-primary transition-colors"
                    style={{ borderColor: "oklch(1 0 0 / 12%)" }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{plan.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{plan.desc}</p>
                      </div>
                      <span className="stat-number text-sm" style={{ color: "#4FFFB0" }}>
                        {total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-muted-foreground">
                        <span style={{ color: "#FFD166" }}>Week 1:</span> {plan.starting}/day
                      </span>
                      <span className="text-muted-foreground">
                        <span style={{ color: "#FFD166" }}>Week 4:</span> {plan.starting + (plan.weeks - 1) * plan.increment}/day
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Option */}
            <button
              onClick={() => setMode("custom")}
              className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ background: "oklch(1 0 0 / 8%)", color: "oklch(0.75 0.01 265)" }}
            >
              Create Custom Plan
            </button>
          </>
        ) : (
          <>
            {/* Custom Plan Builder */}
            <div className="pt-card p-4 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Starting Daily Target
                </label>
                <div
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ background: "oklch(1 0 0 / 6%)", border: "1px solid oklch(1 0 0 / 12%)" }}
                >
                  <input
                    type="number"
                    min="1"
                    value={starting}
                    onChange={(e) => setStarting(e.target.value)}
                    placeholder="e.g. 30"
                    className="flex-1 bg-transparent text-lg font-semibold text-foreground outline-none"
                    inputMode="numeric"
                    style={{ color: starting ? "#4FFFB0" : undefined }}
                  />
                  <span className="text-sm text-muted-foreground">/day</span>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Weekly Increment
                </label>
                <div
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ background: "oklch(1 0 0 / 6%)", border: "1px solid oklch(1 0 0 / 12%)" }}
                >
                  <span className="text-muted-foreground">+</span>
                  <input
                    type="number"
                    min="1"
                    value={increment}
                    onChange={(e) => setIncrement(e.target.value)}
                    placeholder="e.g. 10"
                    className="flex-1 bg-transparent text-lg font-semibold text-foreground outline-none"
                    inputMode="numeric"
                    style={{ color: increment ? "#FFD166" : undefined }}
                  />
                  <span className="text-sm text-muted-foreground">/week</span>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Duration
                </label>
                <div
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ background: "oklch(1 0 0 / 6%)", border: "1px solid oklch(1 0 0 / 12%)" }}
                >
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                    className="flex-1 bg-transparent text-lg font-semibold text-foreground outline-none"
                    inputMode="numeric"
                    style={{ color: "#4FFFB0" }}
                  />
                  <span className="text-sm text-muted-foreground">weeks</span>
                </div>
              </div>

              {/* Preview */}
              {starting && increment && weeks && (
                <div
                  className="pt-card p-3 rounded-lg"
                  style={{ background: "oklch(1 0 0 / 5%)" }}
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Preview</p>
                  <div className="space-y-1 text-sm">
                    {Array.from({ length: parseInt(weeks) }).map((_, i) => {
                      const daily = parseInt(starting) + i * parseInt(increment);
                      const weekly = daily * 7;
                      return (
                        <div key={i} className="flex justify-between text-muted-foreground">
                          <span>Week {i + 1}</span>
                          <span style={{ color: "#FFD166" }}>
                            {daily}/day × 7 = {weekly.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCustom}
                className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: "#4FFFB0", color: "#0F1117" }}
              >
                <Zap size={18} strokeWidth={2.5} />
                Create Plan
              </button>
              <button
                onClick={() => setMode("choose")}
                className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ background: "oklch(1 0 0 / 8%)", color: "oklch(0.75 0.01 265)" }}
              >
                Back to Presets
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
