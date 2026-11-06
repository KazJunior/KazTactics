"use client";

import React from "react";
import { Card } from "@/db/schema";

interface CreatureSprite2DProps {
  card: Card;
  isPlayer?: boolean;
  className?: string;
}

// Helper para classes do SVG Cel-Shaded
function svgProps(isPlayer: boolean) {
  return {
    viewBox: "0 0 100 100",
    className: "w-full h-full overflow-visible select-none pointer-events-none filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]",
    style: {
      transform: isPlayer ? "none" : "scaleX(-1)",
      transformOrigin: "center center",
    },
    xmlns: "http://www.w3.org/2000/svg",
  };
}

/* ========================================================================= */
/* 1. ARTRÓPODES (Estilo Fantasy Insectoid Boss - Esmeralda, Jade & Ouro)     */
/* ========================================================================= */

// Rainha da Colmeia Quitina (Lendária) - Carapaça esmeralda joia, coroa de ouro e asas de éter
export function HiveQueenSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Asas Celestes de Éter Translúcidas */}
      <path d="M42 32 C30 10 10 12 18 28 C24 38 38 38 42 32 Z" fill="#38BDF8" fillOpacity="0.45" stroke="#BAE6FD" strokeWidth="1.2" />
      <path d="M46 36 C34 16 18 24 26 40 C32 48 44 44 46 36 Z" fill="#A7F3D0" fillOpacity="0.4" stroke="#6EE7B7" strokeWidth="1.2" />

      <g stroke="#132E1B" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Abdômen Colossal em Placas de Esmeralda Polida */}
        <path d="M8 50 C6 30 22 22 40 26 C52 30 52 48 44 62 C34 72 14 68 8 50 Z" fill="#059669" />
        {/* Cel-shading Luz Superior no Abdômen */}
        <path d="M14 36 C22 28 34 28 42 34 C38 42 24 42 16 46 Z" fill="#34D399" stroke="none" />
        {/* Nervuras Douradas Reais */}
        <path d="M18 34 Q28 44 22 58" stroke="#FBBF24" strokeWidth="2.2" fill="none" />
        <path d="M28 32 Q38 44 32 60" stroke="#FBBF24" strokeWidth="2.2" fill="none" />

        {/* Agulhões Dourados com Gemas Fúcsia */}
        <polygon points="6,40 0,34 9,37" fill="#F59E0B" />
        <polygon points="4,52 -2,48 7,50" fill="#F59E0B" />
        <circle cx="2" cy="36" r="1.5" fill="#EC4899" stroke="none" />

        {/* Tórax com Placas de Jade Imperial */}
        <ellipse cx="52" cy="44" rx="14" ry="12" fill="#10B981" />
        <ellipse cx="52" cy="41" rx="11" ry="8" fill="#34D399" stroke="none" />

        {/* Coroa Real de Ouro Solar com Joias */}
        <path d="M58 22 L53 13 L48 22 L44 15 L40 24 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="53" cy="17" r="1.5" fill="#EF4444" stroke="none" />
        <circle cx="44" cy="19" r="1.2" fill="#38BDF8" stroke="none" />

        {/* Patas Elegantes de Esmeralda e Ouro */}
        <path d="M38 40 L26 14 L12 38 L6 66 L4 88" fill="none" stroke="#047857" strokeWidth="2.5" />
        <path d="M48 42 L42 18 L34 46 L26 72 L22 88" fill="none" stroke="#10B981" strokeWidth="2.4" />
        <path d="M56 44 L68 20 L78 48 L84 72 L86 88" fill="none" stroke="#10B981" strokeWidth="2.4" />
        <path d="M60 48 L80 28 L90 54 L92 76 L94 88" fill="none" stroke="#34D399" strokeWidth="2.4" />

        {/* Quelíceras Douradas */}
        <path d="M64 48 Q76 56 78 68 L70 66" fill="#F59E0B" />
        <path d="M68 50 Q78 60 82 72 L76 70" fill="#FBBF24" />
      </g>

      {/* Olhos Anime de Rainha em Rubi e Ouro com Brilho Celular */}
      <ellipse cx="64" cy="40" rx="3" ry="4" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
      <circle cx="63.5" cy="38.5" r="1.2" fill="#FFFFFF" />
      <ellipse cx="69" cy="42" rx="2.5" ry="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
      <circle cx="68.5" cy="41" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

// Aranha Tece-Sombras (Ametista & Ciano Mágico)
export function SpiderSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <g stroke="#1E1035" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Abdômen Ametista Brilhante */}
        <path d="M14 48 C12 32 24 26 40 30 C48 34 50 48 44 58 C36 66 18 64 14 48 Z" fill="#8B5CF6" />
        {/* Cel-shading Ametista Claro */}
        <path d="M20 36 C26 30 36 30 42 36 C38 44 26 44 20 36 Z" fill="#C4B5FD" stroke="none" />
        {/* Marca Rúnica Neon no Dorso */}
        <polygon points="30,34 34,42 26,42" fill="#38BDF8" stroke="none" />
        <polygon points="30,48 34,42 26,42" fill="#06B6D4" stroke="none" />

        {/* Tórax Roxo Real */}
        <ellipse cx="52" cy="46" rx="13" ry="9" fill="#6D28D9" />

        {/* Patas Articuladas com Aneis de Ouro */}
        <path d="M42 42 L30 18 L16 42 L10 66 L8 86" fill="none" stroke="#7C3AED" strokeWidth="2.2" />
        <path d="M46 44 L38 24 L28 50 L22 74 L20 87" fill="none" stroke="#8B5CF6" strokeWidth="2.2" />
        <path d="M52 46 L50 20 L42 52 L38 76 L36 87" fill="none" stroke="#7C3AED" strokeWidth="2.2" />
        <path d="M56 46 L60 20 L62 52 L56 76 L52 87" fill="none" stroke="#8B5CF6" strokeWidth="2.2" />
        <path d="M58 44 L70 24 L78 52 L82 74 L84 87" fill="none" stroke="#7C3AED" strokeWidth="2.2" />
        <path d="M62 46 L80 30 L90 56 L92 78 L94 87" fill="none" stroke="#A78BFA" strokeWidth="2.2" />

        {/* Quelíceras de Cristal Ciano */}
        <path d="M62 50 Q70 56 72 64 L67 62" fill="#38BDF8" />
      </g>

      {/* Olhos de Anime Violeta com Brilhos */}
      <circle cx="60" cy="43" r="2.4" fill="#EC4899" />
      <circle cx="59.2" cy="42.2" r="0.9" fill="#FFFFFF" />
      <circle cx="64" cy="44" r="2" fill="#38BDF8" />
      <circle cx="63.3" cy="43.3" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

// Escaravelho Batedor (Turquesa & Ouro Polido)
export function ScarabBeetleSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <g stroke="#0F2B2B" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Carapaça Turquesa com Reflexo Dourado */}
        <path d="M18 52 C18 34 32 28 56 30 C68 34 72 50 66 62 C56 72 22 70 18 52 Z" fill="#0EA5E9" />
        <path d="M22 42 C26 34 40 32 54 34 C48 46 32 46 22 42 Z" fill="#7DD3FC" stroke="none" />
        <line x1="18" y1="52" x2="66" y2="52" stroke="#F59E0B" strokeWidth="2.5" />

        {/* Cabeça de Bronze Dourado */}
        <path d="M62 40 C70 34 80 34 84 44 C86 52 80 60 70 60 Z" fill="#F59E0B" />

        {/* Chifre Dourado Majestoso */}
        <path d="M82 44 C90 34 98 28 98 18 C94 28 86 36 80 46 Z" fill="#FBBF24" stroke="#78350F" strokeWidth="1.6" />
        <circle cx="94" cy="24" r="1.8" fill="#38BDF8" stroke="none" />

        {/* Patas Escavadoras Douradas */}
        <path d="M32 58 L24 74 L18 86" fill="none" stroke="#0284C7" strokeWidth="2.8" />
        <path d="M48 60 L44 74 L40 86" fill="none" stroke="#0EA5E9" strokeWidth="2.8" />
        <path d="M64 58 L68 74 L72 86" fill="none" stroke="#0284C7" strokeWidth="2.8" />
      </g>
      {/* Olho de Anime Safira */}
      <circle cx="74" cy="42" r="2.2" fill="#38BDF8" />
      <circle cx="73.2" cy="41.2" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

// Louva-a-Deus Ceifador (Mantis Reaper - Jade & Lâminas de Luz)
export function MantisReaperSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <g stroke="#14532D" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M12 70 C10 46 22 36 34 40 L38 64 C28 72 16 76 12 70 Z" fill="#15803D" />
        {/* Tórax Fino e Elegante */}
        <line x1="36" y1="48" x2="56" y2="34" stroke="#22C55E" strokeWidth="4.5" />
        <ellipse cx="62" cy="30" rx="9" ry="7" fill="#4ADE80" />

        {/* Grandes Foices de Cristal Esmeralda com Aura */}
        <path d="M58 32 C68 20 84 14 96 16 C88 28 82 42 74 54 L62 40 Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
        <path d="M54 36 C64 26 78 22 88 24 C82 34 76 46 70 56 L60 42 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="1.6" />

        {/* Patas Traseiras Ágeis */}
        <path d="M30 62 L22 40 L16 86" fill="none" stroke="#16A34A" strokeWidth="2.5" />
        <path d="M36 64 L34 46 L30 86" fill="none" stroke="#22C55E" strokeWidth="2.5" />
      </g>
      {/* Olho de Anime Esmeralda Gigante com Specular */}
      <ellipse cx="65" cy="27" rx="3.5" ry="4" fill="#047857" stroke="#14532D" strokeWidth="1" />
      <circle cx="64" cy="25.5" r="1.3" fill="#FFFFFF" />
      <circle cx="66.5" cy="28.5" r="0.8" fill="#86EFAC" />
    </svg>
  );
}

// Centopeia de Pedra (Dragon Centipede - Jade & Ametista)
export function CentipedeSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <g stroke="#1E1B4B" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Segmentos Escamados de Jade */}
        <ellipse cx="20" cy="58" rx="10" ry="8" fill="#10B981" />
        <ellipse cx="32" cy="54" rx="11" ry="9" fill="#059669" />
        <ellipse cx="46" cy="50" rx="12" ry="10" fill="#10B981" />
        <ellipse cx="60" cy="46" rx="12" ry="10" fill="#34D399" />
        <ellipse cx="74" cy="42" rx="11" ry="9" fill="#10B981" />

        {/* Cristais Ametista no Dorso */}
        <polygon points="32,44 36,36 30,36" fill="#A855F7" />
        <polygon points="46,38 50,28 44,28" fill="#C084FC" />
        <polygon points="60,34 64,26 58,26" fill="#A855F7" />

        {/* Mandíbulas Douradas */}
        <path d="M78 44 Q88 38 92 48" stroke="#F59E0B" strokeWidth="3" fill="none" />
        <path d="M78 46 Q88 52 90 60" stroke="#F59E0B" strokeWidth="3" fill="none" />

        {/* Múltiplas Pernas de Ouro */}
        {[18, 28, 38, 48, 58, 68].map((x, idx) => (
          <path key={idx} d={`M${x} 62 L${x - 2} 76 L${x - 6} 86`} fill="none" stroke="#FBBF24" strokeWidth="2.2" />
        ))}
      </g>
      {/* Olho de Anime Violeta */}
      <circle cx="76" cy="39" r="2.2" fill="#EC4899" />
      <circle cx="75.2" cy="38.2" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

/* ========================================================================= */
/* 2. BESTIAIS (Lobo Místico, Grifo Solar, Behemoth de Magma)                */
/* ========================================================================= */

// Grifo Real (Lendário) - Cabeça e Asas de Águia Dourada/Branca, Corpo de Leão Ocre
export function GriffinSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Asa Majestosa de Penas Douradas e Brancas Cel-Shaded */}
      <g stroke="#78350F" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M38 46 C24 16 10 8 4 18 C-2 30 14 44 26 52 Z" fill="#FEF08A" />
        <path d="M8 20 C18 14 30 24 34 38" stroke="#F59E0B" strokeWidth="2.2" fill="none" />
        <path d="M12 28 C22 24 32 34 36 44" stroke="#F59E0B" strokeWidth="2.2" fill="none" />
        <path d="M18 36 C26 34 34 42 38 50" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />

        {/* Corpo Felino de Leão em Âmbar e Ouro */}
        <path d="M22 60 C16 48 30 44 50 48 C62 50 68 62 66 74 C52 78 30 76 22 60 Z" fill="#F59E0B" />
        <path d="M26 54 C34 50 48 50 56 54 C50 64 36 64 26 54 Z" fill="#FDE68A" stroke="none" />

        {/* Cauda com Tufo Dourado */}
        <path d="M20 60 C12 60 8 70 4 78" stroke="#D97724" strokeWidth="2.5" fill="none" />
        <circle cx="4" cy="78" r="3.5" fill="#FEF08A" />

        {/* Patas Traseiras de Leão */}
        <path d="M26 68 L22 86" stroke="#D97724" strokeWidth="4" strokeLinecap="round" />
        <path d="M42 70 L40 86" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />

        {/* Peito e Cabeça de Águia Radiante */}
        <path d="M50 48 C56 34 66 26 80 26 C88 28 88 40 84 52 C74 58 58 58 50 48 Z" fill="#FFFFFF" />
        <path d="M60 30 C70 24 80 26 84 34 C76 40 66 40 60 30 Z" fill="#FEF08A" stroke="none" />

        {/* Bico Adunco de Ouro Solar */}
        <path d="M84 32 C92 32 98 38 96 46 C90 46 84 42 82 40 Z" fill="#FBBF24" stroke="#78350F" strokeWidth="1.6" />

        {/* Patas Dianteiras com Garras de Rapina Douradas */}
        <path d="M64 62 L66 84 L72 87" fill="none" stroke="#F59E0B" strokeWidth="3" />
        <path d="M74 60 L78 84 L84 87" fill="none" stroke="#FBBF24" strokeWidth="3" />
      </g>

      {/* Olho Nobre de Águia Anime com Íris Dourada */}
      <circle cx="76" cy="34" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
      <circle cx="76" cy="34" r="1.6" fill="#1C1917" />
      <circle cx="75" cy="33" r="1" fill="#FFFFFF" />
    </svg>
  );
}

// Lobo Cinzento / Fenrir Místico (Pelagem Prateada, Runas Ciano & Olhos de Safira)
export function WolfBeastSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <g stroke="#1E1B4B" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Cauda Espessa com Ponta Branca */}
        <path d="M16 56 C8 48 4 36 2 24 C10 32 18 42 22 52 Z" fill="#93C5FD" />
        <path d="M2 24 C6 28 10 32 10 36 Z" fill="#FFFFFF" stroke="none" />

        {/* Tronco Ágil e Pelagem Prateada Macia */}
        <path d="M20 54 C24 40 38 38 56 42 C66 46 72 58 66 70 C52 74 30 72 20 54 Z" fill="#E0E7FF" />
        {/* Cel-shading Azul Celeste no Dorso */}
        <path d="M24 46 C34 40 48 40 56 46 C52 56 36 56 24 46 Z" fill="#C7D2FE" stroke="none" />

        {/* Runas Arcanas Luminosas Ciano no Flanco */}
        <path d="M36 50 Q44 48 48 54 Q44 60 38 58" stroke="#38BDF8" strokeWidth="2" fill="none" />
        <circle cx="44" cy="54" r="1.5" fill="#38BDF8" stroke="none" />

        {/* Patas Traseiras Ágeis */}
        <path d="M26 66 L22 86" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 68 L38 86" stroke="#C7D2FE" strokeWidth="4" strokeLinecap="round" />

        {/* Juba Espessa no Peito com Pelos Estilizados de Anime */}
        <path d="M52 46 C58 38 66 36 74 38 L72 56 C62 62 54 58 52 46 Z" fill="#FFFFFF" />

        {/* Cabeça Fina de Lobo e Focinho */}
        <path d="M64 42 L84 46 L86 52 L72 58 Z" fill="#E0E7FF" />
        {/* Narizinho Preto de Anime */}
        <polygon points="86,47 88,49 85,51" fill="#0F172A" />

        {/* Orelhas Pontudas Empinadas */}
        <polygon points="66,38 70,22 74,36" fill="#93C5FD" stroke="#1E1B4B" strokeWidth="1.5" />
        <polygon points="68,36 71,25 73,35" fill="#F472B6" stroke="none" />

        {/* Patas Dianteiras Fortes */}
        <path d="M60 62 L62 86" stroke="#E0E7FF" strokeWidth="4" strokeLinecap="round" />
        <path d="M70 60 L74 86" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Olho Expressivo de Lobo Anime em Azul Safira */}
      <polygon points="70,42 76,44 72,48" fill="#0284C7" stroke="#0F172A" strokeWidth="0.8" />
      <circle cx="73" cy="44.5" r="1.5" fill="#38BDF8" />
      <circle cx="72.3" cy="43.8" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

// Behemoth da Tundra (Vulcânico / Cristais de Magma Laranja & Chifres de Rocha)
export function BehemothSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <g stroke="#431407" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Corpo Colossal Quadrúpede Terracota */}
        <path d="M12 56 C14 36 32 30 62 34 C76 40 82 58 76 72 C60 80 24 78 12 56 Z" fill="#EA580C" />
        {/* Placas de Cristal de Magma Laranja Radiante */}
        <polygon points="26,34 32,18 38,34" fill="#FB923C" />
        <polygon points="40,32 46,14 52,32" fill="#F97316" />
        <polygon points="54,34 60,20 66,34" fill="#FB923C" />
        <polygon points="32,22 36,20 34,26" fill="#FEF08A" stroke="none" />

        {/* Veios de Lava Dourada no Flanco */}
        <path d="M28 54 Q40 48 54 58" stroke="#FDE047" strokeWidth="2.5" fill="none" />
        <path d="M38 60 Q48 56 60 64" stroke="#FDE047" strokeWidth="2.2" fill="none" />

        {/* Patas Robustas como Pilares de Pedra Vulcânica */}
        <path d="M22 66 L20 88" stroke="#C2410C" strokeWidth="7" strokeLinecap="round" />
        <path d="M38 68 L36 88" stroke="#EA580C" strokeWidth="7" strokeLinecap="round" />
        <path d="M58 68 L56 88" stroke="#C2410C" strokeWidth="7" strokeLinecap="round" />
        <path d="M72 66 L74 88" stroke="#EA580C" strokeWidth="7" strokeLinecap="round" />

        {/* Cabeça Blindada e Focinho Bovino */}
        <path d="M68 44 C76 38 88 40 92 52 C90 62 80 66 72 62 Z" fill="#FB923C" />

        {/* Chifres Curvos de Rocha Vulcânica com Ponta Flamejante */}
        <path d="M76 42 C82 30 92 24 98 16 C94 28 86 36 80 44 Z" fill="#F59E0B" stroke="#431407" strokeWidth="1.8" />
        <polygon points="94,22 98,16 93,19" fill="#FEF08A" stroke="none" />
      </g>

      {/* Olho de Fogo Vivo com Brilho Solar */}
      <circle cx="80" cy="46" r="2.8" fill="#EF4444" stroke="#431407" strokeWidth="1" />
      <circle cx="80" cy="46" r="1.6" fill="#FDE047" />
      <circle cx="79.2" cy="45.2" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

// Urso Enraivecido (Pelagem Castanha com Armadura Rúnica Dourada)
export function RagingBearSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <g stroke="#3B190F" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Tronco Forte em Marrom Quente */}
        <path d="M14 56 C16 38 32 32 60 36 C74 42 78 60 72 74 C58 80 26 78 14 56 Z" fill="#9A3412" />
        <path d="M22 46 C32 40 48 40 56 46 C50 56 34 56 22 46 Z" fill="#C2410C" stroke="none" />

        {/* Peitoral de Latão com Runas de Batalha */}
        <path d="M44 44 C52 40 64 42 66 58 C58 64 48 62 44 44 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="55" cy="52" r="2" fill="#38BDF8" stroke="none" />

        {/* Patas Robustas de Urso */}
        <path d="M24 68 L20 88" stroke="#7C2D12" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M38 70 L36 88" stroke="#9A3412" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M56 70 L54 88" stroke="#7C2D12" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M70 68 L72 88" stroke="#9A3412" strokeWidth="6.5" strokeLinecap="round" />

        {/* Cabeça de Urso com Orelhas Redondas Fofas */}
        <circle cx="76" cy="46" r="12" fill="#B45309" />
        <circle cx="72" cy="36" r="3.5" fill="#7C2D12" />
        <circle cx="72" cy="36" r="2" fill="#FCD34D" stroke="none" />
        {/* Focinho Bege */}
        <ellipse cx="84" cy="48" rx="5" ry="4" fill="#FED7AA" />
        <circle cx="86" cy="47" r="1.5" fill="#3B190F" />
      </g>
      {/* Olho de Anime Valente */}
      <circle cx="78" cy="44" r="2.2" fill="#F59E0B" />
      <circle cx="77.3" cy="43.3" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

// Quimera Alada (Leão Dourado + Asas Carmesim + Serpente Esmeralda)
export function ChimeraSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Asas de Dragão Vermelho Vivo */}
      <g stroke="#7F1D1D" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M38 42 C24 18 10 12 4 22 C-2 34 16 46 28 54 Z" fill="#EF4444" />
        <path d="M6 24 C18 20 28 30 32 44" stroke="#FCA5A5" strokeWidth="2" fill="none" />
      </g>

      <g stroke="#3B190F" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Cauda de Serpente Esmeralda */}
        <path d="M18 58 C10 56 6 68 8 76 C10 82 18 80 18 74" stroke="#10B981" strokeWidth="3" fill="none" />
        <circle cx="18" cy="74" r="2.5" fill="#34D399" />

        {/* Corpo de Leão Ocre */}
        <path d="M22 58 C18 46 32 42 54 46 C66 48 70 62 66 74 C52 78 30 76 22 58 Z" fill="#F59E0B" />

        {/* Patas Fortes */}
        <path d="M28 68 L24 88" stroke="#D97724" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M42 70 L40 88" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M62 68 L64 88" stroke="#D97724" strokeWidth="4.5" strokeLinecap="round" />

        {/* Juba Dourada Majestosa */}
        <circle cx="68" cy="44" r="14" fill="#D97724" />
        <circle cx="70" cy="44" r="11" fill="#FBBF24" stroke="none" />
        <circle cx="74" cy="44" r="7" fill="#FDE68A" />
      </g>

      {/* Olho Feroz de Anime */}
      <circle cx="74" cy="42" r="2.2" fill="#EF4444" />
      <circle cx="73.3" cy="41.3" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

/* ========================================================================= */
/* 3. MORTOS-VIVOS (Necromancia Manhwa / Chamas Azuis, Titânio & Éter)       */
/* ========================================================================= */

// Arqueiro Esqueleto (Ossos Polidos Marfim, Túnica Noturna & Arco de Luz Ciano)
export function SkeletonArcherSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Arco de Pura Energia Espectral Ciano */}
      <path d="M72 16 C86 36 86 64 72 84" stroke="#38BDF8" strokeWidth="3.2" strokeLinecap="round" fill="none" className="animate-pulse" />
      <line x1="72" y1="16" x2="72" y2="84" stroke="#BAE6FD" strokeWidth="1.2" strokeDasharray="3 3" />
      {/* Flecha Espectral Pronta para Disparo */}
      <line x1="48" y1="50" x2="88" y2="50" stroke="#38BDF8" strokeWidth="2.5" />
      <polygon points="88,47 94,50 88,53" fill="#BAE6FD" />

      <g stroke="#0F172A" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Túnica Espectral Azul-Marinho / Prata */}
        <path d="M42 46 L34 76 L54 76 L52 46 Z" fill="#1E1B4B" />
        <path d="M42 46 L38 60 L50 60 L48 46 Z" fill="#4338CA" stroke="none" />

        {/* Costelas de Osso Marfim Claro */}
        <line x1="42" y1="52" x2="48" y2="52" stroke="#F8FAFC" strokeWidth="2.2" />
        <line x1="41" y1="56" x2="49" y2="56" stroke="#F8FAFC" strokeWidth="2.2" />

        {/* Braço Puxando a Corda */}
        <path d="M46 48 L62 48 L72 50" fill="none" stroke="#F8FAFC" strokeWidth="2.5" />
        <circle cx="62" cy="48" r="2" fill="#E2E8F0" />

        {/* Crânio de Anime Marfim Estilizado */}
        <path d="M44 24 C44 14 56 14 58 24 C60 30 58 36 54 38 L48 38 C44 36 42 30 44 24 Z" fill="#F8FAFC" />

        {/* Pernas de Osso com Botas Élficas */}
        <path d="M38 76 L36 88" stroke="#F8FAFC" strokeWidth="2.8" />
        <path d="M48 76 L48 88" stroke="#F8FAFC" strokeWidth="2.8" />
      </g>

      {/* Olhos de Fogo Espectral Ciano Vibrante com Brilho */}
      <circle cx="48" cy="26" r="2.4" fill="#38BDF8" />
      <circle cx="47.5" cy="25.5" r="1" fill="#FFFFFF" />
      <circle cx="54" cy="26" r="2.4" fill="#38BDF8" />
      <circle cx="53.5" cy="25.5" r="1" fill="#FFFFFF" />
    </svg>
  );
}

// Carniçal Rastejante (Garras Violeta Neon & Olhos Fúcsia)
export function CrawlingGhoulSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <g stroke="#1E1B4B" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Corpo Ágil Espectral */}
        <path d="M22 66 C28 50 44 48 62 52 C72 56 76 68 70 76 C56 80 32 80 22 66 Z" fill="#312E81" />
        <path d="M30 56 C40 52 52 52 60 56 C54 64 42 64 30 56 Z" fill="#6366F1" stroke="none" />

        {/* Braços com Garras Longas Brilhantes em Violeta Neon */}
        <path d="M58 58 L72 68 L86 76" fill="none" stroke="#818CF8" strokeWidth="3" />
        <polygon points="86,74 94,76 88,80" fill="#C084FC" />
        <polygon points="84,78 92,82 86,84" fill="#C084FC" />

        <path d="M32 64 L24 76 L16 86" fill="none" stroke="#4338CA" strokeWidth="3" />

        {/* Cabeça Espectral Predatória */}
        <circle cx="68" cy="50" r="10" fill="#4338CA" />
      </g>
      {/* Olho Neon Fúcsia com Reflexo Branco */}
      <circle cx="72" cy="48" r="2.5" fill="#F43F5E" />
      <circle cx="71.3" cy="47.3" r="1" fill="#FFFFFF" />
    </svg>
  );
}

// Cavaleiro da Morte (Estilo Shadow Monarch / Solo Leveling - Armadura Titânio & Espada de Chamas)
export function DeathKnightSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Capa Esvoaçante de Chamas Noturnas Púrpura/Azul */}
      <path d="M42 36 C24 40 10 54 4 78 C18 72 32 76 44 70 Z" fill="#4338CA" opacity="0.8" />
      <path d="M42 38 C28 44 18 56 12 76" stroke="#818CF8" strokeWidth="1.8" fill="none" />

      {/* Espada Colossal com Aura de Fogo Espectral */}
      <path d="M68 56 L88 20 L92 24 L72 60 Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.5" />
      <path d="M86 18 Q96 16 94 28" stroke="#38BDF8" strokeWidth="3" fill="none" className="animate-pulse" />

      <g stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Armadura de Placas de Titânio Elegante */}
        <path d="M38 34 L32 70 L58 70 L54 34 Z" fill="#1E293B" />
        <path d="M40 36 L36 50 L52 50 L48 36 Z" fill="#334155" stroke="none" />
        {/* Filigranas Prateadas e Safira */}
        <line x1="44" y1="38" x2="44" y2="66" stroke="#38BDF8" strokeWidth="1.6" />

        {/* Ombreiras Spikes Estilizadas */}
        <polygon points="34,36 24,28 36,32" fill="#475569" />
        <polygon points="56,36 66,28 54,32" fill="#475569" />

        {/* Pernas Blindadas */}
        <path d="M38 70 L36 88" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
        <path d="M52 70 L54 88" stroke="#334155" strokeWidth="5" strokeLinecap="round" />

        {/* Elmo Nobre com Fenda em V */}
        <path d="M40 22 C40 12 52 12 54 22 L52 34 L40 34 Z" fill="#0F172A" />
      </g>

      {/* Fenda dos Olhos com Chamas Ciano Resplandecentes */}
      <line x1="43" y1="24" x2="51" y2="24" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="47" cy="24" r="1.2" fill="#FFFFFF" />
    </svg>
  );
}

// Necromante das Sombras (Manto Índigo/Dourado, Cabelos Prateados & Orbe Flutuante)
export function NecromancerSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Orbe de Alma Ciano Levitação */}
      <circle cx="82" cy="28" r="5" fill="#38BDF8" className="animate-pulse" />
      <circle cx="82" cy="28" r="2.5" fill="#FFFFFF" />

      {/* Cajado com Caveira de Cristal */}
      <line x1="82" y1="24" x2="78" y2="86" stroke="#D97724" strokeWidth="2.5" />
      <circle cx="82" cy="36" r="3.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.2" />

      <g stroke="#0F172A" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Manto Imperial Índigo */}
        <path d="M34 38 L24 86 L62 86 L56 38 Z" fill="#1E1B4B" />
        <path d="M38 40 L30 84 L54 84 L48 40 Z" fill="#312E81" stroke="none" />

        {/* Colar com Gema de Rubi */}
        <polygon points="44,38 48,46 40,46" fill="#F59E0B" />
        <circle cx="44" cy="42" r="1.5" fill="#EF4444" stroke="none" />

        {/* Cabelos Prateados Estilizados de Anime */}
        <path d="M38 22 C34 14 52 10 54 20 C56 26 54 34 50 36 C44 36 38 30 38 22 Z" fill="#F8FAFC" />
        <polygon points="36,26 30,36 40,30" fill="#E2E8F0" />
      </g>

      {/* Olhos de Anime Violeta Noturno */}
      <circle cx="43" cy="24" r="2" fill="#C084FC" />
      <circle cx="42.5" cy="23.5" r="0.8" fill="#FFFFFF" />
      <circle cx="49" cy="24" r="2" fill="#C084FC" />
      <circle cx="48.5" cy="23.5" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

// Rei Lich Supremo (Coroa Dourada, Manto Carmesim & Fogo Gélido)
export function LichKingSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Cristais Flutuantes de Gelo Gélido */}
      <polygon points="20,30 24,20 28,30 24,40" fill="#38BDF8" opacity="0.8" />
      <polygon points="76,34 80,24 84,34 80,44" fill="#38BDF8" opacity="0.8" />

      <g stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Manto Real Carmesim e Ouro */}
        <path d="M32 36 L20 86 L66 86 L56 36 Z" fill="#991B1B" />
        <path d="M36 38 L28 84 L58 84 L50 38 Z" fill="#B91C1C" stroke="none" />
        {/* Borda de Arminho Branco */}
        <path d="M38 38 L38 84 L44 84 L44 38 Z" fill="#FFFFFF" stroke="none" />

        {/* Crânio Monárquico de Cristal Azul-Claro */}
        <circle cx="46" cy="26" r="10" fill="#E0F2FE" />

        {/* Coroa Real de Ouro com Joias */}
        <path d="M38 18 L42 8 L46 16 L50 8 L54 18 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="46" cy="12" r="1.5" fill="#38BDF8" stroke="none" />
      </g>

      {/* Olhos de Fogo Gélido com Brilho Celeste */}
      <circle cx="43" cy="26" r="2.5" fill="#0284C7" />
      <circle cx="43" cy="26" r="1.5" fill="#38BDF8" />
      <circle cx="42.3" cy="25.3" r="0.8" fill="#FFFFFF" />
      <circle cx="49" cy="26" r="2.5" fill="#0284C7" />
      <circle cx="49" cy="26" r="1.5" fill="#38BDF8" />
      <circle cx="48.3" cy="25.3" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

/* ========================================================================= */
/* 4. HUMANOIDES (Heróis de Anime - Prata Polida, Ouro Solar, Capas Vivas)    */
/* ========================================================================= */

// Recruta de Escudo Torre (Jovem Herói Guerreiro - Cabelos Arrepiados, Escudo Solar)
export function TowerShieldRecruitSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Capa Vermelha Vibrante */}
      <path d="M36 38 C26 44 20 60 18 80 C28 76 40 76 44 72 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />

      <g stroke="#0F172A" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Armadura de Prata Polida com Reflexos */}
        <path d="M38 36 L34 72 L54 72 L50 36 Z" fill="#E2E8F0" />
        <path d="M40 38 L36 54 L48 54 L46 38 Z" fill="#FFFFFF" stroke="none" />
        <line x1="44" y1="36" x2="44" y2="72" stroke="#F59E0B" strokeWidth="1.5" />

        {/* Pernas Blindadas */}
        <path d="M38 72 L36 88" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M48 72 L50 88" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />

        {/* Cabelo Anime Castanho/Dourado Estilizado */}
        <path d="M38 18 C38 8 54 8 54 18 C56 24 52 30 46 30 C40 30 38 24 38 18 Z" fill="#D97724" />
        <polygon points="36,18 32,10 42,14" fill="#F59E0B" />
        <polygon points="46,14 54,8 56,18" fill="#F59E0B" />
        <polygon points="40,20 44,12 48,20" fill="#FEF08A" stroke="none" />

        {/* Rosto de Anime */}
        <circle cx="46" cy="24" r="6.5" fill="#FFEDD5" />

        {/* Grande Escudo Torre Azul Celeste com Sol Dourado */}
        <path d="M52 30 L74 30 L78 78 L64 86 L50 78 Z" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2" />
        <path d="M54 32 L68 32 L68 82 L62 84 L52 76 Z" fill="#3B82F6" stroke="none" />
        {/* Emblema do Sol de Ouro no Escudo */}
        <circle cx="64" cy="52" r="6" fill="#F59E0B" />
        <circle cx="64" cy="52" r="3.5" fill="#FEF08A" stroke="none" />
      </g>

      {/* Olho Expressivo Confiante de Anime */}
      <circle cx="48" cy="23" r="1.6" fill="#0284C7" />
      <circle cx="47.5" cy="22.5" r="0.7" fill="#FFFFFF" />
    </svg>
  );
}

// Caçadora Élfica (Cabelos Dourados, Capa Esmeralda & Arco Luminoso)
export function ElvenHuntressSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Arco Dourado com Corda Luminosa */}
      <path d="M70 14 C84 34 84 66 70 86" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <line x1="70" y1="14" x2="70" y2="86" stroke="#67E8F9" strokeWidth="1" strokeDasharray="3 3" />

      {/* Capa Esmeralda Viva */}
      <path d="M36 34 C24 40 18 56 16 78 C26 74 36 74 42 70 Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" />

      <g stroke="#0F172A" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Corselete Élfico em Couro e Ouro */}
        <path d="M38 34 L34 68 L52 68 L48 34 Z" fill="#059669" />
        <path d="M40 36 L36 50 L48 50 L46 36 Z" fill="#34D399" stroke="none" />

        {/* Pernas com Botas Verdes */}
        <path d="M38 68 L36 88" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
        <path d="M48 68 L48 88" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />

        {/* Longos Cabelos Dourados de Anime com Orelhas Pontudas */}
        <path d="M36 22 C34 10 52 8 54 18 C56 30 52 44 48 46 C42 46 36 32 36 22 Z" fill="#FEF08A" />
        <polygon points="32,24 24,18 36,22" fill="#FFEDD5" stroke="#0F172A" strokeWidth="1.2" /> {/* Orelha élfica */}

        {/* Rosto Delicado de Anime */}
        <circle cx="45" cy="22" r="6" fill="#FFEDD5" />
      </g>

      {/* Olho de Anime Esmeralda Límpido */}
      <ellipse cx="46" cy="21.5" rx="1.8" ry="2.2" fill="#059669" />
      <circle cx="45.5" cy="20.8" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

// Lanceiro Real (Armadura Prateada & Capa Carmesim Imperial)
export function RoyalSpearmanSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Lança Prateada Longa com Estandarte de Ouro */}
      <line x1="42" y1="88" x2="84" y2="8" stroke="#E2E8F0" strokeWidth="2.5" />
      <polygon points="84,8 90,4 88,14" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.2" />
      <polygon points="76,18 64,24 74,28" fill="#F59E0B" />

      {/* Capa Vermelha Imperial */}
      <path d="M36 36 C24 44 18 60 16 80 C26 76 38 76 42 70 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />

      <g stroke="#0F172A" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Armadura de Prata Polida */}
        <path d="M38 34 L34 72 L54 72 L50 34 Z" fill="#E2E8F0" />
        <path d="M40 36 L36 50 L48 50 L46 36 Z" fill="#FFFFFF" stroke="none" />

        {/* Elmo Alado com Pluma Azul */}
        <circle cx="45" cy="22" r="7" fill="#CBD5E1" />
        <polygon points="42,14 46,4 50,14" fill="#3B82F6" />
      </g>
      {/* Olho Confiante */}
      <circle cx="46" cy="22" r="1.5" fill="#1E3A8A" />
      <circle cx="45.5" cy="21.5" r="0.6" fill="#FFFFFF" />
    </svg>
  );
}

// Maga Templária (Cabelos Celestes, Túnica Nobre & Livro de Magia Flutuante)
export function TemplarMageSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Livro de Magia Arcana Flutuante Aberto */}
      <g stroke="#F59E0B" strokeWidth="1.2" className="animate-bounce">
        <path d="M68 50 L78 44 L88 50 L78 54 Z" fill="#3B82F6" />
        <path d="M68 50 L78 54 L68 58 Z" fill="#FFFFFF" />
        <path d="M88 50 L78 54 L88 58 Z" fill="#FFFFFF" />
        <circle cx="78" cy="48" r="2" fill="#FEF08A" stroke="none" />
      </g>

      <g stroke="#0F172A" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Túnica Mágica em Azul Royal e Branco */}
        <path d="M36 34 L26 86 L58 86 L50 34 Z" fill="#1D4ED8" />
        <path d="M40 36 L34 84 L50 84 L46 36 Z" fill="#FFFFFF" stroke="none" />
        <line x1="43" y1="36" x2="43" y2="84" stroke="#F59E0B" strokeWidth="1.6" />

        {/* Cabelos Celestes / Lilás Estilizados */}
        <path d="M36 22 C34 10 52 10 54 20 C56 30 52 42 46 44 C40 44 36 30 36 22 Z" fill="#60A5FA" />

        {/* Rosto Doce de Anime */}
        <circle cx="45" cy="22" r="6" fill="#FFEDD5" />
      </g>
      {/* Olhos de Anime Safira Brilhantes */}
      <ellipse cx="46" cy="21.5" rx="1.8" ry="2.2" fill="#2563EB" />
      <circle cx="45.5" cy="20.8" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

// Lorde Comandante Supremo (Paladino Lendário - Armadura Dourada Completa & Espada de Luz)
export function LordCommanderSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Espada Sagrada Radiante de Luz Branca/Dourada */}
      <line x1="56" y1="56" x2="86" y2="18" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" className="animate-pulse" />
      <line x1="56" y1="56" x2="86" y2="18" stroke="#F59E0B" strokeWidth="1.5" />
      <circle cx="56" cy="56" r="3" fill="#F59E0B" />

      {/* Capa Azul Celeste Celestial */}
      <path d="M36 34 C20 40 12 56 8 80 C24 74 38 74 44 68 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />

      <g stroke="#78350F" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Armadura de Ouro Solar Polida */}
        <path d="M36 32 L30 72 L56 72 L52 32 Z" fill="#F59E0B" />
        <path d="M38 34 L34 50 L48 50 L46 34 Z" fill="#FEF08A" stroke="none" />
        <polygon points="43,40 48,46 38,46" fill="#EF4444" stroke="none" />

        {/* Asas Douradas nas Ombreiras */}
        <polygon points="32,34 22,26 34,30" fill="#FBBF24" />
        <polygon points="54,34 64,26 52,30" fill="#FBBF24" />

        {/* Pernas de Ouro com Botas Altas */}
        <path d="M36 72 L34 88" stroke="#D97724" strokeWidth="5" strokeLinecap="round" />
        <path d="M50 72 L52 88" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />

        {/* Coroa/Elmo Dourado Real com Pluma Azul */}
        <circle cx="44" cy="20" r="7.5" fill="#FEF08A" stroke="#78350F" strokeWidth="1.5" />
        <polygon points="40,12 44,4 48,12" fill="#3B82F6" />
      </g>
      {/* Olho Heroico de Anime */}
      <circle cx="45" cy="20" r="1.8" fill="#0284C7" />
      <circle cx="44.4" cy="19.4" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

/* ========================================================================= */
/* 5. MECÂNICOS (Magitek Fantasia / Latão Dourado, Madeira Nobre & Mana Azul) */
/* ========================================================================= */

// Catapulta a Vapor Magitek (Madeira Nobre, Engrenagens Douradas & Orbe de Mana)
export function SteamCatapultSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Esfera de Cristal de Mana Azul Cintilante no Balde */}
      <circle cx="28" cy="30" r="6.5" fill="#38BDF8" className="animate-pulse" />
      <circle cx="28" cy="30" r="3.5" fill="#FFFFFF" />

      <g stroke="#451A03" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Chassi de Madeira de Carvalho Nobre Dourada */}
        <polygon points="18,66 78,66 74,54 22,54" fill="#B45309" />
        <polygon points="22,56 70,56 68,60 24,60" fill="#FDE68A" stroke="none" />

        {/* Braço de Alavanca de Latão Dourado */}
        <line x1="28" y1="36" x2="64" y2="58" stroke="#F59E0B" strokeWidth="4.5" />
        <circle cx="28" cy="36" r="4.5" fill="#FBBF24" />

        {/* Cilindro Reator de Mana Magitek */}
        <rect x="42" y="44" width="12" height="10" rx="3" fill="#0284C7" stroke="#F59E0B" strokeWidth="1.5" />
        <line x1="48" y1="44" x2="48" y2="54" stroke="#BAE6FD" strokeWidth="1.5" />

        {/* Rodas com Aros de Latão e Raios Dourados */}
        <circle cx="28" cy="74" r="10" fill="#F59E0B" />
        <circle cx="28" cy="74" r="7" fill="#78350F" />
        <circle cx="28" cy="74" r="3" fill="#FEF08A" stroke="none" />

        <circle cx="68" cy="74" r="10" fill="#F59E0B" />
        <circle cx="68" cy="74" r="7" fill="#78350F" />
        <circle cx="68" cy="74" r="3" fill="#FEF08A" stroke="none" />
      </g>
    </svg>
  );
}

// Drone de Vapor (Robô Esférico de Fantasia - Latão & Olho Óptico Safira)
export function SteamDroneSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Hélices Douradas Giratórias */}
      <line x1="24" y1="24" x2="76" y2="24" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="24" x2="50" y2="34" stroke="#78350F" strokeWidth="2" />

      <g stroke="#78350F" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Corpo Esférico de Latão Dourado Polido */}
        <circle cx="50" cy="52" r="18" fill="#FBBF24" />
        <circle cx="50" cy="52" r="14" fill="#FEF08A" stroke="none" />

        {/* Asas Estabilizadoras Laterais */}
        <polygon points="32,50 18,54 32,58" fill="#F59E0B" />
        <polygon points="68,50 82,54 68,58" fill="#F59E0B" />
      </g>

      {/* Olho Óptico de Lente Safira Grande de Anime */}
      <circle cx="52" cy="52" r="7.5" fill="#0284C7" stroke="#0F172A" strokeWidth="1.5" />
      <circle cx="52" cy="52" r="4.5" fill="#38BDF8" />
      <circle cx="50.5" cy="50.5" r="1.8" fill="#FFFFFF" />
    </svg>
  );
}

// Sentinela Mecânica (Cavaleiro Mecânico de Relógio - Ouro, Vidro & Engrenagens)
export function ClockworkSentinelSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <g stroke="#78350F" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Tronco de Latão com Visor de Vidro */}
        <rect x="36" y="36" width="26" height="34" rx="6" fill="#F59E0B" />
        {/* Reator de Relógio Interno */}
        <circle cx="49" cy="53" r="8" fill="#0284C7" stroke="#FEF08A" strokeWidth="1.5" />
        <line x1="49" y1="53" x2="49" y2="48" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Braço com Escudo Circular de Engrenagem */}
        <circle cx="26" cy="54" r="10" fill="#FBBF24" />
        <circle cx="26" cy="54" r="4" fill="#38BDF8" stroke="none" />

        {/* Pernas de Pistão Cromadas */}
        <path d="M42 70 L40 88" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M56 70 L58 88" stroke="#E2E8F0" strokeWidth="4.5" strokeLinecap="round" />

        {/* Cabeça de Autômato Nobre */}
        <rect x="42" y="20" width="14" height="16" rx="4" fill="#FEF08A" />
      </g>
      {/* Olho de Safira Ciano */}
      <circle cx="49" cy="28" r="2.5" fill="#38BDF8" />
      <circle cx="48.3" cy="27.3" r="1" fill="#FFFFFF" />
    </svg>
  );
}

// Colosso de Latão (Golem Magitek Gigante com Coração de Cristal Azul)
export function BrassColossusSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Feixes de Energia Azul do Peito */}
      <circle cx="50" cy="48" r="8" fill="#38BDF8" className="animate-pulse" />
      <circle cx="50" cy="48" r="4" fill="#FFFFFF" />

      <g stroke="#78350F" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        {/* Peitoral Maciço de Latão Dourado */}
        <polygon points="28,34 72,34 66,66 34,66" fill="#F59E0B" />
        <polygon points="32,36 68,36 64,52 36,52" fill="#FEF08A" stroke="none" />

        {/* Ombreiras Gigantes com Runas */}
        <circle cx="24" cy="38" r="11" fill="#D97724" />
        <circle cx="76" cy="38" r="11" fill="#D97724" />

        {/* Punhos Magitek Enormes */}
        <rect x="14" y="58" width="14" height="16" rx="4" fill="#FBBF24" />
        <rect x="72" y="58" width="14" height="16" rx="4" fill="#FBBF24" />

        {/* Pernas Maciças de Titânio e Ouro */}
        <path d="M36 66 L34 88" stroke="#B45309" strokeWidth="8" strokeLinecap="round" />
        <path d="M64 66 L66 88" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />

        {/* Cabeça Blindada */}
        <polygon points="42,24 58,24 54,34 46,34" fill="#FDE68A" />
      </g>
      {/* Visor de Olho Ciano Elétrico */}
      <line x1="45" y1="28" x2="55" y2="28" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Leviatã de Guerra (Dreadnought Flutuante Magitek)
export function WarLeviathanSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Turbinas de Mana Azul Ciano nas Laterais */}
      <ellipse cx="20" cy="62" rx="6" ry="12" fill="#38BDF8" opacity="0.8" className="animate-pulse" />

      <g stroke="#78350F" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Casco Dourado de Navio de Guerra Magitek */}
        <polygon points="16,54 84,48 94,62 20,68" fill="#F59E0B" />
        <polygon points="20,56 80,52 86,60 22,62" fill="#FEF08A" stroke="none" />

        {/* Torre de Comando de Latão e Cristal */}
        <rect x="40" y="34" width="24" height="18" rx="4" fill="#0284C7" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="52" cy="43" r="5" fill="#38BDF8" />
        <circle cx="50.5" cy="41.5" r="1.5" fill="#FFFFFF" />

        {/* Canhões de Projétil de Éter */}
        <line x1="74" y1="48" x2="92" y2="44" stroke="#FBBF24" strokeWidth="3" />
        <line x1="70" y1="54" x2="88" y2="52" stroke="#FBBF24" strokeWidth="3" />
      </g>
    </svg>
  );
}

/* ========================================================================= */
/* 6. ESPÍRITOS (Estilo Ethereal / Ciano, Violeta, Luz Estelar & Fadas)        */
/* ========================================================================= */

// Aparição Espectral / Wraith (Véu Translúcido Ciano e Olhos Estelares)
export function SpiritWraithSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Aura de Centelhas Estelares */}
      <circle cx="50" cy="44" r="28" fill="#38BDF8" opacity="0.2" className="animate-pulse" />

      <g stroke="#0369A1" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Véu Fluido em Degradê Ciano e Branco */}
        <path d="M50 20 C34 20 28 36 28 56 C28 76 38 88 50 86 C62 88 72 76 72 56 C72 36 66 20 50 20 Z" fill="#BAE6FD" opacity="0.85" />
        <path d="M50 24 C40 24 36 34 36 50 C36 68 44 78 50 78 C56 78 64 68 64 50 C64 34 60 24 50 24 Z" fill="#FFFFFF" opacity="0.9" stroke="none" />

        {/* Braços Translúcidos Flutuantes */}
        <path d="M34 48 C20 44 14 36 12 28" fill="none" stroke="#7DD3FC" strokeWidth="2.5" />
        <path d="M66 48 C80 44 86 36 88 28" fill="none" stroke="#7DD3FC" strokeWidth="2.5" />
      </g>

      {/* Olhos de Estrela Brilhante de Anime */}
      <circle cx="44" cy="40" r="2.5" fill="#0284C7" />
      <circle cx="43.5" cy="39.5" r="1" fill="#FFFFFF" />
      <circle cx="56" cy="40" r="2.5" fill="#0284C7" />
      <circle cx="55.5" cy="39.5" r="1" fill="#FFFFFF" />
    </svg>
  );
}

// Banshee (Donzela Celestial Esvoaçante de Anime com Asas de Fada)
export function BansheeSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Asas de Fada Luminosas de Éter */}
      <path d="M46 36 C30 16 14 20 20 34 C26 44 40 44 46 36 Z" fill="#C084FC" opacity="0.5" />
      <path d="M54 36 C70 16 86 20 80 34 C74 44 60 44 54 36 Z" fill="#C084FC" opacity="0.5" />

      <g stroke="#4C1D95" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Vestido Celestial Fluido em Ciano e Lavanda */}
        <path d="M44 38 L30 86 C40 82 60 82 70 86 L56 38 Z" fill="#E9D5FF" />
        <path d="M46 40 L38 82 C46 80 54 80 62 82 L54 40 Z" fill="#FFFFFF" stroke="none" />

        {/* Cabelos Longos Flutuantes em Ciano Celeste */}
        <path d="M42 22 C32 10 58 10 58 20 C64 34 66 54 62 60 C58 60 52 40 50 28 Z" fill="#7DD3FC" />

        {/* Rosto Delicado */}
        <circle cx="49" cy="24" r="6" fill="#FDF4FF" />
      </g>
      {/* Olhos de Anime com Lágrimas de Mana Rosa/Ciano */}
      <circle cx="47" cy="24" r="1.8" fill="#A855F7" />
      <circle cx="46.5" cy="23.5" r="0.8" fill="#FFFFFF" />
      <circle cx="53" cy="24" r="1.8" fill="#A855F7" />
      <circle cx="52.5" cy="23.5" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

// Fogo-Fátuo (Fada Espiritual Fofa de Anime - Ciano Radiante com Asas)
export function WillOTheWispSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Halo de Luz Mágica Dourada */}
      <circle cx="50" cy="50" r="26" fill="#FEF08A" opacity="0.3" className="animate-pulse" />

      {/* Asinhas de Fada de Luz */}
      <ellipse cx="34" cy="42" rx="10" ry="5" fill="#BAE6FD" opacity="0.7" transform="rotate(-25 34 42)" />
      <ellipse cx="66" cy="42" rx="10" ry="5" fill="#BAE6FD" opacity="0.7" transform="rotate(25 66 42)" />

      {/* Corpo Esférico Luminoso em Ciano e Branco */}
      <circle cx="50" cy="50" r="16" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="12" fill="#FFFFFF" />

      {/* Olhinhos Felizes Expressivos de Anime (Estilo Mascote) */}
      <circle cx="44" cy="49" r="2.2" fill="#0369A1" />
      <circle cx="43.5" cy="48" r="0.9" fill="#FFFFFF" />
      <circle cx="56" cy="49" r="2.2" fill="#0369A1" />
      <circle cx="55.5" cy="48" r="0.9" fill="#FFFFFF" />
      {/* Bochechas Rosadas */}
      <circle cx="42" cy="53" r="1.5" fill="#F472B6" opacity="0.8" />
      <circle cx="58" cy="53" r="1.5" fill="#F472B6" opacity="0.8" />
    </svg>
  );
}

// Poltergeist (Brincalhão Mágico com Cristais e Lâminas Levitando)
export function PoltergeistSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Espadas e Cristais Levitando em Órbita */}
      <polygon points="18,30 22,22 26,30 22,40" fill="#EC4899" className="animate-bounce" />
      <polygon points="74,26 82,20 86,28 78,34" fill="#38BDF8" className="animate-pulse" />

      <g stroke="#3B0764" strokeWidth="1.6">
        <circle cx="50" cy="50" r="18" fill="#C084FC" />
        <circle cx="50" cy="50" r="13" fill="#F3E8FF" />
      </g>
      {/* Olhos Brincalhões de Anime */}
      <path d="M42 48 Q46 44 50 48" stroke="#7E22CE" strokeWidth="2" fill="none" />
      <path d="M52 48 Q56 44 60 48" stroke="#7E22CE" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Avatar Astral (Nebulosa Cósmica Estelar & Olhos de Supernova)
export function AstralAvatarSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <circle cx="50" cy="48" r="28" fill="#A855F7" opacity="0.35" className="animate-pulse" />
      <g stroke="#3B0764" strokeWidth="1.8">
        <path d="M50 18 C36 18 28 32 28 54 C28 76 38 88 50 86 C62 88 72 76 72 54 C72 32 64 18 50 18 Z" fill="#6B21A8" />
        <circle cx="44" cy="52" r="2" fill="#FDE047" stroke="none" />
        <circle cx="56" cy="62" r="2" fill="#38BDF8" stroke="none" />
        <circle cx="48" cy="70" r="1.5" fill="#FFFFFF" stroke="none" />
      </g>
      {/* Olhos de Supernova Dourada */}
      <circle cx="44" cy="38" r="3" fill="#FDE047" />
      <circle cx="44" cy="38" r="1.5" fill="#FFFFFF" />
      <circle cx="56" cy="38" r="3" fill="#FDE047" />
      <circle cx="56" cy="38" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

/* ========================================================================= */
/* 7. MITOLÓGICOS (Dragão de Platina, Fênix Solar, Titã Mítico & Deuses)      */
/* ========================================================================= */

// Dragão de Platina (Lendário - Escamas Brancas/Prateadas, Asas Celestes & Safiras)
export function PlatinumDragonSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Grande Asa de Dragão com Membrana Azul Celeste */}
      <g stroke="#1E3A8A" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <path d="M42 42 C24 12 8 6 2 16 C-4 28 14 46 28 56 Z" fill="#38BDF8" opacity="0.85" />
        <path d="M4 18 C16 12 30 22 36 36" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
        <path d="M8 26 C20 22 32 32 38 42" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />

        {/* Corpo Serpentino de Escamas Prateadas e Brancas */}
        <path d="M22 62 C16 48 32 44 54 48 C66 50 72 64 68 76 C52 82 28 80 22 62 Z" fill="#F8FAFC" />
        <path d="M26 56 C34 50 48 50 56 56 C50 66 36 66 26 56 Z" fill="#E2E8F0" stroke="none" />

        {/* Cristas e Espinhos de Safira Azul no Dorso */}
        <polygon points="28,46 32,36 36,46" fill="#0284C7" />
        <polygon points="40,46 44,34 48,46" fill="#38BDF8" />
        <polygon points="52,48 56,38 60,48" fill="#0284C7" />

        {/* Patas Dracônicas Fortes com Garras de Platina */}
        <path d="M28 72 L24 88" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M44 74 L42 88" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M64 72 L66 88" stroke="#E2E8F0" strokeWidth="4.5" strokeLinecap="round" />

        {/* Cabeça Nobre de Dragão com Chifres de Platina */}
        <path d="M58 46 C66 34 78 30 90 32 C96 40 92 52 84 56 C74 58 64 56 58 46 Z" fill="#FFFFFF" />
        <path d="M78 32 C86 20 96 16 98 8 C94 18 86 26 80 34 Z" fill="#38BDF8" stroke="#1E3A8A" strokeWidth="1.5" />
      </g>

      {/* Olho Dourado de Dragão de Anime com Pupila Vertical */}
      <ellipse cx="80" cy="38" rx="3" ry="3.5" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
      <ellipse cx="80" cy="38" rx="1.2" ry="2.8" fill="#0F172A" />
      <circle cx="79" cy="36.5" r="1" fill="#FFFFFF" />
    </svg>
  );
}

// Fênix Solar (Pássaro Sagrado - Ouro Solar, Vermelhão, Magenta & Cauda de Fogo)
export function PhoenixSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Halo de Fogo Radiante */}
      <circle cx="50" cy="42" r="26" fill="#F59E0B" opacity="0.3" className="animate-pulse" />

      {/* Asas Abertas em Camadas de Fogo Cel-Shaded */}
      <g stroke="#78350F" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M40 44 C22 18 8 10 2 20 C-4 32 16 48 30 56 Z" fill="#F59E0B" />
        <path d="M8 22 C20 18 32 30 36 44" stroke="#FEF08A" strokeWidth="2.5" fill="none" />
        <path d="M14 30 C24 26 34 38 38 48" stroke="#EF4444" strokeWidth="2.5" fill="none" />

        {/* Fitas Longas da Cauda de Fogo */}
        <path d="M22 62 C12 66 6 78 4 88" stroke="#EF4444" strokeWidth="3" fill="none" />
        <path d="M26 64 C20 72 16 82 14 88" stroke="#F59E0B" strokeWidth="3" fill="none" />
        <path d="M30 66 C28 76 26 84 24 88" stroke="#FEF08A" strokeWidth="2.5" fill="none" />

        {/* Corpo Gracioso em Ouro Solar e Vermelhão */}
        <path d="M28 58 C34 46 48 42 64 46 C74 52 74 64 68 74 C54 78 36 74 28 58 Z" fill="#EF4444" />
        <path d="M32 52 C40 46 52 46 60 52 C54 62 42 62 32 52 Z" fill="#FBBF24" stroke="none" />

        {/* Peito e Cabeça com Crista Flamejante */}
        <path d="M60 46 C66 34 76 28 86 32 C92 38 90 48 84 54 C76 56 66 54 60 46 Z" fill="#FBBF24" />
        <path d="M78 30 C86 18 94 14 96 6 C92 16 84 24 78 32 Z" fill="#EF4444" />

        {/* Bico Fino de Ouro */}
        <polygon points="88,38 98,42 88,46" fill="#F59E0B" />
      </g>
      {/* Olho Solar de Anime */}
      <circle cx="80" cy="38" r="2.5" fill="#EF4444" />
      <circle cx="80" cy="38" r="1.5" fill="#FEF08A" />
      <circle cx="79.2" cy="37.2" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

// Titã Mítico (Deus Celestial - Halo Solar, Armadura de Ouro Estelar & Espada Divina)
export function MythicTitanSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Halo Solar Flutuante de Ouro Divino */}
      <circle cx="46" cy="18" r="16" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 3" className="animate-spin" style={{ animationDuration: "12s" }} />

      <g stroke="#78350F" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Armadura de Ouro Estelar */}
        <path d="M36 34 L28 72 L60 72 L54 34 Z" fill="#F59E0B" />
        <path d="M38 36 L34 52 L50 52 L46 36 Z" fill="#FEF08A" stroke="none" />

        {/* Espada Sagrada de Luz Pura */}
        <line x1="56" y1="56" x2="88" y2="16" stroke="#FFFFFF" strokeWidth="4" />
        <line x1="56" y1="56" x2="88" y2="16" stroke="#FBBF24" strokeWidth="2" />

        {/* Cabelos Brancos Esvoaçantes de Divindade Anime */}
        <path d="M36 20 C34 8 56 8 58 18 C62 30 60 48 54 52 C48 52 42 34 36 20 Z" fill="#FFFFFF" />

        {/* Rosto Sereno de Divindade */}
        <circle cx="47" cy="20" r="7" fill="#FFEDD5" />
      </g>
      {/* Olho Dourado Resplandecente */}
      <circle cx="48" cy="19" r="2" fill="#F59E0B" />
      <circle cx="47.3" cy="18.3" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

// Minotauro Campeão (Guerreiro Bovino Heróico - Armadura de Bronze & Machado Duplo)
export function MinotaurSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Machado Duplo com Lâmina de Ouro */}
      <line x1="62" y1="74" x2="82" y2="18" stroke="#78350F" strokeWidth="3" />
      <path d="M78 20 C88 12 94 24 86 32 C80 34 76 28 78 20 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
      <path d="M74 22 C64 14 58 26 66 34 C72 36 76 30 74 22 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />

      <g stroke="#3B190F" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Tronco Musculoso com Peitoral de Bronze */}
        <path d="M30 40 L26 76 L62 76 L56 40 Z" fill="#9A3412" />
        <rect x="36" y="44" width="18" height="16" rx="4" fill="#F59E0B" />

        {/* Pernas Fortes */}
        <path d="M32 76 L30 88" stroke="#7C2D12" strokeWidth="6" strokeLinecap="round" />
        <path d="M54 76 L56 88" stroke="#9A3412" strokeWidth="6" strokeLinecap="round" />

        {/* Cabeça com Chifres Curvos Majestosos */}
        <circle cx="44" cy="28" r="11" fill="#7C2D12" />
        <path d="M38 24 C28 16 20 18 16 12 C24 10 32 16 38 20 Z" fill="#FBBF24" />
        <path d="M50 24 C60 16 68 18 72 12 C64 10 56 16 50 20 Z" fill="#FBBF24" />
      </g>
      {/* Olho Decidido de Anime */}
      <circle cx="46" cy="26" r="2.2" fill="#EF4444" />
      <circle cx="45.3" cy="25.3" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

// Hidra das Profundezas (Dragão Serpentino de 3 Cabeças - Turquesa & Ametista)
export function HydraSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      <g stroke="#0F2B2B" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Corpo de Serpente Marinha Turquesa */}
        <path d="M18 68 C24 54 40 52 58 56 C68 60 72 74 66 82 C52 86 28 84 18 68 Z" fill="#0EA5E9" />

        {/* 3 Pescoços Longos e Elegantes com Cabeças */}
        {/* Cabeça 1 (Esquerda) */}
        <path d="M32 58 Q24 38 34 26" stroke="#0284C7" strokeWidth="4" fill="none" />
        <circle cx="36" cy="24" r="6" fill="#38BDF8" />

        {/* Cabeça 2 (Centro) */}
        <path d="M46 56 Q46 32 52 18" stroke="#0EA5E9" strokeWidth="4.5" fill="none" />
        <circle cx="54" cy="16" r="6.5" fill="#7DD3FC" />

        {/* Cabeça 3 (Direita) */}
        <path d="M58 58 Q68 40 76 28" stroke="#0284C7" strokeWidth="4" fill="none" />
        <circle cx="78" cy="26" r="6" fill="#38BDF8" />
      </g>

      {/* Olhos Rubi Brilhantes nas 3 Cabeças */}
      <circle cx="36" cy="23" r="1.8" fill="#EF4444" />
      <circle cx="35.5" cy="22.5" r="0.7" fill="#FFFFFF" />
      <circle cx="54" cy="15" r="1.8" fill="#EF4444" />
      <circle cx="53.5" cy="14.5" r="0.7" fill="#FFFFFF" />
      <circle cx="78" cy="25" r="1.8" fill="#EF4444" />
      <circle cx="77.5" cy="24.5" r="0.7" fill="#FFFFFF" />
    </svg>
  );
}

// Sátiro Andarilho (Ranger Mágico da Floresta - Flauta Dourada & Chifres Espirais)
export function SatyrSVG({ isPlayer = true }: { isPlayer?: boolean }) {
  return (
    <svg {...svgProps(isPlayer)}>
      {/* Notas Musicais Mágicas Levitando */}
      <circle cx="74" cy="24" r="2.5" fill="#34D399" className="animate-bounce" />
      <circle cx="84" cy="30" r="2" fill="#FBBF24" className="animate-pulse" />

      {/* Flauta de Pã Dourada */}
      <rect x="52" y="30" width="16" height="8" rx="2" fill="#F59E0B" stroke="#78350F" strokeWidth="1.2" />

      <g stroke="#14532D" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {/* Túnica Élfica Esmeralda */}
        <path d="M38 36 L30 74 L56 74 L50 36 Z" fill="#10B981" />
        <path d="M40 38 L34 52 L48 52 L46 38 Z" fill="#34D399" stroke="none" />

        {/* Pernas de Bode com Pelagem Castanha */}
        <path d="M36 74 L32 88" stroke="#9A3412" strokeWidth="5" strokeLinecap="round" />
        <path d="M50 74 L52 88" stroke="#9A3412" strokeWidth="5" strokeLinecap="round" />

        {/* Cabeça de Jovem Anime com Chifres Espirais */}
        <circle cx="45" cy="22" r="6.5" fill="#FFEDD5" />
        <path d="M38 18 C30 14 26 20 28 24" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
        <path d="M52 18 C60 14 64 20 62 24" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
      </g>
      {/* Olho Alegre de Anime */}
      <circle cx="46" cy="21" r="1.8" fill="#059669" />
      <circle cx="45.5" cy="20.5" r="0.7" fill="#FFFFFF" />
    </svg>
  );
}

/* ========================================================================= */
/* 8. FEITIÇOS (VFX Arcanos Anime - Círculos Rúnicos, Estrelas & Feixes)      */
/* ========================================================================= */

// Meteoro de Fogo Flamejante
export function SpellFireMeteorSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
      <circle cx="50" cy="50" r="32" fill="#EF4444" opacity="0.3" className="animate-pulse" />
      <g stroke="#78350F" strokeWidth="1.8">
        <circle cx="50" cy="50" r="22" fill="#F97316" />
        <circle cx="50" cy="50" r="15" fill="#FBBF24" />
        <circle cx="50" cy="50" r="8" fill="#FFFFFF" stroke="none" />
      </g>
      {/* Labaredas em Órbita */}
      <polygon points="50,14 55,26 45,26" fill="#FEF08A" />
      <polygon points="76,34 66,40 70,48" fill="#EF4444" />
      <polygon points="34,70 44,66 40,58" fill="#F59E0B" />
    </svg>
  );
}

// Rosa de Gelo Glacial
export function SpellFrostIceSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
      <circle cx="50" cy="50" r="32" fill="#38BDF8" opacity="0.3" className="animate-pulse" />
      <g stroke="#0369A1" strokeWidth="1.8" fill="#E0F2FE">
        <polygon points="50,16 60,38 78,50 60,62 50,84 40,62 22,50 40,38" />
        <polygon points="50,26 57,43 72,50 57,57 50,74 43,57 28,50 43,43" fill="#38BDF8" />
        <circle cx="50" cy="50" r="6" fill="#FFFFFF" stroke="none" />
      </g>
    </svg>
  );
}

// Relâmpago Tempestade
export function SpellLightningSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
      <circle cx="50" cy="50" r="30" fill="#FEF08A" opacity="0.25" className="animate-pulse" />
      <polygon points="54,10 32,46 52,46 44,90 72,42 52,42" fill="#FDE047" stroke="#78350F" strokeWidth="2" />
      <polygon points="52,16 38,44 50,44 46,80 66,44 52,44" fill="#FFFFFF" stroke="none" />
    </svg>
  );
}

// Égide Sagrada / Proteção Divina
export function SpellHolyAegisSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
      <circle cx="50" cy="50" r="32" fill="#FBBF24" opacity="0.3" className="animate-pulse" />
      <path d="M50 20 L76 30 L72 68 L50 84 L28 68 L24 30 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
      <path d="M50 24 L72 32 L68 64 L50 78 L32 64 L28 32 Z" fill="#FEF08A" stroke="none" />
      <polygon points="50,34 54,46 66,50 54,54 50,66 46,54 34,50 46,46" fill="#38BDF8" stroke="none" />
    </svg>
  );
}

// Maldição de Sangue / Fúria Carmesim
export function SpellBloodCurseSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
      <circle cx="50" cy="50" r="30" fill="#E11D48" opacity="0.3" className="animate-pulse" />
      <polygon points="50,18 78,74 22,74" fill="none" stroke="#E11D48" strokeWidth="2.5" />
      <polygon points="50,82 78,26 22,26" fill="none" stroke="#F43F5E" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="10" fill="#BE123C" stroke="#FDA4AF" strokeWidth="2" />
      <circle cx="50" cy="50" r="4" fill="#FFFFFF" stroke="none" />
    </svg>
  );
}

// Correntes Seladoras de Luz
export function SpellBindingChainsSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
      <circle cx="50" cy="50" r="32" fill="#38BDF8" opacity="0.25" className="animate-pulse" />
      <circle cx="50" cy="50" r="22" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 4" />
      <polygon points="50,24 74,50 50,76 26,50" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
      <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
    </svg>
  );
}

// Éter Arcano / Vórtice Cósmico
export function SpellArcaneEtherSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
      <circle cx="50" cy="50" r="30" fill="#A855F7" opacity="0.3" className="animate-pulse" />
      <g stroke="#A855F7" strokeWidth="2" fill="none">
        <ellipse cx="50" cy="50" rx="26" ry="10" transform="rotate(30 50 50)" />
        <ellipse cx="50" cy="50" rx="26" ry="10" transform="rotate(-30 50 50)" />
      </g>
      <circle cx="50" cy="50" r="12" fill="#C084FC" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
    </svg>
  );
}

/* ========================================================================= */
/* COMPONENTE PRINCIPAL: CreatureSprite2D                                    */
/* - 100% SVG inline Cel-Shaded diretamente no React (SEM TAGS <img>)        */
/* - Mapeamento detalhado por NOME e TIPO para anatomias 2D ÚNICAS          */
/* ========================================================================= */
export function CreatureSprite2D({
  card,
  isPlayer = true,
  className = "w-full h-full",
}: CreatureSprite2DProps) {
  const name = (card.name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  const type = (card.type || "").toUpperCase();
  const category = (card.category || "").toUpperCase();

  // ==========================================
  // A) SE FOR FEITIÇO (SPELL)
  // ==========================================
  if (category === "FEITICO" || type === "FEITICOS") {
    if (name.includes("FOGO") || name.includes("METEORO") || name.includes("CATACLISMO")) {
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <SpellFireMeteorSVG />
        </div>
      );
    }
    if (name.includes("GELO") || name.includes("CONGELAR")) {
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <SpellFrostIceSVG />
        </div>
      );
    }
    if (name.includes("RELAMPAGO") || name.includes("TEMPESTADE")) {
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <SpellLightningSVG />
        </div>
      );
    }
    if (name.includes("EGIDE") || name.includes("RESTAURADOR") || name.includes("REGENERACAO")) {
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <SpellHolyAegisSVG />
        </div>
      );
    }
    if (name.includes("FURIA") || name.includes("SANGUE") || name.includes("PRAGA") || name.includes("DECOMPOSICAO")) {
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <SpellBloodCurseSVG />
        </div>
      );
    }
    if (name.includes("CORRENTES") || name.includes("SELADORAS")) {
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <SpellBindingChainsSVG />
        </div>
      );
    }
    // Padrão arcano
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <SpellArcaneEtherSVG />
      </div>
    );
  }

  // ==========================================
  // B) CRIATURAS: BESTIAIS
  // ==========================================
  if (name.includes("BEHEMOTH")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <BehemothSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("GRIFO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <GriffinSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("LOBO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <WolfBeastSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("URSO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <RagingBearSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("QUIMERA")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <ChimeraSVG isPlayer={isPlayer} />
      </div>
    );
  }

  // ==========================================
  // C) CRIATURAS: ARTRÓPODES
  // ==========================================
  if (name.includes("RAINHA")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <HiveQueenSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("ARANHA")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <SpiderSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("ESCARAVELHO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <ScarabBeetleSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("LOUVA")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <MantisReaperSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("CENTOPEIA")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <CentipedeSVG isPlayer={isPlayer} />
      </div>
    );
  }

  // ==========================================
  // D) CRIATURAS: MORTOS-VIVOS
  // ==========================================
  if (name.includes("ARQUEIRO") || name.includes("ESQUELETO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <SkeletonArcherSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("CARNICAL")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <CrawlingGhoulSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("CAVALEIRO") && type === "MORTOS_VIVOS") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <DeathKnightSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("NECROMANTE")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <NecromancerSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("LICH")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <LichKingSVG isPlayer={isPlayer} />
      </div>
    );
  }

  // ==========================================
  // E) CRIATURAS: HUMANOIDES
  // ==========================================
  if (name.includes("RECRUTA") || name.includes("ESCUDO TORRE")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <TowerShieldRecruitSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("CACADORA") || name.includes("ELFICA")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <ElvenHuntressSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("LANCEIRO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <RoyalSpearmanSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("MAGO") || name.includes("TEMPLARIO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <TemplarMageSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("LORDE") || name.includes("COMANDANTE")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <LordCommanderSVG isPlayer={isPlayer} />
      </div>
    );
  }

  // ==========================================
  // F) CRIATURAS: MECÂNICOS
  // ==========================================
  if (name.includes("CATAPULTA") || card.attackType === "ARREMESSO") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <SteamCatapultSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("DRONE")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <SteamDroneSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("SENTINELA")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <ClockworkSentinelSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("COLOSSO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <BrassColossusSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("LEVIATA")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <WarLeviathanSVG isPlayer={isPlayer} />
      </div>
    );
  }

  // ==========================================
  // G) CRIATURAS: ESPÍRITOS
  // ==========================================
  if (name.includes("BANSHEE")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <BansheeSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("FOGO-FATUO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <WillOTheWispSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("POLTERGEIST")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <PoltergeistSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("AVATAR") || name.includes("TEMPESTADE ASTRAL")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <AstralAvatarSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (type === "ESPIRITOS" || name.includes("APARICAO") || name.includes("ESPECTRO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <SpiritWraithSVG isPlayer={isPlayer} />
      </div>
    );
  }

  // ==========================================
  // H) CRIATURAS: MITOLÓGICOS
  // ==========================================
  if (name.includes("DRAGAO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <PlatinumDragonSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("FENIX")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <PhoenixSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("MINOTAURO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <MinotaurSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("HIDRA")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <HydraSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (name.includes("SATIRO")) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <SatyrSVG isPlayer={isPlayer} />
      </div>
    );
  }

  // Fallbacks por tipo se não casou nenhum nome específico
  if (type === "ARTROPODES") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <SpiderSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (type === "BESTIAIS") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <WolfBeastSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (type === "MORTOS_VIVOS") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <DeathKnightSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (type === "MECANICOS") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <ClockworkSentinelSVG isPlayer={isPlayer} />
      </div>
    );
  }
  if (type === "MITOLOGICOS") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <MythicTitanSVG isPlayer={isPlayer} />
      </div>
    );
  }

  // Fallback geral
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <TowerShieldRecruitSVG isPlayer={isPlayer} />
    </div>
  );
}
