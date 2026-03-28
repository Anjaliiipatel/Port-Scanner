import { motion } from "framer-motion";
import { ScanResult } from "@/lib/scanner-data";
import { Wifi, WifiOff, AlertTriangle, Clock } from "lucide-react";

interface StatsBarProps {
  results: ScanResult[];
  scanTime: number | null;
}

const StatsBar = ({ results, scanTime }: StatsBarProps) => {
  const open = results.filter((r) => r.status === "open").length;
  const closed = results.filter((r) => r.status === "closed").length;
  const filtered = results.filter((r) => r.status === "filtered").length;

  const stats = [
    { label: "Open", value: open, icon: Wifi, color: "text-port-open" },
    { label: "Closed", value: closed, icon: WifiOff, color: "text-port-closed" },
    { label: "Filtered", value: filtered, icon: AlertTriangle, color: "text-port-filtered" },
    { label: "Time", value: scanTime ? `${(scanTime / 1000).toFixed(1)}s` : "—", icon: Clock, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className="rounded-lg bg-card border border-glow p-4 text-center"
        >
          <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
          <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
