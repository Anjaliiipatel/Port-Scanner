import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import ScannerHeader from "@/components/ScannerHeader";
import ScanForm from "@/components/ScanForm";
import ScanProgress from "@/components/ScanProgress";
import StatsBar from "@/components/StatsBar";
import ResultsTable from "@/components/ResultsTable";
import PortMap from "@/components/PortMap";
import WorldMap from "@/components/WorldMap";
import { ScanResult, parsePorts, simulateScan, TOP_PORTS_100 } from "@/lib/scanner-data";
import { toast } from "sonner";

const Index = () => {
  const [target, setTarget] = useState("");
  const [portSpec, setPortSpec] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [openCount, setOpenCount] = useState(0);
  const [scanTime, setScanTime] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "closed" | "filtered">("all");
  const [hasScanned, setHasScanned] = useState(false);
  const [scanTrigger, setScanTrigger] = useState(0);
  const stopRef = useRef(false);
  const startTimeRef = useRef(0);

  const handleScan = useCallback(() => {
    if (!target.trim()) {
      toast.error("Enter a target host");
      return;
    }

    let ports: number[];
    try {
      ports = portSpec.trim() ? parsePorts(portSpec) : TOP_PORTS_100.slice(0, 50);
    } catch (e: any) {
      toast.error(e.message);
      return;
    }

    setResults([]);
    setIsScanning(true);
    setProgress(0);
    setCompleted(0);
    setTotal(ports.length);
    setOpenCount(0);
    setScanTime(null);
    setFilter("all");
    setHasScanned(true);
    stopRef.current = false;
    startTimeRef.current = Date.now();

    toast.info(`Scanning ${target} — ${ports.length} ports`);

    simulateScan(
      ports,
      (result, done, total) => {
        if (stopRef.current) return;
        setResults((prev) => [...prev, result].sort((a, b) => a.port - b.port));
        setCompleted(done);
        setProgress((done / total) * 100);
        if (result.status === "open") setOpenCount((c) => c + 1);
      },
      (allResults) => {
        if (stopRef.current) return;
        setIsScanning(false);
        setScanTime(Date.now() - startTimeRef.current);
        const openPorts = allResults.filter((r) => r.status === "open").length;
        toast.success(`Scan complete — ${openPorts} open ports found`);
      }
    );
  }, [target, portSpec]);

  const handleStop = useCallback(() => {
    stopRef.current = true;
    setIsScanning(false);
    setScanTime(Date.now() - startTimeRef.current);
    toast.warning("Scan stopped");
  }, []);

  return (
    <div className="min-h-screen bg-background scanline">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <ScannerHeader />
        <ScanForm
          target={target}
          setTarget={setTarget}
          portSpec={portSpec}
          setPortSpec={setPortSpec}
          isScanning={isScanning}
          onScan={handleScan}
          onStop={handleStop}
        />
        <AnimatePresence>
          {isScanning && (
            <ScanProgress
              progress={progress}
              completed={completed}
              total={total}
              openCount={openCount}
            />
          )}
        </AnimatePresence>
        {hasScanned && !isScanning && results.length > 0 && (
          <>
            <StatsBar results={results} scanTime={scanTime} />
            <ResultsTable results={results} filter={filter} setFilter={setFilter} />
            <PortMap results={results} />
            <WorldMap target={target} visible={true} />
          </>
        )}
        {isScanning && results.length > 0 && (
          <div className="mt-6">
            <ResultsTable results={results} filter={filter} setFilter={setFilter} />
            <PortMap results={results} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
