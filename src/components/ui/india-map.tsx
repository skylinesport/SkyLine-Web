import { motion } from 'framer-motion';

/**
 * Clean India map with glowing, labelled campus pins.
 *
 * A thin lime India outline (NE 110m) with a faint body fill and a soft glow —
 * no dot fill. Pins sit at real campus cities, placed with the same mercator
 * projection the outline was built from, as HTML overlays (crisp labels + a CSS
 * ping ring).
 */
interface City {
  name: string;
  lat: number;
  lng: number;
  side: 'left' | 'right';
}

const CITIES: City[] = [
  { name: 'Delhi', lat: 28.61, lng: 77.21, side: 'right' },
  { name: 'Mumbai', lat: 19.08, lng: 72.88, side: 'left' },
  { name: 'Kolkata', lat: 22.57, lng: 88.36, side: 'left' },
  { name: 'Hyderabad', lat: 17.38, lng: 78.49, side: 'right' },
  { name: 'Bengaluru', lat: 12.97, lng: 77.59, side: 'left' },
  { name: 'Chennai', lat: 13.08, lng: 80.27, side: 'right' },
];

const VB_W = 55;
const VB_H = 60;

// lat/lng → viewBox, mercator fit calibrated to the outline below.
const MERC = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2));
const projX = (lng: number) => 1.7474785175633298 * lng - 116.82756792520871;
const projY = (lat: number) => -102.94157762169645 * MERC(lat) + 71.11683298525183;
const pct = (lat: number, lng: number) => ({ left: (projX(lng) / VB_W) * 100, top: (projY(lat) / VB_H) * 100 });

// India outline (NE 110m) projected into the 55×60 viewBox.
const INDIA_OUTLINE =
  'M 53.25 18.15 L 53.38 18.92 L 52.77 19.29 L 52.91 20.54 L 51.66 20.17 L 49.4 21.56 L 49.45 22.71 L 48.49 24.38 L 48.4 25.35 L 47.62 26.97 L 46.26 26.52 L 46.19 28.55 L 45.79 29.22 L 45.98 30.04 L 45.12 30.5 L 44.2 27.41 L 43.71 27.42 L 43.43 28.67 L 42.47 27.65 L 43.01 26.53 L 43.79 26.42 L 44.6 24.75 L 43.59 24.41 L 41.97 24.44 L 40.31 24.17 L 40.15 22.78 L 39.32 22.68 L 37.93 21.82 L 37.32 23.18 L 38.58 24.23 L 37.49 24.97 L 37.1 25.69 L 38.17 26.22 L 37.88 27.4 L 38.48 28.87 L 38.75 30.47 L 38.5 31.18 L 37.31 31.16 L 35.16 31.56 L 35.26 33.01 L 34.33 34.14 L 31.81 35.43 L 29.86 37.66 L 28.54 38.85 L 26.8 40.08 L 26.8 40.95 L 25.93 41.41 L 24.35 42.08 L 23.54 42.18 L 23.01 43.6 L 23.38 46.01 L 23.47 47.55 L 22.73 49.29 L 22.72 52.41 L 21.82 52.49 L 21.02 53.89 L 21.55 54.49 L 19.96 55 L 19.37 56.24 L 18.67 56.76 L 17.02 55.06 L 16.21 52.51 L 15.54 50.67 L 14.93 49.8 L 14 48.03 L 13.56 45.72 L 13.26 44.56 L 11.67 42.01 L 10.95 38.37 L 10.43 35.94 L 10.43 33.63 L 10.09 31.83 L 7.55 32.98 L 6.32 32.75 L 4.04 30.41 L 4.88 29.71 L 4.36 28.94 L 2.31 27.28 L 3.47 25.97 L 7.32 25.98 L 6.97 24.28 L 5.99 23.27 L 5.79 21.73 L 4.65 20.82 L 6.57 18.7 L 8.6 18.86 L 10.43 16.71 L 11.53 14.62 L 13.22 12.53 L 13.2 11.03 L 14.69 9.8 L 13.27 8.75 L 12.67 7.3 L 12.05 5.4 L 12.91 4.46 L 15.56 5 L 17.5 4.67 L 19.19 2.83 L 21.07 5.39 L 20.89 7.16 L 21.59 8.26 L 21.53 9.35 L 20.28 9.06 L 20.77 11.4 L 22.48 12.73 L 24.91 14.19 L 23.8 15.13 L 23.13 17.06 L 24.82 17.83 L 26.47 18.83 L 28.74 19.97 L 31.14 20.23 L 32.15 21.26 L 33.5 21.45 L 35.6 21.92 L 37.06 21.88 L 37.26 21.09 L 37.03 19.8 L 37.16 18.93 L 38.23 18.5 L 38.37 20.1 L 38.41 20.51 L 40 21.27 L 41.1 20.96 L 42.57 21.09 L 44 21.03 L 44.12 19.79 L 43.41 19.14 L 44.82 18.89 L 46.41 17.37 L 48.42 16.06 L 49.89 16.57 L 51.14 15.7 L 51.96 16.98 L 51.37 17.84 L 53.25 18.15 Z';

export function IndiaMap({ lineColor = 'hsl(79, 86%, 59%)' }: { lineColor?: string }) {
  return (
    <div className="relative mx-auto aspect-[11/12] w-full max-w-sm font-sans">
      {/* soft lime glow behind the country */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
        {/* faint body fill */}
        <motion.path
          d={INDIA_OUTLINE}
          fill={lineColor}
          fillOpacity={0.05}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        {/* thin drawn border */}
        <motion.path
          d={INDIA_OUTLINE}
          fill="none"
          stroke={lineColor}
          strokeOpacity={0.7}
          strokeWidth={0.35}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
      </svg>

      {/* Campus pins (HTML overlay for crisp labels) */}
      {CITIES.map((c, i) => {
        const { left, top } = pct(c.lat, c.lng);
        return (
          <motion.div
            key={c.name}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${left}%`, top: `${top}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.12, duration: 0.4, ease: 'backOut' }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(79_86%_59%)]" />
            </span>
            <span
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-term text-[10px] uppercase tracking-wider text-foreground/85 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)] ${
                c.side === 'right' ? 'left-full ml-1.5' : 'right-full mr-1.5'
              }`}
            >
              {c.name}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default IndiaMap;
