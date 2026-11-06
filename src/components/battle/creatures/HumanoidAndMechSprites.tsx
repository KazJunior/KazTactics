"use client";

import React from "react";

/* ========================================================================= */
/* FAMÍLIA HUMANÓIDES (5 Criaturas do Seed + Assassino/Ladino)               */
/* ========================================================================= */

/**
 * 1. Recruta com Escudo Torre:
 * Soldado em armadura de ferro com escudo torre retangular pesado e espada curta.
 */
export function RecrutaEscudoTorreSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="34" ry="7" fill="#09090B" opacity="0.55" stroke="none" />

      {/* Pernas em Armadura de Ferro */}
      <path d="M40 84 L38 114 L48 114 L50 84 Z" fill="#475569" />
      <path d="M56 84 L58 114 L68 114 L64 84 Z" fill="#64748B" />

      {/* Espada Curta de Ferro Empunhada à Esquerda */}
      <polygon points="18,42 26,34 38,68 30,72" fill="#CBD5E1" />
      <line x1="24" y1="68" x2="40" y2="62" stroke="#D97706" strokeWidth="4" />

      {/* Torso de Ferro e Elmo de Guarda com Visor */}
      <path d="M34 48 L68 48 L64 84 L38 84 Z" fill="#64748B" />
      <path d="M36 30 C36 16, 66 16, 66 30 L66 48 L36 48 Z" fill="#94A3B8" />
      {/* Fenda do Visor e Olhos */}
      <rect x="42" y="32" width="18" height="6" fill="#09090B" />
      <circle cx="48" cy="35" r="1.8" fill="#38BDF8" stroke="none" />
      <circle cx="56" cy="35" r="1.8" fill="#38BDF8" stroke="none" />

      {/* Escudo Torre Retangular Pesado na Frente/Direita */}
      <rect x="60" y="28" width="42" height="82" rx="4" fill="#334155" />
      <rect x="66" y="34" width="30" height="70" rx="2" fill="#1E3A8A" />
      {/* Reforços de Ferro e Brasão no Escudo Torre */}
      <line x1="81" y1="30" x2="81" y2="108" stroke="#F59E0B" strokeWidth="4" />
      <line x1="62" y1="68" x2="100" y2="68" stroke="#F59E0B" strokeWidth="4" />
      <polygon points="81,56 89,68 81,80 73,68" fill="#FACC15" />
    </g>
  );
}

/**
 * 2. Caçadora Élfica da Fronteira:
 * Arqueira élfica ágil com capa verde-floresta, orelhas pontudas longas,
 * capuz esmeralda e arco longo recurvo.
 */
export function CacadoraElficaSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="28" ry="6" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Capa Verde-Floresta Esvoaçante */}
      <path d="M44 46 L18 106 L38 98 L48 108 L58 50 Z" fill="#065F46" />

      {/* Botas de Couro e Túnica Élfica */}
      <path d="M46 84 L42 114 L50 114 L54 84 Z" fill="#78350F" />
      <path d="M60 84 L64 114 L72 114 L68 84 Z" fill="#92400E" />
      <path d="M42 48 L72 48 L68 84 L44 84 Z" fill="#10B981" />
      <polygon points="48,48 66,48 58,76" fill="#FDE68A" />

      {/* Cabeça, Cabelos Dourados, Capuz e Orelhas Élficas Longas */}
      <polygon points="42,34 22,26 40,42" fill="#FDE68A" />
      <circle cx="58" cy="34" r="12" fill="#FEF3C7" />
      <path d="M44 30 C44 14, 72 14, 74 32 L64 26 L46 32 Z" fill="#047857" />
      {/* Olhos Esmeralda */}
      <circle cx="56" cy="35" r="2.2" fill="#10B981" stroke="none" />
      <circle cx="64" cy="35" r="2.2" fill="#10B981" stroke="none" />

      {/* Arco Recurvo Dourado com Flecha */}
      <path d="M84 16 C108 42, 108 74, 84 100" fill="none" stroke="#F59E0B" strokeWidth="5" />
      <line x1="84" y1="16" x2="84" y2="100" stroke="#E2E8F0" strokeWidth="1.5" />
      <line x1="62" y1="58" x2="114" y2="58" stroke="#34D399" strokeWidth="3.5" />
      <polygon points="110,51 122,58 110,65" fill="#6EE7B7" />
    </g>
  );
}

/**
 * 3. Lanceiro Real de Aço:
 * Guerreiro veterano em armadura completa de aço polido com penacho carmesim
 * e longa lança/alabarda real empunhada em guarda.
 */
export function LanceiroRealSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="32" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Capa Curta Azul Real */}
      <path d="M38 48 L24 96 L44 92 L50 50 Z" fill="#1D4ED8" />

      {/* Pernas e Tronco em Armadura de Aço Polido */}
      <path d="M44 82 L40 114 L50 114 L54 82 Z" fill="#94A3B8" />
      <path d="M64 82 L68 114 L78 114 L72 82 Z" fill="#CBD5E1" />
      <path d="M38 46 L78 46 L72 84 L44 84 Z" fill="#E2E8F0" />
      {/* Detalhe Dourado no Peitoral */}
      <polygon points="58,52 66,64 58,76 50,64" fill="#F59E0B" />

      {/* Ombreiras de Aço */}
      <path d="M28 52 C28 38, 44 38, 46 52 Z" fill="#CBD5E1" />
      <path d="M70 52 C72 38, 88 38, 88 52 Z" fill="#CBD5E1" />

      {/* Elmo Fechado com Penacho Vermelho */}
      <path d="M48 22 C56 6, 76 6, 82 20 C70 20, 60 22, 48 22 Z" fill="#DC2626" />
      <rect x="46" y="22" width="24" height="24" rx="6" fill="#E2E8F0" />
      <line x1="52" y1="34" x2="66" y2="34" stroke="#09090B" strokeWidth="3.5" />

      {/* Longa Lança / Alabarda Real de Aço com Flâmula */}
      <line x1="26" y1="108" x2="102" y2="18" stroke="#78350F" strokeWidth="5" />
      {/* Flâmula Real sob a Lâmina */}
      <polygon points="90,32 112,38 98,48 82,42" fill="#EF4444" />
      {/* Ponta de Aço da Lança */}
      <polygon points="94,26 118,4 104,34" fill="#F8FAFC" />
    </g>
  );
}

/**
 * 4. Mago de Batalha Templário (Paladino / Templário):
 * Cavaleiro em armadura branca e dourada com capa vermelha, elmo cruzado
 * e martelo/cajado sagrado brilhante.
 */
export function MagoTemplarioSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="34" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Capa Vermelha Templária */}
      <path d="M36 46 L18 108 L40 102 L78 108 L84 46 Z" fill="#DC2626" />

      {/* Armadura Branca e Dourada */}
      <path d="M44 84 L42 114 L52 114 L54 84 Z" fill="#F8FAFC" />
      <path d="M64 84 L66 114 L76 114 L74 84 Z" fill="#F8FAFC" />
      <path d="M38 46 L82 46 L76 86 L42 86 Z" fill="#FFFFFF" />
      {/* Cruz Dourada no Peitoral */}
      <line x1="60" y1="48" x2="60" y2="84" stroke="#F59E0B" strokeWidth="5" />
      <line x1="46" y1="62" x2="74" y2="62" stroke="#F59E0B" strokeWidth="5" />

      {/* Ombreiras Brancas e Douradas */}
      <polygon points="24,52 38,38 46,56 28,60" fill="#FACC15" />
      <polygon points="96,52 82,38 74,56 92,60" fill="#FACC15" />

      {/* Elmo Cruzado Templário */}
      <rect x="46" y="20" width="28" height="26" rx="5" fill="#F8FAFC" />
      <line x1="60" y1="22" x2="60" y2="44" stroke="#F59E0B" strokeWidth="4" />
      <line x1="48" y1="32" x2="72" y2="32" stroke="#09090B" strokeWidth="4" />
      {/* Olhos Brilhantes Sagrados */}
      <circle cx="55" cy="32" r="2" fill="#38BDF8" stroke="none" />
      <circle cx="65" cy="32" r="2" fill="#38BDF8" stroke="none" />

      {/* Martelo / Cajado Sagrado Brilhante */}
      <line x1="98" y1="28" x2="92" y2="112" stroke="#B45309" strokeWidth="4.5" />
      <rect x="82" y="18" width="32" height="16" rx="3" fill="#FACC15" />
      <circle cx="98" cy="26" r="4" fill="#38BDF8" stroke="none" />
    </g>
  );
}

/**
 * 5. Lorde Comandante da Aliança:
 * Soberano militar em armadura dourada ornamentada, manto azul-celeste,
 * elmo coroado alado e grande espada sagrada luminosa erguida.
 */
export function LordeComandanteSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="36" ry="7" fill="#09090B" opacity="0.55" stroke="none" />

      {/* Manto Real Azul-Imperial com Borda Dourada */}
      <path d="M34 44 L14 110 L42 104 L84 110 L90 44 Z" fill="#1E40AF" />

      {/* Pernas e Torso em Armadura de Ouro Maciço */}
      <path d="M44 84 L40 114 L52 114 L56 84 Z" fill="#F59E0B" />
      <path d="M66 84 L70 114 L82 114 L76 84 Z" fill="#D97706" />
      <path d="M36 44 L86 44 L78 86 L44 86 Z" fill="#FACC15" />
      {/* Brasão de Leão/Sol no Peito */}
      <polygon points="61,50 71,64 61,78 51,64" fill="#38BDF8" />

      {/* Ombreiras Colossais Douradas */}
      <path d="M20 48 C20 30, 44 30, 46 48 L36 60 Z" fill="#F59E0B" />
      <path d="M102 48 C102 30, 78 30, 76 48 L86 60 Z" fill="#F59E0B" />

      {/* Elmo Coroado com Asas Brancas */}
      <polygon points="44,28 28,12 46,20" fill="#FFFFFF" />
      <polygon points="78,28 94,12 76,20" fill="#FFFFFF" />
      <rect x="46" y="20" width="30" height="24" rx="5" fill="#FACC15" />
      <polygon points="48,20 54,10 61,18 68,10 74,20" fill="#FEF08A" />
      <circle cx="56" cy="32" r="2.2" fill="#38BDF8" stroke="none" />
      <circle cx="66" cy="32" r="2.2" fill="#38BDF8" stroke="none" />

      {/* Grande Espada Sagrada Luminosa */}
      <polygon points="96,74 114,10 124,14 106,78" fill="#E0F2FE" />
      <line x1="88" y1="72" x2="114" y2="80" stroke="#F59E0B" strokeWidth="5" />
    </g>
  );
}

/**
 * 6. Assassino / Ladino:
 * Figura ágil agachada com máscara ninja/capuz escuro, cachecol esvoaçante
 * e duas adagas curvas brilhando em roxo.
 */
export function AssassinoLadinoSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="32" ry="6" fill="#09090B" opacity="0.5" stroke="none" />
      {/* Cachecol Esvoaçante Carmesim */}
      <path d="M52 44 C26 38, 12 48, 8 64 C24 58, 38 56, 52 52 Z" fill="#E11D48" />
      {/* Corpo Ágil Agachado */}
      <path d="M42 82 L30 112 L42 112 L52 86 Z" fill="#1E1B4B" />
      <path d="M68 82 L82 112 L92 112 L78 82 Z" fill="#1E1B4B" />
      <path d="M44 48 L78 52 L72 84 L44 82 Z" fill="#0F172A" />
      {/* Capuz e Máscara Ninja */}
      <circle cx="64" cy="34" r="13" fill="#1E293B" />
      <circle cx="60" cy="33" r="2.2" fill="#A855F7" stroke="none" />
      <circle cx="69" cy="33" r="2.2" fill="#A855F7" stroke="none" />
      {/* Duas Adagas Curvas Brilhando em Roxo */}
      <path d="M36 68 C20 64, 14 48, 24 38 C24 50, 30 58, 42 62 Z" fill="#A855F7" />
      <path d="M84 68 C100 72, 114 60, 110 46 C104 56, 96 62, 82 62 Z" fill="#A855F7" />
    </g>
  );
}

/* ========================================================================= */
/* FAMÍLIA MECÂNICOS (5 Criaturas Únicas do Seed)                            */
/* ========================================================================= */

/**
 * 7. Drone Batedor a Vapor:
 * Engrenagem voadora a vapor com hélices de bronze, chaminé fumegante,
 * olho óptico brilhante e canhão de plasma arcano.
 */
export function DroneBatedorVaporSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="26" ry="6" fill="#09090B" opacity="0.45" stroke="none" />

      {/* Hélices Superiores Giratórias e Eixo */}
      <line x1="64" y1="18" x2="64" y2="34" stroke="#78350F" strokeWidth="5" />
      <ellipse cx="38" cy="18" rx="22" ry="5" fill="#F59E0B" />
      <ellipse cx="90" cy="18" rx="22" ry="5" fill="#F59E0B" />

      {/* Chaminé Traseira Soltando Vapor */}
      <rect x="28" y="34" width="10" height="18" fill="#475569" />
      <circle cx="26" cy="26" r="5" fill="#CBD5E1" stroke="none" />

      {/* Corpo Esférico Blindado de Bronze e Engrenagens */}
      <circle cx="64" cy="60" r="24" fill="#D97706" />
      <circle cx="64" cy="60" r="18" fill="#92400E" />

      {/* Grande Lente Óptica Azul Brilhante */}
      <circle cx="70" cy="56" r="10" fill="#0284C7" />
      <circle cx="70" cy="56" r="6" fill="#38BDF8" stroke="none" />
      <circle cx="68" cy="54" r="2.5" fill="#FFFFFF" stroke="none" />

      {/* Canhão Inferior de Plasma Arcano */}
      <rect x="58" y="82" width="38" height="10" rx="3" fill="#334155" />
      <circle cx="98" cy="87" r="5" fill="#38BDF8" />
    </g>
  );
}

/**
 * 8. Sentinela de Engrenagens (Torreta / Balista):
 * Mecanismo de tiro blindado montado em tripé pesado com engrenagens aparentes
 * e besta/canhão rotativo duplo.
 */
export function SentinelaDeEngrenagensSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="38" ry="7" fill="#09090B" opacity="0.55" stroke="none" />

      {/* Tripé Pesado de Ferro Cravado no Chão */}
      <path d="M52 78 L24 114 L36 114 L58 84 Z" fill="#334155" />
      <path d="M64 80 L60 116 L70 116 L70 80 Z" fill="#475569" />
      <path d="M74 78 L102 114 L90 114 L68 84 Z" fill="#334155" />

      {/* Grande Engrenagem Lateral de Bronze */}
      <circle cx="44" cy="60" r="20" fill="#F59E0B" strokeDasharray="8 4" />
      <circle cx="44" cy="60" r="12" fill="#78350F" />

      {/* Torreta Blindada Central */}
      <rect x="42" y="36" width="38" height="44" rx="6" fill="#B45309" />
      {/* Visor de Mira Vermelho */}
      <rect x="54" y="42" width="20" height="8" rx="2" fill="#EF4444" />

      {/* Canos Duplos de Metralha / Besta Mecânica */}
      <rect x="76" y="48" width="38" height="8" rx="2" fill="#475569" />
      <rect x="76" y="60" width="38" height="8" rx="2" fill="#334155" />
      <circle cx="114" cy="52" r="3" fill="#F97316" stroke="none" />
      <circle cx="114" cy="64" r="3" fill="#F97316" stroke="none" />
    </g>
  );
}

/**
 * 9. Catapulta a Vapor Blindada:
 * Veículo de cerco sobre rodas com chaminé fumegante, engrenagens de bronze
 * e colher lançadora com rocha em chamas.
 */
export function CatapultaAVaporSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="42" ry="7" fill="#09090B" opacity="0.55" stroke="none" />

      {/* Chaminé Traseira a Vapor com Fumaça */}
      <rect x="22" y="38" width="12" height="32" fill="#475569" />
      <circle cx="28" cy="28" r="6" fill="#94A3B8" stroke="none" />
      <circle cx="20" cy="20" r="8" fill="#CBD5E1" stroke="none" />

      {/* Braço Lançador e Colher com Rocha Incandescente em Chamas */}
      <line x1="72" y1="72" x2="36" y2="28" stroke="#78350F" strokeWidth="7" />
      {/* Colher e Rocha em Chamas */}
      <path d="M20 28 C20 12, 48 12, 48 28 Z" fill="#EA580C" />
      <circle cx="34" cy="22" r="11" fill="#F97316" />
      <circle cx="34" cy="22" r="6" fill="#FEF08A" stroke="none" />

      {/* Chassi Blindado de Madeira e Bronze */}
      <polygon points="18,70 108,70 102,94 24,94" fill="#92400E" />
      <rect x="28" y="74" width="68" height="14" fill="#D97706" />

      {/* Engrenagem de Tensão Central */}
      <circle cx="72" cy="72" r="12" fill="#FACC15" />
      <circle cx="72" cy="72" r="5" fill="#78350F" />

      {/* Rodas Blindadas de Cerco */}
      <circle cx="38" cy="98" r="16" fill="#334155" />
      <circle cx="38" cy="98" r="8" fill="#F59E0B" />
      <circle cx="90" cy="98" r="16" fill="#334155" />
      <circle cx="90" cy="98" r="8" fill="#F59E0B" />
    </g>
  );
}

/**
 * 10. Colosso de Latão e Vapor (Golem de Ferro / Autômato):
 * Robô pesado a vapor com peito de fornalha acesa, chaminés nos ombros
 * e punhos gigantes de metal rebitado.
 */
export function ColossoDeLataoSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="118" rx="40" ry="8" fill="#09090B" opacity="0.6" stroke="none" />

      {/* Chaminés Duplas nos Ombros Soltando Vapor */}
      <rect x="28" y="16" width="10" height="22" fill="#475569" />
      <rect x="90" y="16" width="10" height="22" fill="#475569" />
      <circle cx="33" cy="10" r="5" fill="#CBD5E1" stroke="none" />
      <circle cx="95" cy="10" r="5" fill="#CBD5E1" stroke="none" />

      {/* Pernas Hidráulicas Pesadas */}
      <rect x="38" y="84" width="16" height="30" rx="3" fill="#B45309" />
      <rect x="74" y="84" width="16" height="30" rx="3" fill="#B45309" />

      {/* Torso Blindado de Latão com Peito de Fornalha Acesa */}
      <polygon points="30,36 98,36 90,86 38,86" fill="#D97706" />
      {/* Grelha da Fornalha Acesa no Peito */}
      <rect x="46" y="48" width="36" height="26" rx="4" fill="#F97316" />
      <line x1="55" y1="48" x2="55" y2="74" stroke="#09090B" strokeWidth="3" />
      <line x1="64" y1="48" x2="64" y2="74" stroke="#09090B" strokeWidth="3" />
      <line x1="73" y1="48" x2="73" y2="74" stroke="#09090B" strokeWidth="3" />

      {/* Punhos Gigantes de Metal Rebitado */}
      <rect x="10" y="56" width="22" height="32" rx="5" fill="#64748B" />
      <rect x="96" y="56" width="22" height="32" rx="5" fill="#64748B" />
      <circle cx="21" cy="64" r="2" fill="#FACC15" stroke="none" />
      <circle cx="107" cy="64" r="2" fill="#FACC15" stroke="none" />

      {/* Cabeça de Autômato com Visor Incandescente */}
      <rect x="48" y="20" width="32" height="18" rx="4" fill="#F59E0B" />
      <rect x="54" y="26" width="20" height="6" fill="#FEF08A" />
    </g>
  );
}

/**
 * 11. Leviatã Bélico Autônomo:
 * Dreadnought terrestre colossal sobre lagartas blindadas com múltiplos canhões
 * de cerco, núcleo reator arcano e proa de encouraçado.
 */
export function LeviataBelicoSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="118" rx="46" ry="8" fill="#09090B" opacity="0.6" stroke="none" />

      {/* Baterias Superiores de Canhões de Arremesso */}
      <line x1="68" y1="36" x2="114" y2="20" stroke="#334155" strokeWidth="8" />
      <line x1="74" y1="46" x2="120" y2="34" stroke="#475569" strokeWidth="7" />

      {/* Torre de Comando Central do Dreadnought */}
      <polygon points="32,32 82,32 90,58 26,58" fill="#B45309" />
      <circle cx="58" cy="45" r="8" fill="#38BDF8" />
      <circle cx="58" cy="45" r="3.5" fill="#FFFFFF" stroke="none" />

      {/* Casco Colossal de Encouraçado Terrestre */}
      <polygon points="10,58 118,54 110,90 18,90" fill="#78350F" />
      <polygon points="18,62 108,60 104,76 22,76" fill="#D97706" />

      {/* Lagartas / Rodas Dentadas Blindadas na Base */}
      <rect x="16" y="88" width="96" height="24" rx="12" fill="#1E293B" />
      <circle cx="32" cy="100" r="7" fill="#F59E0B" />
      <circle cx="64" cy="100" r="7" fill="#F59E0B" />
      <circle cx="96" cy="100" r="7" fill="#F59E0B" />
    </g>
  );
}

