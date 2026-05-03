// PushTrack — Monthly Report Card Screen
// Design: Minimal Dark Precision / Sports Analytics

import { useLocation } from "wouter";
import { ChevronLeft, Trophy, TrendingUp, Calendar, Zap } from "lucide-react";
import { getAllMonths, formatYearMonth } from "../lib/analytics";
import { generateMonthlyReport, isMonthComplete } from "../lib/reports";
import { useState } from "react";

function ReportCard({ report }: { report: any }) {
  const goalMetColor = report.goalMet ? "#4FFFB0" : "#FF5252";
  const goalMet = report.goalMet && report.goalTarget > 0;

  return (
    <div className="space-y-4">
      {/* Goal Status */}
      <div
        className="pt-card p-6 rounded-2xl"
        style={{
          background: goalMet
            ? "linear-gradient(135deg, oklch(0.88 0.18 155 / 15%) 0%, #1A1D27 100%)"
            : "linear-gradient(135deg, oklch(0.65 0.22 25 / 15%) 0%, #1A1D27 100%)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${goalMetColor}20` }}
            >
              <Trophy size={20} style={{ color: goalMetColor }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Goal Status</p>
              <p className="font-semibold text-foreground mt-0.5">{goalMet ? "Goal Crushed! 🔥" : "Goal Missed"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <span className="stat-number text-4xl" style={{ color: goalMetColor }}>
            {report.totalCompleted.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-sm mb-1">/ {report.goalTarget.toLocaleString()}</span>
          <span
            className="ml-auto text-lg font-semibold"
            style={{ color: goalMetColor }}
          >
            {report.goalTarget > 0 ? Math.round((report.totalCompleted / report.goalTarget) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="pt-card p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Best Day</p>
          <p className="stat-number text-3xl text-foreground">{report.bestDay.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">pushups</p>
        </div>
        <div className="pt-card p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Days Active</p>
          <p className="stat-number text-3xl text-foreground">{report.daysActive}</p>
          <p className="text-xs text-muted-foreground mt-1">out of 30</p>
        </div>
      </div>

      {/* Daily Average */}
      <div className="pt-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} style={{ color: "#FFD166" }} />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Daily Average</p>
        </div>
        <div className="flex items-end gap-2">
          <span className="stat-number text-3xl" style={{ color: "#FFD166" }}>
            {report.dailyAverage}
          </span>
          <span className="text-muted-foreground text-sm mb-1">pushups/day</span>
        </div>
      </div>

      {/* Month-over-Month Comparison */}
      {report.previousMonth && report.improvement !== null && (
        <div className="pt-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} style={{ color: report.improvement >= 0 ? "#4FFFB0" : "#FF5252" }} />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">vs Last Month</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Daily Average</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{report.previousMonth.dailyAverage}</span>
                <span
                  className="stat-number text-lg"
                  style={{ color: report.improvement >= 0 ? "#4FFFB0" : "#FF5252" }}
                >
                  {report.improvement > 0 ? "+" : ""}{report.improvement}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div
        className="pt-card p-4 text-center rounded-xl"
        style={{ background: "oklch(1 0 0 / 5%)" }}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {goalMet
            ? "You absolutely crushed it this month. Keep the momentum going!"
            : "You're building the habit. Consistency is key. Next month will be better!"}
        </p>
      </div>
    </div>
  );
}

export default function MonthlyReport() {
  const [, navigate] = useLocation();
  const allMonths = getAllMonths().filter((m) => isMonthComplete(m));
  const [selectedMonth, setSelectedMonth] = useState(allMonths[0] || null);

  if (!selectedMonth) {
    return (
      <div className="page-content bg-background">
        <div className="container pt-6 pb-4 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/stats")}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 8%)" }}
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="font-display text-xl text-foreground">Monthly Reports</h1>
          </div>
          <div className="pt-card p-8 text-center">
            <Calendar size={32} className="mx-auto mb-3" style={{ color: "oklch(0.35 0.01 265)" }} />
            <p className="text-muted-foreground text-sm">No completed months yet. Come back at the end of the month!</p>
          </div>
        </div>
      </div>
    );
  }

  const report = generateMonthlyReport(selectedMonth);

  return (
    <div className="page-content bg-background">
      <div className="container pt-6 pb-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/stats")}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 8%)" }}
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="font-display text-xl text-foreground">Monthly Report</h1>
              <p className="text-xs text-muted-foreground">{formatYearMonth(selectedMonth)}</p>
            </div>
          </div>
        </div>

        {/* Month Selector */}
        {allMonths.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allMonths.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                style={{
                  background: selectedMonth === m ? "#4FFFB0" : "oklch(1 0 0 / 8%)",
                  color: selectedMonth === m ? "#0F1117" : "oklch(0.65 0.015 265)",
                }}
              >
                {formatYearMonth(m)}
              </button>
            ))}
          </div>
        )}

        {/* Report Content */}
        <ReportCard report={report} />
      </div>
    </div>
  );
}
