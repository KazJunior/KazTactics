import {
  BoardUnit,
  GridTile,
  MAX_UNIT_ACTIONS_PER_TURN,
  UnitOwner,
  UnitStatusEffect,
} from "@/types/game";
import { FloatingDamage } from "@/lib/tactics/combat";
import { BOARD_HEIGHT, BOARD_WIDTH } from "@/lib/tactics/grid";

export type AbilityTargetType =
  | "ENEMY"
  | "EMPTY_TILE"
  | "SELF_AOE"
  | "AREA_TARGET"
  | "ALLY";

export type AbilityEffectType =
  | "AOE_DAMAGE"
  | "POISON"
  | "DASH_JUMP"
  | "WEB_ROOT"
  | "KNOCKBACK"
  | "HEAL_BUFF";

export interface AbilityVfxData {
  id: string;
  effectType: AbilityEffectType;
  tiles: { x: number; y: number }[];
  origin?: { x: number; y: number };
  destination?: { x: number; y: number };
}

export interface CreatureAbility {
  name: string;
  description: string;
  cooldown: number; // 2 a 4 turnos
  range: number; // 0 se centrada nela mesma
  targetType: AbilityTargetType;
  aoeRadius?: number; // 1 para área 3x3 ao redor do alvo
  effectType: AbilityEffectType;
  power: number; // Valor de dano direto, cura ou dano por turno do veneno
  duration?: number; // Duração em turnos para Veneno, Root ou Weaken
  // Efeitos secundários combinados (para habilidades híbridas)
  secondaryPoisonPower?: number;
  secondaryPoisonDuration?: number;
  appliesRoot?: boolean;
  rootDuration?: number;
  appliesWeaken?: boolean;
  weakenDuration?: number;
  appliesKnockback?: boolean;
  knockbackDistance?: number;
  bonusHpShield?: number;
  appliesSlow?: boolean;
  slowValue?: number;
  slowDuration?: number;
  grantsActionOnKill?: boolean;
  appliesGoldenShell?: boolean;
  goldenShellDuration?: number;
}

/**
 * Catálogo Completo das 35 Criaturas de `seed.ts` (Mapeadas por nome normalizado)
 */
const ABILITIES_BY_NAME: Record<string, CreatureAbility> = {
  // =========================================================================
  // 1. ARTRÓPODES (15 Criaturas)
  // =========================================================================
  "aranha tece-sombras": {
    name: "Cuspe de Teia",
    description:
      "Cospe uma teia em um alvo a até 2 casas, causando 35 de dano e diminuindo seu alcance de movimento em 1 por 2 rodadas.",
    cooldown: 2,
    range: 2,
    targetType: "ENEMY",
    effectType: "WEB_ROOT",
    power: 35,
    appliesSlow: true,
    slowValue: 1,
    slowDuration: 2,
  },
  "cigarrinha saltadora eterea": {
    name: "Salto Rasante",
    description:
      "Realiza um salto rasante para uma casa vazia a até 3 casas, transpondo quaisquer obstáculos.",
    cooldown: 2,
    range: 3,
    targetType: "EMPTY_TILE",
    effectType: "DASH_JUMP",
    power: 0,
  },
  "lacraia venenosa das cavernas": {
    name: "Presa Venenosa",
    description:
      "Crava suas presas causando 45 de dano direto e envenenando o inimigo (15 de dano/turno) por 3 turnos.",
    cooldown: 3,
    range: 1,
    targetType: "ENEMY",
    effectType: "POISON",
    power: 45,
    duration: 3,
    secondaryPoisonPower: 15,
    secondaryPoisonDuration: 3,
  },
  "besouro bombardeiro acido": {
    name: "Erupção Ácida",
    description:
      "Dispara jatos corrosivos a até 2 casas, causando 45 de dano ao inimigo e a outras unidades adjacentes.",
    cooldown: 2,
    range: 2,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 45,
  },
  "louva-a-deus ceifador": {
    name: "Cortes Rápidos",
    description:
      "Realiza dois cortes rápidos no inimigo, cada um causando 75% do dano normal (120 no total). Se abater o inimigo, ganha uma ação adicional.",
    cooldown: 3,
    range: 1,
    targetType: "ENEMY",
    effectType: "AOE_DAMAGE",
    power: 120,
    grantsActionOnKill: true,
  },
  "tarantula golias peluda": {
    name: "Abraço Predatório",
    description:
      "Esmaga a presa com quelíceras reforçadas, imobilizando o alvo e causando 65 de dano.",
    cooldown: 3,
    range: 1,
    targetType: "ENEMY",
    effectType: "WEB_ROOT",
    power: 65,
    appliesRoot: true,
    rootDuration: 1,
  },
  "escorpiao de obsidiana": {
    name: "Ferrão Negro Vulcânico",
    description:
      "Golpe perfurante com o ferrão a até 2 casas causando 50 de dano e envenenando o alvo por 2 turnos (18 dano/turno).",
    cooldown: 2,
    range: 2,
    targetType: "ENEMY",
    effectType: "POISON",
    power: 50,
    duration: 2,
    secondaryPoisonPower: 18,
    secondaryPoisonDuration: 2,
  },
  "caranguejo eremita de rocha": {
    name: "Arremesso de Garra",
    description:
      "Pega o alvo e o arremessa até 2 casas de distância, causando 50 de dano se for inimigo.",
    cooldown: 3,
    range: 2,
    targetType: "ENEMY",
    effectType: "KNOCKBACK",
    power: 50,
    appliesKnockback: true,
    knockbackDistance: 2,
  },
  "centopeia de carapaca titanica": {
    name: "Espiral Ácida",
    description:
      "Gira seu corpo colossal atingindo todas as 8 casas ao redor causando 40 de dano em área e envenenando todos os atingidos (10 dano/turno por 3 turnos).",
    cooldown: 3,
    range: 0,
    targetType: "SELF_AOE",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 40,
    secondaryPoisonPower: 10,
    secondaryPoisonDuration: 3,
  },
  "mariposa da nevoa toxica": {
    name: "Névoa de Esporos Luminescentes",
    description:
      "Voador: Passa por cima de obstáculos. Deixa nuvens tóxicas por onde anda e projeta esporos a 2 casas causando 35 de dano e Veneno por 3 turnos.",
    cooldown: 2,
    range: 2,
    targetType: "ENEMY",
    effectType: "POISON",
    power: 35,
    duration: 3,
    secondaryPoisonPower: 15,
    secondaryPoisonDuration: 3,
  },
  "rainha da colmeia quitina": {
    name: "Chuva de Agulhões Reais",
    description:
      "Bombardeia uma zona 3x3 inteira à distância (alcance 3) causando 50 de dano em área.",
    cooldown: 3,
    range: 3,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 50,
  },
  "imperador escaravelho dourado": {
    name: "Carapaça Dourada",
    description:
      "Ergue sua carapaça dourada, recebendo 30% de redução de dano e refletindo 50% do dano recebido por 2 turnos.",
    cooldown: 3,
    range: 0,
    targetType: "SELF_AOE",
    aoeRadius: 0,
    effectType: "HEAL_BUFF",
    power: 0,
    appliesGoldenShell: true,
    goldenShellDuration: 2,
  },

  // =========================================================================
  // 2. BESTIAIS (5 Criaturas)
  // =========================================================================
  "lobo cinzento cacador": {
    name: "Bote Predatório",
    description:
      "Salta para uma casa adjacente a um inimigo dentro do alcance 2 e desfere uma mordida feroz causando 35 de dano imediato.",
    cooldown: 2,
    range: 2,
    targetType: "ENEMY",
    effectType: "DASH_JUMP",
    power: 35,
  },
  "urso da tundra enraivecido": {
    name: "Rugido Quebra-Gelo",
    description:
      "Esmaga o chão ao redor (3x3) causando 38 de dano em área, curando +20 de HP próprio e imobilizando inimigos por 1 turno.",
    cooldown: 3,
    range: 0,
    targetType: "SELF_AOE",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 38,
    bonusHpShield: 20,
    appliesRoot: true,
    rootDuration: 1,
  },
  "grifo dos picos nevados": {
    name: "Vendaval Rasante",
    description:
      "Bate as asas criando uma rajada que causa 45 de dano em área (3x3) e empurra os inimigos atingidos 1 casa para trás.",
    cooldown: 3,
    range: 2,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 45,
    appliesKnockback: true,
  },
  "quimera das savanas": {
    name: "Baforada Tríplice",
    description:
      "Cospe fogo e peçonha em área 3x3 a até 2 casas, causando 48 de dano e Envenenando (15 de dano por 2 turnos).",
    cooldown: 3,
    range: 2,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 48,
    secondaryPoisonPower: 15,
    secondaryPoisonDuration: 2,
  },
  "behemoth primordial": {
    name: "Cataclismo Sísmico",
    description:
      "Arremessa um pedregulho titânico em área 3x3 (alcance 3) causando 70 de dano e empurrando inimigos 1 casa para trás.",
    cooldown: 4,
    range: 3,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 70,
    appliesKnockback: true,
  },

  // =========================================================================
  // 3. MORTOS-VIVOS (5 Criaturas)
  // =========================================================================
  "carnical rastejante": {
    name: "Mordida Infecciosa",
    description:
      "Injeta toxina necrótica em um inimigo adjacente causando 20 de dano e Veneno (15 de dano por 2 turnos).",
    cooldown: 2,
    range: 1,
    targetType: "ENEMY",
    effectType: "POISON",
    power: 15,
    duration: 2,
  },
  "arqueiro esqueleto maldito": {
    name: "Flecha Pesteada",
    description:
      "Dispara uma flecha necrosada que causa 25 de dano inicial e aplica Veneno severo (20 de dano por turno durante 3 turnos).",
    cooldown: 2,
    range: 3,
    targetType: "ENEMY",
    effectType: "POISON",
    power: 20,
    duration: 3,
  },
  "cavaleiro da morte decrepito": {
    name: "Golpe Profano Drenante",
    description:
      "Desfere um corte sombrio que causa 45 de dano ao inimigo, enfraquece seu ataque em 30% e drena +25 de HP para si.",
    cooldown: 3,
    range: 1,
    targetType: "ENEMY",
    effectType: "AOE_DAMAGE",
    power: 45,
    bonusHpShield: 25,
    appliesWeaken: true,
    weakenDuration: 1,
  },
  "necromante do sepulcro": {
    name: "Miasma do Sepulcro",
    description:
      "Detona energia necrótica em área 3x3 (alcance 3), causando 40 de dano e aplicando Veneno (15 de dano por 2 turnos).",
    cooldown: 3,
    range: 3,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 40,
    secondaryPoisonPower: 15,
    secondaryPoisonDuration: 2,
  },
  "lich rei das sombras": {
    name: "Inverno das Almas",
    description:
      "Congela uma zona 3x3 (alcance 4), causando 55 de dano em área, imobilizando e enfraquecendo todos os inimigos atingidos.",
    cooldown: 4,
    range: 4,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 55,
    appliesRoot: true,
    rootDuration: 1,
    appliesWeaken: true,
    weakenDuration: 1,
  },

  // =========================================================================
  // 4. ESPÍRITOS (5 Criaturas)
  // =========================================================================
  "fogo-fatuo ilusorio": {
    name: "Salto Etéreo",
    description:
      "Teleporta-se para uma casa vazia a até 3 casas ignorando obstáculos e restaura +15 de HP.",
    cooldown: 2,
    range: 3,
    targetType: "EMPTY_TILE",
    effectType: "DASH_JUMP",
    power: 15,
    bonusHpShield: 15,
  },
  "banshee lamuriante": {
    name: "Lamento Ensurdecedor",
    description:
      "Emite um grito espectral que atinge todas as casas ao redor (3x3) causando 40 de dano e reduzindo o ataque inimigo em 30% por 1 turno.",
    cooldown: 3,
    range: 0,
    targetType: "SELF_AOE",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 40,
    appliesWeaken: true,
    weakenDuration: 1,
  },
  "poltergeist telurico": {
    name: "Erupção Sísmica",
    description:
      "Faz pedras brotarem do chão em área 3x3 (alcance 2) causando 45 de dano em área e imobilizando os alvos por 1 turno.",
    cooldown: 3,
    range: 2,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 45,
    appliesRoot: true,
    rootDuration: 1,
  },
  "aparicao vingativa": {
    name: "Passo das Sombras",
    description:
      "Atravessa o véu para trás de um inimigo a até 3 casas e corta sua sombra causando 50 de dano direto.",
    cooldown: 3,
    range: 3,
    targetType: "ENEMY",
    effectType: "DASH_JUMP",
    power: 50,
  },
  "avatar da tempestade astral": {
    name: "Supernova Astral",
    description:
      "Descarrega uma tempestade cósmica em área 3x3 (alcance 3) causando 65 de dano e empurrando inimigos 1 casa para trás.",
    cooldown: 4,
    range: 3,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 65,
    appliesKnockback: true,
  },

  // =========================================================================
  // 5. HUMANOIDES (5 Criaturas)
  // =========================================================================
  "recruta com escudo torre": {
    name: "Muralha Inabalável",
    description:
      "Ergue o escudo torre reforçando sua posição, restaurando/concedendo +35 de HP/escudo imediato.",
    cooldown: 2,
    range: 0,
    targetType: "SELF_AOE",
    aoeRadius: 0,
    effectType: "HEAL_BUFF",
    power: 35,
  },
  "cacadora elfica da fronteira": {
    name: "Flecha Enraizadora",
    description:
      "Dispara uma flecha de cipós mágicos (alcance 4) que causa 30 de dano e imobiliza o inimigo por 1 turno.",
    cooldown: 2,
    range: 4,
    targetType: "ENEMY",
    effectType: "WEB_ROOT",
    power: 30,
    duration: 1,
    appliesRoot: true,
    rootDuration: 1,
  },
  "lanceiro real de aco": {
    name: "Estocada Repulsora",
    description:
      "Golpeia com a alabarda real a até 2 casas causando 40 de dano e empurrando o inimigo 1 casa para trás.",
    cooldown: 2,
    range: 2,
    targetType: "ENEMY",
    effectType: "KNOCKBACK",
    power: 40,
    appliesKnockback: true,
  },
  "mago de batalha templario": {
    name: "Luz Consagrada",
    description:
      "Cura um aliado (ou a si mesmo) a até 3 casas restaurando +50 de HP com energia sagrada.",
    cooldown: 3,
    range: 3,
    targetType: "ALLY",
    effectType: "HEAL_BUFF",
    power: 50,
  },
  "lorde comandante da alianca": {
    name: "Julgamento Real",
    description:
      "Golpeia o solo com a espada sagrada (3x3 ao redor), causando 50 de dano aos inimigos adjacentes e curando +30 de HP próprio.",
    cooldown: 3,
    range: 0,
    targetType: "SELF_AOE",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 50,
    bonusHpShield: 30,
  },

  // =========================================================================
  // 6. MECÂNICOS (5 Criaturas)
  // =========================================================================
  "drone batedor a vapor": {
    name: "Propulsão a Jato",
    description:
      "Aciona turbinas a vapor para saltar até 3 casas para uma casa vazia, ganhando +15 de blindagem.",
    cooldown: 2,
    range: 3,
    targetType: "EMPTY_TILE",
    effectType: "DASH_JUMP",
    power: 15,
    bonusHpShield: 15,
  },
  "sentinela de engrenagens": {
    name: "Rede de Contenção",
    description:
      "Dispara um arpão mecânico (alcance 3) que causa 35 de dano e imobiliza o inimigo por 1 turno.",
    cooldown: 2,
    range: 3,
    targetType: "ENEMY",
    effectType: "WEB_ROOT",
    power: 35,
    duration: 1,
    appliesRoot: true,
    rootDuration: 1,
  },
  "catapulta a vapor blindada": {
    name: "Bomba de Fragmentação Incendiária",
    description:
      "Arremessa um barril explosivo por cima de obstáculos (alcance 4) que explode em área 3x3 causando 65 de dano.",
    cooldown: 3,
    range: 4,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 65,
  },
  "colosso de latao e vapor": {
    name: "Descarga da Fornalha",
    description:
      "Libera vapor superaquecido em todas as casas ao redor (3x3), causando 55 de dano e empurrando inimigos 1 casa para trás.",
    cooldown: 3,
    range: 0,
    targetType: "SELF_AOE",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 55,
    appliesKnockback: true,
  },
  "leviata belico autonomo": {
    name: "Bombardeio Orbital de Cerco",
    description:
      "Dispara toda a bateria de artilharia em área 3x3 (alcance 4) causando 75 de dano devastador.",
    cooldown: 4,
    range: 4,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 75,
  },

  // =========================================================================
  // 7. MITOLÓGICOS (5 Criaturas)
  // =========================================================================
  "satiro dancarino dos bosques": {
    name: "Acrobacia Silvestre",
    description:
      "Salta sobre obstáculos para uma casa adjacente a um inimigo (alcance 2) e golpeia causando 35 de dano.",
    cooldown: 2,
    range: 2,
    targetType: "ENEMY",
    effectType: "DASH_JUMP",
    power: 35,
  },
  "minotauro do labirinto": {
    name: "Investida Brutal",
    description:
      "Avança sobre um inimigo a até 2 casas causando 50 de dano e empurrando-o 1 casa para trás.",
    cooldown: 3,
    range: 2,
    targetType: "ENEMY",
    effectType: "KNOCKBACK",
    power: 50,
    appliesKnockback: true,
  },
  "hidra dos pantanos sombrios": {
    name: "Dilúvio Ácido de Três Cabeças",
    description:
      "Morde e cospe ácido em todas as casas adjacentes (3x3) causando 45 de dano e Veneno (15 de dano por 2 turnos).",
    cooldown: 3,
    range: 0,
    targetType: "SELF_AOE",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 45,
    secondaryPoisonPower: 15,
    secondaryPoisonDuration: 2,
  },
  "fenix renascida do fogo": {
    name: "Chama do Renascimento",
    description:
      "Explode em chamas sagradas ao redor (3x3), causando 55 de dano aos inimigos próximos e restaurando +45 de HP próprio.",
    cooldown: 3,
    range: 0,
    targetType: "SELF_AOE",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 55,
    bonusHpShield: 45,
  },
  "dragao ancestral de platina": {
    name: "Sopro Estelar de Platina",
    description:
      "Incendeia uma área 3x3 a até 3 casas com fogo celestial, causando 75 de dano e enfraquecendo o ataque inimigo em 30%.",
    cooldown: 4,
    range: 3,
    targetType: "AREA_TARGET",
    aoeRadius: 1,
    effectType: "AOE_DAMAGE",
    power: 75,
    appliesWeaken: true,
    weakenDuration: 1,
  },
};

/**
 * Fallbacks Seguros por Tipo (`type`) caso alguma carta futura não tenha match exato pelo nome
 */
const FALLBACK_ABILITY_BY_TYPE: Record<string, CreatureAbility> = {
  ARTROPODES: ABILITIES_BY_NAME["aranha tece-sombras"],
  BESTIAIS: ABILITIES_BY_NAME["lobo cinzento cacador"],
  MORTOS_VIVOS: ABILITIES_BY_NAME["arqueiro esqueleto maldito"],
  ESPIRITOS: ABILITIES_BY_NAME["banshee lamuriante"],
  HUMANOIDES: ABILITIES_BY_NAME["recruta com escudo torre"],
  MECANICOS: ABILITIES_BY_NAME["catapulta a vapor blindada"],
  MITOLOGICOS: ABILITIES_BY_NAME["dragao ancestral de platina"],
};

export const NO_ACTIVE_ABILITY_NAMES = new Set([
  "escaravelho batedor",
  "formiga operaria blindada",
  "vespa cacadora de sangue",
  "escorpiao de obsidiana",
  "mariposa da nevoa toxica",
  "lacraia venenosa das cavernas",
  "imperador escaravelho dourado",
  "falcao peregrino das cristas",
  "javali presa-de-ferro",
  "alce espiritual da aurora",
  "hiena carniceira do deserto",
  "crocodilo couracado do pantano",
  "esqueleto com maca enferrujada",
  "zumbi pestilento decomposto",
  "aparicao da forca solitaria",
  "espectro da cripta esquecida",
  "donzela de sangue carmesim",
  "cavaleiro negro sem cabeca",
  "cao esqueletico carniceiro",
  "mumia das areias negras",
  "abominacao de retalhos",
  "gota de eter primordial",
  "eco fantasmagorico",
  "alma em chamas azuis",
  "guardiao de cristal espectral",
  "sombra errante do vacuo",
  "miliciano da aldeia",
  "escudeiro aprendiz",
  "batedor da vanguarda",
  "besta-fera atiradora",
  "guarda do palacio real",
  "rato de corda autonomo",
  "batedor gyrocopter",
  "canhao de mao a vapor",
  "ariete hidraulico de cerco",
  "torreta de flechas portatil",
  "tanque blindado a vapor",
  "guardiao mecanizado de cobre",
  "pixie travessa das fadas",
  "harpia das penhas rochosas",
  "pegaso de asas alvas",
  "basilisco olhos-de-morte",
  "centauro cacador das estepes",
]);

export function normalizeCardKey(name: string): string {
  return (name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Retorna a Habilidade Ativa Única da criatura pelo `name` (com fallback seguro pelo `type`)
 */
export function getCreatureAbility(
  name: string,
  type = "BESTIAIS"
): CreatureAbility | null {
  const key = normalizeCardKey(name);

  if (NO_ACTIVE_ABILITY_NAMES.has(key)) {
    return null;
  }

  if (ABILITIES_BY_NAME[key]) {
    return ABILITIES_BY_NAME[key];
  }

  // Busca parcial por palavras-chave para variações de nome
  for (const [catalogKey, ability] of Object.entries(ABILITIES_BY_NAME)) {
    if (key.includes(catalogKey) || catalogKey.includes(key)) {
      return ability;
    }
  }

  return (
    FALLBACK_ABILITY_BY_TYPE[(type || "").toUpperCase()] ||
    ABILITIES_BY_NAME["lobo cinzento cacador"]
  );
}

/**
 * Calcula todas as casas válidas onde a unidade pode ativar sua habilidade
 */
export function getValidAbilityTargetTiles(
  caster: BoardUnit,
  ability: CreatureAbility | null | undefined,
  grid: GridTile[][],
  units: BoardUnit[]
): { x: number; y: number }[] {
  if (!ability) return [];
  const height = grid.length || BOARD_HEIGHT;
  const width = grid[0]?.length || BOARD_WIDTH;

  // Se for centrada nela mesma (SELF_AOE), a própria casa da criatura e as casas no raio são válidas para clique
  if (ability.targetType === "SELF_AOE") {
    const tiles: { x: number; y: number }[] = [{ x: caster.x, y: caster.y }];
    const r = ability.aoeRadius || 0;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const nx = caster.x + dx;
        const ny = caster.y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !(nx === caster.x && ny === caster.y)
        ) {
          tiles.push({ x: nx, y: ny });
        }
      }
    }
    return tiles;
  }

  const valid: { x: number; y: number }[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dist = Math.max(Math.abs(x - caster.x), Math.abs(y - caster.y));
      if (dist > ability.range) continue;

      const tile = grid[y]?.[x];
      const unitAtTile = units.find((u) => u.x === x && u.y === y);

      if (ability.targetType === "EMPTY_TILE") {
        if (
          dist > 0 &&
          tile &&
          tile.type !== "OBSTACLE" &&
          !unitAtTile &&
          !(x === 0 && y === 4) &&
          !(x === 14 && y === 4)
        ) {
          valid.push({ x, y });
        }
      } else if (ability.targetType === "ENEMY") {
        if (unitAtTile && unitAtTile.owner !== caster.owner) {
          valid.push({ x, y });
        }
      } else if (ability.targetType === "ALLY") {
        if (unitAtTile && unitAtTile.owner === caster.owner) {
          valid.push({ x, y });
        }
      } else if (ability.targetType === "AREA_TARGET") {
        if (dist > 0) {
          valid.push({ x, y });
        }
      }
    }
  }

  return valid;
}

/**
 * Calcula todas as casas que serão atingidas na Zona de Impacto (ex: 3x3 para AOE_DAMAGE)
 * quando o jogador passa o mouse sobre (hoverX, hoverY) no modo de mira da habilidade.
 */
export function getAbilityImpactZoneTiles(
  caster: BoardUnit,
  ability: CreatureAbility | null | undefined,
  targetX: number,
  targetY: number,
  grid: GridTile[][]
): { x: number; y: number }[] {
  if (!ability) return [];
  const height = grid.length || BOARD_HEIGHT;
  const width = grid[0]?.length || BOARD_WIDTH;

  if (ability.targetType === "SELF_AOE") {
    const radius = ability.aoeRadius ?? 1;
    const zone: { x: number; y: number }[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dist = Math.max(Math.abs(x - caster.x), Math.abs(y - caster.y));
        if (dist <= radius) {
          zone.push({ x, y });
        }
      }
    }
    return zone;
  }

  if (ability.targetType === "AREA_TARGET" || (ability.aoeRadius && ability.aoeRadius > 0)) {
    const radius = ability.aoeRadius ?? 1;
    const zone: { x: number; y: number }[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dist = Math.max(Math.abs(x - targetX), Math.abs(y - targetY));
        if (dist <= radius) {
          zone.push({ x, y });
        }
      }
    }
    return zone;
  }

  return [{ x: targetX, y: targetY }];
}

function addOrRefreshStatus(
  effects: UnitStatusEffect[] | undefined,
  newEffect: UnitStatusEffect
): UnitStatusEffect[] {
  const list = [...(effects || [])];
  const effectWithFlag: UnitStatusEffect = {
    ...newEffect,
    justApplied: newEffect.type === "ROOTED" || newEffect.type === "WEAKENED",
  };
  const existingIdx = list.findIndex((e) => e.type === newEffect.type);
  if (existingIdx >= 0) {
    list[existingIdx] = {
      type: newEffect.type,
      value: Math.max(list[existingIdx].value, newEffect.value),
      turnsLeft: Math.max(list[existingIdx].turnsLeft, newEffect.turnsLeft),
      justApplied: effectWithFlag.justApplied,
    };
  } else {
    list.push(effectWithFlag);
  }
  return list;
}

/**
 * Executa a Habilidade Ativa da criatura no alvo (targetX, targetY)
 */
export function executeCreatureAbility(
  caster: BoardUnit,
  ability: CreatureAbility,
  targetX: number,
  targetY: number,
  grid: GridTile[][],
  units: BoardUnit[]
): {
  updatedUnits: BoardUnit[];
  floatingDamages: FloatingDamage[];
  summaryText: string;
  vfx: AbilityVfxData;
} {
  const height = grid.length || BOARD_HEIGHT;
  const width = grid[0]?.length || BOARD_WIDTH;
  const floatingDamages: FloatingDamage[] = [];
  const originCoord = { x: caster.x, y: caster.y };
  const impactZoneTiles = getAbilityImpactZoneTiles(
    caster,
    ability,
    targetX,
    targetY,
    grid
  );

  // Clonar unidades
  let nextUnits: BoardUnit[] = units.map((u) => ({
    ...u,
    statusEffects: [...(u.statusEffects || [])],
  }));

  const findCaster = () => nextUnits.find((u) => u.id === caster.id)!;

  // Aplicar recarga e consumir 1 das 2 ações da rodada na unidade conjuradora
  const casterRef = findCaster();
  const nextActions = Math.max(
    0,
    (casterRef.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) - 1
  );
  casterRef.actionsRemaining = nextActions;
  casterRef.abilityCooldown = ability.cooldown;
  casterRef.usedAbilityThisTurn = true;
  casterRef.hasMoved = nextActions <= 0;
  casterRef.hasAttacked = nextActions <= 0;

  // Se conceder escudo/cura própria (ex: Escaravelho, Urso, Fênix, Cavaleiro da Morte, Recruta)
  if (ability.bonusHpShield || ability.effectType === "HEAL_BUFF") {
    if (ability.targetType === "ALLY") {
      const allyTarget = nextUnits.find(
        (u) => u.x === targetX && u.y === targetY && u.owner === caster.owner
      );
      if (allyTarget) {
        allyTarget.currentHp = Math.min(
          allyTarget.currentHp + ability.power,
          allyTarget.maxHp + 20
        );
        floatingDamages.push({
          id: `heal_${Date.now()}_${allyTarget.id}`,
          x: allyTarget.x,
          y: allyTarget.y,
          damage: ability.power,
          label: `+${ability.power} Cura`,
          variant: "HEAL",
        });
        return {
          updatedUnits: nextUnits,
          floatingDamages,
          summaryText: `✨ "${caster.card.name}" usou ${ability.name} e restaurou +${ability.power} HP de "${allyTarget.card.name}"!`,
          vfx: {
            id: `vfx_${Date.now()}_${Math.random()}`,
            effectType: "HEAL_BUFF",
            tiles: [{ x: allyTarget.x, y: allyTarget.y }],
            origin: originCoord,
            destination: { x: allyTarget.x, y: allyTarget.y },
          },
        };
      }
    } else {
      const boost = ability.bonusHpShield || ability.power;
      casterRef.maxHp = Math.max(
        casterRef.maxHp,
        casterRef.currentHp + boost
      );
      casterRef.currentHp += boost;
      floatingDamages.push({
        id: `shield_${Date.now()}_${casterRef.id}`,
        x: casterRef.x,
        y: casterRef.y,
        damage: boost,
        label: `+${boost} HP`,
        variant: "HEAL",
      });
    }
  }

  // 1. Efeito de Salto para Casa Vazia (ex: Escaravelho Batedor, Fogo-Fátuo, Drone)
  if (ability.targetType === "EMPTY_TILE" && ability.effectType === "DASH_JUMP") {
    casterRef.x = targetX;
    casterRef.y = targetY;
    return {
      updatedUnits: nextUnits,
      floatingDamages,
      summaryText: `⚡ "${caster.card.name}" usou "${ability.name}", emergiu em (${targetX}, ${targetY}) e ganhou +${ability.power} HP!`,
      vfx: {
        id: `vfx_${Date.now()}_${Math.random()}`,
        effectType: "DASH_JUMP",
        tiles: [originCoord, { x: targetX, y: targetY }],
        origin: originCoord,
        destination: { x: targetX, y: targetY },
      },
    };
  }

  // 2. Efeito de Salto / Bote em Inimigo (ex: Lobo Cinzento Caçador, Louva-a-Deus, Aparição, Sátiro)
  if (ability.targetType === "ENEMY" && ability.effectType === "DASH_JUMP") {
    const enemy = nextUnits.find(
      (u) => u.x === targetX && u.y === targetY && u.owner !== caster.owner
    );
    if (enemy) {
      // Encontrar casa livre adjacente ao inimigo mais próxima do conjurador
      const adjDirs = [
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: -1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: 1, dy: 1 },
      ];
      let bestLanding: { x: number; y: number } | null = null;
      let bestDist = 999;

      for (const d of adjDirs) {
        const lx = enemy.x + d.dx;
        const ly = enemy.y + d.dy;
        if (lx < 0 || lx >= width || ly < 0 || ly >= height) continue;
        if (lx === casterRef.x && ly === casterRef.y) {
          bestLanding = { x: lx, y: ly };
          break;
        }
        const tile = grid[ly]?.[lx];
        const occupied = nextUnits.some((u) => u.x === lx && u.y === ly);
        if (tile && tile.type !== "OBSTACLE" && !occupied) {
          const dist = Math.hypot(lx - casterRef.x, ly - casterRef.y);
          if (dist < bestDist) {
            bestDist = dist;
            bestLanding = { x: lx, y: ly };
          }
        }
      }

      if (bestLanding) {
        casterRef.x = bestLanding.x;
        casterRef.y = bestLanding.y;
      }

      enemy.currentHp -= ability.power;
      if (ability.secondaryPoisonPower) {
        enemy.statusEffects = addOrRefreshStatus(enemy.statusEffects, {
          type: "POISON",
          value: ability.secondaryPoisonPower,
          turnsLeft: ability.secondaryPoisonDuration || 2,
        });
      }

      floatingDamages.push({
        id: `dash_dmg_${Date.now()}_${enemy.id}`,
        x: enemy.x,
        y: enemy.y,
        damage: ability.power,
        isFatal: enemy.currentHp <= 0,
        label: `-${ability.power} ${ability.name}`,
        variant: "ABILITY",
      });

      nextUnits = nextUnits.filter((u) => u.currentHp > 0);
      return {
        updatedUnits: nextUnits,
        floatingDamages,
        summaryText: `⚡ "${caster.card.name}" executou "${ability.name}" em "${enemy.card.name}" causando ${ability.power} de dano!`,
        vfx: {
          id: `vfx_${Date.now()}_${Math.random()}`,
          effectType: "DASH_JUMP",
          tiles: [
            originCoord,
            { x: casterRef.x, y: casterRef.y },
            { x: enemy.x, y: enemy.y },
          ],
          origin: originCoord,
          destination: { x: enemy.x, y: enemy.y },
        },
      };
    }
  }

  // 3. Alvo Único Inimigo (POISON, WEB_ROOT, KNOCKBACK)
  if (ability.targetType === "ENEMY") {
    const enemy = nextUnits.find(
      (u) => u.x === targetX && u.y === targetY && u.owner !== caster.owner
    );
    if (enemy) {
      const directDamage =
        ability.effectType === "POISON"
          ? ability.name.includes("Flecha Pesteada")
            ? 25
            : 15
          : ability.power;

      enemy.currentHp -= directDamage;

      if (ability.effectType === "POISON" || ability.secondaryPoisonPower) {
        enemy.statusEffects = addOrRefreshStatus(enemy.statusEffects, {
          type: "POISON",
          value: ability.secondaryPoisonPower || ability.power,
          turnsLeft: ability.duration || 2,
        });
      }

      if (ability.effectType === "WEB_ROOT" || ability.appliesRoot) {
        enemy.statusEffects = addOrRefreshStatus(enemy.statusEffects, {
          type: "ROOTED",
          value: 1,
          turnsLeft: ability.rootDuration || ability.duration || 1,
        });
      }

      if (ability.appliesWeaken) {
        enemy.statusEffects = addOrRefreshStatus(enemy.statusEffects, {
          type: "WEAKENED",
          value: 30,
          turnsLeft: ability.weakenDuration || 1,
        });
      }

      if (ability.appliesSlow) {
        enemy.statusEffects = addOrRefreshStatus(enemy.statusEffects, {
          type: "SLOWED",
          value: ability.slowValue || 1,
          turnsLeft: ability.slowDuration || 2,
        });
      }

      if (ability.effectType === "KNOCKBACK" || ability.appliesKnockback) {
        const pushDx = Math.sign(enemy.x - casterRef.x);
        const pushDy = Math.sign(enemy.y - casterRef.y);
        const maxDist = ability.knockbackDistance || 1;
        let curX = enemy.x;
        let curY = enemy.y;
        for (let s = 0; s < maxDist; s++) {
          const nx = curX + pushDx;
          const ny = curY + pushDy;
          if (
            nx >= 0 &&
            nx < width &&
            ny >= 0 &&
            ny < height &&
            grid[ny]?.[nx]?.type !== "OBSTACLE" &&
            !nextUnits.some((u) => u.x === nx && u.y === ny && u.id !== enemy.id)
          ) {
            curX = nx;
            curY = ny;
          } else {
            break;
          }
        }
        enemy.x = curX;
        enemy.y = curY;
      }

      if (ability.grantsActionOnKill && enemy.currentHp <= 0) {
        casterRef.actionsRemaining = (casterRef.actionsRemaining || 0) + 1;
        floatingDamages.push({
          id: `bonus_act_${Date.now()}_${casterRef.id}`,
          x: casterRef.x,
          y: casterRef.y,
          damage: 0,
          label: "+1 AÇÃO!",
          variant: "ABILITY",
        });
      }

      floatingDamages.push({
        id: `enemy_ab_${Date.now()}_${enemy.id}`,
        x: enemy.x,
        y: enemy.y,
        damage: directDamage,
        isFatal: enemy.currentHp <= 0,
        label:
          ability.effectType === "POISON"
            ? `-${directDamage} + Veneno!`
            : ability.appliesRoot
            ? `-${directDamage} + Preso!`
            : ability.appliesSlow
            ? `-${directDamage} + Teia (-1 Mov)!`
            : `-${directDamage}`,
        variant: ability.effectType === "POISON" ? "POISON" : "ABILITY",
      });

      nextUnits = nextUnits.filter((u) => u.currentHp > 0);
      return {
        updatedUnits: nextUnits,
        floatingDamages,
        summaryText: `⚡ "${caster.card.name}" usou "${ability.name}" em "${enemy.card.name}"!`,
        vfx: {
          id: `vfx_${Date.now()}_${Math.random()}`,
          effectType:
            ability.effectType === "POISON" || ability.secondaryPoisonPower
              ? "POISON"
              : ability.effectType,
          tiles: [{ x: enemy.x, y: enemy.y }],
          origin: originCoord,
          destination: { x: enemy.x, y: enemy.y },
        },
      };
    }
  }

  // 4. Habilidades em Área (SELF_AOE ou AREA_TARGET)
  const centerX = ability.targetType === "SELF_AOE" ? casterRef.x : targetX;
  const centerY = ability.targetType === "SELF_AOE" ? casterRef.y : targetY;
  const radius = ability.aoeRadius ?? 1;

  if (radius === 0 && (ability.effectType === "HEAL_BUFF" || ability.appliesGoldenShell)) {
    if (ability.appliesGoldenShell) {
      casterRef.statusEffects = addOrRefreshStatus(casterRef.statusEffects, {
        type: "GOLDEN_SHELL",
        value: 30,
        turnsLeft: ability.goldenShellDuration || 2,
      });
      floatingDamages.push({
        id: `gold_shell_${Date.now()}_${casterRef.id}`,
        x: casterRef.x,
        y: casterRef.y,
        damage: 0,
        label: "🛡️ Carapaça Dourada!",
        variant: "HEAL",
      });
      return {
        updatedUnits: nextUnits,
        floatingDamages,
        summaryText: `🛡️ "${caster.card.name}" ativou "${ability.name}"! +30% de Redução de Dano e 50% de Dano Refletido por 2 turnos!`,
        vfx: {
          id: `vfx_${Date.now()}_${Math.random()}`,
          effectType: "HEAL_BUFF",
          tiles: [{ x: casterRef.x, y: casterRef.y }],
          origin: originCoord,
          destination: { x: casterRef.x, y: casterRef.y },
        },
      };
    }
    return {
      updatedUnits: nextUnits,
      floatingDamages,
      summaryText: `🛡️ "${caster.card.name}" ativou "${ability.name}" e recebeu +${ability.power} HP!`,
      vfx: {
        id: `vfx_${Date.now()}_${Math.random()}`,
        effectType: "HEAL_BUFF",
        tiles: [{ x: casterRef.x, y: casterRef.y }],
        origin: originCoord,
        destination: { x: casterRef.x, y: casterRef.y },
      },
    };
  }

  let hitCount = 0;
  for (const unit of nextUnits) {
    if (unit.owner === caster.owner) continue;
    const dist = Math.max(
      Math.abs(unit.x - centerX),
      Math.abs(unit.y - centerY)
    );
    if (dist <= radius) {
      hitCount++;
      unit.currentHp -= ability.power;

      if (ability.secondaryPoisonPower) {
        unit.statusEffects = addOrRefreshStatus(unit.statusEffects, {
          type: "POISON",
          value: ability.secondaryPoisonPower,
          turnsLeft: ability.secondaryPoisonDuration || 2,
        });
      }

      if (ability.appliesRoot) {
        unit.statusEffects = addOrRefreshStatus(unit.statusEffects, {
          type: "ROOTED",
          value: 1,
          turnsLeft: ability.rootDuration || 1,
        });
      }

      if (ability.appliesWeaken) {
        unit.statusEffects = addOrRefreshStatus(unit.statusEffects, {
          type: "WEAKENED",
          value: 30,
          turnsLeft: ability.weakenDuration || 1,
        });
      }

      if (ability.appliesKnockback) {
        const pushDx = Math.sign(unit.x - casterRef.x) || 1;
        const pushDy = Math.sign(unit.y - casterRef.y);
        const nx = unit.x + pushDx;
        const ny = unit.y + pushDy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          grid[ny]?.[nx]?.type !== "OBSTACLE" &&
          !nextUnits.some((u) => u.x === nx && u.y === ny)
        ) {
          unit.x = nx;
          unit.y = ny;
        }
      }

      floatingDamages.push({
        id: `aoe_ab_${Date.now()}_${unit.id}`,
        x: unit.x,
        y: unit.y,
        damage: ability.power,
        isFatal: unit.currentHp <= 0,
        label: `-${ability.power} ${ability.name}`,
        variant: ability.secondaryPoisonPower ? "POISON" : "ABILITY",
      });
    }
  }

  nextUnits = nextUnits.filter((u) => u.currentHp > 0);
  return {
    updatedUnits: nextUnits,
    floatingDamages,
    summaryText: `💥 "${caster.card.name}" desencadeou "${ability.name}" atingindo ${hitCount} inimigo(s) por ${ability.power} de dano!`,
    vfx: {
      id: `vfx_${Date.now()}_${Math.random()}`,
      effectType: "AOE_DAMAGE",
      tiles: impactZoneTiles,
      origin: originCoord,
      destination: { x: centerX, y: centerY },
    },
  };
}

/**
 * Processa o início do turno para todas as unidades do jogador daquele turno:
 * - Reduz `abilityCooldown = Math.max(0, unit.abilityCooldown - 1)`
 * - Aplica dano de `'POISON'` com texto flutuante verde `"-X Veneno"` e mata se HP <= 0
 * - Decrementa `turnsLeft` dos `statusEffects` que expiram após o turno
 */
export function processTurnStartAbilitiesAndStatuses(
  turnOwner: UnitOwner,
  units: BoardUnit[]
): {
  updatedUnits: BoardUnit[];
  poisonDamages: FloatingDamage[];
  logs: string[];
} {
  const poisonDamages: FloatingDamage[] = [];
  const logs: string[] = [];

  const processed = units.map((unit) => {
    if (unit.owner !== turnOwner) return unit;

    let currentHp = unit.currentHp;
    const nextEffects: UnitStatusEffect[] = [];

    for (const effect of unit.statusEffects || []) {
      if (effect.type === "POISON" && effect.turnsLeft > 0) {
        currentHp -= effect.value;
        poisonDamages.push({
          id: `poison_tick_${Date.now()}_${unit.id}_${Math.random()}`,
          x: unit.x,
          y: unit.y,
          damage: effect.value,
          isFatal: currentHp <= 0,
          label: `-${effect.value} Veneno`,
          variant: "POISON",
        });
        logs.push(
          `☠️ "${unit.card.name}" sofreu -${effect.value} de Veneno (${Math.max(0, currentHp)} HP)!`
        );
      }

      if (effect.type === "POISON") {
        const remaining = effect.turnsLeft - 1;
        if (remaining > 0) {
          nextEffects.push({ ...effect, turnsLeft: remaining });
        }
      } else if (effect.justApplied) {
        // Mantém ROOTED / WEAKENED ativo durante todo o turno atual da unidade
        nextEffects.push({ ...effect, justApplied: false });
      } else {
        const remaining = effect.turnsLeft - 1;
        if (remaining > 0) {
          nextEffects.push({ ...effect, turnsLeft: remaining });
        }
      }
    }

    const isRootedNow = nextEffects.some(
      (e) => e.type === "ROOTED" && e.turnsLeft > 0
    );

    return {
      ...unit,
      currentHp,
      actionsRemaining: MAX_UNIT_ACTIONS_PER_TURN,
      hasMoved: isRootedNow ? true : false,
      hasAttacked: false,
      usedAbilityThisTurn: false,
      abilityCooldown: Math.max(0, (unit.abilityCooldown || 0) - 1),
      statusEffects: nextEffects,
    };
  });

  const aliveUnits = processed.filter((u) => u.currentHp > 0);
  return {
    updatedUnits: aliveUnits,
    poisonDamages,
    logs,
  };
}
