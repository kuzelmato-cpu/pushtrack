// PushTrack — Analytics & Stats Engine
// Design: Minimal Dark Precision / Sports Analytics

import {
  addDays,
  computeCurrentStreak,
  daysInMonth,
  getWeekStart,
  loadData,
  remainingDaysInMonth,
  today,
  toDateStr,
  toYearMonth,
} from "./storage";
import type {
  MonthStats,
  PersonalRecords,
  WeekSummary,
} from "./types";

// ─── Monthly Stats ─────────────────────────────────────────────────────────────

export function getMonthStats(yearMonth: string): MonthStats {
  const data = loadData();
  const goal = data.monthGoals[yearMonth]?.goal ?? 0;

  let total = 0;
  let daysLogged = 0;
  let daysRest = 0;
  let bestDay = 0;

  Object.values(data.days).forEach((entry) => {
    if (entry.date.startsWith(yearMonth)) {
      if (entry.isRestDay) {
        daysRest++;
      } else if (entry.total > 0) {
        total += entry.total;
        daysLogged++;
        if (entry.total > bestDay) bestDay = entry.total;
      }
    }
  });

  const dailyAverage = daysLogged > 0 ? Math.round(total / daysLogged) : 0;

  return { yearMonth, total, goal, daysLogged, daysRest, bestDay, dailyAverage };
}

// ─── Smart Daily Target ────────────────────────────────────────────────────────

export function getSmartDailyTarget(yearMonth: string): number {
  const data = loadData();
  const goal = data.monthGoals[yearMonth]?.goal ?? 0;
  if (!goal) return 0;

  let done = 0;
  Object.values(data.days).forEach((entry) => {
    if (entry.date.startsWith(yearMonth) && !entry.isRestDay) {
      done += entry.total;
    }
  });

  const remaining = goal - done;
  if (remaining <= 0) return 0;

  const daysLeft = remainingDaysInMonth(yearMonth);
  if (daysLeft <= 0) return remaining;

  return Math.ceil(remaining / daysLeft);
}

// ─── Streaks ───────────────────────────────────────────────────────────────────

export function getCurrentStreak(): number {
  return computeCurrentStreak(loadData());
}

export function getBestStreakEver(): number {
  const data = loadData();
  // Ensure best streak is up to date
  const current = computeCurrentStreak(data);
  return Math.max(data.bestStreak, current);
}

// ─── Personal Records ──────────────────────────────────────────────────────────

export function getPersonalRecords(): PersonalRecords {
  const data = loadData();
  const entries = Object.values(data.days).filter((e) => !e.isRestDay && e.total > 0);

  // Best day
  let bestDay: PersonalRecords["bestDay"] = null;
  entries.forEach((e) => {
    if (!bestDay || e.total > bestDay.count) {
      bestDay = { date: e.date, count: e.total };
    }
  });

  // Best week — iterate over all dates and compute 7-day windows
  let bestWeek: PersonalRecords["bestWeek"] = null;
  const allDates = Object.keys(data.days).sort();
  const weekTotals: Record<string, number> = {};

  allDates.forEach((dateStr) => {
    const entry = data.days[dateStr];
    if (!entry || entry.isRestDay) return;
    const weekStart = getWeekStart(dateStr);
    weekTotals[weekStart] = (weekTotals[weekStart] ?? 0) + entry.total;
  });

  Object.entries(weekTotals).forEach(([start, count]) => {
    if (!bestWeek || count > bestWeek.count) {
      bestWeek = { startDate: start, count };
    }
  });

  // Best month
  let bestMonth: PersonalRecords["bestMonth"] = null;
  const monthTotals: Record<string, number> = {};

  entries.forEach((e) => {
    const ym = toYearMonth(e.date);
    monthTotals[ym] = (monthTotals[ym] ?? 0) + e.total;
  });

  Object.entries(monthTotals).forEach(([ym, count]) => {
    if (!bestMonth || count > bestMonth.count) {
      bestMonth = { yearMonth: ym, count };
    }
  });

  return { bestDay, bestWeek, bestMonth };
}

// ─── Weekly Summary ────────────────────────────────────────────────────────────

export function getWeeklySummary(weekStartDate: string): WeekSummary {
  const data = loadData();
  let total = 0;
  let daysLogged = 0;
  let daysRest = 0;

  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStartDate, i);
    const entry = data.days[d];
    if (!entry) continue;
    if (entry.isRestDay) {
      daysRest++;
    } else if (entry.total > 0) {
      total += entry.total;
      daysLogged++;
    }
  }

  const weekEndDate = addDays(weekStartDate, 6);
  const yearMonth = toYearMonth(weekStartDate);
  const monthStats = getMonthStats(yearMonth);
  const monthlyGoalProgress =
    monthStats.goal > 0
      ? Math.round((monthStats.total / monthStats.goal) * 100)
      : 0;

  return {
    startDate: weekStartDate,
    endDate: weekEndDate,
    total,
    dailyAverage: daysLogged > 0 ? Math.round(total / daysLogged) : 0,
    daysLogged,
    daysRest,
    monthlyGoalProgress,
  };
}

export function getRecentWeeklySummaries(count: number = 8): WeekSummary[] {
  const summaries: WeekSummary[] = [];
  const todayStr = today();
  let weekStart = getWeekStart(todayStr);

  for (let i = 0; i < count; i++) {
    summaries.push(getWeeklySummary(weekStart));
    weekStart = addDays(weekStart, -7);
  }

  return summaries.reverse();
}

// ─── Calendar Data ─────────────────────────────────────────────────────────────

export function getCalendarMonth(yearMonth: string): {
  date: string;
  total: number;
  isRestDay: boolean;
  hasEntry: boolean;
}[] {
  const data = loadData();
  const [y, m] = yearMonth.split("-").map(Number);
  const days = new Date(y, m, 0).getDate();
  const result = [];

  for (let d = 1; d <= days; d++) {
    const dateStr = `${yearMonth}-${String(d).padStart(2, "0")}`;
    const entry = data.days[dateStr];
    result.push({
      date: dateStr,
      total: entry?.total ?? 0,
      isRestDay: entry?.isRestDay ?? false,
      hasEntry: !!entry,
    });
  }

  return result;
}

// ─── All Months With Data ──────────────────────────────────────────────────────

export function getAllMonths(): string[] {
  const data = loadData();
  const months = new Set<string>();

  Object.keys(data.days).forEach((d) => months.add(toYearMonth(d)));
  Object.keys(data.monthGoals).forEach((ym) => months.add(ym));

  // Always include current month
  months.add(toYearMonth(today()));

  return Array.from(months).sort().reverse();
}

// ─── Progress Bar Color ────────────────────────────────────────────────────────

export function progressColor(pct: number): string {
  if (pct >= 80) return "#4FFFB0"; // green/mint
  if (pct >= 40) return "#FFD166"; // yellow
  return "#FF5252"; // red
}

// ─── Format Helpers ────────────────────────────────────────────────────────────

export function formatYearMonth(yearMonth: string): string {
  const [y, m] = yearMonth.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function currentYearMonth(): string {
  return toYearMonth(today());
}

export function todayStr(): string {
  return today();
}

export function getDayOfWeek(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short" });
}

// ─── Record Breaking Detection ─────────────────────────────────────────────────

export function isNewDayRecord(date: string, count: number): boolean {
  const data = loadData();
  const entries = Object.values(data.days).filter(
    (e) => !e.isRestDay && e.total > 0 && e.date !== date
  );
  return entries.every((e) => count > e.total);
}

export function isNewWeekRecord(weekStart: string, count: number): boolean {
  const data = loadData();
  const allDates = Object.keys(data.days).sort();
  const weekTotals: Record<string, number> = {};

  allDates.forEach((dateStr) => {
    const entry = data.days[dateStr];
    if (!entry || entry.isRestDay) return;
    const ws = getWeekStart(dateStr);
    if (ws === weekStart) return; // exclude current week
    weekTotals[ws] = (weekTotals[ws] ?? 0) + entry.total;
  });

  return Object.values(weekTotals).every((t) => count > t);
}
