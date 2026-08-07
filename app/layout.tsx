import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./mobile.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  metadataBase: new URL("https://struwweltv.de"),
  title: {
    default: "StruwwelTV – Chaos. Kugeln. Community.",
    template: "%s | StruwwelTV",
  },
  description:
    "StruwwelTV – Livestreams, Warzone, Clips, Community und jede Menge kontrolliertes Chaos.",
  alternates: {
    canonical: "https://struwweltv.de",
  },
  openGraph: {
    title: "StruwwelTV – Chaos. Kugeln. Community.",
    description: "Livestreams, Warzone, Clips, Community und jede Menge kontrolliertes Chaos.",
    url: "https://struwweltv.de",
    siteName: "StruwwelTV",
    images: [
      {
        url: "/logo.png",
        width: 1000,
        height: 1000,
        alt: "StruwwelTV Logo",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StruwwelTV – Chaos. Kugeln. Community.",
    description: "Livestreams, Warzone, Clips, Community und jede Menge kontrolliertes Chaos.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${inter.variable} ${space.variable}`}>
      <body>{children}</body>
    </html>
  );
}
