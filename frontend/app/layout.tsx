import type { Metadata } from "next";
import { Baloo_2, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import ChatWidget from "@/components/chat/ChatWidget";


const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-baloo",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "INCA EDUCA — Educación Sin límites",
  description:
    "Centro de Educación Técnico-Productiva en Cusco. Carreras técnicas orientadas al turismo y la gastronomía.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="antialiased">
        <Header />
        {children}
        <ChatWidget />

      </body>
    </html>
  );
}