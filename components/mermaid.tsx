"use client";

import { cn } from "@/lib/utils";
import mermaid from "mermaid";
import { usePathname } from "next/navigation";
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

const htmlReplacer = {
  regex: /(&lt;|&gt;|&amp;|&#39;|&quot;)/g,
  fn: (tag: string) =>
    ({ "&lt;": "<", "&gt;": ">", "&amp;": "&", "&#39;": "'", "&quot;": '"' })[
      tag
    ] ?? "",
};

type MermaidProps = {
  chart: string;
  setSpanId: (spanId: string | undefined) => void;
};

export default function Mermaid({ chart, setSpanId }: MermaidProps) {
  const pathname = usePathname();
  const [renderStage, setRenderStage] = useState<
    "server" | "browser" | "mermaid"
  >("server");

  useEffect(() => {
    setRenderStage("browser");
  }, []);

  useEffect(() => {
    if (renderStage !== "browser") {
      return;
    }

    mermaid.contentLoaded();

    const interval = setInterval(() => {
      const msgs = Array.from(
        document.getElementsByClassName("messageText"),
      ) as HTMLElement[];

      if (!msgs.length) {
        return;
      }

      for (const msg of msgs) {
        if (msg.textContent?.startsWith("<")) {
          msg.innerHTML = msg.innerHTML.replace(
            htmlReplacer.regex,
            htmlReplacer.fn,
          );

          const span = msg.firstElementChild;
          if (!span) {
            continue;
          }

          const linkToSpan = span.getAttribute("href");
          if (!linkToSpan) {
            continue;
          }

          span.addEventListener("click", (e) => {
            e.preventDefault();

            if (!pathname.endsWith(linkToSpan)) {
              window.history.replaceState(null, "", linkToSpan);
              setSpanId(linkToSpan.split("/").slice(-1)[0]);
            }
          });
        }
      }

      setRenderStage("mermaid");
    });

    return () => clearInterval(interval);
  }, [pathname, renderStage, setSpanId]);

  return renderStage !== "server" ? (
    <div className={cn("mermaid", renderStage !== "mermaid" && "hidden")}>
      {chart}
    </div>
  ) : null;
}
