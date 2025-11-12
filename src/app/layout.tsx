import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feria Empresarial 2025 - Sistema de Registro",
  description: "Sistema de registro y control de asistencia para la Feria Empresarial 2025. Registra tu asistencia, obtén tu ticket con código QR y participa en el evento del 12 y 13 de noviembre.",
  keywords: ["Feria Empresarial", "Registro", "QR", "Asistencia", "Evento 2025", "Educación", "Empresas"],
  authors: [{ name: "Feria Empresarial 2025" }],
  creator: "Feria Empresarial 2025",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Feria Empresarial 2025 - Registro de Asistentes",
    description: "Registra tu asistencia a la Feria Empresarial 2025 y recibe tu ticket con código QR",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feria Empresarial 2025",
    description: "Sistema de registro para la Feria Empresarial 2025",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
