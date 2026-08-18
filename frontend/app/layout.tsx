import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";


const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
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
    <html lang="es" className={jakarta.variable}>
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
        <ChatWidget />

      </body>
    </html>
  );
}
