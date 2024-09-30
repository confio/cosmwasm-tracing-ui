"use client";

import { cn } from "@/lib/utils";
import mermaid from "mermaid";
import { useEffect, useState } from "react";

mermaid.initialize({
  startOnLoad: true,
  securityLevel: "loose",
  sequence: { mirrorActors: false },
  theme: "base",
  themeVariables: {
    background: "#fff",
    mainBkg: "#fff",
    primaryColor: "#fff",
    textColor: "#171717",
    lineColor: "#171717",
    actorBorder: "#171717",
  },
  themeCSS: `
    .actor {
      stroke-width: 2px;
    }

    .messageText a {
      text-decoration: underline;
    }
  `,
});

const replacer = (tag: string) =>
  ({
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&#39;": "'",
    "&quot;": '"',
  })[tag] ?? "";

export default function Mermaid({ chart }: { chart: string }) {
  const [isBrowserRendering, setIsBrowserRendering] = useState(false);

  useEffect(() => {
    if (isBrowserRendering) {
      mermaid.contentLoaded();

      setTimeout(() => {
        const elems = Array.from(
          document.getElementsByClassName("messageText"),
        ) as HTMLElement[];

        for (const elem of elems) {
          if (elem.textContent?.startsWith("<")) {
            elem.innerHTML = elem.innerHTML.replace(
              /(&lt;|&gt;|&amp;|&#39;|&quot;)/g,
              replacer,
            );
          }
        }
      }, 100);
    } else {
      setIsBrowserRendering(true);
    }
  }, [isBrowserRendering]);

  return isBrowserRendering ? <div className="mermaid">{chart}</div> : null;
}
