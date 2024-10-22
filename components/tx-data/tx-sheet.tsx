"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

export default function TxSheet({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <Sheet
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <SheetContent className="min-w-[80%] overflow-auto">
        {children}
      </SheetContent>
    </Sheet>
  );
}
