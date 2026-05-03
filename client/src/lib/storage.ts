// PushTrack — Local Storage Layer
// Design: Minimal Dark Precision / Sports Analytics

import type { AppData, DayEntry, MonthGoal } from "./types";

const STORAGE_KEY = "pushtrack_data";

const DEFAULT_DATA: AppData = {
  days: {},
  monthGoals: {},
  bestStreak: 0,
  fitnessTest: null,
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(raw) as AppData;
    return {
      days: parsed.days ?? {},
      monthGoals: parsed.monthGoals ?? {},
      bestStreak: parsed.bestStreak ?? 0,
      fitnessTest: parsed.fitnessTest ?? null,
    };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getDay(date: string): DayEntry | null {
  const data = loadData();
  return data.days[date] ?? null;
}

export function setDay(entry: DayEntry): void {
  const data = loadData();
  data.days[entry.date] = entry;
  // Recalculate best streak after every write
  data.bestStreak = Math.max(data.bestStreak, computeCurrentStreak(data));
  saveData(data);
}

export function deleteDay(date: string): void {
  const data = loadData();
  delete data.days[date];
  saveData(data);
}

export function getMonthGoal(yearMonth: string): MonthGoal | null {
  const data = loadData();
  return data.monthGoals[yearMonth] ?? null;
}

export function setMonthGoal(yearMonth: string, goal: number): void {
  const data = loadData();
  data.monthGoals[yearMonth] = { yearMonth, goal };
  saveData(data);
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function today(): string {
  return toDateStr(new Date());
}

export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function toYearMonth(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysInMonth(yearMonth: string): number {
  const [y, m] = yearMonth.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

export function remainingDaysInMonth(yearMonth: string): number {
  const todayStr = today();
  const todayYM = toYearMonth(todayStr);
  if (todayYM !== yearMonth) return 0;
  const todayDate = parseDate(todayStr);
  const [y, m] = yearMonth.split("-").map(Number);
  const lastDay = new Date(y, m, 0);
  const diff = Math.floor(
    (lastDay.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff + 1; // include today
}

export function getWeekStart(dateStr: string): string {
  const d = parseDate(dateStr);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // Monday-based
  d.setDate(d.getDate() + diff);
  return toDateStr(d);
}

export function addDays(dateStr: string, n: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

// ─── Streak Computation ───────────────────────────────────────────────────────

export function computeCurrentStreak(data: AppData): number {
  const todayStr = today();
  let streak = 0;
  let cursor = todayStr;

  // If today has no entry yet, start checking from yesterday
  const todayEntry = data.days[cursor];
  if (!todayEntry || (!todayEntry.total && !todayEntry.isRestDay)) {
    cursor = addDays(cursor, -1);
  }

  for (let i = 0; i < 365; i++) {
    const entry = data.days[cursor];
    if (!entry) break;
    if (entry.isRestDay || entry.total > 0) {
      streak++;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

export function getBestStreak(): number {
  return loadData().bestStreak;
}
