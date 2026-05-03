// PushTrack — History Screen
// Design: Minimal Dark Precision / Sports Analytics

import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, CalendarDays, List, Moon } from "lucide-react";
import {
  getCalendarMonth,
  getAllMonths,
  formatYearMonth,
  currentYearMonth,
  progressColor,
  getMonthStats,
  formatDate,
} from "../lib/analytics";
import { loadData } from "../lib/storage";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getFirstDayOffset(yearMonth: string): number {
  const [y, m] = yearMonth.split("-").map(Number);
  const firstDay = new Date(y, m - 1, 1).getDay(); // 0=Sun
  // Convert to Monday-based (0=Mon)
  return firstDay === 0 ? 6 : firstDay - 1;
}

function CalendarView({ yearMonth }: { yearMonth: string }) {
  const days = getCalendarMonth(yearMonth);
  const offset = getFirstDayOffset(yearMonth);
  const stats = getMonthStats(yearMonth);
  const maxVal = Math.max(...days.map((d) => d.total), 1);

  return (
    <div className="space-y-4">
      {/* Month Summary */}
      <div className="pt-card p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="stat-number text-2xl text-foreground">{stats.total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total</p>
          </div>
          <div>
            <p className="stat-number text-2xl text-foreground">{stats.daysLogged}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Active Days</p>
          </div>
          <div>
            <p className="stat-number text-2xl text-foreground">{stats.dailyAverage}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Daily Avg</p>
          </div>
        </div>
        {stats.goal > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Goal: {stats.goal.toLocaleString()}</span>
              <span style={{ color: progressColor(Math.round((stats.total / stats.goal) * 100)) }}>
                {Math.round((stats.total / stats.goal) * 100)}%
              </span>
            </div>
            <div className="progress-track h-1.5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((stats.total / stats.goal) * 100))}%`,
                  background: progressColor(Math.round((stats.total / stats.goal) * 100)),
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="pt-card p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Offset empty cells */}
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((day) => {
            const dayNum = parseInt(day.date.split("-")[2]);
            const intensity = day.total > 0 ? day.total / maxVal : 0;

            let bgColor = "oklch(1 0 0 / 5%)";
            let textColor = "oklch(0.35 0.01 265)";

            if (day.isRestDay) {
              bgColor = "oklch(0.5 0.05 265 / 20%)";
              textColor = "oklch(0.55 0.015 265)";
            } else if (day.total > 0) {
              // Interpolate from dim mint to full mint
              const alpha = 0.15 + intensity * 0.7;
              bgColor = `oklch(0.88 0.18 155 / ${Math.round(alpha * 100)}%)`;
              textColor = intensity > 0.5 ? "#0F1117" : "#4FFFB0";
            }

            return (
              <div
                key={day.date}
                className="aspect-square rounded-lg flex flex-col items-center justify-center relative"
                style={{ background: bgColor }}
                title={day.isRestDay ? "Rest day" : day.total > 0 ? `${day.total} pushups` : "No entry"}
              >
                <span className="text-xs font-medium" style={{ color: textColor }}>
                  {dayNum}
                </span>
                {day.isRestDay && (
                  <Moon size={8} style={{ color: "oklch(0.55 0.015 265)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "oklch(0.88 0.18 155 / 30%)" }} />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "oklch(0.88 0.18 155 / 85%)" }} />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "oklch(0.5 0.05 265 / 20%)" }} />
            <span className="text-xs text-muted-foreground">Rest</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListView({ yearMonth }: { yearMonth: string }) {
  const data = loadData();
  const days = getCalendarMonth(yearMonth);
  const activeDays = days
    .filter((d) => d.hasEntry)
    .reverse();

  if (activeDays.length === 0) {
    return (
      <div className="pt-card p-8 text-center">
        <p className="text-muted-foreground text-sm">No entries for this month yet.</p>
      </div>
    );
  }

  return (
    <div className="pt-card divide-y divide-border">
      {activeDays.map((day) => {
        const entry = data.days[day.date];
        return (
          <div key={day.date} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-foreground">{formatDate(day.date)}</p>
              {entry?.sets && entry.sets.length > 1 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {entry.sets.join(" + ")}
                </p>
              )}
            </div>
            <div className="text-right">
              {day.isRestDay ? (
                <div className="flex items-center gap-1.5">
                  <Moon size={14} style={{ color: "oklch(0.55 0.015 265)" }} />
                  <span className="text-sm text-muted-foreground">Rest</span>
                </div>
              ) : (
                <span className="stat-number text-xl" style={{ color: "#4FFFB0" }}>
                  {day.total.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function History() {
  const [, navigate] = useLocation();
  const allMonths = getAllMonths();
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth());
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const currentIdx = allMonths.indexOf(selectedMonth);

  function prevMonth() {
    if (currentIdx < allMonths.length - 1) {
      setSelectedMonth(allMonths[currentIdx + 1]);
    }
  }

  function nextMonth() {
    if (currentIdx > 0) {
      setSelectedMonth(allMonths[currentIdx - 1]);
    }
  }

  return (
    <div className="page-content bg-background">
      <div className="container pt-6 pb-4 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl text-foreground">History</h1>
          {/* View Toggle */}
          <div
            className="flex rounded-xl overflow-hidden"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          >
            <button
              onClick={() => setView("calendar")}
              className="px-3 py-2 flex items-center gap-1.5 text-xs font-medium transition-colors rounded-xl"
              style={{
                background: view === "calendar" ? "oklch(0.88 0.18 155 / 20%)" : "transparent",
                color: view === "calendar" ? "#4FFFB0" : "oklch(0.55 0.015 265)",
              }}
            >
              <CalendarDays size={14} />
              Calendar
            </button>
            <button
              onClick={() => setView("list")}
              className="px-3 py-2 flex items-center gap-1.5 text-xs font-medium transition-colors rounded-xl"
              style={{
                background: view === "list" ? "oklch(0.88 0.18 155 / 20%)" : "transparent",
                color: view === "list" ? "#4FFFB0" : "oklch(0.55 0.015 265)",
              }}
            >
              <List size={14} />
              List
            </button>
          </div>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            disabled={currentIdx >= allMonths.length - 1}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-display text-lg text-foreground">
            {formatYearMonth(selectedMonth)}
          </h2>
          <button
            onClick={nextMonth}
            disabled={currentIdx <= 0}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* View Content */}
        {view === "calendar" ? (
          <CalendarView yearMonth={selectedMonth} />
        ) : (
          <ListView yearMonth={selectedMonth} />
        )}

      </div>
    </div>
  );
}
