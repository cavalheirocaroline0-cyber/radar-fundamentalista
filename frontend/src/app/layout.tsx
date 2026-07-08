import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar Fundamentalista",
  description:
    "Plataforma de análise fundamentalista com empresas brasileiras, indicadores macro, rankings e inteligência de mercado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
