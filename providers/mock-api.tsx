"use client";

import { env } from "@/lib/env";
import { mockWorkerService } from "@/tests/mocks/worker";
import { PropsWithChildren, useEffect, useState } from "react";

export default function MockApiProvider({ children }: PropsWithChildren) {
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  useEffect(() => {
    if (env.NEXT_PUBLIC_MOCK_API === "TRUE") {
      mockWorkerService.start().then(() => {
        setShouldRenderChildren(true);
      });
    }

    return () => {
      mockWorkerService.stop();
    };
  }, []);

  return shouldRenderChildren ? children : null;
}
