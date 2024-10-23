import { ComponentProps } from "react";
import { JSONTree } from "react-json-tree";

const theme: ComponentProps<typeof JSONTree>["theme"] = {
  base00: "#171717",
  base01: "#171717",
  base02: "#171717",
  base03: "#fff",
  base04: "#171717",
  base05: "#fff",
  base06: "#fff",
  base07: "#fff",
  base08: "#fff",
  base09: "#2672F9",
  base0A: "#fff",
  base0B: "#fff",
  base0C: "#fff",
  base0D: "#f92672",
  base0E: "#fff",
  base0F: "#fff",
};

export default function JsonTreeViewer(props: ComponentProps<typeof JSONTree>) {
  return (
    <div className="p-2 border-solid border-2">
      <JSONTree
        hideRoot
        shouldExpandNodeInitially={() => true}
        theme={theme}
        {...props}
      />
    </div>
  );
}
