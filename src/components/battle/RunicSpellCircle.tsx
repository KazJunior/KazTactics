import React from "react";

interface RunicSpellCircleProps {
  spellType?: "DIRECT_DAMAGE" | "HEAL" | "RESOURCE_GAIN" | "CONTROL" | string;
}

/**
 * Círculo Rúnico Desenhado a Nanquim no Chão do Tabuleiro
 * - Vermelho para dano (`DIRECT_DAMAGE`)
 * - Âmbar para buff/cura (`HEAL`, `RESOURCE_GAIN`)
 * - Roxo para controle e feitiços arcanos
 */
export function RunicSpellCircle({ spellType = "DIRECT_DAMAGE" }: RunicSpellCircleProps) {
  const isDamage = spellType === "DIRECT_DAMAGE";
  const isHealOrBuff = spellType === "HEAL" || spellType === "RESOURCE_GAIN";

  const mainColor = isDamage
    ? "#B82923"
    : isHealOrBuff
    ? "#F29F3D"
    : "#9D4EDD";

  const glowColor = isDamage
    ? "rgba(184, 41, 35, 0.6)"
    : isHealOrBuff
    ? "rgba(242, 159, 61, 0.6)"
    : "rgba(157, 78, 221, 0.6)";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
      <svg
        viewBox="0 0 80 80"
        className="w-full h-full animate-runic-spin filter"
        style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Anel Externo Tracejado com Runas */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={mainColor}
          strokeWidth="1.8"
          strokeDasharray="6 3"
        />

        {/* Anel Interno Fino */}
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke={mainColor}
          strokeWidth="1"
        />

        {/* Estrela / Sigilo Ocultista Central */}
        <polygon
          points="40,16 58,56 16,32 64,32 22,56"
          fill="none"
          stroke={mainColor}
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* Glifos Cardeais */}
        <circle cx="40" cy="10" r="2" fill={mainColor} />
        <circle cx="70" cy="40" r="2" fill={mainColor} />
        <circle cx="40" cy="70" r="2" fill={mainColor} />
        <circle cx="10" cy="40" r="2" fill={mainColor} />

        {/* Olho Rúnico Central */}
        <circle cx="40" cy="40" r="4" fill="#09080B" stroke={mainColor} strokeWidth="1.5" />
        <circle cx="40" cy="40" r="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

