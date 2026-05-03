// PushTrack — Settings Screen
// Design: Minimal Dark Precision / Sports Analytics

import { useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Download, Upload, Trash2, RotateCcw } from "lucide-react";
import { exportToCSV, exportJSON, importJSON } from "../lib/export";
import { loadData, saveData } from "../lib/storage";
import { toast } from "sonner";

export default function Settings() {
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExportCSV() {
    try {
      exportToCSV();
      toast.success("CSV exported successfully");
    } catch (e) {
      toast.error("Failed to export CSV");
    }
  }

  function handleExportJSON() {
    try {
      exportJSON();
      toast.success("Backup exported successfully");
    } catch (e) {
      toast.error("Failed to export backup");
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await importJSON(file);
    if (success) {
      toast.success("Data imported successfully. Refresh to see changes.");
      window.location.reload();
    } else {
      toast.error("Invalid backup file");
    }
  }

  function handleClearData() {
    if (confirm("Are you sure? This will delete all your data. This cannot be undone.")) {
      const emptyData = {
        days: {},
        monthGoals: {},
        bestStreak: 0,
        fitnessTest: null,
        progressiveOverload: null,
        weightLog: [],
      };
      saveData(emptyData);
      toast.success("All data cleared");
      window.location.reload();
    }
  }

  function handleResetToday() {
    const data = loadData();
    const today = new Date().toISOString().split("T")[0];
    if (data.days[today]) {
      delete data.days[today];
      saveData(data);
      toast.success("Today's entry cleared");
      window.location.reload();
    } else {
      toast.info("No entry for today");
    }
  }

  return (
    <div className="page-content bg-background">
      <div className="container pt-6 pb-4 space-y-4">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/stats")}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-xl text-foreground">Settings</h1>
            <p className="text-xs text-muted-foreground">Data & preferences</p>
          </div>
        </div>

        {/* Export Section */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground px-1">Export</p>

          <button
            onClick={handleExportCSV}
            className="w-full pt-card p-4 flex items-center gap-3 rounded-xl hover:border-primary transition-colors text-left"
            style={{ borderColor: "oklch(1 0 0 / 12%)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.88 0.18 155 / 15%)" }}
            >
              <Download size={18} style={{ color: "#4FFFB0" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Export as CSV</p>
              <p className="text-xs text-muted-foreground">Download all data as spreadsheet</p>
            </div>
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full pt-card p-4 flex items-center gap-3 rounded-xl hover:border-primary transition-colors text-left"
            style={{ borderColor: "oklch(1 0 0 / 12%)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.82 0.16 85 / 15%)" }}
            >
              <Download size={18} style={{ color: "#FFD166" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Export Backup</p>
              <p className="text-xs text-muted-foreground">Full backup for restore</p>
            </div>
          </button>
        </div>

        {/* Import Section */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground px-1">Import</p>

          <button
            onClick={handleImportClick}
            className="w-full pt-card p-4 flex items-center gap-3 rounded-xl hover:border-primary transition-colors text-left"
            style={{ borderColor: "oklch(1 0 0 / 12%)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.88 0.18 155 / 15%)" }}
            >
              <Upload size={18} style={{ color: "#4FFFB0" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Restore Backup</p>
              <p className="text-xs text-muted-foreground">Import previously exported data</p>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Danger Zone */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground px-1">Danger Zone</p>

          <button
            onClick={handleResetToday}
            className="w-full pt-card p-4 flex items-center gap-3 rounded-xl hover:border-primary transition-colors text-left"
            style={{ borderColor: "oklch(1 0 0 / 12%)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.704 0.191 22 / 15%)" }}
            >
              <RotateCcw size={18} style={{ color: "#FF5252" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Reset Today</p>
              <p className="text-xs text-muted-foreground">Clear today's entry only</p>
            </div>
          </button>

          <button
            onClick={handleClearData}
            className="w-full pt-card p-4 flex items-center gap-3 rounded-xl hover:border-primary transition-colors text-left"
            style={{ borderColor: "oklch(1 0 0 / 12%)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.704 0.191 22 / 15%)" }}
            >
              <Trash2 size={18} style={{ color: "#FF5252" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Delete All Data</p>
              <p className="text-xs text-muted-foreground">Permanently erase everything</p>
            </div>
          </button>
        </div>

        {/* Info */}
        <div
          className="pt-card p-4 text-center rounded-xl"
          style={{ background: "oklch(1 0 0 / 5%)" }}
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            All data is stored locally on your device. Export regularly for backup.
          </p>
        </div>

      </div>
    </div>
  );
}
