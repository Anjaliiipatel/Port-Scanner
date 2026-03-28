export interface ScanResult {
  port: number;
  status: "open" | "closed" | "filtered";
  service: string | null;
  banner: string | null;
}

export const COMMON_SERVICES: Record<number, string> = {
  20: "FTP-data", 21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP",
  53: "DNS", 80: "HTTP", 110: "POP3", 123: "NTP", 135: "MSRPC",
  137: "NetBIOS-NS", 139: "NetBIOS-SSN", 143: "IMAP", 161: "SNMP",
  389: "LDAP", 443: "HTTPS", 445: "SMB", 465: "SMTPS", 500: "IKE",
  554: "RTSP", 587: "Submission", 631: "IPP", 636: "LDAPS",
  873: "rsync", 993: "IMAPS", 995: "POP3S", 1433: "MSSQL",
  1521: "Oracle", 1723: "PPTP", 2049: "NFS", 3000: "Dev HTTP",
  3128: "Proxy", 3306: "MySQL", 3389: "RDP", 3690: "SVN",
  5000: "API/Flask", 5060: "SIP", 5432: "Postgres", 5672: "AMQP",
  5900: "VNC", 5985: "WinRM", 6379: "Redis", 6443: "K8s API",
  8000: "Alt HTTP", 8080: "HTTP-proxy", 8443: "Alt HTTPS",
  8888: "Dev UI", 9000: "Alt API", 9092: "Kafka", 9200: "Elasticsearch",
  11211: "Memcached", 27017: "MongoDB",
};

export const TOP_PORTS_100 = [
  7, 20, 21, 22, 23, 25, 26, 37, 53, 80, 81, 88, 110, 111, 113, 119, 123,
  135, 137, 139, 143, 161, 179, 199, 389, 427, 443, 445, 465, 500, 512, 513,
  514, 515, 520, 554, 587, 623, 631, 636, 873, 902, 989, 990, 993, 995, 1025,
  1026, 1027, 1028, 1029, 1433, 1434, 1521, 1723, 1900, 2049, 2082, 2083,
  2121, 2181, 2375, 2376, 3000, 3128, 3306, 3389, 3478, 3479, 3632, 3690,
  4000, 4040, 4369, 4444, 4500, 4567, 5000, 5060, 5432, 5672, 5900, 5985,
  5986, 6379, 6443, 6667, 7001, 7002, 7077, 7199, 8000, 8008, 8080, 8081,
  8088, 8161, 8333, 8443, 8530, 8531, 8888, 9000, 9092, 9200, 9300, 11211,
];

export function parsePorts(spec: string): number[] {
  const parts = spec.split(",").map(p => p.trim()).filter(Boolean);
  const ports = new Set<number>();
  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!rangeMatch) throw new Error(`Invalid port: ${part}`);
    const start = parseInt(rangeMatch[1]);
    const end = parseInt(rangeMatch[2] || rangeMatch[1]);
    if (start < 1 || end > 65535 || start > end) throw new Error(`Port out of range: ${part}`);
    for (let p = start; p <= end; p++) ports.add(p);
  }
  return Array.from(ports).sort((a, b) => a - b);
}

// Simulated scan — in a real app this would call a backend API
export function simulateScan(
  ports: number[],
  onProgress: (result: ScanResult, completed: number, total: number) => void,
  onComplete: (results: ScanResult[]) => void
) {
  const results: ScanResult[] = [];
  let i = 0;

  const processNext = () => {
    if (i >= ports.length) {
      results.sort((a, b) => a.port - b.port);
      onComplete(results);
      return;
    }

    const port = ports[i];
    const rand = Math.random();
    let status: ScanResult["status"];
    if (rand < 0.15) status = "open";
    else if (rand < 0.25) status = "filtered";
    else status = "closed";

    const result: ScanResult = {
      port,
      status,
      service: COMMON_SERVICES[port] || null,
      banner: status === "open" && Math.random() > 0.5
        ? `${COMMON_SERVICES[port] || "Service"} v${Math.floor(Math.random() * 9 + 1)}.${Math.floor(Math.random() * 9)}`
        : null,
    };

    results.push(result);
    i++;
    onProgress(result, i, ports.length);

    const delay = Math.random() * 30 + 5;
    setTimeout(processNext, delay);
  };

  processNext();
}
