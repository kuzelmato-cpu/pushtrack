// PushTrack — Data Export (CSV)
// Design: Minimal Dark Precision / Sports Analytics

import { loadData } from "./storage";
import { formatDate } from "./analytics";

export function exportToCSV(): void {
  const data = loadData();

  // Prepare CSV data
  const rows: string[][] = [];

  // Header
  rows.push(["Date", "Pushups", "Sets", "Rest Day", "Weight (lbs)"]);

  // Get all dates with entries or weight logs
  const allDates = new Set<string>();
  Object.keys(data.days).forEach((date) => allDates.add(date));
  data.weightLog.forEach((w) => allDates.add(w.date));

  // Sort dates
  const sortedDates = Array.from(allDates).sort();

  // Build rows
  sortedDates.forEach((date) => {
    const dayEntry = data.days[date];
    const weightEntry = data.weightLog.find((w) => w.date === date);

    const pushups = dayEntry?.total ?? "";
    const sets = dayEntry?.sets.join("+") ?? "";
    const isRestDay = dayEntry?.isRestDay ? "Yes" : "";
    const weight = weightEntry?.weight ?? "";

    rows.push([formatDate(date), String(pushups), sets, isRestDay, String(weight)]);
  });

  // Convert to CSV string
  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `pushtrack-export-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportJSON(): void {
  const data = loadData();

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `pushtrack-backup-${new Date().toISOString().split("T")[0]}.json`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function importJSON(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        // Basic validation
        if (parsed.days && parsed.monthGoals !== undefined) {
          localStorage.setItem("pushtrack_data", content);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch {
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
}
