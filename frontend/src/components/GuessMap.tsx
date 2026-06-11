"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, {
  type LngLatBoundsLike,
  type Map as MapLibreMap,
  type Marker,
  type StyleSpecification,
} from "maplibre-gl";

const KZ_BOUNDS: LngLatBoundsLike = [
  [44.5, 39.5], // southwest (lng, lat)
  [89.5, 56.5], // northeast
];

const BASEMAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
      maxzoom: 19,
    },
  },
  layers: [
    // Light backdrop behind tiles so the map never reads as an empty box.
    {
      id: "bg",
      type: "background",
      paint: { "background-color": "#cfd8dc" },
    },
    { id: "carto", type: "raster", source: "carto" },
  ],
};

function makePinElement(color: string): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cssText = `width:22px;height:22px;border-radius:50% 50% 50% 0;background:${color};border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.5);`;
  return el;
}

export interface ResultPins {
  guess: { lat: number; lng: number };
  actual: { lat: number; lng: number };
}

interface GuessMapProps {
  /** Player's current pin while guessing (null = none placed yet). */
  pin: { lat: number; lng: number } | null;
  /** When set, the map shows the round result and ignores clicks. */
  result: ResultPins | null;
  onPick: (lat: number, lng: number) => void;
  className?: string;
}

export default function GuessMap({ pin, result, onPick, className }: GuessMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const guessMarkerRef = useRef<Marker | null>(null);
  const actualMarkerRef = useRef<Marker | null>(null);
  const onPickRef = useRef(onPick);
  const interactiveRef = useRef(result === null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    interactiveRef.current = result === null;
  }, [result]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let map: MapLibreMap;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: BASEMAP_STYLE,
        bounds: KZ_BOUNDS,
        fitBoundsOptions: { padding: 16 },
        minZoom: 2,
        attributionControl: { compact: true },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      console.error("MapLibre failed to initialize:", err);
      // queued so the lint-checked effect body itself stays setState-free
      queueMicrotask(() => setInitError(message));
      return;
    }
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
    map.on("error", (e) => {
      console.error("MapLibre error:", e.error?.message ?? e);
    });
    map.on("click", (e) => {
      if (!interactiveRef.current) return;
      onPickRef.current(e.lngLat.lat, e.lngLat.lng);
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      guessMarkerRef.current = null;
      actualMarkerRef.current = null;
    };
  }, []);

  // Guess pin while playing, plus guess pin of the result view.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const point = result?.guess ?? pin;
    if (!point) {
      guessMarkerRef.current?.remove();
      guessMarkerRef.current = null;
      return;
    }
    if (!guessMarkerRef.current) {
      guessMarkerRef.current = new maplibregl.Marker({
        element: makePinElement("#00a6a6"),
        anchor: "bottom",
        offset: [0, 2],
      })
        .setLngLat([point.lng, point.lat])
        .addTo(map);
    } else {
      guessMarkerRef.current.setLngLat([point.lng, point.lat]);
    }
  }, [pin, result]);

  // Result view: actual location pin + connecting line + camera fit.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const clearResult = () => {
      actualMarkerRef.current?.remove();
      actualMarkerRef.current = null;
      if (map.getLayer("result-line")) map.removeLayer("result-line");
      if (map.getSource("result-line")) map.removeSource("result-line");
    };

    if (!result) {
      if (map.isStyleLoaded()) clearResult();
      map.fitBounds(KZ_BOUNDS, { padding: 16 });
      return;
    }

    const draw = () => {
      clearResult();
      actualMarkerRef.current = new maplibregl.Marker({
        element: makePinElement("#d6a84f"),
        anchor: "bottom",
        offset: [0, 2],
      })
        .setLngLat([result.actual.lng, result.actual.lat])
        .addTo(map);

      map.addSource("result-line", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [result.guess.lng, result.guess.lat],
              [result.actual.lng, result.actual.lat],
            ],
          },
        },
      });
      map.addLayer({
        id: "result-line",
        type: "line",
        source: "result-line",
        paint: {
          "line-color": "#d6a84f",
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      });

      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([result.guess.lng, result.guess.lat]);
      bounds.extend([result.actual.lng, result.actual.lat]);
      map.fitBounds(bounds, { padding: 60, maxZoom: 10, duration: 600 });
    };

    if (map.isStyleLoaded()) {
      draw();
    } else {
      map.once("load", draw);
    }
  }, [result]);

  if (initError) {
    return (
      <div
        className={`${className ?? ""} flex items-center justify-center bg-surface p-4 text-center text-sm text-danger`}
      >
        Map failed to load: {initError}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${className ?? ""} bg-[#cfd8dc]`}
      role="application"
      aria-label="Map of Kazakhstan — click to place your guess"
    />
  );
}
