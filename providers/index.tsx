import { TooltipProvider } from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";
import MockApiProvider from "./mock-api";
import ReactQueryProvider from "./react-query";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <MockApiProvider>
      <ReactQueryProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ReactQueryProvider>
    </MockApiProvider>
  );
}
