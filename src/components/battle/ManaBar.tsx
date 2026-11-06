"use client";

import { MAX_MANA, MAX_FIELD_UNITS_PER_PLAYER } from "@/lib/tactics/gameState";
import { Zap, Swords, Sparkles, ArrowRight, ShieldAlert } from "lucide-react";

interface ManaBarProps {
  currentMana: number;
  playerUnitsCount: number;
  turnNumber: number;
  onEndTurn: () => void;
  isAiTurn?: boolean;
}

export function ManaBar({
  currentMana,
  playerUnitsCount,
  turnNumber,
  onEndTurn,
  isAiTurn = false,
}: ManaBarProps) {
  const isFieldFull = playerUnitsCount >= MAX_FIELD_UNITS_PER_PLAYER;

  return (
    <div className="p-4 md:p-5 rounded-2xl bg-[#252147]/85 backdrop-blur-md border border-[#38BDF8]/40 shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
      {/* Cantoneiras luminosas */}
      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#38BDF8]/60 pointer-events-none" />
      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#38BDF8]/60 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#38BDF8]/60 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#38BDF8]/60 pointer-events-none" />

      {/* Bloco Esquerdo: Cristal de Mana & Indicadores de Éter */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1E1B3A] border-2 border-[#38BDF8] text-[#38BDF8] rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <Sparkles className="w-4 h-4 animate-torch" />
            </div>
            <div>
              <span className="text-[10px] font-gothic uppercase tracking-widest text-[#38BDF8] block leading-none">
                Reserva de Mana Arcana
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-numbers font-black text-[#38BDF8] drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]">
                  {currentMana}
                </span>
                <span className="text-xs font-numbers text-[#94A3B8]">
                  / {MAX_MANA} CRISTAIS
                </span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-numbers uppercase tracking-wider text-[#F59E0B] px-3 py-1 bg-[#1E1B3A] border border-[#F59E0B]/50 rounded-lg shadow-sm">
            +3 Mana / Turno (Máx: 15)
          </span>
        </div>

        {/* 15 Cristais de Mana Radiantes */}
        <div className="p-1.5 bg-[#121026] border border-white/10 rounded-xl flex items-center gap-1.5 overflow-hidden shadow-inner">
          {Array.from({ length: MAX_MANA }).map((_, idx) => {
            const isFilled = idx < currentMana;
            return (
              <div
                key={idx}
                className={`flex-1 h-5 rounded flex items-center justify-center transition-all duration-300 relative border ${
                  isFilled
                    ? "bg-gradient-to-t from-[#0284C7] via-[#38BDF8] to-[#BAE6FD] border-[#E0F2FE] shadow-[0_0_10px_rgba(56,189,248,0.8)] scale-y-105"
                    : "bg-[#1C1838] border-white/5 opacity-40"
                }`}
                title={`Cristal de Mana #${idx + 1}`}
              >
                {isFilled && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white blur-[0.5px] animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bloco Central: Presença em Campo (X / 7) */}
      <div className="flex flex-col items-start md:items-center justify-center px-4 py-2.5 bg-[#181433]/90 border border-white/10 rounded-xl shadow-inner">
        <span className="text-[9px] font-gothic uppercase tracking-widest text-[#94A3B8]">
          Tropas em Campo
        </span>
        <div className="flex items-center gap-2 mt-1">
          <Swords className="w-4 h-4 text-[#F59E0B]" />
          <span
            className={`text-lg font-numbers font-black ${
              isFieldFull ? "text-[#F43F5E]" : "text-[#F8FAFC]"
            }`}
          >
            {playerUnitsCount}{" "}
            <span className="text-xs font-normal text-[#94A3B8]">
              / {MAX_FIELD_UNITS_PER_PLAYER} HEROIS
            </span>
          </span>
        </div>

        {isFieldFull && (
          <span className="mt-1 flex items-center gap-1 text-[8px] font-gothic uppercase text-[#F43F5E] bg-[#3B1424] border border-[#F43F5E]/60 px-2 py-0.5 rounded-full animate-pulse">
            <ShieldAlert className="w-3 h-3" /> Limite 7/7 Atingido
          </span>
        )}
      </div>

      {/* Bloco Direito: Botão Passar Turno (Ouro Solar Vibrante) */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <span className="text-[9px] font-gothic uppercase tracking-widest text-[#94A3B8] block">
            Turno
          </span>
          <span className="text-sm font-numbers font-black text-[#F59E0B]">
            #{turnNumber}
          </span>
        </div>

        <button
          onClick={onEndTurn}
          disabled={isAiTurn}
          className="btn-iron-torch px-5 py-3 text-xs tracking-wider cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
        >
          <span>{isAiTurn ? "Turno da IA..." : "Passar Turno (+3)"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
