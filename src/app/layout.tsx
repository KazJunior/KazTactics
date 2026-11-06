import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KazTactics - RPG Tático & Deckbuilder Anime High Fantasy",
  description:
    "Jogo Web de Estratégia Tática em Turnos no estilo Anime High Fantasy e JRPG Vibrante, com combates em arena arcana, cristais nexus e grimório de heróis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gradient-to-br from-[#16132B] via-[#1E1B3A] to-[#13182E] text-[#F8FAFC] selection:bg-[#F59E0B] selection:text-[#0F0D1E] min-h-screen">
        {children}
      </body>
    </html>
  );
}
