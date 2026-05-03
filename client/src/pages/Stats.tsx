// PushTrack — Stats Screen
// Design: Minimal Dark Precision / Sports Analytics

import { Trophy, Flame, TrendingUp, Calendar, Star, BarChart2, Award, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import {
  getPersonalRecords,
  getRecentWeeklySummaries,
  getBestStreakEver,
  getCurrentStreak,
  formatDate,
  formatShortDate,
  formatYearMonth,
  getAllMonths,
  getMonthStats,
  progressColor,
} from "../lib/analytics";

function RecordCard({
  icon,
  label,
  value,
  sub,
  color = "#4FFFB0",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="pt-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          {icon}
        </div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className="stat-number text-3xl" style={{ color }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function Stats() {
  const [, navigate] = useLocation();
  const records = getPersonalRecords();
  const currentStreak = getCurrentStreak();
  const bestStreak = getBestStreakEver();
  const weeklySummaries = getRecentWeeklySummaries(8);
  const allMonths = getAllMonths();

  // Filter weeks that have any activity
  const activeWeeks = weeklySummaries.filter((w) => w.total > 0 || w.daysRest > 0);

  // Max weekly total for bar chart scaling
  const maxWeekTotal = Math.max(...weeklySummaries.map((w) => w.total), 1);

  return (
    <div className="page-content bg-background">
      <div className="container pt-6 pb-4 space-y-5">

        {/* Header */}
        <div>
          <h1 className="font-display text-xl text-foreground">Stats</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Personal records & progress</p>
        </div>

        {/* Monthly Report Button */}
        <button
          onClick={() => navigate("/monthly-report")}
          className="pt-card p-4 flex items-center gap-3 rounded-xl hover:border-primary transition-colors"
          style={{ borderColor: "oklch(1 0 0 / 12%)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.88 0.18 155 / 15%)" }}
          >
            <Award size={18} style={{ color: "#4FFFB0" }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">Monthly Report Card</p>
            <p className="text-xs text-muted-foreground">View your end-of-month summary</p>
          </div>
          <ChevronLeft size={18} className="rotate-180" style={{ color: "oklch(0.55 0.01 265)" }} />
        </button>

        {/* Personal Records */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} style={{ color: "#FFD166" }} />
            <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Personal Records</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RecordCard
              icon={<Star size={16} style={{ color: "#4FFFB0" }} />}
              label="Best Day"
              value={records.bestDay?.count ?? 0}
              sub={records.bestDay ? formatDate(records.bestDay.date) : "No data yet"}
              color="#4FFFB0"
            />
            <RecordCard
              icon={<Calendar size={16} style={{ color: "#FFD166" }} />}
              label="Best Week"
              value={records.bestWeek?.count ?? 0}
              sub={records.bestWeek ? `w/ ${formatShortDate(records.bestWeek.startDate)}` : "No data yet"}
              color="#FFD166"
            />
            <RecordCard
              icon={<TrendingUp size={16} style={{ color: "#4FFFB0" }} />}
              label="Best Month"
              value={records.bestMonth?.count ?? 0}
              sub={records.bestMonth ? formatYearMonth(records.bestMonth.yearMonth) : "No data yet"}
              color="#4FFFB0"
            />
            <RecordCard
              icon={<BarChart2 size={16} style={{ color: "#FF5252" }} />}
              label="Total Ever"
              value={allMonths.reduce((sum, m) => sum + getMonthStats(m).total, 0)}
              sub="all time"
              color="#FF5252"
            />
          </div>
        </div>

        {/* Streaks */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} style={{ color: "#4FFFB0" }} />
            <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Streaks</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RecordCard
              icon={<Flame size={16} className="flame-pulse" style={{ color: "#4FFFB0" }} />}
              label="Current"
              value={currentStreak}
              sub="consecutive days"
              color="#4FFFB0"
            />
            <RecordCard
              icon={<Trophy size={16} style={{ color: "#FFD166" }} />}
              label="Best Ever"
              value={bestStreak}
              sub="all time record"
              color="#FFD166"
            />
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="pt-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} style={{ color: "#4FFFB0" }} />
            <p className="text-sm font-semibold text-foreground">Weekly Volume</p>
            <span className="text-xs text-muted-foreground ml-auto">Last 8 weeks</span>
          </div>

          <div className="flex items-end gap-1.5 h-24">
            {weeklySummaries.map((week, i) => {
              const height = week.total > 0 ? Math.max(8, (week.total / maxWeekTotal) * 100) : 4;
              const isCurrentWeek = i === weeklySummaries.length - 1;
              return (
                <div key={week.startDate} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${height}%`,
                      background: isCurrentWeek ? "#4FFFB0" : "oklch(0.88 0.18 155 / 35%)",
                      minHeight: "4px",
                    }}
                    title={`${week.total} pushups`}
                  />
                  <span className="text-[9px] text-muted-foreground">
                    {formatShortDate(week.startDate).split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Weekly detail for current week */}
          {weeklySummaries.length > 0 && (() => {
            const w = weeklySummaries[weeklySummaries.length - 1];
            return (
              <div
                className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2 text-center"
              >
                <div>
                  <p className="stat-number text-lg text-foreground">{w.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
                <div>
                  <p className="stat-number text-lg text-foreground">{w.dailyAverage}</p>
                  <p className="text-xs text-muted-foreground">Daily Avg</p>
                </div>
                <div>
                  <p className="stat-number text-lg" style={{ color: progressColor(w.monthlyGoalProgress) }}>
                    {w.monthlyGoalProgress}%
                  </p>
                  <p className="text-xs text-muted-foreground">Month Goal</p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Weekly Summaries List */}
        {activeWeeks.length > 0 && (
          <div className="pt-card divide-y divide-border">
            <div className="p-4 flex items-center gap-2">
              <Calendar size={14} style={{ color: "#4FFFB0" }} />
              <p className="text-sm font-semibold text-foreground">Weekly Summaries</p>
            </div>
            {[...activeWeeks].reverse().map((week) => (
              <div key={week.startDate} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">
                    {formatShortDate(week.startDate)} – {formatShortDate(week.endDate)}
                  </p>
                  <span
                    className="stat-number text-xl"
                    style={{ color: "#4FFFB0" }}
                  >
                    {week.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{week.daysLogged} active</span>
                  {week.daysRest > 0 && <span>{week.daysRest} rest</span>}
                  <span>avg {week.dailyAverage}/day</span>
                  {week.monthlyGoalProgress > 0 && (
                    <span
                      className="ml-auto font-medium"
                      style={{ color: progressColor(week.monthlyGoalProgress) }}
                    >
                      {week.monthlyGoalProgress}% of month goal
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Monthly History */}
        {allMonths.length > 0 && (
          <div className="pt-card divide-y divide-border">
            <div className="p-4 flex items-center gap-2">
              <TrendingUp size={14} style={{ color: "#4FFFB0" }} />
              <p className="text-sm font-semibold text-foreground">Monthly History</p>
            </div>
            {allMonths.map((ym) => {
              const stats = getMonthStats(ym);
              const pct = stats.goal > 0 ? Math.round((stats.total / stats.goal) * 100) : 0;
              return (
                <div key={ym} className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-foreground">{formatYearMonth(ym)}</p>
                    <div className="flex items-center gap-2">
                      <span className="stat-number text-xl" style={{ color: progressColor(pct || 50) }}>
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
                  <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>{stats.daysLogged} days</span>
                    <span>avg {stats.dailyAverage}/day</span>
                    {stats.bestDay > 0 && <span>best {stats.bestDay}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {allMonths.length === 0 && (
          <div className="pt-card p-8 text-center">
            <BarChart2 size={32} className="mx-auto mb-3" style={{ color: "oklch(0.35 0.01 265)" }} />
            <p className="text-muted-foreground text-sm">Start logging pushups to see your stats here.</p>
          </div>
        )}

      </div>
    </div>
  );
}
