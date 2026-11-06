"use client";

import React from "react";

/* ========================================================================= */
/* FAMÍLIA ARTRÓPODES (5 Criaturas Únicas)                                   */
/* ========================================================================= */

/**
 * 1. Escaravelho Batedor:
 * Besouro encouraçado compacto de quatro patas, com um grande chifre frontal curvo de rinoceronte,
 * carapaça abobadada preta/azul-escura brilhante e olhos laranjas.
 */
export function EscaravelhoBatedorSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="114" rx="34" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* 4 Patas Quitinosas Compactas com Garras */}
      <path d="M36 86 L24 102 L28 112 L34 104 L42 92 Z" fill="#1E293B" />
      <path d="M54 90 L48 106 L52 114 L58 106 L62 92 Z" fill="#0F172A" />
      <path d="M76 90 L78 106 L84 114 L88 104 L82 90 Z" fill="#1E293B" />
      <path d="M90 84 L102 100 L106 110 L96 104 L86 88 Z" fill="#0F172A" />

      {/* Carapaça Abobadada Preta/Azul-Escura Brilhante */}
      <path
        d="M22 84 C18 46, 52 34, 82 48 C96 56, 98 74, 92 86 C72 94, 42 94, 22 84 Z"
        fill="#1E3A8A"
      />
      {/* Sombra inferior da carapaça */}
      <path
        d="M22 84 C44 92, 72 92, 92 86 C90 74, 62 72, 24 76 Z"
        fill="#0F172A"
      />
      {/* Reflexo especular azul-claro no domo */}
      <path
        d="M34 54 C46 44, 66 44, 78 52 C66 56, 46 58, 34 54 Z"
        fill="#60A5FA"
        opacity="0.7"
        stroke="none"
      />
      {/* Linha divisória do élitro */}
      <path d="M56 42 C58 60, 56 76, 52 90" fill="none" stroke="#09090B" strokeWidth="2.8" />

      {/* Cabeça Blindada e Grande Chifre Frontal Curvo de Rinoceronte */}
      <path
        d="M78 60 C88 58, 98 64, 98 76 C98 86, 86 88, 76 84 Z"
        fill="#0F172A"
      />
      {/* Grande Chifre Curvo Principal */}
      <path
        d="M90 66 C106 62, 118 44, 112 24 C106 38, 98 50, 84 56 Z"
        fill="#334155"
      />
      {/* Chifre Secundário Menor */}
      <polygon points="82,56 90,42 94,56" fill="#475569" />

      {/* Olhos Laranjas Brilhantes */}
      <ellipse cx="90" cy="70" rx="4.5" ry="3.5" fill="#F97316" stroke="#09090B" strokeWidth="1.8" />
      <circle cx="91" cy="69" r="1.4" fill="#FEF08A" stroke="none" />
    </g>
  );
}

/**
 * 2. Aranha Tece-Sombras:
 * Viúva-negra sombria com 8 patas longas e pontiagudas, abdômen traseiro globoso
 * com ampulheta roxa/vermelha neon, 6 olhos pequenos brilhantes e presas pingando veneno.
 */
export function AranhaTeceSombrasSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="114" rx="42" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* 4 Patas Traseiras/Esquerdas Longas e Pontiagudas */}
      <path d="M44 68 L22 38 L8 72 L4 106" fill="none" stroke="#1E1B4B" strokeWidth="4.5" />
      <path d="M48 72 L30 44 L16 80 L14 112" fill="none" stroke="#312E81" strokeWidth="4.5" />
      <path d="M54 74 L40 48 L28 84 L26 114" fill="none" stroke="#1E1B4B" strokeWidth="4.5" />
      <path d="M60 76 L52 54 L42 88 L40 114" fill="none" stroke="#312E81" strokeWidth="4.5" />

      {/* 4 Patas Dianteiras/Direitas Longas e Pontiagudas */}
      <path d="M72 76 L82 52 L92 86 L90 114" fill="none" stroke="#312E81" strokeWidth="4.5" />
      <path d="M76 74 L92 46 L104 82 L102 114" fill="none" stroke="#1E1B4B" strokeWidth="4.5" />
      <path d="M80 72 L102 40 L116 76 L114 110" fill="none" stroke="#312E81" strokeWidth="4.5" />
      <path d="M84 68 L110 36 L124 68 L122 102" fill="none" stroke="#1E1B4B" strokeWidth="4.5" />

      {/* Abdômen Traseiro Globoso de Viúva-Negra */}
      <circle cx="40" cy="58" r="24" fill="#0F172A" />
      <path
        d="M22 44 C30 34, 48 34, 56 44 C46 40, 32 40, 22 44 Z"
        fill="#334155"
        stroke="none"
      />
      {/* Ampulheta Roxa/Vermelha Neon no Abdômen */}
      <polygon points="32,46 48,46 40,56" fill="#F43F5E" stroke="#09090B" strokeWidth="1.8" />
      <polygon points="40,56 48,66 32,66" fill="#A855F7" stroke="#09090B" strokeWidth="1.8" />

      {/* Cefalotórax e Cabeça */}
      <ellipse cx="70" cy="70" rx="16" ry="12" fill="#1E1B4B" />

      {/* 6 Olhos Pequenos Brilhantes */}
      <circle cx="72" cy="64" r="2.2" fill="#F43F5E" stroke="none" />
      <circle cx="78" cy="65" r="2.5" fill="#F43F5E" stroke="none" />
      <circle cx="83" cy="64" r="2" fill="#F43F5E" stroke="none" />
      <circle cx="74" cy="69" r="1.8" fill="#A855F7" stroke="none" />
      <circle cx="79" cy="70" r="2.2" fill="#F43F5E" stroke="none" />
      <circle cx="84" cy="69" r="1.8" fill="#A855F7" stroke="none" />

      {/* Quelíceras / Presas Pingando Veneno e Teia */}
      <path d="M76 76 L74 92 L82 82 Z" fill="#4C1D95" />
      <path d="M84 76 L88 92 L90 80 Z" fill="#4C1D95" />
      {/* Gotas de veneno neon */}
      <circle cx="74" cy="97" r="2.5" fill="#A3E635" stroke="#09090B" strokeWidth="1.5" />
      <circle cx="88" cy="97" r="2.5" fill="#A3E635" stroke="#09090B" strokeWidth="1.5" />
    </g>
  );
}

/**
 * 3. Louva-a-Deus Ceifador:
 * Predador vertical de carapaça verde-esmeralda com duas grandes lâminas/foices
 * quitinosas dianteiras serrilhadas, cabeça triangular e asas translúcidas.
 */
export function LouvaADeusCeifadorSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="30" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Asas Traseiras Afiadas */}
      <path d="M58 56 L18 42 L26 68 L54 74 Z" fill="#065F46" />
      <path d="M58 62 L12 64 L24 84 L54 80 Z" fill="#047857" />

      {/* 4 Patas Traseiras de Salto */}
      <path d="M50 84 L32 96 L26 114" fill="none" stroke="#065F46" strokeWidth="4" />
      <path d="M58 86 L48 100 L46 116" fill="none" stroke="#10B981" strokeWidth="4" />
      <path d="M66 86 L76 100 L78 116" fill="none" stroke="#065F46" strokeWidth="4" />
      <path d="M72 84 L92 96 L96 114" fill="none" stroke="#10B981" strokeWidth="4" />

      {/* Abdômen Segmentado Curvo */}
      <path
        d="M32 86 C36 72, 54 70, 64 78 C64 92, 46 100, 32 86 Z"
        fill="#059669"
      />

      {/* Tórax Longo Vertical de Louva-a-Deus */}
      <path d="M58 78 L68 38 L76 40 L66 80 Z" fill="#10B981" />

      {/* Duas Foices Quitinosas Serrilhadas Gigantes */}
      <path
        d="M72 48 L98 34 L116 58 L98 60 L92 52 L84 56 Z"
        fill="#A3E635"
      />
      <path
        d="M68 54 L94 48 L112 74 L94 74 L88 66 L80 68 Z"
        fill="#65A30D"
      />

      {/* Cabeça Triangular com Antenas e Olhos Compostos Âmbar */}
      <path d="M70 24 L82 10 M76 24 L94 12" fill="none" stroke="#09090B" strokeWidth="2.2" />
      <polygon points="62,26 84,26 74,44" fill="#34D399" />
      <circle cx="66" cy="28" r="4.5" fill="#F59E0B" />
      <circle cx="80" cy="28" r="4.5" fill="#F59E0B" />
      <circle cx="67" cy="27" r="1.5" fill="#FEF08A" stroke="none" />
      <circle cx="81" cy="27" r="1.5" fill="#FEF08A" stroke="none" />
    </g>
  );
}

/**
 * 4. Centopeia de Carapaça Titânica:
 * Corpo longo sinuoso em formato de "S" formado por múltiplos segmentos de placas
 * blindadas sobrepostas, dezenas de pequenas patas laterais, antenas longas e mandíbulas.
 */
export function CentopeiaCarapacaSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="38" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Dezenas de Patas Laterais Afiadas ao Longo da Curva em "S" */}
      <path
        d="M28 98 L16 106 M38 102 L30 112 M52 100 L48 112 M68 96 L72 108 M82 86 L94 94 M86 72 L100 76 M72 60 L84 54 M52 54 L38 58 M38 42 L24 42 M46 28 L32 24"
        stroke="#DC2626"
        strokeWidth="3.2"
      />

      {/* Segmentos Sobrepostos da Carapaça em Formato de "S" */}
      {/* Cauda com pinças traseiras */}
      <path d="M24 96 L12 88 M24 102 L10 102" stroke="#7F1D1D" strokeWidth="3" />
      <ellipse cx="32" cy="98" rx="12" ry="9" fill="#450A0A" />
      <ellipse cx="48" cy="98" rx="13" ry="10" fill="#7F1D1D" />
      <ellipse cx="66" cy="92" rx="14" ry="10" fill="#991B1B" />
      <ellipse cx="80" cy="80" rx="14" ry="11" fill="#7F1D1D" />
      <ellipse cx="78" cy="66" rx="14" ry="11" fill="#991B1B" />
      <ellipse cx="62" cy="56" rx="14" ry="11" fill="#B91C1C" />
      <ellipse cx="46" cy="46" rx="15" ry="11" fill="#991B1B" />
      <ellipse cx="52" cy="32" rx="16" ry="12" fill="#B91C1C" />

      {/* Cabeça Couraçada Superior com Mandíbulas Serrilhadas e Antenas Longas */}
      <ellipse cx="70" cy="26" rx="16" ry="12" fill="#DC2626" />
      {/* Mandíbulas Serrilhadas */}
      <path d="M82 22 L98 16 L90 28 Z" fill="#FACC15" />
      <path d="M82 30 L98 36 L88 36 Z" fill="#FACC15" />
      {/* Antenas Longas */}
      <path d="M74 16 Q88 4 104 8" fill="none" stroke="#EF4444" strokeWidth="2.8" />
      <path d="M66 15 Q74 2 90 2" fill="none" stroke="#EF4444" strokeWidth="2.8" />

      {/* Olhos Múltiplos Brilhantes Amarelos */}
      <circle cx="74" cy="24" r="3" fill="#FEF08A" stroke="none" />
      <circle cx="67" cy="22" r="2.2" fill="#FEF08A" stroke="none" />
    </g>
  );
}

/**
 * 5. Rainha da Colmeia Quitina:
 * Matriarca abelha/vespa colossal flutuante com asas translúcidas rasgadas,
 * coroa quitinosa dourada na cabeça, abdômen listrado em ouro velho e preto
 * terminado em um ferrão gigante brilhando em verde-ácido.
 */
export function RainhaDaColmeiaSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="30" ry="6" fill="#09090B" opacity="0.45" stroke="none" />

      {/* Asas Translúcidas Rasgadas de Vespa Real */}
      <path
        d="M56 44 C32 14, 8 18, 14 40 C20 50, 42 52, 56 44 Z"
        fill="#BAE6FD"
        fillOpacity="0.65"
      />
      <path
        d="M68 44 C92 14, 116 18, 110 40 C104 50, 82 52, 68 44 Z"
        fill="#BAE6FD"
        fillOpacity="0.65"
      />
      <path
        d="M54 52 C30 38, 16 48, 24 62 C34 68, 48 60, 54 52 Z"
        fill="#7DD3FC"
        fillOpacity="0.5"
      />
      <path
        d="M70 52 C94 38, 108 48, 100 62 C90 68, 76 60, 70 52 Z"
        fill="#7DD3FC"
        fillOpacity="0.5"
      />

      {/* Abdômen Colossal Listrado em Ouro Velho e Preto */}
      <path
        d="M42 64 C36 82, 46 100, 62 104 C78 100, 88 82, 82 64 Z"
        fill="#F59E0B"
      />
      {/* Listras Pretas de Vespa */}
      <path d="M41 72 Q62 78 83 72" fill="none" stroke="#09090B" strokeWidth="6" />
      <path d="M44 84 Q62 90 80 84" fill="none" stroke="#09090B" strokeWidth="6" />
      <path d="M50 95 Q62 99 74 95" fill="none" stroke="#09090B" strokeWidth="5" />

      {/* Ferrão Gigante Brilhando em Verde-Ácido */}
      <polygon points="56,102 68,102 62,122" fill="#84CC16" />
      <circle cx="62" cy="122" r="3" fill="#BEF264" stroke="none" />

      {/* Tórax Real e Braços/Patas Articuladas */}
      <ellipse cx="62" cy="52" rx="14" ry="12" fill="#1E293B" />
      <path d="M48 52 L34 64 L38 76 M76 52 L90 64 L86 76" fill="none" stroke="#09090B" strokeWidth="3.5" />

      {/* Cabeça e Coroa Quitinosa Dourada */}
      <circle cx="62" cy="34" r="11" fill="#1E293B" />
      <polygon
        points="50,26 54,10 62,20 70,10 74,26"
        fill="#FACC15"
      />
      {/* Olhos Compostos Carmesim */}
      <ellipse cx="57" cy="34" rx="3.5" ry="4.5" fill="#EF4444" stroke="none" />
      <ellipse cx="67" cy="34" rx="3.5" ry="4.5" fill="#EF4444" stroke="none" />
    </g>
  );
}

/* ========================================================================= */
/* FAMÍLIA BESTIAIS (5 Criaturas Únicas + Kitsune)                           */
/* ========================================================================= */

/**
 * 6. Lobo Cinzento Caçador:
 * Lobo selvagem quadrúpede de pelagem cinza-escura e prata (NÃO raposa branca),
 * focinho comprido com cicatriz, orelhas pontudas, presas à mostra e apenas UMA cauda peluda cinza.
 */
export function LoboCinzentoCacadorSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="36" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* ÚNICA Cauda Peluda Cinza-Escura e Prata */}
      <path
        d="M36 76 C16 72, 8 56, 14 42 C24 48, 32 60, 40 70 Z"
        fill="#475569"
      />
      <path
        d="M14 42 C20 46, 24 52, 26 58"
        stroke="#94A3B8"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Patas Traseiras Musculosas Cinza-Escuras */}
      <path d="M38 82 L32 112 L42 112 L48 86 Z" fill="#334155" />
      <path d="M50 84 L48 114 L58 114 L60 86 Z" fill="#475569" />

      {/* Corpo de Lobo Selvagem Cinza-Escuro com Ventre Prateado */}
      <path
        d="M36 68 Q60 58 84 64 Q92 78 82 90 Q58 94 38 84 Z"
        fill="#475569"
      />
      <path
        d="M44 84 Q62 88 80 86"
        stroke="#CBD5E1"
        strokeWidth="4"
        fill="none"
      />

      {/* Patas Dianteiras com Garras */}
      <path d="M70 84 L70 114 L80 114 L80 84 Z" fill="#334155" />
      <path d="M80 82 L86 112 L96 112 L90 82 Z" fill="#475569" />

      {/* Juba Cinza/Prata eriçada no pescoço */}
      <path
        d="M66 52 L56 62 L68 68 L64 78 L80 80 L90 70 L84 56 Z"
        fill="#64748B"
      />

      {/* Orelhas Pontudas Cinzentas */}
      <polygon points="68,36 64,14 78,28" fill="#334155" />
      <polygon points="78,34 84,12 92,32" fill="#475569" />

      {/* Cabeça e Focinho Comprido com Cicatriz e Presas à Mostra */}
      <path
        d="M66 38 Q78 26 92 34 L114 46 L110 58 L88 60 Q70 56 66 38 Z"
        fill="#475569"
      />
      {/* Cicatriz vermelha no focinho */}
      <line x1="94" y1="38" x2="100" y2="50" stroke="#EF4444" strokeWidth="2.4" />
      {/* Presas brancas afiadas à mostra */}
      <polygon points="96,56 99,63 102,56" fill="#F8FAFC" strokeWidth="1.5" />
      <polygon points="103,56 106,62 108,56" fill="#F8FAFC" strokeWidth="1.5" />

      {/* Olho Amarelo/Âmbar de Lobo Caçador */}
      <polygon points="82,42 92,44 86,49" fill="#FACC15" stroke="#09090B" strokeWidth="1.5" />
    </g>
  );
}

/**
 * 7. Urso da Tundra Enraivecido:
 * Urso colossal erguido de pelagem branca-ártica/azulada, cicatrizes de guerra,
 * ombreiras de gelo glacial e garras pesadas.
 */
export function UrsoDaTundraSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="118" rx="40" ry="8" fill="#09090B" opacity="0.55" stroke="none" />

      {/* Pernas Traseiras Maciças */}
      <path d="M36 84 L30 114 L48 114 L52 88 Z" fill="#CBD5E1" />
      <path d="M76 84 L80 114 L98 114 L90 84 Z" fill="#E2E8F0" />

      {/* Torso Colossal de Urso da Tundra */}
      <path
        d="M28 46 C26 24, 102 24, 100 46 L94 92 L34 92 Z"
        fill="#F1F5F9"
      />
      {/* Sombra muscular no peito e cicatriz */}
      <path d="M46 56 L78 72 M74 54 L52 74" stroke="#E11D48" strokeWidth="3" />

      {/* Cristais de Gelo nos Ombros */}
      <polygon points="22,48 14,26 32,34 38,48" fill="#38BDF8" />
      <polygon points="106,48 114,26 96,34 90,48" fill="#38BDF8" />

      {/* Braços Gigantes com Garras Afiadas */}
      <path d="M26 50 L12 82 L28 92 L38 68 Z" fill="#E2E8F0" />
      <path d="M102 50 L116 82 L100 92 L90 68 Z" fill="#E2E8F0" />
      {/* Garras de Gelo */}
      <polygon points="12,82 8,94 16,88" fill="#38BDF8" />
      <polygon points="18,86 15,98 23,90" fill="#38BDF8" />

      {/* Orelhas Redondas de Urso e Cabeça Rugindo */}
      <circle cx="48" cy="24" r="7" fill="#CBD5E1" />
      <circle cx="80" cy="24" r="7" fill="#CBD5E1" />
      <path
        d="M44 28 C44 14, 84 14, 84 28 L88 48 L40 48 Z"
        fill="#F8FAFC"
      />
      {/* Bocarra Rugindo com Presas */}
      <rect x="52" y="38" width="24" height="12" rx="4" fill="#991B1B" />
      <polygon points="55,38 58,44 61,38" fill="#FFFFFF" strokeWidth="1.2" />
      <polygon points="67,38 70,44 73,38" fill="#FFFFFF" strokeWidth="1.2" />
      {/* Olhos Brilhantes Furiosos */}
      <circle cx="54" cy="30" r="3" fill="#38BDF8" stroke="none" />
      <circle cx="74" cy="30" r="3" fill="#38BDF8" stroke="none" />
    </g>
  );
}

/**
 * 8. Grifo dos Picos Nevados:
 * Metade águia, metade leão — cabeça branca com bico curvo amarelo-ouro de ave de rapina,
 * grandes asas emplumadas abertas nas costas, peito estufado e garras dianteiras de águia douradas.
 */
export function GrifoDosPicosSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="36" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Grandes Asas Emplumadas Abertas nas Costas */}
      <path
        d="M52 60 L14 22 L8 42 L20 48 L12 60 L28 64 L48 70 Z"
        fill="#E2E8F0"
      />
      <path
        d="M68 56 L36 16 L30 34 L42 42 L34 52 L58 62 Z"
        fill="#F8FAFC"
      />

      {/* Cauda de Leão com Tufo na Ponta */}
      <path d="M34 80 Q14 74 12 58" fill="none" stroke="#D97706" strokeWidth="4" />
      <circle cx="12" cy="56" r="5" fill="#92400E" />

      {/* Corpo Traseiro de Leão Dourado */}
      <path d="M36 82 L30 112 L40 112 L46 86 Z" fill="#B45309" />
      <path
        d="M34 72 Q58 64 82 70 Q88 84 78 92 Q54 96 36 86 Z"
        fill="#D97706"
      />

      {/* Garras Dianteiras de Águia Douradas */}
      <path d="M72 86 L74 114 L84 114 L80 86 Z" fill="#F59E0B" />
      <path d="M82 84 L92 112 L102 112 L90 84 Z" fill="#FBBF24" />

      {/* Peito Estufado de Penas Brancas de Águia */}
      <path
        d="M64 52 L56 70 L68 88 L88 86 L94 66 L84 50 Z"
        fill="#F8FAFC"
      />

      {/* Cabeça de Águia Branca com Bico Curvo Amarelo-Ouro */}
      <path
        d="M66 36 C66 20, 92 20, 94 36 L92 54 L68 54 Z"
        fill="#FFFFFF"
      />
      {/* Penacho de Águia */}
      <polygon points="68,26 56,16 74,22" fill="#E2E8F0" />
      {/* Bico Curvo Amarelo-Ouro */}
      <path
        d="M92 34 C108 34, 114 44, 106 54 L90 48 Z"
        fill="#FACC15"
      />
      {/* Olho Dourado Feroz */}
      <circle cx="84" cy="36" r="3" fill="#EF4444" stroke="none" />
    </g>
  );
}

/**
 * 9. Quimera das Savanas:
 * Predador tríplice: cabeça principal de leão com juba de fogo, cabeça secundária
 * de bode com chifres negros e cauda de serpente venenosa.
 */
export function QuimeraDasSavanasSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="64" cy="116" rx="38" ry="7" fill="#09090B" opacity="0.5" stroke="none" />

      {/* Cauda de Serpente Venenosa Viva */}
      <path
        d="M34 78 C14 72, 10 46, 24 34"
        fill="none"
        stroke="#16A34A"
        strokeWidth="5"
      />
      <ellipse cx="26" cy="32" rx="7" ry="5" fill="#22C55E" />
      <circle cx="28" cy="31" r="1.8" fill="#EF4444" stroke="none" />

      {/* Corpo Felino Musculoso e Patas */}
      <path d="M38 84 L32 112 L42 112 L48 86 Z" fill="#B45309" />
      <path d="M74 84 L76 112 L86 112 L84 84 Z" fill="#D97706" />
      <path
        d="M34 70 Q60 62 86 68 Q92 82 82 90 Q58 94 36 86 Z"
        fill="#D97706"
      />

      {/* 2ª Cabeça nas Costas: Bode com Chifres Negros Curvos */}
      <path d="M50 36 C42 18, 30 16, 28 28" fill="none" stroke="#18181B" strokeWidth="4" />
      <path d="M58 36 C56 18, 46 14, 42 26" fill="none" stroke="#18181B" strokeWidth="4" />
      <polygon points="46,36 64,36 68,52 50,52" fill="#57534E" />
      <circle cx="58" cy="42" r="2.2" fill="#FACC15" stroke="none" />

      {/* Juba Flamejante Vermelho-Laranja e Cabeça de Leão Principal */}
      <path
        d="M66 42 L60 56 L66 72 L80 82 L98 74 L104 54 L94 38 L78 34 Z"
        fill="#DC2626"
      />
      <circle cx="86" cy="56" r="13" fill="#F59E0B" />
      {/* Presas e Olhos da Cabeça de Leão */}
      <circle cx="90" cy="52" r="2.8" fill="#FEF08A" stroke="none" />
      <polygon points="90,62 93,68 96,62" fill="#FFFFFF" strokeWidth="1.2" />
    </g>
  );
}

/**
 * 10. Behemoth Primordial:
 * Quadrúpede titânico marrom/vulcânico com corcova muscular enorme,
 * chifres de carneiro retorcidos, mandíbula inferior com presas gigantes e rachaduras sob as patas.
 */
export function BehemothPrimordialSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Rachaduras Sísmicas Sob as Patas */}
      <ellipse cx="64" cy="116" rx="44" ry="8" fill="#09090B" opacity="0.6" stroke="none" />
      <path d="M24 114 L12 120 M56 116 L64 122 M92 114 L108 120" stroke="#EA580C" strokeWidth="2.5" />

      {/* Patas Traseiras e Dianteiras Ciclópicas */}
      <path d="M26 78 L20 114 L40 114 L44 82 Z" fill="#451A03" />
      <path d="M76 78 L78 114 L100 114 L96 78 Z" fill="#78350F" />

      {/* Corcova Muscular Enorme com Placas Rochosas nas Costas */}
      <path
        d="M20 78 C16 34, 58 18, 92 42 C104 52, 104 74, 96 86 C68 94, 38 92, 20 78 Z"
        fill="#5C280B"
      />
      {/* Espinhos Rochosos Dorsais */}
      <polygon points="34,36 42,16 52,30" fill="#27272A" />
      <polygon points="52,30 62,12 72,28" fill="#3F3F46" />
      <polygon points="70,30 80,16 86,34" fill="#27272A" />

      {/* Cabeça Brutal, Chifres de Carneiro Retorcidos e Presas Gigantes */}
      <path
        d="M78 48 L112 52 L110 78 L80 80 Z"
        fill="#451A03"
      />
      {/* Chifre de Carneiro Retorcido */}
      <path
        d="M84 48 C72 28, 96 20, 104 38 C108 48, 94 56, 88 50"
        fill="#D6D3D1"
      />
      {/* Presas Inferiores Colossais Curvadas para Cima */}
      <path d="M98 76 L112 50 L118 64 L106 78 Z" fill="#FEF3C7" />
      <path d="M88 76 L98 56 L104 68 L94 78 Z" fill="#FDE68A" />

      {/* Olho Incandescente Vermelho */}
      <circle cx="96" cy="58" r="3.5" fill="#EF4444" stroke="none" />
    </g>
  );
}

/**
 * 11. Raposa / Kitsune (Reservada apenas para cartas de Raposa/Kitsune)
 */
export function KitsuneRaposaSprite() {
  return (
    <g stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="66" cy="116" rx="34" ry="7" fill="#09090B" opacity="0.45" stroke="none" />
      <path d="M42 84 C18 82 6 62 12 40 C20 50 32 62 44 74 Z" fill="#F9A8D4" />
      <path d="M46 80 C22 68 16 42 26 24 C36 38 44 56 50 72 Z" fill="#F472B6" />
      <path d="M44 74 Q64 64 86 68 Q92 80 84 92 Q64 96 46 88 Z" fill="#FFFFFF" />
      <path d="M46 86 L40 112 L48 112 L54 90 Z" fill="#F8FAFC" />
      <path d="M74 86 L74 114 L82 114 L82 86 Z" fill="#F8FAFC" />
      <polygon points="82,36 88,10 98,34" fill="#FFFFFF" />
      <path d="M70 42 Q82 28 96 36 L112 52 L106 60 L86 62 Q72 58 70 42 Z" fill="#FFFFFF" />
      <circle cx="94" cy="48" r="2.5" fill="#E11D48" stroke="none" />
    </g>
  );
}
