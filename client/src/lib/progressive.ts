// PushTrack — Progressive Overload
// Design: Minimal Dark Precision / Sports Analytics

import { loadData, saveData, today, toYearMonth } from "./storage";
import type { ProgressiveOverloadPlan } from "./types";

// ─── Progressive Overload Plan Management ───────────────────────────────────

export function createProgressiveOverloadPlan(
  startingDaily: number,
  weeklyIncrement: number,
  weeks: number = 4
): ProgressiveOverloadPlan {
  const data = loadData();
  const ym = toYearMonth(today());

  const plan: ProgressiveOverloadPlan = {
    startDate: today(),
    yearMonth: ym,
    startingDaily,
    weeklyIncrement,
    weeks,
    active: true,
  };

  // Calculate total for the month
  let total = 0;
  for (let week = 0; week < weeks; week++) {
    const dailyTarget = startingDaily + week * weeklyIncrement;
    total += dailyTarget * 7; // 7 days per week
  }

  // Set monthly goal to match the progressive plan total
  data.monthGoals[ym] = { yearMonth: ym, goal: total };
  data.progressiveOverload = plan;
  saveData(data);

  return plan;
}

export function getProgressiveOverloadPlan(): ProgressiveOverloadPlan | null {
  return loadData().progressiveOverload;
}

export function getWeekNumber(date: string): number {
  const plan = getProgressiveOverloadPlan();
  if (!plan) return 0;

  const planStart = new Date(plan.startDate);
  const checkDate = new Date(date);
  const diffTime = checkDate.getTime() - planStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

export function getDailyTarget(date: string): number {
  const plan = getProgressiveOverloadPlan();
  if (!plan || !plan.active) return 0;

  const week = getWeekNumber(date);
  if (week < 0 || week >= plan.weeks) return 0;

  return plan.startingDaily + week * plan.weeklyIncrement;
}

export function getWeeklyTarget(weekNumber: number): number {
  const plan = getProgressiveOverloadPlan();
  if (!plan || !plan.active) return 0;

  if (weekNumber < 0 || weekNumber >= plan.weeks) return 0;

  const dailyTarget = plan.startingDaily + weekNumber * plan.weeklyIncrement;
  return dailyTarget * 7;
}

export function getCurrentWeekInfo(): {
  weekNumber: number;
  dailyTarget: number;
  weeklyTarget: number;
  weekStart: string;
  weekEnd: string;
} {
  const plan = getProgressiveOverloadPlan();
  if (!plan || !plan.active) {
    return { weekNumber: 0, dailyTarget: 0, weeklyTarget: 0, weekStart: "", weekEnd: "" };
  }

  const todayDate = new Date(today());
  const planStart = new Date(plan.startDate);
  const diffTime = todayDate.getTime() - planStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7);

  // Calculate week start (Monday) and end (Sunday)
  const dayOfWeek = todayDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(todayDate);
  weekStart.setDate(todayDate.getDate() - daysToMonday);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const dailyTarget = plan.startingDaily + weekNumber * plan.weeklyIncrement;
  const weeklyTarget = dailyTarget * 7;

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  return {
    weekNumber,
    dailyTarget,
    weeklyTarget,
    weekStart: formatDate(weekStart),
    weekEnd: formatDate(weekEnd),
  };
}

export function deactivateProgressiveOverload(): void {
  const data = loadData();
  if (data.progressiveOverload) {
    data.progressiveOverload.active = false;
  }
  saveData(data);
}

export function getTotalProgressiveOverloadTarget(): number {
  const plan = getProgressiveOverloadPlan();
  if (!plan || !plan.active) return 0;

  let total = 0;
  for (let week = 0; week < plan.weeks; week++) {
    const dailyTarget = plan.startingDaily + week * plan.weeklyIncrement;
    total += dailyTarget * 7;
  }
  return total;
}
