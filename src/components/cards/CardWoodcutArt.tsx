import React from "react";
import { CardType, CardCategory } from "@/types";

interface CardWoodcutArtProps {
  cardType: CardType;
  category: CardCategory;
  cardName: string;
}

/**
 * Ilustração Central em Xilogravura de Alto Contraste (Darkest Dungeon)
 * - Sombras pretas sólidas (> 40% da arte)
 * - Olhos ocultos na escuridão com ponto de luz focal
 * - Hachuras e traços pesados de nanquim
 */
export function CardWoodcutArt({ cardType, category, cardName }: CardWoodcutArtProps) {
  return (
    <div className="relative w-full h-32 sm:h-36 overflow-hidden bg-[#09080B] border-y-2 border-[#09080B]">
      {/* Moldura Interna em Nanquim com Textura Suja */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 z-10 pointer-events-none" />

      {/* Renderização Específica por Tipo */}
      {category === "FEITICO" || cardType === "FEITICOS" ? (
        <SpellWoodcut />
      ) : cardType === "ARTROPODES" ? (
        <ArthropodWoodcut />
      ) : cardType === "BESTIAIS" ? (
        <BestialWoodcut />
      ) : cardType === "MORTOS_VIVOS" ? (
        <UndeadWoodcut />
      ) : cardType === "ESPIRITOS" ? (
        <SpiritWoodcut />
      ) : cardType === "HUMANOIDES" ? (
        <HumanoidWoodcut />
      ) : cardType === "MECANICOS" ? (
        <MechanicalWoodcut />
      ) : (
        <MythologicalWoodcut />
      )}
    </div>
  );
}

// 1. ARTRÓPODES: Quitinosa, mandíbulas afiadas, espinhos em nanquim e verde-ácido
function ArthropodWoodcut() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" fill="#0c120a" />
      {/* Fundo com Espinhos Quitinosos */}
      <path d="M10 140L30 80L40 140M160 140L175 70L190 140" fill="#09080B" stroke="#222E1F" strokeWidth="2" />
      <circle cx="100" cy="70" r="45" fill="#141E11" stroke="#3E5227" strokeWidth="3" />

      {/* Carapaça Central e Quelíceras */}
      <path d="M70 40C85 30 115 30 130 40C140 65 135 95 100 115C65 95 60 65 70 40Z" fill="#09080B" stroke="#4E6838" strokeWidth="3" />
      <path d="M85 110L75 135M115 110L125 135" stroke="#7AA658" strokeWidth="4" strokeLinecap="round" />

      {/* Mandíbulas Venenosas */}
      <path d="M82 85Q90 105 78 115M118 85Q110 105 122 115" stroke="#09080B" strokeWidth="5" fill="none" />
      <path d="M82 85Q90 105 78 115M118 85Q110 105 122 115" stroke="#7AA658" strokeWidth="2" fill="none" />

      {/* Olhos Múltiplos: Fendas de Nanquim com 2 Pontos Ácidos */}
      <rect x="75" y="60" width="50" height="12" fill="#09080B" />
      <circle cx="92" cy="66" r="2.5" fill="#a3e635" />
      <circle cx="108" cy="66" r="2.5" fill="#a3e635" />
      <circle cx="85" cy="64" r="1.5" fill="#4d7c0f" />
      <circle cx="115" cy="64" r="1.5" fill="#4d7c0f" />
    </svg>
  );
}

// 2. BESTIAIS: Fera predadora com garras e silhueta sombria
function BestialWoodcut() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" fill="#140704" />
      {/* Marcas de Garras no Fundo */}
      <line x1="30" y1="20" x2="60" y2="120" stroke="#8C3018" strokeWidth="3" strokeDasharray="15 5" />
      <line x1="45" y1="15" x2="75" y2="115" stroke="#8C3018" strokeWidth="4" />
      <line x1="60" y1="25" x2="90" y2="125" stroke="#8C3018" strokeWidth="3" />

      {/* Silhueta Pesada da Besta (45% Preto Sólido) */}
      <path
        d="M50 140L70 80L85 45L95 25L105 45L120 20L135 50L150 85L170 140Z"
        fill="#09080B"
        stroke="#8C3018"
        strokeWidth="3"
      />
      {/* Focinho e Presas Brutais */}
      <path d="M90 75L100 88L110 75L100 95Z" fill="#8C3018" stroke="#09080B" strokeWidth="2" />
      <polygon points="88,95 93,115 97,95" fill="#C8B99E" stroke="#09080B" strokeWidth="1" />
      <polygon points="103,95 107,115 112,95" fill="#C8B99E" stroke="#09080B" strokeWidth="1" />

      {/* Olhos na Sombra Profunda: Ponto Único Carmesim */}
      <rect x="80" y="50" width="40" height="15" fill="#000000" />
      <circle cx="88" cy="58" r="2.5" fill="#B82923" />
      <circle cx="112" cy="58" r="2.5" fill="#F29F3D" />
    </svg>
  );
}

// 3. MORTOS-VIVOS: Crânio esquelético com ossos e olhos na fenda escura
function UndeadWoodcut() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" fill="#0d1210" />
      {/* Lápide Rachada e Névoa Fúnebre */}
      <path d="M60 140V50C60 30 140 30 140 50V140H60Z" fill="#1A211E" stroke="#2F3833" strokeWidth="2" />
      <path d="M85 35L95 65L88 85" stroke="#09080B" strokeWidth="3" fill="none" />

      {/* Crânio em Xilogravura */}
      <path
        d="M75 55C75 35 125 35 125 55C125 75 120 85 115 95H85C80 85 75 75 75 55Z"
        fill="#C8B99E"
        stroke="#09080B"
        strokeWidth="3.5"
      />
      {/* Maxilar e Dentes */}
      <rect x="88" y="95" width="24" height="15" fill="#9E8C70" stroke="#09080B" strokeWidth="2" />
      <line x1="94" y1="95" x2="94" y2="110" stroke="#09080B" strokeWidth="2" />
      <line x1="100" y1="95" x2="100" y2="110" stroke="#09080B" strokeWidth="2" />
      <line x1="106" y1="95" x2="106" y2="110" stroke="#09080B" strokeWidth="2" />

      {/* Cavidades Oculares em Sombra Absoluta com Fagulha Espectral */}
      <circle cx="88" cy="62" r="7" fill="#09080B" />
      <circle cx="112" cy="62" r="7" fill="#09080B" />
      <circle cx="90" cy="62" r="2" fill="#2E8B78" />
      <circle cx="110" cy="62" r="2" fill="#2E8B78" />
    </svg>
  );
}

// 4. ESPÍRITOS: Correntes etéreas, fumaça espectral e brilho ciano
function SpiritWoodcut() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" fill="#061014" />
      {/* Elos de Corrente Espectral */}
      <ellipse cx="40" cy="40" rx="15" ry="8" fill="none" stroke="#2C626E" strokeWidth="3" transform="rotate(-30 40 40)" />
      <ellipse cx="60" cy="55" rx="15" ry="8" fill="none" stroke="#2C626E" strokeWidth="3" transform="rotate(30 60 55)" />
      <ellipse cx="150" cy="90" rx="15" ry="8" fill="none" stroke="#2C626E" strokeWidth="3" transform="rotate(-20 150 90)" />

      {/* Vulto Fantasmagórico em Nanquim e Névoa Ciano */}
      <path
        d="M100 20C75 20 65 50 70 85C75 110 60 135 100 135C140 135 125 110 130 85C135 50 125 20 100 20Z"
        fill="#09080B"
        stroke="#38BDF8"
        strokeWidth="2.5"
      />
      {/* Rosto Vazio com Brilho Espectral */}
      <ellipse cx="100" cy="55" rx="18" ry="24" fill="#04090c" />
      <circle cx="93" cy="52" r="2.5" fill="#38BDF8" />
      <circle cx="107" cy="52" r="2.5" fill="#38BDF8" />
      <path d="M94 72Q100 78 106 72" stroke="#38BDF8" strokeWidth="2" fill="none" />
    </svg>
  );
}

// 5. HUMANOIDES: Cavaleiro gótico com elmo fechado e aço enferrujado
function HumanoidWoodcut() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" fill="#121116" />
      {/* Estandarte Rasgado ao Fundo */}
      <path d="M140 20H185L170 65L185 110H140V140" fill="#2A2830" stroke="#4E4A58" strokeWidth="2" />

      {/* Ombreiras de Ferro e Elmo Gótico */}
      <path d="M50 140L75 100L100 110L125 100L150 140Z" fill="#09080B" stroke="#635C6E" strokeWidth="3" />
      <path
        d="M80 50C80 30 120 30 120 50V90L100 105L80 90V50Z"
        fill="#26232C"
        stroke="#09080B"
        strokeWidth="3.5"
      />
      {/* Crista de Ferro e Rebites */}
      <path d="M96 25H104V55H96V25Z" fill="#D97724" stroke="#09080B" strokeWidth="1.5" />

      {/* Visor em Fenda Escura com Ponto de Luz Fria */}
      <rect x="85" y="62" width="30" height="6" fill="#09080B" />
      <line x1="86" y1="65" x2="114" y2="65" stroke="#C8B99E" strokeWidth="1" strokeDasharray="4 8" />
      <circle cx="102" cy="65" r="1.5" fill="#F29F3D" />
    </svg>
  );
}

// 6. MECÂNICOS: Engrenagens de latão, rebites e vapor de caldeira
function MechanicalWoodcut() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" fill="#120c08" />
      {/* Engrenagens de Latão em Xilogravura */}
      <circle cx="50" cy="50" r="28" fill="#1b120a" stroke="#785028" strokeWidth="3" strokeDasharray="6 4" />
      <circle cx="150" cy="90" r="35" fill="#1b120a" stroke="#785028" strokeWidth="3.5" strokeDasharray="8 5" />

      {/* Autômato / Forja Central em Nanquim Pesado */}
      <rect x="75" y="40" width="50" height="65" rx="6" fill="#09080B" stroke="#D97724" strokeWidth="3" />
      {/* Chaminé Soltando Fumaça */}
      <rect x="88" y="20" width="10" height="20" fill="#26232C" stroke="#09080B" strokeWidth="2" />
      <circle cx="93" cy="14" r="5" fill="#3A3542" />

      {/* Visor de Lente de Fornalha (Brilho Âmbar) */}
      <circle cx="100" cy="65" r="10" fill="#78350f" stroke="#D97724" strokeWidth="2.5" />
      <circle cx="100" cy="65" r="5" fill="#f59e0b" />
      <circle cx="100" cy="65" r="2" fill="#fff" />
    </svg>
  );
}

// 7. MITOLÓGICOS: Monólito cósmico, tentáculos sombrios e runas ancestrais
function MythologicalWoodcut() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" fill="#120e06" />
      {/* Tentáculos em Nanquim Emergindo das Bordas */}
      <path d="M20 140Q40 80 15 40Q10 20 30 25Q45 50 35 140Z" fill="#09080B" stroke="#8C7030" strokeWidth="2" />
      <path d="M180 140Q160 80 185 40Q190 20 170 25Q155 50 165 140Z" fill="#09080B" stroke="#8C7030" strokeWidth="2" />

      {/* Monólito Ancestral Rúnico */}
      <polygon points="75,140 85,30 115,30 125,140" fill="#09080B" stroke="#D49B27" strokeWidth="3" />
      {/* Runas de Ouro Ancestral */}
      <line x1="100" y1="45" x2="100" y2="70" stroke="#F29F3D" strokeWidth="2" />
      <line x1="92" y1="55" x2="108" y2="55" stroke="#F29F3D" strokeWidth="2" />
      <circle cx="100" cy="85" r="4" fill="none" stroke="#D49B27" strokeWidth="2" />

      {/* Olho Abissal Central */}
      <path d="M85 105C95 95 105 95 115 105C105 115 95 115 85 105Z" fill="#78350f" stroke="#D49B27" strokeWidth="2" />
      <circle cx="100" cy="105" r="3" fill="#D49B27" />
    </svg>
  );
}

// 8. FEITIÇOS: Pergaminho queimado, selo ocultista e chamas de nanquim
function SpellWoodcut() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" fill="#140817" />
      {/* Fumaça Ocultista e Borda Chamuscada */}
      <path d="M0 0H200V25L180 15L150 25L120 10L90 25L50 15L0 25V0Z" fill="#09080B" />
      <path d="M0 140H200V115L180 125L150 115L120 130L90 115L50 125L0 115V140Z" fill="#09080B" />

      {/* Sigilo Arcano Pentagonal */}
      <circle cx="100" cy="70" r="38" fill="#09080B" stroke="#6B2D84" strokeWidth="3" />
      <circle cx="100" cy="70" r="32" fill="none" stroke="#9D4EDD" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Estrela / Glifo Ocultista */}
      <polygon points="100,42 118,85 75,58 125,58 82,85" fill="none" stroke="#9D4EDD" strokeWidth="2" />

      {/* Chamas Púrpuras / Escarlates */}
      <circle cx="100" cy="70" r="6" fill="#c77dff" />
      <circle cx="100" cy="70" r="2.5" fill="#ffffff" />
    </svg>
  );
}

