"use client";

import { useEffect, useRef } from "react";
import { bootstrapGoogleMaps } from "@/lib/google-maps-bootstrap";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const SEARCH_RADIUS_M = 3000;

export function streetViewEnabled(): boolean {
  return Boolean(API_KEY);
}

let loaderPromise: Promise<void> | null = null;

/** Loads the Google Maps JS API once per page and waits for the libraries we use. */
export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("not in a browser"));
  }
  if (loaderPromise) return loaderPromise;
  loaderPromise = (async () => {
    if (!window.google?.maps?.importLibrary) {
      bootstrapGoogleMaps(API_KEY ?? "");
    }
    await Promise.all([
      google.maps.importLibrary("streetView"),
      google.maps.importLibrary("maps"),
    ]);
  })().catch((err: unknown) => {
    loaderPromise = null; // allow a retry on the next round
    throw err;
  });
  return loaderPromise;
}

interface StreetViewPaneProps {
  lat: number;
  lng: number;
  /** Called when no panorama exists near the location (caller shows a fallback). */
  onUnavailable: () => void;
  className?: string;
}

/**
 * GeoGuessr-style 360° Street View of the round location. Address labels,
 * road names and all location hints are disabled so nothing gives the
 * answer away. Includes user photospheres, which cover many sights that
 * Google's cars never drove to.
 */
export default function StreetViewPane({
  lat,
  lng,
  onUnavailable,
  className,
}: StreetViewPaneProps) {
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
        const service = new google.maps.StreetViewService();
        return service
          .getPanorama({
            location: { lat, lng },
            radius: SEARCH_RADIUS_M,
            // default source (not OUTDOOR-only) so photospheres at sights count
          })
          .then(({ data }) => {
            if (cancelled || !containerRef.current) return;
            const panoLocation = data.location;
            if (!panoLocation?.pano) {
              console.warn(`Street View: no panorama near ${lat},${lng}`);
              onUnavailableRef.current();
              return;
            }
            new google.maps.StreetViewPanorama(containerRef.current, {
              pano: panoLocation.pano,
              addressControl: false,
              showRoadLabels: false,
              fullscreenControl: false,
              motionTracking: false,
              motionTrackingControl: false,
              zoomControl: true,
              panControl: false,
              linksControl: true,
              enableCloseButton: false,
            });
          });
      })
      .catch((err: unknown) => {
        console.error(
          `Street View unavailable for ${lat},${lng}:`,
          err instanceof Error ? err.message : err,
        );
        if (!cancelled) onUnavailableRef.current();
      });

    return () => {
      // The panorama has no destroy API; unmounting the DOM node is enough.
      cancelled = true;
    };
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="Street view of the location — look around for clues"
    />
  );
}
