// PushTrack — Home Screen
// Design: Minimal Dark Precision / Sports Analytics
// Dark #0F1117, Mint #4FFFB0, Syne display font, DM Sans body

import { useLocation } from "wouter";
import { Flame, Trophy, ChevronRight, Moon, Zap, Plus } from "lucide-react";
import { usePushTrack } from "../contexts/PushTrackContext";
import {
  formatYearMonth,
  currentYearMonth,
  progressColor,
  formatDate,
  todayStr,
  getBestStreakEver,
} from "../lib/analytics";
import { useState, useEffect } from "react";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const duration = 600;
    const start = performance.now();
    const from = 0;
    const to = value;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  // Use digit characters directly to avoid emoji rendering of "0"
  return <>{display.toLocaleString()}</>;
}

function ProgressBar({ pct }: { pct: number }) {
  const color = progressColor(pct);
  const clamped = Math.min(pct, 100);

  return (
    <div className="progress-track h-3 w-full">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const {
    todayEntry,
    monthGoal,
    monthStats,
    smartTarget,
    currentStreak,
    personalRecords,
    markRestDay,
    clearRestDay,
  } = usePushTrack();

  const ym = currentYearMonth();
  const pct = monthGoal > 0 ? Math.round((monthStats.total / monthGoal) * 100) : 0;
  const todayTotal = todayEntry?.total ?? 0;
  const isRestDay = todayEntry?.isRestDay ?? false;
  const bestStreak = getBestStreakEver();

  const isNewRecord =
    personalRecords.bestDay !== null &&
    todayTotal > 0 &&
    todayTotal >= personalRecords.bestDay.count &&
    todayEntry?.date === todayStr();

  const progressColor_ = progressColor(pct);

  return (
    <div className="page-content bg-background">
      <div className="container pt-8 pb-4 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              {formatDate(todayStr())}
            </p>
            <h1 className="font-display text-2xl text-foreground mt-0.5">PushTrack</h1>
          </div>
          {currentStreak > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "oklch(0.88 0.18 155 / 12%)", border: "1px solid oklch(0.88 0.18 155 / 25%)" }}
            >
              <Flame size={16} className="flame-pulse" style={{ color: "#4FFFB0" }} />
              <span className="stat-number text-sm" style={{ color: "#4FFFB0" }}>
                {currentStreak}
              </span>
            </div>
          )}
        </div>

        {/* Today's Count Hero */}
        <div
          className="pt-card p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1A1D27 0%, #1E2235 100%)" }}
        >
          {/* Record badge */}
          {isNewRecord && (
            <div
              className="record-badge absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "oklch(0.82 0.16 85 / 20%)", color: "#FFD166", border: "1px solid oklch(0.82 0.16 85 / 40%)" }}
            >
              <Trophy size={12} />
              New Record!
            </div>
          )}

          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Today
          </p>

          {isRestDay ? (
            <div className="flex items-center gap-3">
              <Moon size={36} style={{ color: "#6B7280" }} />
              <div>
                <p className="stat-number text-5xl text-muted-foreground">Rest</p>
                <p className="text-sm text-muted-foreground mt-1">Streak safe — good call</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-end gap-3">
                <p
                  className="stat-number text-7xl"
                  style={{
                    color: todayTotal > 0 ? "#4FFFB0" : "oklch(0.4 0.01 265)",
                  }}
                >
                  <AnimatedNumber value={todayTotal} />
                </p>
                <p className="text-muted-foreground text-lg mb-2">pushups</p>
              </div>
              {todayEntry && todayEntry.sets.length > 1 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {todayEntry.sets.join(" + ")} = {todayTotal}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-5">
            {isRestDay ? (
              <button
                onClick={clearRestDay}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ background: "oklch(1 0 0 / 8%)", color: "oklch(0.75 0.01 265)" }}
              >
                Cancel Rest Day
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/log")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
                  style={{ background: "#4FFFB0", color: "#0F1117" }}
                >
                  <Plus size={18} strokeWidth={2.5} />
                  {todayTotal > 0 ? "Add More" : "Log Pushups"}
                </button>
                <button
                  onClick={markRestDay}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{ background: "oklch(1 0 0 / 8%)", color: "oklch(0.55 0.015 265)" }}
                  title="Mark as rest day"
                >
                  <Moon size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Smart Daily Target */}
        {!isRestDay && smartTarget > 0 && (
          <div className="pt-card p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.82 0.16 85 / 15%)" }}
            >
              <Zap size={20} style={{ color: "#FFD166" }} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Daily Target</p>
              <p className="text-foreground font-medium mt-0.5">
                You need{" "}
                <span className="stat-number text-xl" style={{ color: "#FFD166" }}>
                  {smartTarget}
                </span>{" "}
                today to stay on track
              </p>
            </div>
          </div>
        )}

        {monthGoal > 0 && pct >= 100 && !isRestDay && (
          <div className="pt-card p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.88 0.18 155 / 15%)" }}
            >
              <Trophy size={20} style={{ color: "#4FFFB0" }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Monthly Goal</p>
              <p className="font-medium mt-0.5" style={{ color: "#4FFFB0" }}>
                Goal crushed! Keep going 💪
              </p>
            </div>
          </div>
        )}

        {/* Monthly Progress */}
        <div className="pt-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {formatYearMonth(ym)}
              </p>
              <p className="font-display text-lg text-foreground mt-0.5">Monthly Goal</p>
            </div>
            <button
              onClick={() => navigate("/goals")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {monthGoal > 0 ? `${monthGoal.toLocaleString()} target` : "Set goal"}
              <ChevronRight size={14} />
            </button>
          </div>

          {monthGoal > 0 ? (
            <>
              <div className="flex items-end gap-2 mb-3">
                <span className="stat-number text-3xl" style={{ color: progressColor_ }}>
                  <AnimatedNumber value={monthStats.total} />
                </span>
                <span className="text-muted-foreground text-sm mb-1">
                  / {monthGoal.toLocaleString()}
                </span>
                <span
                  className="ml-auto text-sm font-semibold"
                  style={{ color: progressColor_ }}
                >
                  {pct}%
                </span>
              </div>
              <ProgressBar pct={pct} />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{monthStats.daysLogged} days logged</span>
                <span>{Math.max(0, monthGoal - monthStats.total).toLocaleString()} remaining</span>
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/goals")}
              className="w-full py-3 rounded-xl text-sm font-medium border border-dashed transition-colors"
              style={{ borderColor: "oklch(1 0 0 / 15%)", color: "oklch(0.55 0.015 265)" }}
            >
              + Set a monthly goal
            </button>
          )}
        </div>

        {/* Streak + Best Streak */}
        <div className="grid grid-cols-2 gap-3">
          <div className="pt-card p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Streak</p>
            <div className="flex items-center gap-2">
              <Flame size={20} className="flame-pulse" style={{ color: "#4FFFB0" }} />
              <span className="stat-number text-3xl text-foreground">{currentStreak}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </div>
          <div className="pt-card p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Best Streak</p>
            <div className="flex items-center gap-2">
              <Trophy size={20} style={{ color: "#FFD166" }} />
              <span className="stat-number text-3xl text-foreground">{bestStreak}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">days ever</p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="pt-card p-3 text-center">
            <p className="stat-number text-2xl text-foreground">{monthStats.daysLogged}</p>
            <p className="text-xs text-muted-foreground mt-1">Days Active</p>
          </div>
          <div className="pt-card p-3 text-center">
            <p className="stat-number text-2xl text-foreground">{monthStats.dailyAverage}</p>
            <p className="text-xs text-muted-foreground mt-1">Daily Avg</p>
          </div>
          <div className="pt-card p-3 text-center">
            <p className="stat-number text-2xl text-foreground">{monthStats.bestDay}</p>
            <p className="text-xs text-muted-foreground mt-1">Best Day</p>
          </div>
        </div>

      </div>
    </div>
  );
}
