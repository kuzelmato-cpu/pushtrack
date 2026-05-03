// PushTrack — Body Weight Tracking
// Design: Minimal Dark Precision / Sports Analytics

import { loadData, saveData, today } from "./storage";
import type { WeightEntry } from "./types";

export function logWeight(weight: number): void {
  const data = loadData();
  const todayStr = today();

  // Remove existing entry for today if it exists
  data.weightLog = data.weightLog.filter((w) => w.date !== todayStr);

  // Add new entry
  data.weightLog.push({ date: todayStr, weight });

  // Keep sorted by date
  data.weightLog.sort((a, b) => a.date.localeCompare(b.date));

  saveData(data);
}

export function getTodayWeight(): number | null {
  const data = loadData();
  const todayStr = today();
  const entry = data.weightLog.find((w) => w.date === todayStr);
  return entry?.weight ?? null;
}

export function getWeightHistory(): WeightEntry[] {
  const data = loadData();
  return [...data.weightLog].sort((a, b) => b.date.localeCompare(a.date));
}

export function getWeightStats(): {
  current: number | null;
  min: number | null;
  max: number | null;
  avg: number | null;
  change: number | null;
} {
  const data = loadData();
  if (data.weightLog.length === 0) {
    return { current: null, min: null, max: null, avg: null, change: null };
  }

  const sorted = [...data.weightLog].sort((a, b) => a.date.localeCompare(b.date));
  const current = sorted[sorted.length - 1].weight;
  const min = Math.min(...sorted.map((w) => w.weight));
  const max = Math.max(...sorted.map((w) => w.weight));
  const avg = sorted.reduce((sum, w) => sum + w.weight, 0) / sorted.length;
  const first = sorted[0].weight;
  const change = current - first;

  return { current, min, max, avg: Math.round(avg * 10) / 10, change };
}

export function getMonthWeightStats(yearMonth: string): {
  entries: WeightEntry[];
  min: number | null;
  max: number | null;
  avg: number | null;
} {
  const data = loadData();
  const entries = data.weightLog.filter((w) => w.date.startsWith(yearMonth));

  if (entries.length === 0) {
    return { entries: [], min: null, max: null, avg: null };
  }

  const weights = entries.map((w) => w.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const avg = Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10;

  return { entries, min, max, avg };
}

// Correlation analysis
export function getWeightPushupCorrelation(yearMonth: string): {
  correlation: number;
  trend: "positive" | "negative" | "neutral";
  strength: "strong" | "moderate" | "weak";
} {
  const data = loadData();

  // Get weight entries for the month
  const weightEntries = data.weightLog.filter((w) => w.date.startsWith(yearMonth));
  if (weightEntries.length < 2) {
    return { correlation: 0, trend: "neutral", strength: "weak" };
  }

  // Get pushup entries for the month
  const pushupDays = Object.entries(data.days)
    .filter(([date]) => date.startsWith(yearMonth))
    .map(([date, entry]) => ({ date, pushups: entry.total }));

  if (pushupDays.length < 2) {
    return { correlation: 0, trend: "neutral", strength: "weak" };
  }

  // Create aligned data points (weight and pushups on same days)
  const alignedPoints: Array<{ weight: number; pushups: number }> = [];
  for (const weight of weightEntries) {
    const pushup = pushupDays.find((p) => p.date === weight.date);
    if (pushup) {
      alignedPoints.push({ weight: weight.weight, pushups: pushup.pushups });
    }
  }

  if (alignedPoints.length < 2) {
    return { correlation: 0, trend: "neutral", strength: "weak" };
  }

  // Calculate Pearson correlation coefficient
  const n = alignedPoints.length;
  const sumX = alignedPoints.reduce((sum, p) => sum + p.weight, 0);
  const sumY = alignedPoints.reduce((sum, p) => sum + p.pushups, 0);
  const sumXY = alignedPoints.reduce((sum, p) => sum + p.weight * p.pushups, 0);
  const sumX2 = alignedPoints.reduce((sum, p) => sum + p.weight * p.weight, 0);
  const sumY2 = alignedPoints.reduce((sum, p) => sum + p.pushups * p.pushups, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  const correlation = denominator === 0 ? 0 : numerator / denominator;
  const absCor = Math.abs(correlation);

  const trend = correlation > 0.1 ? "positive" : correlation < -0.1 ? "negative" : "neutral";
  const strength = absCor > 0.7 ? "strong" : absCor > 0.4 ? "moderate" : "weak";

  return { correlation: Math.round(correlation * 100) / 100, trend, strength };
}
