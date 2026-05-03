// PushTrack — Core Data Types
// Design: Minimal Dark Precision / Sports Analytics

export interface DayEntry {
  date: string; // "YYYY-MM-DD"
  sets: number[]; // individual set counts
  total: number; // sum of sets
  isRestDay: boolean;
}

export interface MonthGoal {
  yearMonth: string; // "YYYY-MM"
  goal: number;
}

export interface FitnessTest {
  date: string; // "YYYY-MM-DD"
  maxReps: number;
  level: "beginner" | "intermediate" | "beast";
  suggestedGoal: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  dailyTargets: number[]; // per day for 30 days
  totalReps: number;
}

export interface AppData {
  days: Record<string, DayEntry>; // keyed by "YYYY-MM-DD"
  monthGoals: Record<string, MonthGoal>; // keyed by "YYYY-MM"
  bestStreak: number;
  fitnessTest: FitnessTest | null;
}

export interface DayStats {
  date: string;
  total: number;
  isRestDay: boolean;
  sets: number[];
}

export interface MonthStats {
  yearMonth: string;
  total: number;
  goal: number;
  daysLogged: number;
  daysRest: number;
  bestDay: number;
  dailyAverage: number;
}

export interface WeekSummary {
  startDate: string; // "YYYY-MM-DD" Monday
  endDate: string;   // "YYYY-MM-DD" Sunday
  total: number;
  dailyAverage: number;
  daysLogged: number;
  daysRest: number;
  monthlyGoalProgress: number; // % of monthly goal done in this week's month
}

export interface PersonalRecords {
  bestDay: { date: string; count: number } | null;
  bestWeek: { startDate: string; count: number } | null;
  bestMonth: { yearMonth: string; count: number } | null;
}

export interface MonthlyReport {
  yearMonth: string;
  goalTarget: number;
  totalCompleted: number;
  goalMet: boolean;
  bestDay: number;
  daysActive: number;
  dailyAverage: number;
  previousMonth: {
    total: number;
    dailyAverage: number;
  } | null;
  improvement: number | null; // % improvement vs previous month
}
