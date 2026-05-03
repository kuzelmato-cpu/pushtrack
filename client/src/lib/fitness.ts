// PushTrack — Fitness Test & Templates
// Design: Minimal Dark Precision / Sports Analytics

import { loadData, saveData, today, toYearMonth } from "./storage";
import type { FitnessTest, WorkoutTemplate } from "./types";

// ─── Fitness Level Detection ───────────────────────────────────────────────────

export function detectFitnessLevel(maxReps: number): "beginner" | "intermediate" | "beast" {
  if (maxReps < 20) return "beginner";
  if (maxReps < 50) return "intermediate";
  return "beast";
}

export function suggestMonthlyGoal(maxReps: number, level: "beginner" | "intermediate" | "beast"): number {
  // Suggest a monthly goal based on fitness level
  // Assumes user can do this many reps per day on average
  const dailyMultiplier = level === "beginner" ? 0.5 : level === "intermediate" ? 0.75 : 1;
  const dailyTarget = Math.round(maxReps * dailyMultiplier);
  return dailyTarget * 30;
}

export function saveFitnessTest(maxReps: number): FitnessTest {
  const data = loadData();
  const level = detectFitnessLevel(maxReps);
  const suggestedGoal = suggestMonthlyGoal(maxReps, level);

  const test: FitnessTest = {
    date: today(),
    maxReps,
    level,
    suggestedGoal,
  };

  data.fitnessTest = test;
  saveData(data);
  return test;
}

export function getFitnessTest(): FitnessTest | null {
  return loadData().fitnessTest;
}

// ─── Workout Templates ────────────────────────────────────────────────────────

export const PRESET_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "100-day",
    name: "100 Pushups Daily",
    description: "Do 100 pushups every day for 30 days. Classic challenge.",
    dailyTargets: Array(30).fill(100),
    totalReps: 3000,
  },
  {
    id: "progressive",
    name: "Progressive Overload",
    description: "Start at 50, add 5 every day. Week 1: 50-85, Week 2: 90-125, etc.",
    dailyTargets: Array.from({ length: 30 }, (_, i) => 50 + i * 5),
    totalReps: 3225,
  },
  {
    id: "beginner-30",
    name: "Beginner 30-Day",
    description: "Ramp up gradually. Perfect for starting out. Avg 40/day.",
    dailyTargets: [
      20, 20, 25, 25, 30, 30, 35, 35, 40, 40, 45, 45, 50, 50, 55, 55,
      50, 50, 45, 45, 40, 40, 50, 50, 60, 60, 70, 70, 80, 80,
    ],
    totalReps: 1350,
  },
  {
    id: "pyramid",
    name: "Pyramid Week",
    description: "Ramp up to peak mid-week, then down. 7-day cycle, repeat.",
    dailyTargets: [
      30, 40, 50, 60, 50, 40, 30, 40, 50, 60, 50, 40, 30, 40, 50, 60,
      50, 40, 30, 40, 50, 60, 50, 40, 30, 40, 50, 60, 50, 40,
    ],
    totalReps: 1260,
  },
  {
    id: "high-volume",
    name: "High Volume",
    description: "For intermediate+. Avg 100/day. Build serious endurance.",
    dailyTargets: Array.from({ length: 30 }, (_, i) => {
      const week = Math.floor(i / 7);
      return 80 + week * 10;
    }),
    totalReps: 3000,
  },
];

export function loadTemplate(templateId: string): WorkoutTemplate | null {
  return PRESET_TEMPLATES.find((t) => t.id === templateId) ?? null;
}

export function applyTemplate(templateId: string): { success: boolean; goal: number } {
  const template = loadTemplate(templateId);
  if (!template) return { success: false, goal: 0 };

  const data = loadData();
  const ym = toYearMonth(today());
  data.monthGoals[ym] = { yearMonth: ym, goal: template.totalReps };
  saveData(data);

  return { success: true, goal: template.totalReps };
}
