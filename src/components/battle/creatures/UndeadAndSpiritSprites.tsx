"use client";

import React from "react";

/* ========================================================================= */
/* FAMÍLIA MORTOS-VIVOS (5 Criaturas Únicas do Seed + Esqueleto Guerreiro)   */
/* ========================================================================= */

/**
 * 1. Carniçal Rastejante:
 * Criatura corcunda costurada com garras compridas e brilho tóxico verde saindo da boca.
 */
export function CarnicalRastejanteSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="38" ry="7" fill="#09090B" opacity="0.55" stroke="none" />

      {/* Pernas Traseiras Agachadas com Costuras */}
      <path d="M28 84 L18 106 L28 114 L38 92 Z" fill="#3F6212" />
      <path d="M44 88 L40 112 L52 114 L54 90 Z" fill="#4D7C0F" />

      {/* Dorso Corcunda Costurado e Coluna Aparente */}
      <path
        d="M24 80 C20 44, 58 34, 84 52 C92 62, 88 84, 76 90 C54 94, 34 90, 24 80 Z"
        fill="#4D7C0F"
      />
      {/* Cicatriz Costurada no Corpo */}
      <path d="M38 56 L64 68 M44 52 L40 62 M52 56 L48 66 M60 60 L56 70" stroke="#18181B" strokeWidth="2.4" />
      {/* Espinhos de Vértebras na Corcunda */}
      <polygon points="36,44 42,34 46,44" fill="#E2E8F0" />
      <polygon points="50,42 56,32 60,42" fill="#E2E8F0" />
      <polygon points="64,44 70,36 74,46" fill="#E2E8F0" />

      {/* Braço Rastejante e Garras Compridas Afiadas */}
      <path d="M68 74 L84 96 L74 112 L62 86 Z" fill="#3F6212" />
      <path d="M78 70 L102 88 L96 106 L74 82 Z" fill="#4D7C0F" />
      {/* Garras Compridas Necróticas */}
      <polygon points="96,106 112,112 100,98" fill="#FEF08A" />
      <polygon points="100,98 116,102 102,90" fill="#FEF08A" />
      <polygon points="74,112 88,118 80,104" fill="#FEF08A" />

      {/* Cabeça Deformada e Boca Aberta com Brilho Tóxico Verde */}
      <path
        d="M74 44 C86 38, 104 46, 104 60 L96 76 L72 72 Z"
        fill="#65A30D"
      />
      {/* Boca Rasgada com Dentes e Brilho Tóxico Verde */}
      <path d="M84 60 L104 62 L100 76 L82 72 Z" fill="#14532D" />
      <polygon points="86,60 89,66 92,60" fill="#F8FAFC" strokeWidth="1.5" />
      <polygon points="94,61 97,67 100,61" fill="#F8FAFC" strokeWidth="1.5" />
      {/* Gosma e Vapor Tóxico Verde-Ácido Saindo da Boca */}
      <path
        d="M90 68 C94 82, 88 92, 94 100 C100 92, 98 80, 102 70 Z"
        fill="#A3E635"
      />
      <circle cx="96" cy="105" r="3" fill="#BEF264" stroke="none" />
      <circle cx="108" cy="68" r="3.5" fill="#A3E635" stroke="none" />

      {/* Olho Esbugalhado Brilhante */}
      <circle cx="90" cy="52" r="4" fill="#FEF08A" />
      <circle cx="91" cy="52" r="1.5" fill="#DC2626" stroke="none" />
    </g>
  );
}

/**
 * 2. Arqueiro Esqueleto Maldito:
 * Esqueleto encapuzado com manto roxo rasgado e arco longo de osso tensionado
 * com flecha verde ectoplásmica.
 */
export function ArqueiroEsqueletoSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="30" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Pernas de Osso Aparentes */}
      <path d="M46 86 L42 114 L50 114 L52 86 Z" fill="#E2E8F0" />
      <path d="M62 86 L66 114 L74 114 L68 86 Z" fill="#CBD5E1" />

      {/* Manto Roxo Rasgado e Costelas Aparentes */}
      <path
        d="M34 52 L22 98 L36 90 L44 102 L58 88 L72 98 L76 52 Z"
        fill="#581C87"
      />
      {/* Costelas de Osso Visíveis no Peito */}
      <path d="M48 56 L66 56 M48 64 L66 64 M50 72 L64 72 M57 50 L57 78" stroke="#F8FAFC" strokeWidth="3" />

      {/* Capuz Roxo Sombrio e Crânio Esquelético */}
      <path
        d="M36 48 C34 20, 76 18, 78 46 L72 56 L40 56 Z"
        fill="#6B21A8"
      />
      {/* Crânio de Osso */}
      <path
        d="M46 30 C46 20, 70 20, 70 32 L68 48 L48 48 Z"
        fill="#F8FAFC"
      />
      {/* Olhos Brilhantes Verde Ectoplásmico no Crânio */}
      <circle cx="55" cy="36" r="3.2" fill="#4ADE80" stroke="none" />
      <circle cx="65" cy="36" r="3.2" fill="#4ADE80" stroke="none" />

      {/* Braços de Osso Tensionando o Arco */}
      <line x1="66" y1="56" x2="92" y2="56" stroke="#F8FAFC" strokeWidth="4" />
      <line x1="48" y1="58" x2="68" y2="56" stroke="#E2E8F0" strokeWidth="4" />

      {/* Arco Longo de Osso Esculpido */}
      <path
        d="M84 18 C108 40, 108 74, 84 96"
        fill="none"
        stroke="#F1F5F9"
        strokeWidth="5.5"
      />
      {/* Corda Tensionada */}
      <polyline points="84,18 66,56 84,96" fill="none" stroke="#A7F3D0" strokeWidth="1.8" />

      {/* Flecha Verde Ectoplásmica Brilhante */}
      <line x1="66" y1="56" x2="116" y2="56" stroke="#4ADE80" strokeWidth="3.5" />
      <polygon points="112,48 126,56 112,64" fill="#86EFAC" stroke="#09090B" strokeWidth="2" />
    </g>
  );
}

/**
 * 3. Cavaleiro da Morte Decrépito / Esqueleto Guerreiro:
 * Soldado de ossos com elmo rachado, costelas aparentes, escudo redondo quebrado
 * e espada enferrujada/profana.
 */
export function CavaleiroDaMorteSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="34" ry="7" fill="#09090B" opacity="0.55" stroke="none" />

      {/* Capa Fúnebre Esfarrapada */}
      <path d="M36 48 L18 104 L34 96 L44 108 L60 94 L66 50 Z" fill="#1E1B4B" />

      {/* Pernas de Osso com Grevas Enferrujadas */}
      <path d="M44 84 L40 114 L50 114 L54 84 Z" fill="#64748B" />
      <path d="M66 84 L70 114 L80 114 L74 84 Z" fill="#475569" />

      {/* Torso de Armadura Enferrujada com Costelas de Osso Aparentes */}
      <path d="M40 48 L80 48 L74 86 L46 86 Z" fill="#334155" />
      <path d="M48 56 L72 56 M48 64 L72 64 M50 72 L70 72 M60 52 L60 80" stroke="#E2E8F0" strokeWidth="3" />

      {/* Espada Enferrujada / Profana na Mão Direita */}
      <polygon points="88,72 114,20 122,24 96,76" fill="#78350F" />
      <polygon points="92,68 114,22 117,24 95,70" fill="#B45309" stroke="none" />
      {/* Guarda da Espada em Chifre */}
      <path d="M80 68 L104 80" stroke="#94A3B8" strokeWidth="5" />

      {/* Escudo Redondo Quebrado na Frente/Esquerda */}
      <path
        d="M20 56 C20 40, 48 40, 52 56 L42 64 L50 74 C42 88, 20 84, 20 56 Z"
        fill="#7C2D12"
      />
      <path
        d="M26 56 C26 46, 44 46, 46 56 L38 64 L44 72 C38 80, 26 76, 26 56 Z"
        fill="#475569"
      />
      <circle cx="35" cy="62" r="4" fill="#94A3B8" />

      {/* Crânio de Osso com Elmo Rachado e Chifre Quebrado */}
      <circle cx="60" cy="34" r="13" fill="#F1F5F9" />
      {/* Elmo de Ferro Rachado */}
      <path d="M46 32 C46 16, 74 16, 74 32 L64 28 L60 36 L56 26 Z" fill="#475569" />
      <polygon points="46,26 32,12 42,32" fill="#64748B" />
      <polygon points="74,26 82,20 78,32" fill="#64748B" />

      {/* Olhos Brilhantes Ciano/Azul Profano e Dentes do Crânio */}
      <circle cx="55" cy="36" r="3" fill="#38BDF8" stroke="none" />
      <circle cx="65" cy="36" r="3" fill="#38BDF8" stroke="none" />
      <path d="M54 44 L66 44" stroke="#09090B" strokeWidth="2.5" />
    </g>
  );
}

/**
 * 4. Necromante do Sepulcro:
 * Figura esquelética alta flutuando com cajado de crânio brilhante,
 * ombreiras pontiagudas e grimório flutuante.
 */
export function NecromanteDoSepulcroSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Aura Necrótica no Chão */}
      <ellipse cx="64" cy="116" rx="32" ry="7" fill="#10B981" opacity="0.35" stroke="none" />

      {/* Manto Longo Flutuante Verde-Escuro e Roxo */}
      <path
        d="M42 46 L26 112 L42 104 L54 114 L66 104 L80 112 L74 46 Z"
        fill="#1E1B4B"
      />
      <path d="M48 48 L44 108 L66 108 L64 48 Z" fill="#064E3B" />

      {/* Ombreiras Pontiagudas de Osso */}
      <polygon points="26,48 42,36 48,54" fill="#E2E8F0" />
      <polygon points="90,48 74,36 68,54" fill="#E2E8F0" />

      {/* Cabeça Esquelética sob Capuz Alto */}
      <path d="M42 42 C42 16, 74 16, 74 42 Z" fill="#312E81" />
      <circle cx="58" cy="34" r="9" fill="#F8FAFC" />
      <circle cx="54" cy="34" r="2.5" fill="#10B981" stroke="none" />
      <circle cx="62" cy="34" r="2.5" fill="#10B981" stroke="none" />

      {/* Cajado Longo com Crânio Brilhante Verde */}
      <line x1="92" y1="24" x2="86" y2="114" stroke="#78350F" strokeWidth="4.5" />
      <circle cx="92" cy="24" r="11" fill="#34D399" opacity="0.35" stroke="none" />
      <circle cx="92" cy="24" r="7" fill="#F8FAFC" />
      <circle cx="89" cy="23" r="2" fill="#10B981" stroke="none" />
      <circle cx="95" cy="23" r="2" fill="#10B981" stroke="none" />

      {/* Grimório Aberto Flutuante à Esquerda */}
      <polygon points="10,60 26,54 36,62 20,68" fill="#7C3AED" />
      <polygon points="12,56 26,50 34,58 20,64" fill="#FEF3C7" />
      <circle cx="24" cy="44" r="3" fill="#34D399" stroke="none" />
    </g>
  );
}

/**
 * 5. Lich Rei das Sombras:
 * Soberano arqui-lich flutuante com coroa imperial de espinhos, manto real rasgado,
 * crânio espectral flamejante, cetro abissal e orbes de almas frias.
 */
export function LichReiDasSombrasSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="36" ry="7" fill="#38BDF8" opacity="0.3" stroke="none" />

      {/* Orbes de Almas Gélidas Flutuando em Órbita */}
      <circle cx="20" cy="40" r="6" fill="#38BDF8" />
      <circle cx="20" cy="40" r="2.5" fill="#FFFFFF" stroke="none" />
      <circle cx="108" cy="38" r="6" fill="#A855F7" />
      <circle cx="108" cy="38" r="2.5" fill="#FFFFFF" stroke="none" />

      {/* Manto Real Rasgado Carmesim Escuro e Roxo Abissal */}
      <path
        d="M36 46 L16 112 L36 100 L50 114 L64 100 L78 114 L92 100 L110 112 L92 46 Z"
        fill="#3B0764"
      />
      <path d="M46 48 L38 106 L64 98 L88 106 L82 48 Z" fill="#7F1D1D" />

      {/* Colar Real de Ouro e Ombreiras de Crânios */}
      <polygon points="32,48 52,42 76,42 96,48 84,60 44,60" fill="#F59E0B" />
      <circle cx="36" cy="48" r="7" fill="#E2E8F0" />
      <circle cx="92" cy="48" r="7" fill="#E2E8F0" />

      {/* Crânio Espectral e Grande Coroa de Espinhos Dourada/Negra */}
      <circle cx="64" cy="34" r="11" fill="#E0F2FE" />
      <polygon
        points="48,26 50,8 58,20 64,4 70,20 78,8 80,26"
        fill="#FACC15"
      />
      {/* Olhos de Fogo Azul Gélido */}
      <circle cx="59" cy="34" r="3" fill="#0284C7" stroke="none" />
      <circle cx="69" cy="34" r="3" fill="#0284C7" stroke="none" />

      {/* Cetro Real das Sombras */}
      <line x1="100" y1="52" x2="88" y2="112" stroke="#1E293B" strokeWidth="4.5" />
      <polygon points="100,36 110,48 100,60 90,48" fill="#38BDF8" />
    </g>
  );
}

/* ========================================================================= */
/* FAMÍLIA ESPÍRITOS (5 Criaturas Únicas do Seed)                            */
/* ========================================================================= */

/**
 * 6. Fogo-Fátuo Ilusório:
 * Chama espectral bruxuleante azul/violeta que flutua pelo campo com núcleo luminoso
 * e centelhas arcanas.
 */
export function FogoFatuoIlusorioSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="26" ry="6" fill="#38BDF8" opacity="0.35" stroke="none" />

      {/* Cauda Etérea e Base de Lanterna Quebrada */}
      <path d="M56 96 L64 114 L72 96 Z" fill="#1E293B" />

      {/* Chama Exterior Espectral Ciano e Azul */}
      <path
        d="M64 14 C52 32, 36 40, 32 62 C28 84, 46 98, 64 98 C82 98, 100 84, 96 62 C92 40, 76 32, 64 14 Z"
        fill="#0EA5E9"
      />
      {/* Chama Interna Branca/Ciano */}
      <path
        d="M64 34 C54 48, 44 58, 46 74 C48 88, 80 88, 82 74 C84 58, 74 48, 64 34 Z"
        fill="#BAE6FD"
        stroke="none"
      />

      {/* Olhos Brilhantes Hipnóticos */}
      <ellipse cx="55" cy="70" rx="4.5" ry="6" fill="#09090B" stroke="none" />
      <circle cx="55" cy="69" r="2.2" fill="#FEF08A" stroke="none" />
      <ellipse cx="73" cy="70" rx="4.5" ry="6" fill="#09090B" stroke="none" />
      <circle cx="73" cy="69" r="2.2" fill="#FEF08A" stroke="none" />

      {/* Centelhas Ilusórias Flutuantes */}
      <circle cx="26" cy="48" r="4" fill="#38BDF8" />
      <circle cx="102" cy="44" r="4.5" fill="#A855F7" />
      <circle cx="92" cy="24" r="3" fill="#7DD3FC" />
    </g>
  );
}

/**
 * 7. Banshee Lamuriante:
 * Espectro feminino de cabelos longos flutuantes brancos/ciano, mãos no rosto
 * e boca aberta emitindo anéis sônicos luminosos.
 */
export function BansheeLamurianteSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="30" ry="6" fill="#09090B" opacity="0.45" stroke="none" />

      {/* Longos Cabelos Flutuantes Brancos/Ciano */}
      <path
        d="M42 28 C16 24, 6 52, 16 78 C26 70, 36 58, 44 46 Z"
        fill="#BAE6FD"
      />
      <path
        d="M78 28 C100 22, 112 48, 104 74 C94 66, 84 56, 76 46 Z"
        fill="#BAE6FD"
      />

      {/* Vestido Espectral Flutuante Rasgado */}
      <path
        d="M44 52 L28 110 L44 100 L56 112 L68 100 L84 110 L74 52 Z"
        fill="#0284C7"
      />
      <path d="M48 54 L40 102 L60 96 L74 102 L70 54 Z" fill="#E0F2FE" stroke="none" />

      {/* Cabeça Pálida e Boca Aberta em Grito Agoniante */}
      <ellipse cx="60" cy="36" rx="13" ry="15" fill="#F0F9FF" />
      {/* Olhos Chorando Ectoplasma Ciano */}
      <circle cx="55" cy="32" r="2.5" fill="#0284C7" stroke="none" />
      <circle cx="65" cy="32" r="2.5" fill="#0284C7" stroke="none" />
      {/* Boca Aberta Gritando */}
      <ellipse cx="62" cy="43" rx="5" ry="6.5" fill="#09090B" />

      {/* Mãos Esqueléticas Próximas ao Rosto */}
      <path d="M36 62 L46 42 M82 62 L74 42" stroke="#E0F2FE" strokeWidth="4" />

      {/* Anéis Sônicos Luminosos Saindo da Boca */}
      <ellipse
        cx="88"
        cy="43"
        rx="5"
        ry="12"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="2.8"
      />
      <ellipse
        cx="102"
        cy="43"
        rx="7"
        ry="18"
        fill="none"
        stroke="#A855F7"
        strokeWidth="2.8"
      />
      <ellipse
        cx="116"
        cy="43"
        rx="9"
        ry="24"
        fill="none"
        stroke="#7DD3FC"
        strokeWidth="2.2"
      />
    </g>
  );
}

/**
 * 8. Poltergeist Telúrico:
 * Espírito elemental formado por rochas flutuantes acorrentadas em torno de um
 * núcleo de energia laranja/roxo com olhos furiosos.
 */
export function PoltergeistTeluricoSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="34" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Correntes Espectrais Conectando as Rochas ao Núcleo */}
      <line x1="64" y1="60" x2="22" y2="38" stroke="#A855F7" strokeWidth="3" strokeDasharray="4 4" />
      <line x1="64" y1="60" x2="106" y2="36" stroke="#A855F7" strokeWidth="3" strokeDasharray="4 4" />
      <line x1="64" y1="60" x2="26" y2="88" stroke="#F97316" strokeWidth="3" strokeDasharray="4 4" />
      <line x1="64" y1="60" x2="104" y2="88" stroke="#F97316" strokeWidth="3" strokeDasharray="4 4" />

      {/* Núcleo de Energia Laranja/Roxo Furioso */}
      <circle cx="64" cy="60" r="24" fill="#7E22CE" />
      <circle cx="64" cy="60" r="17" fill="#F97316" stroke="none" />
      {/* Olhos Furiosos no Núcleo */}
      <polygon points="52,52 62,58 54,62" fill="#FEF08A" stroke="#09090B" strokeWidth="1.5" />
      <polygon points="76,52 66,58 74,62" fill="#FEF08A" stroke="#09090B" strokeWidth="1.5" />

      {/* Rochas Flutuantes Angularizadas em Órbita */}
      <polygon points="12,32 28,24 34,42 18,48" fill="#57534E" />
      <polygon points="96,24 116,30 110,48 94,42" fill="#78716C" />
      <polygon points="16,80 34,76 38,96 20,98" fill="#78716C" />
      <polygon points="92,76 112,80 108,98 90,94" fill="#57534E" />
      <polygon points="54,92 74,92 68,108 58,108" fill="#44403C" />
    </g>
  );
}

/**
 * 9. Aparição Vingativa:
 * Silhueta encapuzada etérea com foice espectral e manto rasgado em sombras.
 */
export function AparicaoVingativaSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="30" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Grande Foice Espectral Ciano/Roxa */}
      <line x1="36" y1="98" x2="94" y2="22" stroke="#334155" strokeWidth="4.5" />
      <path
        d="M86 18 C114 20, 124 44, 106 60 C104 44, 96 34, 82 30 Z"
        fill="#38BDF8"
      />

      {/* Manto Sombrio Etéreo em Tiras Flutuantes */}
      <path
        d="M42 48 L22 108 L38 98 L48 112 L62 98 L76 110 L86 50 Z"
        fill="#1E1B4B"
      />
      {/* Capuz Profundo */}
      <path d="M38 48 C38 20, 82 20, 82 48 Q60 60 38 48 Z" fill="#0F172A" />

      {/* Olhos Carmesim Vingativos no Vazio */}
      <polygon points="52,38 60,41 54,44" fill="#F43F5E" stroke="none" />
      <polygon points="70,38 62,41 68,44" fill="#F43F5E" stroke="none" />
    </g>
  );
}

/**
 * 10. Avatar da Tempestade Astral:
 * Entidade cósmica colossal com múltiplas máscaras flutuantes e anéis astrais
 * ao redor de uma chama azul/roxa descarregando relâmpagos.
 */
export function AvatarTempestadeAstralSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="36" ry="7" fill="#A855F7" opacity="0.35" stroke="none" />

      {/* Anel Astral Cósmico nas Costas */}
      <circle cx="64" cy="52" r="36" fill="none" stroke="#C084FC" strokeWidth="3.5" strokeDasharray="8 5" />

      {/* Corpo de Nebulosa e Chama Azul/Roxa */}
      <path
        d="M44 46 L30 108 L50 98 L64 112 L78 98 L98 108 L84 46 Z"
        fill="#4C1D95"
      />
      <path
        d="M64 16 C48 34, 44 56, 64 88 C84 56, 80 34, 64 16 Z"
        fill="#38BDF8"
      />

      {/* Máscara Astral Central + Duas Máscaras Flutuantes Laterais */}
      <polygon points="54,32 64,24 74,32 70,48 64,52 58,48" fill="#FEF08A" />
      <circle cx="60" cy="36" r="2" fill="#09090B" stroke="none" />
      <circle cx="68" cy="36" r="2" fill="#09090B" stroke="none" />

      {/* Máscaras Menores em Órbita */}
      <polygon points="18,46 26,40 34,46 30,58 22,58" fill="#E2E8F0" />
      <polygon points="94,46 102,40 110,46 106,58 98,58" fill="#E2E8F0" />

      {/* Raios Cósmicos nas Laterais */}
      <polyline points="26,64 14,78 24,80 12,96" fill="none" stroke="#FEF08A" strokeWidth="3" />
      <polyline points="102,64 114,78 104,80 116,96" fill="none" stroke="#FEF08A" strokeWidth="3" />
    </g>
  );
}

