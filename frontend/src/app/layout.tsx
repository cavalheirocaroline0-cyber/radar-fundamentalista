import type { Metadata, Viewport } from "next";
import InstallAppButton from "@/components/InstallAppButton";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import "./globals.css";

import DashVoiceAssistant from "@/components/DashVoiceAssistant";
import GoogleAdsTag from "@/components/GoogleAdsTag";
export const metadata: Metadata = {
  title: {
    default: "Dash Diário — Todo dia começa com o Dash",
    template: "%s | Dash Diário",
  },
  description:
    "Acompanhe empresas, indicadores, rankings e entenda o mercado com a IA do Dash Diário.",
  applicationName: "Dash Diário",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Dash Diário",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <GoogleAdsTag />
        {children}
	<Footer />
        <DashVoiceAssistant />
        <InstallAppButton />
        <MobileBottomNav />
      </body>
    </html>
  );
}
