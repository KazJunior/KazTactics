"use client";

import { DrawnCard } from "@/types";
import { CardComponent } from "@/components/cards/CardComponent";
import { Flame } from "lucide-react";

interface CardFlipProps {
  card: DrawnCard;
  isRevealed: boolean;
  onReveal: () => void;
  index: number;
}

export function CardFlip({ card, isRevealed, onReveal, index }: CardFlipProps) {
  return (
    <div
      onClick={() => {
        if (!isRevealed) onReveal();
      }}
      className="group relative cursor-pointer select-none"
      style={{
        perspective: "1200px",
        width: "100%",
        maxWidth: "270px",
        minHeight: "410px",
        animationDelay: `${index * 120}ms`,
      }}
    >
      {/* Contêiner com efeito de rotação 3D */}
      <div
        className="w-full h-full relative duration-700 transition-all"
        style={{
          transformStyle: "preserve-3d",
          transform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ======================================================== */}
        {/* VERSO DA CARTA (LIVRO MALDITO / TOME SOMBRIO) */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl border-3 border-[#26232C] bg-gradient-to-br from-[#121016] via-[#09080B] to-black p-4 flex flex-col items-center justify-between shadow-2xl overflow-hidden group-hover:border-[#D97724] group-hover:shadow-[0_0_25px_rgba(217,119,36,0.35)] transition-all"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Textura de vinheta e pergaminho sombrio */}
          <div className="absolute inset-0 bg-[radial-gradient(#26232C_1px,transparent_1px)] [background-size:12px_12px] opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/85 pointer-events-none" />

          {/* Cantoneiras de ferro decorativas */}
          <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#9E8C70]/50" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#9E8C70]/50" />
          <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#9E8C70]/50" />
          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#9E8C70]/50" />

          {/* Topo do Verso */}
          <div className="relative z-10 w-full flex items-center justify-between text-[#9E8C70] text-[10px] font-gothic uppercase tracking-widest">
            <span>KazTactics Tarot</span>
            <span>✠ ✠ ✠</span>
          </div>

          {/* Selo Central da Tocha & Runa */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="relative p-5 rounded-xl bg-[#09080B] border-2 border-[#3A3542] shadow-inner group-hover:scale-110 group-hover:border-[#D97724] transition-all duration-300">
              <Flame className="w-10 h-10 text-[#D97724] animate-pulse" />
              <div className="absolute -inset-1 rounded-xl bg-[#D97724]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="mt-4 font-gothic text-xs font-bold uppercase tracking-wider text-[#C8B99E] group-hover:text-[#F29F3D] transition-colors">
              Quebre o Selo
            </span>
            <span className="font-numbers text-[10px] text-[#9E8C70] mt-1">
              Lâmina #{index + 1}
            </span>
          </div>

          {/* Rodapé do Verso */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#D97724]/60 to-transparent rounded-full" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* FRENTE DA CARTA (LÂMINA DE TAROT GÓTICO REVELADA) */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xl transition-all flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardComponent
            card={card}
            isNew={card.isNew}
            size="md"
            className="w-full h-full max-w-none"
          />
        </div>
      </div>
    </div>
  );
}
