import type { Metadata } from "next";
import { TermsModal } from "@/components/terms-modal";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import "@/components/terms-modal.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Next.js FE/BE Structure",
  description: "Next.js project split into auth, client, admin frontend groups and a layered backend structure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
        suppressHydrationWarning
      >
        <TermsModal />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
