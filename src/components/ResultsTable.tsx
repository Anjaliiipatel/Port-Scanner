import { motion, AnimatePresence } from "framer-motion";
import { ScanResult } from "@/lib/scanner-data";
import { Download } from "lucide-react";

interface ResultsTableProps {
  results: ScanResult[];
  filter: "all" | "open" | "closed" | "filtered";
  setFilter: (f: "all" | "open" | "closed" | "filtered") => void;
}

const statusColors: Record<string, string> = {
  open: "bg-port-open/15 text-port-open border-port-open/30",
  closed: "bg-port-closed/15 text-port-closed border-port-closed/30",
  filtered: "bg-port-filtered/15 text-port-filtered border-port-filtered/30",
};

const filters: Array<{ label: string; value: ResultsTableProps["filter"] }> = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "Filtered", value: "filtered" },
];

const ResultsTable = ({ results, filter, setFilter }: ResultsTableProps) => {
  const filtered = filter === "all" ? results : results.filter((r) => r.status === filter);

  const counts = {
    all: results.length,
    open: results.filter((r) => r.status === "open").length,
    closed: results.filter((r) => r.status === "closed").length,
    filtered: results.filter((r) => r.status === "filtered").length,
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scan-results.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg bg-card border border-glow overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border">
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label} ({counts[f.value]})
            </button>
          ))}
        </div>
        <button
          onClick={exportJSON}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-secondary text-muted-foreground hover:text-foreground transition-all"
        >
          <Download className="w-3 h-3" /> Export JSON
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-widest">Port</th>
              <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-widest">Service</th>
              <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-widest">Banner</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((r, i) => (
                <motion.tr
                  key={r.port}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.2 }}
                  className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-4 py-2.5 text-foreground">{r.port}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded border text-xs font-semibold ${statusColors[r.status]}`}>
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-secondary-foreground">{r.service || "—"}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{r.banner || "—"}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-mono text-sm">
            No results to display
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultsTable;
