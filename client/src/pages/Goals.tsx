// PushTrack — Goals Screen
// Design: Minimal Dark Precision / Sports Analytics

import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Target, Check, TrendingUp } from "lucide-react";
import { usePushTrack } from "../contexts/PushTrackContext";
import { toast } from "sonner";
import {
  formatYearMonth,
  currentYearMonth,
  getAllMonths,
  getMonthStats,
  progressColor,
} from "../lib/analytics";

const PRESET_GOALS = [500, 750, 1000, 1500, 2000, 3000];

export default function Goals() {
  const [, navigate] = useLocation();
  const { monthGoal, setGoal, monthStats } = usePushTrack();

  const ym = currentYearMonth();
  const [inputVal, setInputVal] = useState(monthGoal > 0 ? String(monthGoal) : "");

  function handleSave() {
    const n = parseInt(inputVal);
    if (!n || n < 1) {
      toast.error("Enter a valid goal (at least 1)");
      return;
    }
    setGoal(n);
    toast.success(`Goal set: ${n.toLocaleString()} pushups for ${formatYearMonth(ym)}`);
    navigate("/");
  }

  const allMonths = getAllMonths().filter((m) => m !== ym);

  return (
    <div className="page-content bg-background">
      <div className="container pt-6 pb-4 space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-xl text-foreground">Monthly Goal</h1>
            <p className="text-xs text-muted-foreground">{formatYearMonth(ym)}</p>
          </div>
        </div>

        {/* Current Month Goal Card */}
        <div
          className="pt-card p-6"
          style={{ background: "linear-gradient(135deg, #1A1D27 0%, #1E2235 100%)" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.88 0.18 155 / 15%)" }}
            >
              <Target size={20} style={{ color: "#4FFFB0" }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {formatYearMonth(ym)}
              </p>
              <p className="font-semibold text-foreground">Set Your Target</p>
            </div>
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-4"
            style={{ background: "oklch(1 0 0 / 6%)", border: "1px solid oklch(1 0 0 / 12%)" }}
          >
            <input
              type="number"
              min="1"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. 1000"
              className="flex-1 bg-transparent stat-number text-4xl text-foreground outline-none placeholder:text-muted-foreground"
              inputMode="numeric"
              style={{ color: inputVal ? "#4FFFB0" : undefined }}
            />
            <span className="text-muted-foreground text-sm">pushups</span>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {PRESET_GOALS.map((g) => (
              <button
                key={g}
                onClick={() => setInputVal(String(g))}
                className="py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
                style={{
                  background: inputVal === String(g) ? "oklch(0.88 0.18 155 / 20%)" : "oklch(1 0 0 / 8%)",
                  color: inputVal === String(g) ? "#4FFFB0" : "oklch(0.65 0.015 265)",
                  border: `1px solid ${inputVal === String(g) ? "oklch(0.88 0.18 155 / 40%)" : "transparent"}`,
                }}
              >
                {g.toLocaleString()}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: "#4FFFB0", color: "#0F1117" }}
          >
            <Check size={18} strokeWidth={2.5} />
            Save Goal
          </button>
        </div>

        {/* Current Progress */}
        {monthGoal > 0 && (
          <div className="pt-card p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">This Month's Progress</p>
            <div className="flex items-end gap-2 mb-2">
              <span
                className="stat-number text-3xl"
                style={{ color: progressColor(Math.round((monthStats.total / monthGoal) * 100)) }}
              >
                {monthStats.total.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-sm mb-1">/ {monthGoal.toLocaleString()}</span>
              <span
                className="ml-auto text-sm font-semibold"
                style={{ color: progressColor(Math.round((monthStats.total / monthGoal) * 100)) }}
              >
                {Math.round((monthStats.total / monthGoal) * 100)}%
              </span>
            </div>
            <div className="progress-track h-2">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, Math.round((monthStats.total / monthGoal) * 100))}%`,
                  background: progressColor(Math.round((monthStats.total / monthGoal) * 100)),
                }}
              />
            </div>
          </div>
        )}

        {/* Past Months */}
        {allMonths.length > 0 && (
          <div className="pt-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} style={{ color: "#4FFFB0" }} />
              <p className="text-sm font-medium text-foreground">Past Months</p>
            </div>
            <div className="space-y-3">
              {allMonths.slice(0, 6).map((m) => {
                const stats = getMonthStats(m);
                const pct = stats.goal > 0 ? Math.round((stats.total / stats.goal) * 100) : 0;
                return (
                  <div key={m}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{formatYearMonth(m)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: progressColor(pct) }}>
                          {stats.total.toLocaleString()}
                        </span>
                        {stats.goal > 0 && (
                          <span className="text-xs text-muted-foreground">/ {stats.goal.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    {stats.goal > 0 && (
                      <div className="progress-track h-1.5">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, pct)}%`,
                            background: progressColor(pct),
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
