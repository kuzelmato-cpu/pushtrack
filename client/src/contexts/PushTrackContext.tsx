// PushTrack — Global State Context
// Design: Minimal Dark Precision / Sports Analytics

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  currentYearMonth,
  getCurrentStreak,
  getMonthStats,
  getPersonalRecords,
  getSmartDailyTarget,
  todayStr,
} from "../lib/analytics";
import {
  deleteDay,
  getDay,
  getMonthGoal,
  setDay,
  setMonthGoal,
} from "../lib/storage";
import type { DayEntry, MonthStats, PersonalRecords } from "../lib/types";

interface PushTrackContextValue {
  // Today
  todayEntry: DayEntry | null;
  logSets: (sets: number[]) => void;
  markRestDay: () => void;
  clearRestDay: () => void;
  deleteToday: () => void;

  // Monthly goal
  monthGoal: number;
  setGoal: (goal: number) => void;

  // Derived stats (current month)
  monthStats: MonthStats;
  smartTarget: number;
  currentStreak: number;
  personalRecords: PersonalRecords;

  // Refresh trigger
  refresh: () => void;
  lastUpdated: number;
}

const PushTrackContext = createContext<PushTrackContextValue | null>(null);

export function PushTrackProvider({ children }: { children: React.ReactNode }) {
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const refresh = useCallback(() => setLastUpdated(Date.now()), []);

  const ym = currentYearMonth();
  const dateStr = todayStr();

  const todayEntry = getDay(dateStr);
  const monthGoalObj = getMonthGoal(ym);
  const monthGoal = monthGoalObj?.goal ?? 0;
  const monthStats = getMonthStats(ym);
  const smartTarget = getSmartDailyTarget(ym);
  const currentStreak = getCurrentStreak();
  const personalRecords = getPersonalRecords();

  // Re-compute on lastUpdated change (no-op since all reads are synchronous)
  useEffect(() => {}, [lastUpdated]);

  const logSets = useCallback(
    (sets: number[]) => {
      const total = sets.reduce((a, b) => a + b, 0);
      const entry: DayEntry = {
        date: dateStr,
        sets,
        total,
        isRestDay: false,
      };
      setDay(entry);
      refresh();
    },
    [dateStr, refresh]
  );

  const markRestDay = useCallback(() => {
    const entry: DayEntry = {
      date: dateStr,
      sets: [],
      total: 0,
      isRestDay: true,
    };
    setDay(entry);
    refresh();
  }, [dateStr, refresh]);

  const clearRestDay = useCallback(() => {
    deleteDay(dateStr);
    refresh();
  }, [dateStr, refresh]);

  const deleteToday = useCallback(() => {
    deleteDay(dateStr);
    refresh();
  }, [dateStr, refresh]);

  const setGoal = useCallback(
    (goal: number) => {
      setMonthGoal(ym, goal);
      refresh();
    },
    [ym, refresh]
  );

  const value: PushTrackContextValue = {
    todayEntry,
    logSets,
    markRestDay,
    clearRestDay,
    deleteToday,
    monthGoal,
    setGoal,
    monthStats,
    smartTarget,
    currentStreak,
    personalRecords,
    refresh,
    lastUpdated,
  };

  return (
    <PushTrackContext.Provider value={value}>
      {children}
    </PushTrackContext.Provider>
  );
}

export function usePushTrack(): PushTrackContextValue {
  const ctx = useContext(PushTrackContext);
  if (!ctx) throw new Error("usePushTrack must be used within PushTrackProvider");
  return ctx;
}
