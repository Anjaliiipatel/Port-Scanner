import { motion } from "framer-motion";
import { ScanResult } from "@/lib/scanner-data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PortMapProps {
  results: ScanResult[];
}

const statusColor: Record<string, string> = {
  open: "bg-port-open shadow-[0_0_6px_hsl(155_100%_50%/0.5)]",
  closed: "bg-port-closed/80",
  filtered: "bg-port-filtered shadow-[0_0_6px_hsl(45_100%_55%/0.3)]",
};

const PortMap = ({ results }: PortMapProps) => {
  if (results.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 rounded-lg border border-border bg-card p-4"
    >
      <h3 className="font-mono text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        PORT MAP
      </h3>

      <TooltipProvider delayDuration={100}>
        <div className="flex flex-wrap gap-1.5">
          {results.map((r, i) => (
            <Tooltip key={r.port}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.008, duration: 0.2 }}
                  className={`w-4 h-4 rounded-sm cursor-pointer transition-transform hover:scale-150 ${statusColor[r.status]}`}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-xs bg-card border-border">
                <p className="text-foreground font-semibold">Port {r.port}</p>
                <p className="text-muted-foreground capitalize">{r.status}{r.service ? ` · ${r.service}` : ""}</p>
                {r.banner && <p className="text-primary text-[10px]">{r.banner}</p>}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <div className="flex gap-4 mt-3 font-mono text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-port-open" /> Open</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-port-closed/80" /> Closed</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-port-filtered" /> Filtered</span>
      </div>
    </motion.div>
  );
};

export default PortMap;
