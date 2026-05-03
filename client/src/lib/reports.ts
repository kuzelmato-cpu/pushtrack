// PushTrack — Monthly Reports
// Design: Minimal Dark Precision / Sports Analytics

import { getMonthStats, formatYearMonth, getAllMonths } from "./analytics";
import type { MonthlyReport } from "./types";

export function generateMonthlyReport(yearMonth: string): MonthlyReport {
  const stats = getMonthStats(yearMonth);
  const allMonths = getAllMonths();
  const currentIdx = allMonths.indexOf(yearMonth);
  const previousYM = currentIdx + 1 < allMonths.length ? allMonths[currentIdx + 1] : null;

  let previousStats = null;
  let improvement = null;

  if (previousYM) {
    previousStats = getMonthStats(previousYM);
    if (previousStats.dailyAverage > 0) {
      improvement = Math.round(
        ((stats.dailyAverage - previousStats.dailyAverage) / previousStats.dailyAverage) * 100
      );
    }
  }

  return {
    yearMonth,
    goalTarget: stats.goal,
    totalCompleted: stats.total,
    goalMet: stats.goal > 0 && stats.total >= stats.goal,
    bestDay: stats.bestDay,
    daysActive: stats.daysLogged,
    dailyAverage: stats.dailyAverage,
    previousMonth: previousStats
      ? {
          total: previousStats.total,
          dailyAverage: previousStats.dailyAverage,
        }
      : null,
    improvement,
  };
}

export function getLatestMonthReport(): MonthlyReport | null {
  const allMonths = getAllMonths();
  if (allMonths.length === 0) return null;
  return generateMonthlyReport(allMonths[0]);
}

export function isMonthComplete(yearMonth: string): boolean {
  const [y, m] = yearMonth.split("-").map(Number);
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  // Month is complete if it's in the past
  if (y < currentYear) return true;
  if (y === currentYear && m < currentMonth) return true;
  return false;
}
