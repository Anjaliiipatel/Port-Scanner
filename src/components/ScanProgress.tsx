import { motion } from "framer-motion";

interface ScanProgressProps {
  progress: number;
  completed: number;
  total: number;
  openCount: number;
}

const ScanProgress = ({ progress, completed, total, openCount }: ScanProgressProps) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    className="rounded-lg bg-card border border-glow p-5 mb-6"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
        Scanning...
      </span>
      <div className="flex gap-4 text-xs font-mono">
        <span className="text-muted-foreground">
          {completed}/{total} ports
        </span>
        <span className="text-port-open">
          {openCount} open
        </span>
      </div>
    </div>
    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: "var(--gradient-scan)" }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
    <div className="text-right mt-1">
      <span className="text-xs font-mono text-primary">{Math.round(progress)}%</span>
    </div>
  </motion.div>
);

export default ScanProgress;
