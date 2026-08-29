"use client";

import * as React from "react";
import { store, subscribe } from "@/lib/store";

export function useDb() {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    return subscribe(() => setTick((t) => t + 1));
  }, []);

  return store.getAll();
}
