import type { Metadata, Viewport } from "next";
import { Klee_One, Schibsted_Grotesk, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";

const kleeOne = Klee_One({
  variable: "--font-klee-one",
  weight: ["400", "600"],
  // Japanese glyphs load on demand through unicode-range; nothing to preload.
  preload: false,
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oyster — Kanji Master N4",
  description: "SRS de kanji alinhado ao Kanji Master N4",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Keep the answer field above the virtual keyboard on mobile.
  interactiveWidget: "resizes-content",
  themeColor: "#0F0E0D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${kleeOne.variable} ${zenKaku.variable} ${schibsted.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
