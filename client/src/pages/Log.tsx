// PushTrack — Log Screen
// Design: Minimal Dark Precision / Sports Analytics

import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Plus, Trash2, Check, ChevronLeft, X } from "lucide-react";
import { usePushTrack } from "../contexts/PushTrackContext";
import { toast } from "sonner";
import { formatDate, todayStr } from "../lib/analytics";

export default function Log() {
  const [, navigate] = useLocation();
  const { todayEntry, logSets, deleteToday } = usePushTrack();

  // Initialize sets from existing entry if editing
  const [sets, setSets] = useState<number[]>(
    todayEntry && !todayEntry.isRestDay && todayEntry.sets.length > 0
      ? todayEntry.sets
      : [0]
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const total = sets.reduce((a, b) => a + b, 0);

  function updateSet(idx: number, val: string) {
    const n = Math.max(0, parseInt(val) || 0);
    setSets((prev) => prev.map((v, i) => (i === idx ? n : v)));
  }

  function addSet() {
    setSets((prev) => [...prev, 0]);
    setActiveIdx(sets.length);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function removeSet(idx: number) {
    if (sets.length === 1) {
      setSets([0]);
      return;
    }
    setSets((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx(Math.max(0, idx - 1));
  }

  function handleSave() {
    const filtered = sets.filter((s) => s > 0);
    if (filtered.length === 0) {
      toast.error("Enter at least one set with pushups");
      return;
    }
    logSets(filtered);
    toast.success(`Logged ${filtered.reduce((a, b) => a + b, 0)} pushups!`);
    navigate("/");
  }

  function handleDelete() {
    deleteToday();
    toast.success("Today's entry deleted");
    navigate("/");
  }

  // Quick-add buttons
  const QUICK_AMOUNTS = [10, 20, 25, 30, 50, 100];

  function quickAdd(amount: number) {
    setSets((prev) => {
      const updated = [...prev];
      updated[activeIdx] = (updated[activeIdx] || 0) + amount;
      return updated;
    });
  }

  return (
    <div className="page-content bg-background">
      <div className="container pt-6 pb-4 space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-xl text-foreground">Log Pushups</h1>
            <p className="text-xs text-muted-foreground">{formatDate(todayStr())}</p>
          </div>
        </div>

        {/* Total Display */}
        <div
          className="pt-card p-6 text-center"
          style={{ background: "linear-gradient(135deg, #1A1D27 0%, #1E2235 100%)" }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Total Today</p>
          <p
            className="stat-number text-8xl transition-all duration-300"
            style={{ color: total > 0 ? "#4FFFB0" : "oklch(0.35 0.01 265)" }}
          >
            {total}
          </p>
          <p className="text-muted-foreground text-sm mt-1">pushups</p>
        </div>

        {/* Sets */}
        <div className="pt-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Sets</p>
            <p className="text-xs text-muted-foreground">{sets.filter(s => s > 0).length} set{sets.filter(s => s > 0).length !== 1 ? "s" : ""}</p>
          </div>

          <div className="space-y-2">
            {sets.map((val, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                style={{
                  background: activeIdx === idx ? "oklch(0.88 0.18 155 / 8%)" : "oklch(1 0 0 / 5%)",
                  border: `1px solid ${activeIdx === idx ? "oklch(0.88 0.18 155 / 25%)" : "transparent"}`,
                }}
                onClick={() => setActiveIdx(idx)}
              >
                <span className="text-xs text-muted-foreground w-12">Set {idx + 1}</span>
                <input
                  ref={activeIdx === idx ? inputRef : undefined}
                  type="number"
                  min="0"
                  value={val || ""}
                  placeholder="0"
                  onChange={(e) => updateSet(idx, e.target.value)}
                  onFocus={() => setActiveIdx(idx)}
                  className="flex-1 bg-transparent text-right stat-number text-2xl text-foreground outline-none"
                  style={{ color: val > 0 ? "#4FFFB0" : undefined }}
                  inputMode="numeric"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); removeSet(idx); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ color: "oklch(0.45 0.015 265)" }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addSet}
            className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            style={{ background: "oklch(1 0 0 / 5%)", color: "oklch(0.65 0.015 265)", border: "1px dashed oklch(1 0 0 / 15%)" }}
          >
            <Plus size={16} />
            Add Set
          </button>
        </div>

        {/* Quick Add */}
        <div className="pt-card p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Quick Add to Set {activeIdx + 1}</p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => quickAdd(amt)}
                className="py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{ background: "oklch(1 0 0 / 8%)", color: "oklch(0.75 0.01 265)" }}
              >
                +{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ background: "#4FFFB0", color: "#0F1117" }}
        >
          <Check size={20} strokeWidth={2.5} />
          Save {total > 0 ? `${total} Pushups` : "Entry"}
        </button>

        {/* Delete today's entry */}
        {todayEntry && !todayEntry.isRestDay && (
          <button
            onClick={handleDelete}
            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            style={{ color: "oklch(0.65 0.22 25)", background: "oklch(0.65 0.22 25 / 10%)" }}
          >
            <Trash2 size={16} />
            Delete Today's Entry
          </button>
        )}

      </div>
    </div>
  );
}
