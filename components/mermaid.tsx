"use client";

import mermaid from "mermaid";
import { useEffect, useState } from "react";

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
  themeCSS: `
    g.classGroup rect {
      fill: #282a36;
      stroke: #6272a4;
    } 
    g.classGroup text {
      fill: #f8f8f2;
    }
    g.classGroup line {
      stroke: #f8f8f2;
      stroke-width: 0.5;
    }
    .classLabel .box {
      stroke: #21222c;
      stroke-width: 3;
      fill: #21222c;
      opacity: 1;
    }
    .classLabel .label {
      fill: #f1fa8c;
    }
    .relation {
      stroke: #ff79c6;
      stroke-width: 1;
    }
    #compositionStart, #compositionEnd {
      fill: #bd93f9;
      stroke: #bd93f9;
      stroke-width: 1;
    }
    #aggregationEnd, #aggregationStart {
      fill: #21222c;
      stroke: #50fa7b;
      stroke-width: 1;
    }
    #dependencyStart, #dependencyEnd {
      fill: #00bcd4;
      stroke: #00bcd4;
      stroke-width: 1;
    } 
    #extensionStart, #extensionEnd {
      fill: #f8f8f2;
      stroke: #f8f8f2;
      stroke-width: 1;
    }`,
  fontFamily: "Fira Code",
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
