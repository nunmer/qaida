"use client";

import { useSyncExternalStore } from "react";
import {
  EMPTY_STATS,
  loadDailyResult,
  loadStats,
  subscribeStorage,
  type DailyResult,
  type PlayerStats,
} from "@/lib/storage";

export function useStats(): PlayerStats {
  return useSyncExternalStore(subscribeStorage, loadStats, () => EMPTY_STATS);
}

export function useDailyResult(dateKey: string): DailyResult | null {
  return useSyncExternalStore(
    subscribeStorage,
    () => loadDailyResult(dateKey),
    () => null,
  );
}
