import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const ScannerHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex items-center gap-4 mb-8"
  >
    <div className="relative">
      <Shield className="w-10 h-10 text-primary" />
      <div className="absolute inset-0 w-10 h-10 bg-primary/20 rounded-full blur-xl" />
    </div>
    <div>
      <h1 className="text-3xl font-display font-bold text-foreground text-glow tracking-tight">
        Port Scanner
      </h1>
      <p className="text-sm font-mono text-muted-foreground">
        Network reconnaissance &amp; service detection
      </p>
    </div>
  </motion.div>
);

export default ScannerHeader;
