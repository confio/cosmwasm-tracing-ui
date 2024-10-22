import { fontIceland, fontInter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import type { Metadata } from "next";
import Image from "next/image";
import { PropsWithChildren, ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CosmWasm Tracing UI",
  icons: "/logo.svg",
};

type RootLayoutProps = PropsWithChildren & {
  span: ReactNode;
};

export default function RootLayout({ children, span }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={fontInter.className}>
        <Providers>
          <>
            <div className="h-full flex-1 flex-col space-y-8 p-6 flex">
              <a href="/" className="flex gap-4 items-center">
                <Image
                  alt="Tracing logo"
                  src="/logo.svg"
                  width={40}
                  height={40}
                />
                <h1
                  className={cn(
                    "text-3xl font-bold tracking-tight",
                    fontIceland.className,
                  )}
                >
                  CosmWasm Tracing UI
                </h1>
              </a>
              {children}
            </div>
            {span}
          </>
        </Providers>
      </body>
    </html>
  );
}
