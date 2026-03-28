import { motion } from "framer-motion";
import { Play, Square, Crosshair, Network } from "lucide-react";

interface ScanFormProps {
  target: string;
  setTarget: (v: string) => void;
  portSpec: string;
  setPortSpec: (v: string) => void;
  isScanning: boolean;
  onScan: () => void;
  onStop: () => void;
}

const ScanForm = ({ target, setTarget, portSpec, setPortSpec, isScanning, onScan, onStop }: ScanFormProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="rounded-lg bg-card border border-glow p-6 mb-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
      <div>
        <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2 uppercase tracking-widest">
          <Crosshair className="w-3 h-3" />
          Target Host
        </label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="192.168.1.1 or example.com"
          disabled={isScanning}
          className="w-full bg-secondary border border-border rounded-md px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-50"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2 uppercase tracking-widest">
          <Network className="w-3 h-3" />
          Ports
        </label>
        <input
          type="text"
          value={portSpec}
          onChange={(e) => setPortSpec(e.target.value)}
          placeholder="1-1024 or 22,80,443"
          disabled={isScanning}
          className="w-full bg-secondary border border-border rounded-md px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-50"
        />
      </div>
      <button
        onClick={isScanning ? onStop : onScan}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md font-mono text-sm font-semibold transition-all ${
          isScanning
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:brightness-110 glow-primary"
        } disabled:opacity-50`}
      >
        {isScanning ? (
          <>
            <Square className="w-4 h-4" /> Stop
          </>
        ) : (
          <>
            <Play className="w-4 h-4" /> Scan
          </>
        )}
      </button>
    </div>
  </motion.div>
);

export default ScanForm;
