import React from "react";

/**
 * Ícones de Status e Selos em estilo Xilogravura / Nanquim Pesado (Darkest Dungeon)
 */

// 1. Selo de Custo de Mana (Chama Âmbar e Anel de Ferro em Nanquim)
export function ManaFlameSeal({ cost }: { cost: number }) {
  const isDoubleDigit = cost >= 10;
  return (
    <div className="relative flex items-center justify-center w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 shrink-0 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
      <svg
        viewBox="0 0 36 36"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Anel Externo de Ferro Forjado */}
        <circle cx="18" cy="18" r="16" fill="#09080B" stroke="#26232C" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="14" stroke="#D97724" strokeWidth="1" strokeDasharray="3 2" />

        {/* Chama Âmbar Entalhada */}
        <path
          d={
            isDoubleDigit
              ? "M18 4C18 4 9 12 9 19C9 23.8 13 27 18 27C23 27 27 23.8 27 19C27 12 18 4 18 4Z"
              : "M18 5C18 5 12 13 12 19C12 23 15 26 18 26C21 26 24 23 24 19C24 13 18 5 18 5Z"
          }
          fill="#D97724"
          stroke="#09080B"
          strokeWidth="1.5"
        />
        <path
          d={
            isDoubleDigit
              ? "M18 8C18 8 11 14 11 19C11 22.5 14 25 18 25C22 25 25 22.5 25 19C25 14 18 8 18 8Z"
              : "M18 10C18 10 14 15 14 19C14 21.5 15.8 23.5 18 23.5C20.2 23.5 22 21.5 22 19C22 15 18 10 18 10Z"
          }
          fill="#F29F3D"
        />
        <path
          d={
            isDoubleDigit
              ? "M18 12C18 12 14 16 14 19.5C14 21.5 15.5 23 18 23C20.5 23 22 21.5 22 19.5C22 16 18 12 18 12Z"
              : "M18 14C18 14 16 17 16 19.5C16 20.8 16.9 21.8 18 21.8C19.1 21.8 20 20.8 20 19.5C20 17 18 14 18 14Z"
          }
          fill="#FEF08A"
        />
      </svg>
      {/* Dígito do Custo de Mana (Centralizado e Nunca Cortado) */}
      <span
        className={`absolute inset-0 flex items-center justify-center font-numbers font-black text-[#09080B] pt-0.5 ${
          isDoubleDigit
            ? "text-[11px] sm:text-xs tracking-tighter"
            : "text-xs sm:text-sm"
        }`}
      >
        {cost}
      </span>
    </div>
  );
}

// 2. Dano: Espada Quebrada (Broken Sword)
export function BrokenSwordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cabo & Guarda */}
      <rect x="10.5" y="19" width="3" height="4" rx="0.5" fill="#09080B" stroke="#D97724" strokeWidth="1.2" />
      <path d="M7 18H17V20H7V18Z" fill="#26232C" stroke="#D97724" strokeWidth="1" />
      <circle cx="12" cy="23" r="1.5" fill="#D97724" />

      {/* Lâmina Fraturada com dentes de quebra em xilogravura */}
      <path
        d="M10.5 18V11L8.5 8.5L12 10.5L15 7L13.5 12V18H10.5Z"
        fill="#C8B99E"
        stroke="#09080B"
        strokeWidth="1.4"
      />
      {/* Fragmento quebrado flutuando */}
      <path
        d="M12 2L9.5 5.5L13.5 4.5L12 2Z"
        fill="#C8B99E"
        stroke="#09080B"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// 3. Vida: Coração Anatômico (Anatomical Heart)
export function AnatomicalHeartIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Veias e Artérias Superiores (Aorta) */}
      <path
        d="M10 2V6H13V2H10Z"
        fill="#09080B"
        stroke="#B82923"
        strokeWidth="1.2"
      />
      <path
        d="M14 3.5L17 5L15.5 7.5L13 6L14 3.5Z"
        fill="#09080B"
        stroke="#B82923"
        strokeWidth="1"
      />
      {/* Massa Ventricular do Coração com Hachuras */}
      <path
        d="M6.5 9.5C6.5 7 8.5 5.5 11 6.5C11.8 4.8 14.5 4.5 16 6.5C18 6.5 19 8.5 18.5 11C18 14.5 14 19 12 22C10 19 6.5 14.5 6.5 9.5Z"
        fill="#B82923"
        stroke="#09080B"
        strokeWidth="1.8"
      />
      {/* Sombra de Nanquim e Artérias Ventriculares */}
      <path
        d="M12 8C13 10.5 13.5 14 12 18"
        stroke="#09080B"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8.5 10C9.5 12 10.5 14 11 16"
        stroke="#09080B"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 4. Movimento: Bota de Ferro / Pegada de Masmorra
export function ArmoredBootIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cano da Bota com Rebites */}
      <path
        d="M9 3H15L14.5 11H9.5L9 3Z"
        fill="#26232C"
        stroke="#09080B"
        strokeWidth="1.5"
      />
      {/* Peito do Pé e Calcanhar */}
      <path
        d="M9.5 11L7 16H6V19H18C20 19 20 17 19 15L16 13L14.5 11H9.5Z"
        fill="#C8B99E"
        stroke="#09080B"
        strokeWidth="1.5"
      />
      {/* Sola de Ferro Dentada */}
      <path
        d="M5 19H19V21H5V19Z"
        fill="#2E8B78"
        stroke="#09080B"
        strokeWidth="1.2"
      />
      {/* Placa Frontal de Aço */}
      <circle cx="12" cy="7" r="1.2" fill="#D97724" />
      <circle cx="12" cy="15" r="1.2" fill="#D97724" />
    </svg>
  );
}

// 5. Alcance: Retículo / Mira Xilogravada
export function MysticSightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="8" fill="none" stroke="#09080B" strokeWidth="2" />
      <circle cx="12" cy="12" r="7" fill="none" stroke="#F29F3D" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="2.5" fill="#D97724" stroke="#09080B" strokeWidth="1" />
      {/* Miras Cardeais */}
      <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="#F29F3D" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 6. Selo: LINE_OF_SIGHT (Olho Cortado / Linha Reta Direta)
export function LineOfSightSeal({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <div
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#09080B] border border-[#2E5A88] text-[#7dd3fc] text-[9px] font-gothic uppercase tracking-wide"
      title="Line of Sight: Ataque em linha direta; bloqueado por obstáculos e criaturas"
    >
      <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Olho Rúnico */}
        <path
          d="M2 12C5 6 19 6 22 12C19 18 5 18 2 12Z"
          fill="#0c1a29"
          stroke="#38bdf8"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="3.5" fill="#38bdf8" stroke="#09080B" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="1.5" fill="#09080B" />
        {/* Linha de Trajetória Reta Cortando o Olho */}
        <line x1="0" y1="12" x2="24" y2="12" stroke="#f43f5e" strokeWidth="1.6" strokeDasharray="3 2" />
      </svg>
      <span className="font-bold">Linha Direta</span>
    </div>
  );
}

// 7. Selo: ARREMESSO (Catapulta / Trajetória Parabólica em Arco)
export function HighArcLobSeal({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <div
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#09080B] border border-[#D97724] text-[#F29F3D] text-[9px] font-gothic uppercase tracking-wide"
      title="Arremesso: Projétil em parábola; passa por cima de muralhas e outras criaturas"
    >
      <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Obstáculo / Muralha no meio */}
        <rect x="10" y="14" width="4" height="8" fill="#26232C" stroke="#09080B" strokeWidth="1.2" />
        {/* Linha em Arco Balístico passando por cima */}
        <path
          d="M3 19C4 9 12 5 21 19"
          stroke="#F29F3D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />
        {/* Projétil Incandescente no topo do arco */}
        <circle cx="12" cy="6.5" r="2.2" fill="#D97724" stroke="#09080B" strokeWidth="1" />
      </svg>
      <span className="font-bold">Arremesso</span>
    </div>
  );
}

