import React from "react";

/**
 * Ilustrações 2D Hand-Drawn para a Tenda do Antiquário (Darkest Dungeon)
 */

// 1. Baú Enferrujado de Ferro e Madeira Podre (Pacote Padrão)
export function RustIronChest() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20 md:w-28 md:h-24 overflow-visible filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.9)]" xmlns="http://www.w3.org/2000/svg">
      {/* Sombra de Nanquim na Mesa */}
      <ellipse cx="50" cy="74" rx="42" ry="8" fill="#09080B" />

      {/* Caixa do Baú (Madeira Gasta de Carvalho) */}
      <polygon points="12,70 88,70 94,38 6,38" fill="#1C1814" stroke="#09080B" strokeWidth="2.5" />

      {/* Tampa Arqueada de Ferro com Chanfros */}
      <path
        d="M6 38C6 20 22 14 50 14C78 14 94 20 94 38H6Z"
        fill="#26211C"
        stroke="#09080B"
        strokeWidth="2.5"
      />

      {/* Cintas de Ferro Oxidado com Rebites */}
      <path d="M26 18V70" stroke="#785028" strokeWidth="4" />
      <path d="M26 18V70" stroke="#09080B" strokeWidth="1" strokeDasharray="3 4" />
      <path d="M74 18V70" stroke="#785028" strokeWidth="4" />
      <path d="M74 18V70" stroke="#09080B" strokeWidth="1" strokeDasharray="3 4" />

      {/* Cadeado Enferrujado com Fecho de Corrente */}
      <rect x="44" y="34" width="12" height="15" rx="2" fill="#D97724" stroke="#09080B" strokeWidth="1.8" />
      <path d="M47 34V29C47 26 53 26 53 29V34" stroke="#09080B" strokeWidth="2" fill="none" />
      <circle cx="50" cy="40" r="1.5" fill="#09080B" />

      {/* Correntes Envolventes */}
      <ellipse cx="20" cy="38" rx="8" ry="4" fill="none" stroke="#5A5560" strokeWidth="2" />
      <ellipse cx="80" cy="38" rx="8" ry="4" fill="none" stroke="#5A5560" strokeWidth="2" />

      {/* Hachuras de Nanquim e Madeira Rachada */}
      <line x1="32" y1="45" x2="40" y2="45" stroke="#09080B" strokeWidth="1.2" />
      <line x1="60" y1="55" x2="70" y2="55" stroke="#09080B" strokeWidth="1.2" />
      <path d="M64 42L68 48L65 52" stroke="#09080B" strokeWidth="1" fill="none" />
    </svg>
  );
}

// 2. Urna Lacrada com Runas Eldritch (Pacote Místico)
export function EldritchUrn() {
  return (
    <svg viewBox="0 0 100 85" className="w-24 h-20 md:w-28 md:h-24 overflow-visible filter drop-shadow-[0_0_20px_rgba(107,45,132,0.6)]" xmlns="http://www.w3.org/2000/svg">
      {/* Sombra e Aura Roxa */}
      <ellipse cx="50" cy="78" rx="38" ry="8" fill="#09080B" />
      <circle cx="50" cy="42" r="30" fill="#6B2D84" fillOpacity="0.2" className="animate-pulse" />

      {/* Corpo da Urna de Pedra Negra */}
      <path
        d="M32 16H68L78 35C82 52 74 72 50 75C26 72 18 52 22 35L32 16Z"
        fill="#120B17"
        stroke="#26232C"
        strokeWidth="2.5"
      />

      {/* Tampa Chanfrada com Selo de Cera Escarlate */}
      <polygon points="28,16 72,16 66,8 34,8" fill="#24142E" stroke="#09080B" strokeWidth="2" />
      <circle cx="50" cy="12" r="4.5" fill="#8C1D18" stroke="#09080B" strokeWidth="1.2" />

      {/* Faixas de Linho Rúnico com Sigilos Escritos em Púrpura */}
      <path d="M22 35Q50 45 78 35" stroke="#6B2D84" strokeWidth="4" fill="none" />
      <path d="M24 50Q50 60 76 50" stroke="#6B2D84" strokeWidth="4" fill="none" />

      {/* Olho Ocultista Entalhado na Urna */}
      <g className="animate-pulse">
        <path d="M40 45C44 40 56 40 60 45C56 50 44 50 40 45Z" fill="#290715" stroke="#B82923" strokeWidth="1.5" />
        <circle cx="50" cy="45" r="3" fill="#B82923" />
        <ellipse cx="50" cy="45" rx="1" ry="2.5" fill="#09080B" />
        <circle cx="49" cy="44" r="0.8" fill="#FEF08A" />
      </g>

      {/* Runas Luminosas */}
      <line x1="34" y1="26" x2="38" y2="30" stroke="#9D4EDD" strokeWidth="1.5" />
      <line x1="62" y1="26" x2="66" y2="30" stroke="#9D4EDD" strokeWidth="1.5" />
    </svg>
  );
}

// 2.5 Relicário Astral Supremo (Pacote Supremo - Apenas Épicas 90% e Lendárias 10%)
export function SupremeAstralReliquary() {
  return (
    <svg
      viewBox="0 0 100 85"
      className="w-24 h-20 md:w-28 md:h-24 overflow-visible filter drop-shadow-[0_0_24px_rgba(250,204,21,0.65)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sombra e Halo Dourado-Imperial */}
      <ellipse cx="50" cy="78" rx="40" ry="8" fill="#09080B" />
      <circle
        cx="50"
        cy="42"
        r="34"
        fill="#D97724"
        fillOpacity="0.25"
        className="animate-pulse"
      />

      {/* Asas Ornamentais de Ouro nas Laterais */}
      <path
        d="M20 46 L6 30 L16 32 L10 20 L24 28 Z"
        fill="#FACC15"
        stroke="#09080B"
        strokeWidth="2"
      />
      <path
        d="M80 46 L94 30 L84 32 L90 20 L76 28 Z"
        fill="#FACC15"
        stroke="#09080B"
        strokeWidth="2"
      />

      {/* Corpo do Relicário Real em Ouro Velho e Púrpura */}
      <polygon
        points="22,30 78,30 72,72 28,72"
        fill="#2A1238"
        stroke="#09080B"
        strokeWidth="2.5"
      />
      <polygon
        points="18,30 82,30 74,18 26,18"
        fill="#D97724"
        stroke="#09080B"
        strokeWidth="2.5"
      />

      {/* Coroa Suprema no Topo */}
      <polygon
        points="32,18 36,6 44,14 50,4 56,14 64,6 68,18"
        fill="#FEF08A"
        stroke="#09080B"
        strokeWidth="2"
      />

      {/* Bordas e Pilares de Ouro Maciço */}
      <rect
        x="26"
        y="30"
        width="6"
        height="42"
        fill="#F59E0B"
        stroke="#09080B"
        strokeWidth="1.8"
      />
      <rect
        x="68"
        y="30"
        width="6"
        height="42"
        fill="#F59E0B"
        stroke="#09080B"
        strokeWidth="1.8"
      />

      {/* Cristal Lendário Central Pulsante */}
      <polygon
        points="50,34 60,48 50,62 40,48"
        fill="#F43F5E"
        stroke="#FEF08A"
        strokeWidth="2"
        className="animate-pulse"
      />
      <polygon points="50,38 56,48 50,58 44,48" fill="#FEF08A" />
    </svg>
  );
}

// 3. Quebra de Correntes de Ferro (Animação de Abertura)
export function ChainsShatterAnim() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none select-none overflow-hidden animate-chains-shatter">
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Clarão Central de Fogo da Tocha */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D97724] via-[#FEF08A] to-[#B82923] opacity-65 blur-xl animate-ping" />

        <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Elos de Corrente Rompendo-se */}
          <ellipse cx="70" cy="90" rx="25" ry="12" fill="none" stroke="#26232C" strokeWidth="7" transform="rotate(-35 70 90)" />
          <ellipse cx="70" cy="90" rx="25" ry="12" fill="none" stroke="#D97724" strokeWidth="3" transform="rotate(-35 70 90)" />

          <ellipse cx="130" cy="110" rx="25" ry="12" fill="none" stroke="#26232C" strokeWidth="7" transform="rotate(35 130 110)" />
          <ellipse cx="130" cy="110" rx="25" ry="12" fill="none" stroke="#D97724" strokeWidth="3" transform="rotate(35 130 110)" />

          {/* Fragmentos de Ferro Voando com Faíscas */}
          <polygon points="95,95 105,85 100,105" fill="#FEF08A" />
          <polygon points="105,105 115,115 110,95" fill="#FEF08A" />
          <line x1="100" y1="100" x2="40" y2="40" stroke="#FEF08A" strokeWidth="2.5" />
          <line x1="100" y1="100" x2="160" y2="160" stroke="#FEF08A" strokeWidth="2.5" />
          <line x1="100" y1="100" x2="160" y2="40" stroke="#D97724" strokeWidth="2" />
          <line x1="100" y1="100" x2="40" y2="160" stroke="#B82923" strokeWidth="2" />
        </svg>

        <span className="absolute font-gothic font-black text-2xl tracking-widest text-[#09080B] bg-[#FEF08A] px-4 py-1 border-3 border-[#09080B] shadow-[6px_6px_0px_#09080B]">
          SELOS ROMPIDOS!
        </span>
      </div>
    </div>
  );
}

// 4. Ressonância de Sino de Catedral (Para Épicas e Lendárias)
export function CathedralBellResonance({ rarity }: { rarity: "EPICO" | "LENDARIO" }) {
  const isLegendary = rarity === "LENDARIO";

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      {/* Ondas Sonoras Radiais de Xilogravura */}
      <div
        className={`w-96 h-96 rounded-full border-4 animate-bell-chime ${
          isLegendary
            ? "border-[#D49B27] shadow-[0_0_50px_rgba(212,155,39,0.85)]"
            : "border-[#9D4EDD] shadow-[0_0_50px_rgba(157,78,221,0.85)]"
        }`}
      />
      <div
        className={`absolute w-72 h-72 rounded-full border-3 animate-bell-chime ${
          isLegendary ? "border-[#B82923]" : "border-[#6B2D84]"
        }`}
        style={{ animationDelay: "150ms" }}
      />
    </div>
  );
}

