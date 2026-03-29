import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GeoData {
  lat: number;
  lon: number;
  city: string;
  country: string;
  isp: string;
  org: string;
  query: string;
}

interface WorldMapProps {
  target: string;
  visible: boolean;
}

const WorldMap = ({ target, visible }: WorldMapProps) => {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !target.trim()) {
      setGeo(null);
      return;
    }

    const lookup = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://ipapi.co/${target.trim()}/json/`);
        const data = await res.json();
        if (data.error) {
          setError(data.reason || "Could not geolocate target");
          setGeo(null);
        } else {
          setGeo({
            lat: data.latitude,
            lon: data.longitude,
            city: data.city || "Unknown",
            country: data.country_name || "Unknown",
            isp: data.org || "",
            org: data.org || "",
            query: data.ip,
          });
        }
      } catch {
        setError("Geolocation lookup failed");
        setGeo(null);
      } finally {
        setLoading(false);
      }
    };

    lookup();
  }, [target, visible]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 rounded-lg border border-border bg-card p-4 overflow-hidden"
    >
      <h3 className="font-mono text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        TARGET LOCATION
      </h3>

      {loading && (
        <div className="flex items-center justify-center h-48 font-mono text-sm text-muted-foreground">
          <span className="animate-pulse">Geolocating target...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-48 font-mono text-sm text-destructive">
          {error}
        </div>
      )}

      {geo && (
        <div className="space-y-3">
          <div className="rounded-md overflow-hidden border border-border bg-background">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 120 }}
              style={{ width: "100%", height: "auto" }}
            >
              <ZoomableGroup center={[geo.lon, geo.lat]} zoom={3}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((g) => (
                      <Geography
                        key={g.rsmKey}
                        geography={g}
                        fill="hsl(var(--muted))"
                        stroke="hsl(var(--border))"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "hsl(var(--accent))", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
                <Marker coordinates={[geo.lon, geo.lat]}>
                  <circle r={6} fill="hsl(var(--primary))" opacity={0.3}>
                    <animate
                      attributeName="r"
                      from="6"
                      to="18"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.4"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r={5} fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth={1.5} />
                </Marker>
              </ZoomableGroup>
            </ComposableMap>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="rounded-md bg-background border border-border p-2.5">
              <p className="text-muted-foreground mb-0.5">IP</p>
              <p className="text-foreground font-semibold truncate">{geo.query}</p>
            </div>
            <div className="rounded-md bg-background border border-border p-2.5">
              <p className="text-muted-foreground mb-0.5">Location</p>
              <p className="text-foreground font-semibold truncate">{geo.city}, {geo.country}</p>
            </div>
            <div className="rounded-md bg-background border border-border p-2.5">
              <p className="text-muted-foreground mb-0.5">Coordinates</p>
              <p className="text-foreground font-semibold">{geo.lat.toFixed(4)}, {geo.lon.toFixed(4)}</p>
            </div>
            <div className="rounded-md bg-background border border-border p-2.5">
              <p className="text-muted-foreground mb-0.5">ISP / Org</p>
              <p className="text-foreground font-semibold truncate">{geo.org || geo.isp}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && !geo && (
        <div className="flex items-center justify-center h-48 font-mono text-sm text-muted-foreground">
          Run a scan to see target location
        </div>
      )}
    </motion.div>
  );
};

export default WorldMap;
