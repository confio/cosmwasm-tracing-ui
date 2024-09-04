import { TooltipProvider } from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";
import ReactQueryProvider from "./react-query";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </ReactQueryProvider>
  );
}
