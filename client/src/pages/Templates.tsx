// PushTrack — Workout Templates Screen
// Design: Minimal Dark Precision / Sports Analytics

import { useLocation } from "wouter";
import { ChevronLeft, Zap, Calendar, TrendingUp, Flame } from "lucide-react";
import { PRESET_TEMPLATES, applyTemplate } from "../lib/fitness";
import { usePushTrack } from "../contexts/PushTrackContext";
import { toast } from "sonner";

const TEMPLATE_ICONS = {
  "100-day": Flame,
  "progressive": TrendingUp,
  "beginner-30": Zap,
  "pyramid": Calendar,
  "high-volume": Flame,
};

export default function Templates() {
  const [, navigate] = useLocation();
  const { refresh } = usePushTrack();

  function handleApplyTemplate(templateId: string, templateName: string) {
    const result = applyTemplate(templateId);
    if (result.success) {
      toast.success(`${templateName} loaded! Goal: ${result.goal.toLocaleString()} pushups.`);
      refresh();
      navigate("/");
    } else {
      toast.error("Failed to load template");
    }
  }

  return (
    <div className="page-content bg-background">
      <div className="container pt-6 pb-4 space-y-4">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/goals")}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-xl text-foreground">Workout Plans</h1>
            <p className="text-xs text-muted-foreground">Pre-built 30-day challenges</p>
          </div>
        </div>

        {/* Info */}
        <div className="pt-card p-4 bg-opacity-50" style={{ background: "oklch(1 0 0 / 5%)" }}>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pick a plan to set your monthly goal. Each plan is designed to build strength and endurance over 30 days.
          </p>
        </div>

        {/* Templates */}
        <div className="space-y-3">
          {PRESET_TEMPLATES.map((template) => {
            const Icon = TEMPLATE_ICONS[template.id as keyof typeof TEMPLATE_ICONS] || Zap;
            const dailyAvg = Math.round(template.totalReps / 30);

            return (
              <div
                key={template.id}
                className="pt-card p-4 flex items-start gap-3 hover:border-primary transition-colors"
                style={{ borderColor: "oklch(1 0 0 / 12%)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "oklch(0.88 0.18 155 / 15%)" }}
                >
                  <Icon size={18} style={{ color: "#4FFFB0" }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{template.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{template.description}</p>

                  <div className="flex gap-3 mt-2.5 text-xs">
                    <span className="text-muted-foreground">
                      <span className="stat-number text-sm" style={{ color: "#4FFFB0" }}>
                        {template.totalReps.toLocaleString()}
                      </span>{" "}
                      total
                    </span>
                    <span className="text-muted-foreground">
                      <span className="stat-number text-sm" style={{ color: "#FFD166" }}>
                        {dailyAvg}
                      </span>{" "}
                      /day
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyTemplate(template.id, template.name)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95 shrink-0"
                  style={{ background: "#4FFFB0", color: "#0F1117" }}
                >
                  Load
                </button>
              </div>
            );
          })}
        </div>

        {/* Progressive Overload */}
        <button
          onClick={() => navigate("/progressive-overload")}
          className="w-full py-3 rounded-xl text-sm font-medium transition-colors mt-4 mb-2"
          style={{ background: "oklch(0.88 0.18 155 / 15%)", color: "#4FFFB0" }}
        >
          Try Progressive Overload
        </button>

        {/* Custom Goal */}
        <button
          onClick={() => navigate("/goals")}
          className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ background: "oklch(1 0 0 / 8%)", color: "oklch(0.75 0.01 265)" }}
        >
          Set Custom Goal
        </button>

      </div>
    </div>
  );
}
