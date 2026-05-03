// PushTrack — Body Weight Tracking Screen
// Design: Minimal Dark Precision / Sports Analytics

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Scale, TrendingDown, TrendingUp, Calendar } from "lucide-react";
import { logWeight, getTodayWeight, getWeightHistory, getWeightStats } from "../lib/weight";
import { formatDate } from "../lib/analytics";
import { toast } from "sonner";

export default function BodyWeight() {
  const [, navigate] = useLocation();
  const [weight, setWeight] = useState("");
  const [todayWeight, setTodayWeight] = useState<number | null>(null);
  const [stats, setStats] = useState(getWeightStats());
  const [history, setHistory] = useState(getWeightHistory());

  useEffect(() => {
    const today = getTodayWeight();
    setTodayWeight(today);
    if (today) setWeight(String(today));
    setStats(getWeightStats());
    setHistory(getWeightHistory());
  }, []);

  function handleLogWeight() {
    const w = parseFloat(weight);
    if (!w || w < 50 || w > 500) {
      toast.error("Enter a valid weight (50-500)");
      return;
    }
    logWeight(w);
    setTodayWeight(w);
    setStats(getWeightStats());
    setHistory(getWeightHistory());
    toast.success(`Weight logged: ${w} lbs`);
  }

  const trend = stats.change ? (stats.change > 0 ? "up" : "down") : null;
  const trendColor = trend === "up" ? "#FF5252" : trend === "down" ? "#4FFFB0" : "#FFD166";
  const trendIcon = trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />;

  return (
    <div className="page-content bg-background">
      <div className="container pt-6 pb-4 space-y-4">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/stats")}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-xl text-foreground">Body Weight</h1>
            <p className="text-xs text-muted-foreground">Track weight alongside pushups</p>
          </div>
        </div>

        {/* Log Today's Weight */}
        <div
          className="pt-card p-6 rounded-2xl"
          style={{ background: "linear-gradient(135deg, oklch(0.82 0.16 85 / 15%) 0%, #1A1D27 100%)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.82 0.16 85 / 25%)" }}
            >
              <Scale size={20} style={{ color: "#FFD166" }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Today's Weight</p>
              <p className="font-semibold text-foreground mt-0.5">Log or update</p>
            </div>
          </div>

          <div
            className="flex items-center gap-2 p-4 rounded-lg mb-4"
            style={{ background: "oklch(1 0 0 / 6%)", border: "1px solid oklch(1 0 0 / 12%)" }}
          >
            <input
              type="number"
              step="0.1"
              min="50"
              max="500"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 180"
              className="flex-1 bg-transparent stat-number text-4xl text-foreground outline-none placeholder:text-muted-foreground"
              inputMode="decimal"
              style={{ color: weight ? "#FFD166" : undefined }}
            />
            <span className="text-muted-foreground text-sm">lbs</span>
          </div>

          <button
            onClick={handleLogWeight}
            className="w-full py-3.5 rounded-xl font-semibold transition-all active:scale-95"
            style={{ background: "#FFD166", color: "#0F1117" }}
          >
            Log Weight
          </button>
        </div>

        {/* Stats Overview */}
        {stats.current !== null && (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground px-1">Stats</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="pt-card p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Current</p>
                <p className="stat-number text-3xl" style={{ color: "#FFD166" }}>
                  {stats.current}
                </p>
                <p className="text-xs text-muted-foreground mt-1">lbs</p>
              </div>

              <div className="pt-card p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Change</p>
                <div className="flex items-center gap-2">
                  <span className="stat-number text-3xl" style={{ color: trendColor }}>
                    {Math.abs(stats.change || 0).toFixed(1)}
                  </span>
                  {trendIcon && <div style={{ color: trendColor }}>{trendIcon}</div>}
                </div>
              </div>

              <div className="pt-card p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Min</p>
                <p className="stat-number text-3xl" style={{ color: "#4FFFB0" }}>
                  {stats.min}
                </p>
              </div>

              <div className="pt-card p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Max</p>
                <p className="stat-number text-3xl" style={{ color: "#FF5252" }}>
                  {stats.max}
                </p>
              </div>
            </div>

            <div className="pt-card p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Average</p>
              <p className="stat-number text-3xl" style={{ color: "#FFD166" }}>
                {stats.avg}
              </p>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="pt-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} style={{ color: "#4FFFB0" }} />
              <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Recent History</p>
            </div>
            <div className="space-y-2">
              {history.slice(0, 10).map((entry) => (
                <div key={entry.date} className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
                  <span className="stat-number text-lg" style={{ color: "#FFD166" }}>
                    {entry.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length === 0 && (
          <div className="pt-card p-8 text-center">
            <Scale size={32} className="mx-auto mb-3" style={{ color: "oklch(0.35 0.01 265)" }} />
            <p className="text-muted-foreground text-sm">No weight entries yet. Start tracking to see trends.</p>
          </div>
        )}

      </div>
    </div>
  );
}
