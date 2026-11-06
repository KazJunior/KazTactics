import React from "react";

/**
 * Ícones Desenhados a Bico de Pena & Adagas de Mesa de Guerra (Darkest Dungeon)
 */

// 1. Adaga de Ferro Cravada na Mesa de Guerra
export function WarTableDagger({ className = "w-6 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 50" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Sombra da Adaga na Madeira */}
      <ellipse cx="12" cy="46" rx="8" ry="3" fill="#09080B" />
      {/* Lâmina de Ferro Cravada */}
      <polygon points="10,48 14,48 13,20 11,20" fill="#5A5560" stroke="#09080B" strokeWidth="1.2" />
      {/* Guarda da Adaga */}
      <rect x="5" y="18" width="14" height="3" fill="#26232C" stroke="#09080B" strokeWidth="1" />
      {/* Empunhadura de Couro e Pomo */}
      <rect x="10" y="6" width="4" height="12" fill="#1C1814" stroke="#09080B" strokeWidth="1" />
      <circle cx="12" cy="5" r="3" fill="#D97724" stroke="#09080B" strokeWidth="1" />
    </svg>
  );
}

// 2. Selo de Cera Vermelha (Red Wax Seal de Expedição Concluída)
export function RedWaxSeal({ className = "w-8 h-8", text = "PURGADO" }: { className?: string; text?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Cera Derretida Irregular */}
      <path
        d="M18 2C24 1 31 7 32 14C33 22 28 30 20 33C11 34 3 28 3 19C2 10 10 3 18 2Z"
        fill="#8C1D18"
        stroke="#09080B"
        strokeWidth="1.8"
      />
      <circle cx="18" cy="18" r="10" fill="#B82923" stroke="#09080B" strokeWidth="1.2" />
      {/* Carimbo de Ferro no Selo */}
      <path d="M14 18L17 21L23 15" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// 3. Estágio 1: Ruínas Góticas das Catacumbas
export function GothicRuinsIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill="#14121A" />
      {/* Arco Ogival em Ruínas */}
      <path d="M10 44V22C10 14 24 6 24 6C24 6 38 14 38 22V44" fill="#09080B" stroke="#C8B99E" strokeWidth="2" />
      <path d="M16 44V26C16 20 24 14 24 14C24 14 32 20 32 26V44" fill="#1C1824" stroke="#C8B99E" strokeWidth="1.2" />
      {/* Fissuras no Arco */}
      <path d="M24 6L21 16L26 22" stroke="#09080B" strokeWidth="1.5" fill="none" />
      <line x1="6" y1="44" x2="42" y2="44" stroke="#C8B99E" strokeWidth="2" />
    </svg>
  );
}

// 4. Estágio 2: Covil dos Artrópodes Venenosos
export function ArthropodLairIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill="#10180E" />
      {/* Quelíceras e Teias Quitinosas em Bico de Pena */}
      <path d="M6 6L24 24M42 6L24 24M6 42L24 24M42 42L24 24" stroke="#222E1F" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="24" cy="24" r="10" fill="#09080B" stroke="#4E6838" strokeWidth="2" />
      {/* Mandíbulas Venenosas */}
      <path d="M18 20Q24 28 19 32" stroke="#7AA658" strokeWidth="2.5" fill="none" />
      <path d="M30 20Q24 28 29 32" stroke="#7AA658" strokeWidth="2.5" fill="none" />
      <circle cx="21" cy="22" r="1.5" fill="#a3e635" />
      <circle cx="27" cy="22" r="1.5" fill="#a3e635" />
    </svg>
  );
}

// 5. Estágio 3: Cripta dos Mortos-Vivos Necróticos
export function UndeadCryptIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill="#111614" />
      {/* Lápide e Crânio em Bico de Pena */}
      <path d="M12 44V18C12 10 36 10 36 18V44H12Z" fill="#09080B" stroke="#C8B99E" strokeWidth="2" />
      {/* Crânio Entalhado */}
      <circle cx="24" cy="24" r="6" fill="#C8B99E" stroke="#09080B" strokeWidth="1" />
      <circle cx="22" cy="23" r="1.5" fill="#09080B" />
      <circle cx="26" cy="23" r="1.5" fill="#09080B" />
      <rect x="22" y="27" width="4" height="2" fill="#09080B" />
      {/* Ossos Cruzados na Base */}
      <line x1="16" y1="36" x2="32" y2="42" stroke="#889C91" strokeWidth="1.5" />
      <line x1="32" y1="36" x2="16" y2="42" stroke="#889C91" strokeWidth="1.5" />
    </svg>
  );
}

// 6. Estágio 4: Forja Mecânica de Autômatos
export function MechanicalForgeIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill="#17110B" />
      {/* Engrenagens de Latão e Bigorna */}
      <circle cx="24" cy="24" r="14" fill="#09080B" stroke="#785028" strokeWidth="2.5" strokeDasharray="5 3" />
      <circle cx="24" cy="24" r="8" fill="#2E2218" stroke="#D97724" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="3" fill="#FEF08A" />
      {/* Chaminés e Pistões */}
      <rect x="21" y="4" width="6" height="8" fill="#09080B" stroke="#785028" strokeWidth="1" />
      <line x1="8" y1="44" x2="40" y2="44" stroke="#D97724" strokeWidth="2" />
    </svg>
  );
}

// 7. Estágio 5: Santuário Mitológico dos Deuses Antigos
export function MythicSanctuaryIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill="#161209" />
      {/* Monólito Cósmico com Olho Ancestral e Tentáculos */}
      <polygon points="24,4 34,44 14,44" fill="#09080B" stroke="#D49B27" strokeWidth="2" />
      {/* Olho Cósmico */}
      <path d="M19 26C21 21 27 21 29 26C27 31 21 31 19 26Z" fill="#78350F" stroke="#FEF08A" strokeWidth="1" />
      <circle cx="24" cy="26" r="2" fill="#D49B27" />
      {/* Tentáculos Laterais em Nanquim */}
      <path d="M8 44Q14 26 6 16" stroke="#8C7030" strokeWidth="2" fill="none" />
      <path d="M40 44Q34 26 42 16" stroke="#8C7030" strokeWidth="2" fill="none" />
    </svg>
  );
}

/**
 * Seletor de Ícone a Bico de Pena pelo número do estágio
 */
export function getStagePenIcon(stageNumber: number, className?: string) {
  switch (stageNumber) {
    case 1:
      return <GothicRuinsIcon className={className} />;
    case 2:
      return <ArthropodLairIcon className={className} />;
    case 3:
      return <UndeadCryptIcon className={className} />;
    case 4:
      return <MechanicalForgeIcon className={className} />;
    case 5:
    default:
      return <MythicSanctuaryIcon className={className} />;
  }
}
