"use client";

import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "@/components/StreetViewPane";

interface SatelliteSightPaneProps {
  lat: number;
  lng: number;
  /** Called if the Google Maps API can't load (caller shows the photo). */
  onUnavailable: () => void;
  className?: string;
}

/**
 * Fallback for locations without Street View: an explorable satellite view
 * centered on the sight. Pure imagery — no labels, roads or POI names that
 * could give the location away. Zooming out is capped so the player can't
 * just read the whole country off the map.
 */
export default function SatelliteSightPane({
  lat,
  lng,
  onUnavailable,
  className,
}: SatelliteSightPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onUnavailableRef = useRef(onUnavailable);

  useEffect(() => {
    onUnavailableRef.current = onUnavailable;
  }, [onUnavailable]);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        new google.maps.Map(containerRef.current, {
          center: { lat, lng },
          zoom: 15,
          minZoom: 12, // can't zoom out far enough to recognize the region shape
          maxZoom: 19,
          mapTypeId: google.maps.MapTypeId.SATELLITE, // imagery only, no labels
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          keyboardShortcuts: false,
          clickableIcons: false,
        });
      })
      .catch((err: unknown) => {
        console.error(
          "Satellite view unavailable:",
          err instanceof Error ? err.message : err,
        );
        if (!cancelled) onUnavailableRef.current();
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="Satellite view of the location — explore for clues"
    />
  );
}
