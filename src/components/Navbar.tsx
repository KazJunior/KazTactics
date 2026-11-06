"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Swords,
  ShoppingBag,
  Coins,
  Sparkles,
  Layers,
  Crosshair,
  MapPin,
  Home,
  Crown,
} from "lucide-react";

interface NavbarProps {
  gold?: number;
  username?: string;
}

export function Navbar({ gold = 500, username = "Comandante" }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#1A1633]/85 backdrop-blur-md border-b border-[#F59E0B]/30 shadow-[0_4px_25px_rgba(22,19,43,0.7)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo & Marca (Estilo Anime High Fantasy) */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#F59E0B] text-[#0F0D1E] shadow-[0_0_18px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="font-gothic font-black text-lg tracking-wider bg-gradient-to-r from-[#F59E0B] via-[#FF7A00] to-[#38BDF8] bg-clip-text text-transparent">
              KazTactics
            </span>
            <span className="hidden sm:inline-block ml-2 text-[9px] font-numbers uppercase tracking-widest text-[#38BDF8] px-2 py-0.5 rounded-full bg-[#13182E] border border-[#38BDF8]/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
              High Fantasy
            </span>
          </div>
        </Link>

        {/* Links Centrais de Navegação (Vidro Arcano) */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
          {/* Hub */}
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic tracking-wide transition-all shrink-0 ${
              pathname === "/"
                ? "bg-[#252147] text-[#F59E0B] border border-[#F59E0B]/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#252147]/50 border border-transparent"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Santuário</span>
          </Link>

          {/* Campanha */}
          <Link
            href="/campaign"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic tracking-wide transition-all shrink-0 ${
              pathname === "/campaign"
                ? "bg-[#2A1E4A] text-[#F43F5E] border border-[#F43F5E]/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]"
                : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#252147]/50 border border-transparent"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#F43F5E]" />
            <span>Expedições</span>
          </Link>

          {/* Baralho */}
          <Link
            href="/deckbuilder"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic tracking-wide transition-all shrink-0 ${
              pathname === "/deckbuilder"
                ? "bg-[#182846] text-[#38BDF8] border border-[#38BDF8]/60 shadow-[0_0_12px_rgba(56,189,248,0.35)]"
                : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#252147]/50 border border-transparent"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Grimório</span>
          </Link>

          {/* Tabuleiro / Combate */}
          <Link
            href="/battle"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic tracking-wide transition-all shrink-0 ${
              pathname === "/battle"
                ? "bg-gradient-to-r from-[#FF7A00]/25 to-[#F59E0B]/25 text-[#F59E0B] border border-[#F59E0B] shadow-[0_0_16px_rgba(245,158,11,0.45)]"
                : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#252147]/50 border border-transparent"
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span>Arena</span>
          </Link>

          {/* Loja / Relicário */}
          <Link
            href="/shop"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic tracking-wide transition-all shrink-0 ${
              pathname === "/shop"
                ? "bg-[#252147] text-[#A855F7] border border-[#A855F7]/60 shadow-[0_0_12px_rgba(168,85,247,0.35)]"
                : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#252147]/50 border border-transparent"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Invocação</span>
          </Link>
        </nav>

        {/* Informações do Usuário: Ouro & Nome */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Indicador de Ouro */}
          <div className="flex items-center gap-1.5 bg-[#121024]/90 border border-[#F59E0B]/40 px-3 py-1.5 rounded-xl shadow-inner">
            <Coins className="w-4 h-4 text-[#F59E0B] animate-torch" />
            <span className="font-numbers font-black text-sm text-[#F59E0B]">
              {gold.toLocaleString()}
            </span>
          </div>

          {/* Perfil Compacto */}
          <div className="hidden md:flex items-center gap-2 bg-[#252147]/80 border border-white/10 px-3 py-1.5 rounded-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
            <span className="font-parchment text-xs font-semibold text-[#F8FAFC]">
              {username}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
