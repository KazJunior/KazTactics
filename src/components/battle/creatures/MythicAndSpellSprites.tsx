"use client";

import React from "react";

/* ========================================================================= */
/* FAMÍLIA MITOLÓGICOS (5 Criaturas Únicas do Seed + Titã)                   */
/* ========================================================================= */

/**
 * 1. Sátiro Dançarino dos Bosques:
 * Ser mítico metade humano, metade bode, com pernas caprinas e cascos,
 * chifres curvos de bode e duas adagas encantadas verde-esmeralda.
 */
export function SatiroDancarinoSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="30" ry="6" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Pernas Caprinas Peludas com Cascos */}
      <path d="M46 78 L36 96 L44 114 L52 114 L48 96 L56 80 Z" fill="#78350F" />
      <path d="M68 78 L78 96 L72 114 L80 114 L86 96 L76 80 Z" fill="#92400E" />

      {/* Torso Ágil com Bandoleira de Folhas */}
      <path d="M46 46 L76 46 L72 80 L48 80 Z" fill="#FDE68A" />
      <path d="M46 48 L72 78" stroke="#15803D" strokeWidth="6" />

      {/* Cabeça com Barba Pontuda e Chifres de Bode */}
      <path d="M50 28 C36 12, 24 18, 28 30" fill="none" stroke="#451A03" strokeWidth="5" />
      <path d="M72 28 C86 12, 98 18, 94 30" fill="none" stroke="#451A03" strokeWidth="5" />
      <circle cx="61" cy="34" r="11" fill="#FDE68A" />
      <circle cx="57" cy="33" r="2.2" fill="#10B981" stroke="none" />
      <circle cx="65" cy="33" r="2.2" fill="#10B981" stroke="none" />

      {/* Duas Adagas Encantadas Esmeralda */}
      <polygon points="16,52 38,58 34,66" fill="#34D399" />
      <polygon points="108,44 86,56 92,64" fill="#34D399" />
    </g>
  );
}

/**
 * 2. Minotauro do Labirinto:
 * Guerreiro bovino colossal com chifres mortais apontados para frente,
 * argola dourada no focinho e machado duplo de guerra.
 */
export function MinotauroLabirintoSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="118" rx="40" ry="8" fill="#09090B" opacity="0.6" stroke="none" />

      {/* Pernas Taurinas e Cascos Pesados */}
      <path d="M38 84 L32 114 L46 114 L52 84 Z" fill="#451A03" />
      <path d="M72 84 L78 114 L92 114 L84 84 Z" fill="#451A03" />

      {/* Torso Muscular Colossal Marrom-Escuro */}
      <polygon points="28,42 96,42 84,86 40,86" fill="#78350F" />
      {/* Cinturão de Crânio/Bronze */}
      <rect x="40" y="76" width="44" height="10" fill="#F59E0B" />

      {/* Cabeça de Touro Furioso, Chifres Longos e Argola no Focinho */}
      <path d="M44 30 C24 24, 16 8, 30 6 C32 16, 40 22, 48 24 Z" fill="#FEF3C7" />
      <path d="M80 30 C100 24, 108 8, 94 6 C92 16, 84 22, 76 24 Z" fill="#FEF3C7" />
      <polygon points="44,24 80,24 76,52 48,52" fill="#451A03" />
      {/* Argola de Ouro no Focinho */}
      <circle cx="62" cy="52" r="6" fill="none" stroke="#FACC15" strokeWidth="3.5" />
      {/* Olhos Vermelhos em Fúria */}
      <polygon points="50,32 58,35 52,38" fill="#EF4444" stroke="none" />
      <polygon points="74,32 66,35 72,38" fill="#EF4444" stroke="none" />

      {/* Grande Machado de Batalha de Lâmina Dupla */}
      <line x1="98" y1="20" x2="92" y2="112" stroke="#451A03" strokeWidth="5" />
      <path d="M98 30 C118 16, 124 44, 98 50 Z" fill="#CBD5E1" />
      <path d="M98 30 C78 16, 72 44, 98 50 Z" fill="#94A3B8" />
    </g>
  );
}

/**
 * 3. Hidra dos Pântanos Sombrios:
 * Besta reptiliana de múltiplas cabeças serpentinas com pescoços sinuosos
 * e presas venenosas.
 */
export function HidraDosPantanosSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="42" ry="7" fill="#09090B" opacity="0.55" stroke="none" />

      {/* Corpo Reptiliano Escamoso e Cauda */}
      <path
        d="M20 96 C24 72, 64 68, 88 84 C96 94, 88 110, 68 110 C40 110, 18 106, 20 96 Z"
        fill="#065F46"
      />

      {/* Pescoço e Cabeça 1 (Esquerda) */}
      <path d="M42 80 C24 62, 16 40, 28 26" fill="none" stroke="#047857" strokeWidth="10" />
      <path d="M42 80 C24 62, 16 40, 28 26" fill="none" stroke="#09090B" strokeWidth="2.6" />
      <polygon points="20,20 44,18 42,32 22,34" fill="#10B981" />
      <circle cx="34" cy="24" r="2.5" fill="#FACC15" stroke="none" />

      {/* Pescoço e Cabeça 2 (Central Principal) */}
      <path d="M58 76 C54 52, 56 30, 68 16" fill="none" stroke="#059669" strokeWidth="11" />
      <polygon points="56,10 86,12 82,28 58,26" fill="#10B981" />
      <circle cx="74" cy="17" r="2.8" fill="#EF4444" stroke="none" />

      {/* Pescoço e Cabeça 3 (Direita) */}
      <path d="M74 82 C88 64, 96 46, 106 34" fill="none" stroke="#047857" strokeWidth="10" />
      <polygon points="94,26 120,30 114,44 94,40" fill="#10B981" />
      <circle cx="108" cy="33" r="2.5" fill="#FACC15" stroke="none" />
    </g>
  );
}

/**
 * 4. Fênix Renascida do Fogo:
 * Pássaro lendário inteiramente feito de penas de fogo dourado e laranja
 * com cauda longa luminosa.
 */
export function FenixRenascidaSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="30" ry="6" fill="#F97316" opacity="0.35" stroke="none" />

      {/* Grandes Asas de Fogo Abertas em Camadas */}
      <path
        d="M54 56 L8 18 L14 44 L6 58 L28 66 L52 68 Z"
        fill="#EA580C"
      />
      <path
        d="M74 56 L120 18 L114 44 L122 58 L100 66 L76 68 Z"
        fill="#EA580C"
      />
      <path d="M54 58 L20 30 L26 52 L52 64 Z" fill="#FACC15" stroke="none" />
      <path d="M74 58 L108 30 L102 52 L76 64 Z" fill="#FACC15" stroke="none" />

      {/* Cauda Longa Luminosa em Três Fitas de Fogo */}
      <path d="M56 76 C44 94, 34 106, 26 116" fill="none" stroke="#EF4444" strokeWidth="5" />
      <path d="M64 78 C64 96, 62 108, 64 118" fill="none" stroke="#FACC15" strokeWidth="5" />
      <path d="M72 76 C84 94, 94 106, 102 116" fill="none" stroke="#F97316" strokeWidth="5" />

      {/* Corpo e Cabeça de Ave Solar com Crista de Chamas */}
      <ellipse cx="64" cy="60" rx="14" ry="18" fill="#F59E0B" />
      <circle cx="64" cy="36" r="10" fill="#FEF08A" />
      <polygon points="58,28 64,8 70,28" fill="#EF4444" />
      <polygon points="64,34 78,38 64,42" fill="#F97316" />
      <circle cx="66" cy="34" r="2.2" fill="#DC2626" stroke="none" />
    </g>
  );
}

/**
 * 5. Dragão Ancestral de Platina:
 * Dragão escamoso com asas de morcego abertas, chifres longos e chamas na garganta.
 */
export function DragaoAncestralPlatinaSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="40" ry="8" fill="#09090B" opacity="0.55" stroke="none" />

      {/* Grandes Asas Dracônicas de Morcego Abertas */}
      <path
        d="M52 54 L8 20 L4 54 L20 50 L28 66 L48 64 Z"
        fill="#38BDF8"
      />
      <path
        d="M76 54 L120 20 L124 54 L108 50 L100 66 L80 64 Z"
        fill="#38BDF8"
      />

      {/* Cauda Escamosa de Platina */}
      <path d="M52 88 C28 96, 16 86, 14 72" fill="none" stroke="#CBD5E1" strokeWidth="7" />

      {/* Pernas com Garras e Corpo Escamoso de Platina */}
      <path d="M44 82 L36 112 L48 112 L54 84 Z" fill="#94A3B8" />
      <path d="M84 82 L92 112 L80 112 L74 84 Z" fill="#94A3B8" />
      <path d="M46 48 L82 48 L78 90 L50 90 Z" fill="#E2E8F0" />
      {/* Chamas Incandescentes na Garganta e Peito */}
      <polygon points="56,48 72,48 64,82" fill="#F97316" />

      {/* Cabeça Dracônica, Chifres Longos e Baforada */}
      <polygon points="52,28 36,6 58,22" fill="#FACC15" />
      <polygon points="76,28 92,6 70,22" fill="#FACC15" />
      <polygon points="50,24 78,24 84,44 44,44" fill="#F8FAFC" />
      <circle cx="58" cy="34" r="2.8" fill="#F97316" stroke="none" />
      <circle cx="70" cy="34" r="2.8" fill="#F97316" stroke="none" />
    </g>
  );
}

/* ========================================================================= */
/* FAMÍLIA FEITIÇOS (15 Feitiços Únicos do Seed - Zero Repetição)            */
/* ========================================================================= */

export function SpellByNameSprite({ cleanName }: { cleanName: string }) {
  // 1. Toque Restaurador
  if (cleanName.includes("TOQUE RESTAURADOR")) {
    return (
      <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="64" cy="64" r="38" fill="#10B981" opacity="0.25" stroke="none" />
        <rect x="52" y="24" width="24" height="80" rx="6" fill="#34D399" />
        <rect x="24" y="52" width="80" height="24" rx="6" fill="#34D399" />
        <circle cx="64" cy="64" r="14" fill="#FEF08A" />
      </g>
    );
  }

  // 2. Raio de Gelo Paralisante
  if (cleanName.includes("RAIO DE GELO")) {
    return (
      <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="64,12 86,52 72,56 90,114 38,68 54,64" fill="#38BDF8" />
        <polygon points="24,36 42,44 32,56" fill="#BAE6FD" />
        <polygon points="104,36 86,44 96,56" fill="#BAE6FD" />
      </g>
    );
  }

  // 3. Fúria do Berzerker
  if (cleanName.includes("FURIA DO BERZERKER")) {
    return (
      <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="64" cy="64" r="38" fill="#EF4444" opacity="0.3" stroke="none" />
        <path d="M24 30 C10 56, 24 88, 52 74 L64 56 L36 24 Z" fill="#DC2626" />
        <path d="M104 30 C118 56, 104 88, 76 74 L64 56 L92 24 Z" fill="#DC2626" />
        <line x1="64" y1="20" x2="64" y2="112" stroke="#FACC15" strokeWidth="6" />
      </g>
    );
  }

  // 4. Cristais de Mana Fluídos
  if (cleanName.includes("CRISTAIS DE MANA")) {
    return (
      <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="64,14 84,56 64,106 44,56" fill="#0EA5E9" />
        <polygon points="32,38 48,68 34,102 20,68" fill="#38BDF8" />
        <polygon points="96,38 108,68 94,102 80,68" fill="#38BDF8" />
      </g>
    );
  }

  // 5. Bola de Fogo Concentrada
  if (cleanName.includes("BOLA DE FOGO")) {
    return (
      <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M64 12 C32 36, 20 68, 40 96 C60 116, 98 100, 96 66 C94 40, 78 28, 64 12 Z" fill="#F97316" />
        <circle cx="64" cy="74" r="20" fill="#FEF08A" />
      </g>
    );
  }

  // 6. Chuva de Flechas Arcanas
  if (cleanName.includes("CHUVA DE FLECHAS")) {
    return (
      <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="24" y1="20" x2="54" y2="96" stroke="#C084FC" strokeWidth="4.5" />
        <polygon points="46,94 60,108 60,88" fill="#E9D5FF" />
        <line x1="50" y1="14" x2="80" y2="90" stroke="#38BDF8" strokeWidth="4.5" />
        <polygon points="72,88 86,102 86,82" fill="#BAE6FD" />
        <line x1="76" y1="22" x2="106" y2="98" stroke="#C084FC" strokeWidth="4.5" />
        <polygon points="98,96 112,110 112,90" fill="#E9D5FF" />
      </g>
    );
  }

  // 7. Égide Divina de Proteção
  if (cleanName.includes("EGIDE DIVINA")) {
    return (
      <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 24 L98 24 L92 74 L64 110 L36 74 Z" fill="#FACC15" />
        <path d="M40 34 L88 34 L82 70 L64 96 L46 70 Z" fill="#38BDF8" />
        <line x1="64" y1="40" x2="64" y2="86" stroke="#FFFFFF" strokeWidth="5" />
        <line x1="46" y1="58" x2="82" y2="58" stroke="#FFFFFF" strokeWidth="5" />
      </g>
    );
  }

  // 8. Correntes Etéreas Seladoras
  if (cleanName.includes("CORRENTES ETEREAS")) {
    return (
      <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="22" x2="110" y2="106" stroke="#A855F7" strokeWidth="7" strokeDasharray="10 6" />
        <line x1="110" y1="22" x2="18" y2="106" stroke="#38BDF8" strokeWidth="7" strokeDasharray="10 6" />
        <rect x="46" y="46" width="36" height="36" rx="6" fill="#FACC15" />
        <circle cx="64" cy="64" r="7" fill="#09090B" />
      </g>
    );
  }

  // 9. Torrente de Regeneração Coletiva
  if (cleanName.includes("TORRENTE DE REGENERACAO")) {
    return (
      <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M64 16 C40 48, 30 74, 48 98 C64 114, 92 98, 84 68 Z" fill="#06B6D4" />
        <circle cx="32" cy="48" r="8" fill="#34D399" />
        <circle cx="96" cy="48" r="8" fill="#34D399" />
        <circle cx="64" cy="76" r="12" fill="#A7F3D0" />
      </g>
    );
  }

  // 10. Meteoro Devastador do Cataclismo
  if (cleanName.includes("METEORO DEVASTADOR")) {
    return (
      <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="18,14 68,26 102,68 48,96 24,58" fill="#EF4444" />
        <circle cx="72" cy="76" r="28" fill="#451A03" />
        <path d="M56 66 L76 78 L88 64 M76 78 L68 96" stroke="#FACC15" strokeWidth="4" />
      </g>
    );
  }

  // 11. Tempestade de Relâmpagos em Cadeia
  if (cleanName.includes("TEMPESTADE DE RELAMPAGOS")) {
    return (
      <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="28,16 18,54 38,54 24,104" fill="none" stroke="#FACC15" strokeWidth="6" />
        <polyline points="64,12 50,58 74,58 58,112" fill="none" stroke="#38BDF8" strokeWidth="7" />
        <polyline points="100,16 88,54 108,54 92,104" fill="none" stroke="#FACC15" strokeWidth="6" />
      </g>
    );
  }

  // 12. Sobrecarga de Éter Cósmico
  if (cleanName.includes("SOBRECARGA DE ETER")) {
    return (
      <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="64,10 78,48 118,64 78,80 64,118 50,80 10,64 50,48" fill="#A855F7" />
        <circle cx="64" cy="64" r="16" fill="#FEF08A" />
      </g>
    );
  }

  // 13. Dança dos Ventos Célere
  if (cleanName.includes("DANCA DOS VENTOS")) {
    return (
      <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 44 Q64 20 110 44" fill="none" stroke="#6EE7B7" strokeWidth="7" />
        <path d="M26 68 Q64 44 102 68" fill="none" stroke="#34D399" strokeWidth="7" />
        <path d="M36 92 Q64 72 92 92" fill="none" stroke="#A7F3D0" strokeWidth="7" />
      </g>
    );
  }

  // 14. Praga da Decomposição Vital
  if (cleanName.includes("PRAGA DA DECOMPOSICAO")) {
    return (
      <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="64" cy="54" r="24" fill="#84CC16" />
        <rect x="50" y="70" width="28" height="18" rx="4" fill="#84CC16" />
        <circle cx="55" cy="52" r="5" fill="#09090B" />
        <circle cx="73" cy="52" r="5" fill="#09090B" />
        <circle cx="32" cy="96" r="6" fill="#A3E635" />
        <circle cx="96" cy="96" r="6" fill="#A3E635" />
      </g>
    );
  }

  // 15. Julgamento do Apocalipse (ou fallback de feitiço)
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="64" cy="48" r="28" fill="#F59E0B" />
      <polygon points="56,12 72,12 68,112 60,112" fill="#FEF08A" />
      <line x1="36" y1="36" x2="92" y2="36" stroke="#EF4444" strokeWidth="6" />
    </g>
  );
}

