// PushTrack — Share Progress Screen
// Design: Minimal Dark Precision / Sports Analytics

import { useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Share2, Download, Copy } from "lucide-react";
import { currentYearMonth, formatYearMonth, getMonthStats } from "../lib/analytics";
import { getWeightStats } from "../lib/weight";
import { toast } from "sonner";

export default function ShareProgress() {
  const [, navigate] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ym = currentYearMonth();
  const monthStats = getMonthStats(ym);
  const weightStats = getWeightStats();

  function generateImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 600;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "#0F1117";
    ctx.fillRect(0, 0, width, height);

    // Header
    ctx.fillStyle = "#4FFFB0";
    ctx.font = "bold 48px 'Syne', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PushTrack", width / 2, 80);

    // Month
    ctx.fillStyle = "#FFD166";
    ctx.font = "24px 'DM Sans', sans-serif";
    ctx.fillText(formatYearMonth(ym), width / 2, 130);

    // Stats
    const stats = [
      { label: "Total Pushups", value: monthStats.total.toLocaleString(), color: "#4FFFB0" },
      { label: "Monthly Goal", value: monthStats.goal.toLocaleString(), color: "#FFD166" },
      { label: "Best Day", value: monthStats.bestDay?.toLocaleString() ?? "—", color: "#4FFFB0" },
      { label: "Days Active", value: monthStats.daysLogged, color: "#FFD166" },
    ];

    let y = 200;
    ctx.font = "18px 'DM Sans', sans-serif";
    ctx.textAlign = "left";

    stats.forEach((stat) => {
      ctx.fillStyle = "#CCCCCC";
      ctx.fillText(stat.label, 60, y);

      ctx.fillStyle = stat.color;
      ctx.font = "bold 28px 'Syne', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(String(stat.value), width - 60, y);

      ctx.textAlign = "left";
      ctx.font = "18px 'DM Sans', sans-serif";
      y += 80;
    });

    // Weight info if available
    if (weightStats.current) {
      ctx.fillStyle = "#CCCCCC";
      ctx.font = "18px 'DM Sans', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Current Weight", 60, y);

      ctx.fillStyle = "#FFD166";
      ctx.font = "bold 28px 'Syne', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${weightStats.current} lbs`, width - 60, y);

      y += 80;
    }

    // Footer
    ctx.fillStyle = "#666666";
    ctx.font = "14px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Track your progress at pushtrack.app", width / 2, height - 40);
  }

  function downloadImage() {
    generateImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `pushtrack-${ym}.png`;
    link.click();
    toast.success("Image downloaded!");
  }

  function copyImage() {
    generateImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      navigator.clipboard
        .write([new ClipboardItem({ "image/png": blob })])
        .then(() => toast.success("Image copied to clipboard!"))
        .catch(() => toast.error("Failed to copy image"));
    });
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
            <h1 className="font-display text-xl text-foreground">Share Progress</h1>
            <p className="text-xs text-muted-foreground">Generate shareable image</p>
          </div>
        </div>

        {/* Preview */}
        <div className="pt-card p-4 flex justify-center rounded-xl" style={{ background: "oklch(1 0 0 / 3%)" }}>
          <canvas
            ref={canvasRef}
            className="w-full max-w-xs rounded-lg"
            style={{ background: "#0F1117" }}
          />
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={downloadImage}
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: "#4FFFB0", color: "#0F1117" }}
          >
            <Download size={18} strokeWidth={2.5} />
            Download Image
          </button>
          <button
            onClick={copyImage}
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: "oklch(1 0 0 / 8%)", color: "oklch(0.75 0.01 265)" }}
          >
            <Copy size={18} strokeWidth={2.5} />
            Copy to Clipboard
          </button>
        </div>

        {/* Info */}
        <div
          className="pt-card p-4 text-center rounded-xl"
          style={{ background: "oklch(1 0 0 / 5%)" }}
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            Share your monthly progress on social media or with friends. No account needed.
          </p>
        </div>

      </div>
    </div>
  );
}
