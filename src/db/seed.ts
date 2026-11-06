import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import * as schema from "./schema";
import { EXPANDED_CARDS_DATA } from "../lib/expandedCardsCatalog";
import { eq } from "drizzle-orm";

dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

// =========================================================================
// 1. DEFINIÇÃO DAS 50 CARTAS (35 MONSTROS NOS 7 TIPOS + 15 FEITIÇOS)
// =========================================================================

const allCardsData: schema.NewCard[] = [
  // -----------------------------------------------------------------------
  // ARTRÓPODES (5 Monstros)
  // -----------------------------------------------------------------------
  {
    name: "Escaravelho Batedor",
    description: "Criatura ágil com carapaça reforçada, excelente para reconhecer posições avançadas no tabuleiro.",
    rarity: "COMUM",
    category: "MONSTRO",
    type: "ARTROPODES",
    manaCost: 1,
    hp: 150,
    damage: 55,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/beetle-scout.png",
  },
  {
    name: "Aranha Tece-Sombras",
    description: "Cospe teias densas em um alvo, causando dano e diminuindo seu alcance de movimento.",
    rarity: "INCOMUM",
    category: "MONSTRO",
    type: "ARTROPODES",
    manaCost: 2,
    hp: 150,
    damage: 55,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/shadow-spider.png",
  },
  {
    name: "Louva-a-Deus Ceifador",
    description: "Predador implacável com lâminas quitinosas afiadas. Realiza cortes rápidos e ganha ação adicional se abater o alvo.",
    rarity: "RARO",
    category: "MONSTRO",
    type: "ARTROPODES",
    manaCost: 4,
    hp: 170,
    damage: 80,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/reaper-mantis.png",
  },
  {
    name: "Centopeia de Carapaça Titânica",
    description: "Monstruosidade couraçada colossal que atinge todas as 8 casas ao redor causando dano em área e envenenando alvos.",
    rarity: "EPICO",
    category: "MONSTRO",
    type: "ARTROPODES",
    manaCost: 7,
    hp: 270,
    damage: 75,
    movementTiles: 3,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/titanic-centipede.png",
  },
  {
    name: "Rainha da Colmeia Quitina",
    description: "Matriarca lendária que bombardeia uma zona 3x3 inteira à distância com chuva de agulhões reais.",
    rarity: "LENDARIO",
    category: "MONSTRO",
    type: "ARTROPODES",
    manaCost: 6,
    hp: 180,
    damage: 65,
    movementTiles: 1,
    rangeTiles: 3,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/chitin-hive-queen.png",
  },

  // -----------------------------------------------------------------------
  // BESTIAIS (5 Monstros)
  // -----------------------------------------------------------------------
  {
    name: "Lobo Cinzento Caçador",
    description: "Fera veloz que se desloca com agilidade superior pelas bordas da batalha.",
    rarity: "COMUM",
    category: "MONSTRO",
    type: "BESTIAIS",
    manaCost: 2,
    hp: 80,
    damage: 30,
    movementTiles: 4,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/grey-wolf-hunter.png",
  },
  {
    name: "Urso da Tundra Enraivecido",
    description: "Fera brutal que ganha fúria ao receber danos frontais.",
    rarity: "INCOMUM",
    category: "MONSTRO",
    type: "BESTIAIS",
    manaCost: 4,
    hp: 170,
    damage: 48,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/tundra-raging-bear.png",
  },
  {
    name: "Grifo dos Picos Nevados",
    description: "Criatura alada soberba que mergulha e arremessa garras afiadas sobre defesas inimigas.",
    rarity: "RARO",
    category: "MONSTRO",
    type: "BESTIAIS",
    manaCost: 5,
    hp: 145,
    damage: 60,
    movementTiles: 4,
    rangeTiles: 2,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/snowy-griffin.png",
  },
  {
    name: "Quimera das Savanas",
    description: "Predador tríplice com presas venenosas e chifres perfurantes.",
    rarity: "EPICO",
    category: "MONSTRO",
    type: "BESTIAIS",
    manaCost: 7,
    hp: 240,
    damage: 82,
    movementTiles: 3,
    rangeTiles: 2,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/savanna-chimera.png",
  },
  {
    name: "Behemoth Primordial",
    description: "Titã selvagem colhesse que esmaga o solo e arremessa rochas ciclópicas em campo aberto.",
    rarity: "LENDARIO",
    category: "MONSTRO",
    type: "BESTIAIS",
    manaCost: 10,
    hp: 430,
    damage: 125,
    movementTiles: 2,
    rangeTiles: 2,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/primordial-behemoth.png",
  },

  // -----------------------------------------------------------------------
  // MORTOS-VIVOS (5 Monstros)
  // -----------------------------------------------------------------------
  {
    name: "Carniçal Rastejante",
    description: "Cadáver reanimado de baixo custo ideal para absorver os primeiros projéteis adversários.",
    rarity: "COMUM",
    category: "MONSTRO",
    type: "MORTOS_VIVOS",
    manaCost: 1,
    hp: 50,
    damage: 20,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/crawling-ghoul.png",
  },
  {
    name: "Arqueiro Esqueleto Maldito",
    description: "Atirador esquelético capaz de disparar flechas de precisão a longa distância em linha reta.",
    rarity: "COMUM",
    category: "MONSTRO",
    type: "MORTOS_VIVOS",
    manaCost: 3,
    hp: 65,
    damage: 38,
    movementTiles: 2,
    rangeTiles: 4,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/cursed-skeleton-archer.png",
  },
  {
    name: "Cavaleiro da Morte Decrépito",
    description: "Guerreiro reerguido munido de armadura enferrujada e espada runada profana.",
    rarity: "RARO",
    category: "MONSTRO",
    type: "MORTOS_VIVOS",
    manaCost: 5,
    hp: 175,
    damage: 58,
    movementTiles: 3,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/death-knight.png",
  },
  {
    name: "Necromante do Sepulcro",
    description: "Mestre da necromancia que arremessa orbes de energia necrótica sobre unidades de cobertura.",
    rarity: "EPICO",
    category: "MONSTRO",
    type: "MORTOS_VIVOS",
    manaCost: 6,
    hp: 115,
    damage: 68,
    movementTiles: 2,
    rangeTiles: 4,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/grave-necromancer.png",
  },
  {
    name: "Lich Rei das Sombras",
    description: "Soberano dos mortos-vivos com domínio sobre almas frias e feitiços de arremesso profano.",
    rarity: "LENDARIO",
    category: "MONSTRO",
    type: "MORTOS_VIVOS",
    manaCost: 8,
    hp: 230,
    damage: 105,
    movementTiles: 2,
    rangeTiles: 4,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/shadow-lich-king.png",
  },

  // -----------------------------------------------------------------------
  // ESPÍRITOS (5 Monstros)
  // -----------------------------------------------------------------------
  {
    name: "Fogo-Fátuo Ilusório",
    description: "Chama espectral bruxuleante que flutua pelo campo arremessando centelhas sobre obstáculos.",
    rarity: "INCOMUM",
    category: "MONSTRO",
    type: "ESPIRITOS",
    manaCost: 1,
    hp: 42,
    damage: 22,
    movementTiles: 4,
    rangeTiles: 2,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/illusory-wisp.png",
  },
  {
    name: "Banshee Lamuriante",
    description: "Entidade perturbadora que emite uivos sonoros destrutivos em arremesso etéreo.",
    rarity: "RARO",
    category: "MONSTRO",
    type: "ESPIRITOS",
    manaCost: 3,
    hp: 85,
    damage: 48,
    movementTiles: 3,
    rangeTiles: 3,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/mourning-banshee.png",
  },
  {
    name: "Poltergeist Telúrico",
    description: "Espírito furioso da terra que arremessa detritos e rochas sobre formações inimigas.",
    rarity: "INCOMUM",
    category: "MONSTRO",
    type: "ESPIRITOS",
    manaCost: 4,
    hp: 120,
    damage: 42,
    movementTiles: 2,
    rangeTiles: 3,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/telluric-poltergeist.png",
  },
  {
    name: "Aparição Vingativa",
    description: "Sombra incorpórea veloz que atravessa unidades para golpear em linha de visão direta.",
    rarity: "EPICO",
    category: "MONSTRO",
    type: "ESPIRITOS",
    manaCost: 6,
    hp: 155,
    damage: 78,
    movementTiles: 3,
    rangeTiles: 2,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/vengeful-wraith.png",
  },
  {
    name: "Avatar da Tempestade Astral",
    description: "Manifestação colossal de éter puro que descarrega raios cósmicos sobre as defesas adversárias.",
    rarity: "LENDARIO",
    category: "MONSTRO",
    type: "ESPIRITOS",
    manaCost: 8,
    hp: 260,
    damage: 110,
    movementTiles: 3,
    rangeTiles: 4,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/astral-storm-avatar.png",
  },

  // -----------------------------------------------------------------------
  // HUMANOIDES (5 Monstros)
  // -----------------------------------------------------------------------
  {
    name: "Recruta com Escudo Torre",
    description: "Defensor com escudo pesado, ideal para bloquear corredores estreitos e passagens de choke-point.",
    rarity: "COMUM",
    category: "MONSTRO",
    type: "HUMANOIDES",
    manaCost: 1,
    hp: 80,
    damage: 16,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/tower-shield-recruit.png",
  },
  {
    name: "Caçadora Élfica da Fronteira",
    description: "Atiradora experiente que atinge alvos distantes com linha de tiro limpa.",
    rarity: "INCOMUM",
    category: "MONSTRO",
    type: "HUMANOIDES",
    manaCost: 2,
    hp: 65,
    damage: 32,
    movementTiles: 3,
    rangeTiles: 4,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/elven-frontier-ranger.png",
  },
  {
    name: "Lanceiro Real de Aço",
    description: "Combatente veterano com lança longa que atinge inimigos a até 2 casas de distância.",
    rarity: "COMUM",
    category: "MONSTRO",
    type: "HUMANOIDES",
    manaCost: 3,
    hp: 115,
    damage: 40,
    movementTiles: 2,
    rangeTiles: 2,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/royal-steel-pikeman.png",
  },
  {
    name: "Mago de Batalha Templário",
    description: "Conjurador que projeta feixes de choque concentrado em trajetória reta.",
    rarity: "RARO",
    category: "MONSTRO",
    type: "HUMANOIDES",
    manaCost: 5,
    hp: 125,
    damage: 64,
    movementTiles: 2,
    rangeTiles: 3,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/templar-battle-mage.png",
  },
  {
    name: "Lorde Comandante da Aliança",
    description: "Mestre de táticas e liderança marcial com presença imponente na linha de frente.",
    rarity: "EPICO",
    category: "MONSTRO",
    type: "HUMANOIDES",
    manaCost: 7,
    hp: 250,
    damage: 88,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/alliance-lord-commander.png",
  },

  // -----------------------------------------------------------------------
  // MECÂNICOS (5 Monstros)
  // -----------------------------------------------------------------------
  {
    name: "Drone Batedor a Vapor",
    description: "Unidade mecanizada leve de rápido reposicionamento para assédio veloz.",
    rarity: "COMUM",
    category: "MONSTRO",
    type: "MECANICOS",
    manaCost: 2,
    hp: 60,
    damage: 26,
    movementTiles: 4,
    rangeTiles: 2,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/steam-scout-drone.png",
  },
  {
    name: "Sentinela de Engrenagens",
    description: "Torre autônoma com alta blindagem e disparos cadenciados de metralha de chumbo.",
    rarity: "INCOMUM",
    category: "MONSTRO",
    type: "MECANICOS",
    manaCost: 3,
    hp: 135,
    damage: 36,
    movementTiles: 1,
    rangeTiles: 3,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/gear-sentinel.png",
  },
  {
    name: "Catapulta a Vapor Blindada",
    description: "Armamento de artilharia pesada que arremessa projéteis explosivos a distâncias extremas sobre muralhas.",
    rarity: "RARO",
    category: "MONSTRO",
    type: "MECANICOS",
    manaCost: 5,
    hp: 140,
    damage: 68,
    movementTiles: 1,
    rangeTiles: 5,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/steam-catapult.png",
  },
  {
    name: "Colosso de Latão e Vapor",
    description: "Golias motorizado que avança implacavelmente destruindo defesas inimigas com punhos hidráulicos.",
    rarity: "EPICO",
    category: "MONSTRO",
    type: "MECANICOS",
    manaCost: 8,
    hp: 320,
    damage: 98,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/brass-steam-colossus.png",
  },
  {
    name: "Leviatã Bélico Autônomo",
    description: "Dreadnought terrestre móvel com canhões de arremesso que devastam zonas inteiras do tabuleiro.",
    rarity: "LENDARIO",
    category: "MONSTRO",
    type: "MECANICOS",
    manaCost: 10,
    hp: 420,
    damage: 135,
    movementTiles: 1,
    rangeTiles: 5,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/autonomous-war-leviathan.png",
  },

  // -----------------------------------------------------------------------
  // MITOLÓGICOS (5 Monstros)
  // -----------------------------------------------------------------------
  {
    name: "Sátiro Dançarino dos Bosques",
    description: "Ser mítico travesso que ilude oponentes com saltos rápidos e adagas encantadas.",
    rarity: "INCOMUM",
    category: "MONSTRO",
    type: "MITOLOGICOS",
    manaCost: 2,
    hp: 85,
    damage: 32,
    movementTiles: 3,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/woodland-satyr-dancer.png",
  },
  {
    name: "Minotauro do Labirinto",
    description: "Guerreiro com chifres mortais que atropela qualquer unidade em sua linha de carga.",
    rarity: "RARO",
    category: "MONSTRO",
    type: "MITOLOGICOS",
    manaCost: 4,
    hp: 185,
    damage: 58,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/labyrinth-minotaur.png",
  },
  {
    name: "Hidra dos Pântanos Sombrios",
    description: "Besta de múltiplas cabeças com ataques ferozes que atingem alvos adjacentes.",
    rarity: "EPICO",
    category: "MONSTRO",
    type: "MITOLOGICOS",
    manaCost: 6,
    hp: 245,
    damage: 72,
    movementTiles: 2,
    rangeTiles: 2,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "/sprites/swamp-hydra.png",
  },
  {
    name: "Fênix Renascida do Fogo",
    description: "Ave lendária que arremessa labaredas celestes por cima de pilares e ressurge gloriosa.",
    rarity: "LENDARIO",
    category: "MONSTRO",
    type: "MITOLOGICOS",
    manaCost: 8,
    hp: 220,
    damage: 100,
    movementTiles: 3,
    rangeTiles: 3,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/rebirth-fire-phoenix.png",
  },
  {
    name: "Dragão Ancestral de Platina",
    description: "Soberano lendário dos céus que cospe baforadas incandescentes capazes de pulverizar fortificações.",
    rarity: "LENDARIO",
    category: "MONSTRO",
    type: "MITOLOGICOS",
    manaCost: 10,
    hp: 460,
    damage: 140,
    movementTiles: 3,
    rangeTiles: 3,
    attackType: "ARREMESSO",
    spriteUrl: "/sprites/ancestral-platinum-dragon.png",
  },

  // -----------------------------------------------------------------------
  // FEITIÇOS (15 Feitiços com efeitos variados em JSON)
  // -----------------------------------------------------------------------
  {
    name: "Toque Restaurador",
    description: "Emite uma onda de energia luminosa que restaura instantaneamente 45 de HP a uma criatura aliada.",
    rarity: "COMUM",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 1,
    hp: null,
    damage: null,
    movementTiles: null,
    rangeTiles: 3,
    attackType: null,
    spellEffectJson: {
      type: "HEAL",
      target: "SINGLE_ALLY",
      healAmount: 45,
      animation: "HOLY_GLOW",
    },
    spriteUrl: "/sprites/healing-touch.png",
  },
  {
    name: "Raio de Gelo Paralisante",
    description: "Atinge um inimigo causando 25 de dano de gelo e reduzindo sua movimentação em 2 casas por 2 turnos.",
    rarity: "COMUM",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 2,
    hp: null,
    damage: 25,
    movementTiles: null,
    rangeTiles: 4,
    attackType: null,
    spellEffectJson: {
      type: "DAMAGE_AND_DEBUFF",
      target: "SINGLE_ENEMY",
      damage: 25,
      debuff: {
        stat: "movementTiles",
        reduction: 2,
        durationTurns: 2,
      },
      statusEffect: "SLOWED",
    },
    spriteUrl: "/sprites/frost-ray.png",
  },
  {
    name: "Fúria do Berzerker",
    description: "Infundir uma unidade aliada com ira primordial, concedendo +30 de dano pelos próximos 2 turnos.",
    rarity: "INCOMUM",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 2,
    hp: null,
    damage: null,
    movementTiles: null,
    rangeTiles: 3,
    attackType: null,
    spellEffectJson: {
      type: "BUFF",
      target: "SINGLE_ALLY",
      buff: {
        stat: "damage",
        increase: 30,
        durationTurns: 2,
      },
      statusEffect: "ENRAGED",
    },
    spriteUrl: "/sprites/berserker-fury.png",
  },
  {
    name: "Cristais de Mana Fluídos",
    description: "Sintoniza a energia residual do campo de batalha e concede imediatamente +2 de mana para o turno atual.",
    rarity: "INCOMUM",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 1,
    hp: null,
    damage: null,
    movementTiles: null,
    rangeTiles: null,
    attackType: null,
    spellEffectJson: {
      type: "RESOURCE_GAIN",
      target: "PLAYER",
      manaBonus: 2,
      instant: true,
    },
    spriteUrl: "/sprites/fluid-mana-crystals.png",
  },
  {
    name: "Bola de Fogo Concentrada",
    description: "Lança um projétil flamejante veloz que incinera o alvo causando 65 de dano de fogo.",
    rarity: "COMUM",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 3,
    hp: null,
    damage: 65,
    movementTiles: null,
    rangeTiles: 4,
    attackType: null,
    spellEffectJson: {
      type: "DIRECT_DAMAGE",
      target: "SINGLE_ENEMY",
      damage: 65,
      damageElement: "FIRE",
    },
    spriteUrl: "/sprites/concentrated-fireball.png",
  },
  {
    name: "Chuva de Flechas Arcanas",
    description: "Dispara uma saraivada mágica cobrindo uma área de 3x3 casas e infligindo 45 de dano a todos os inimigos na zona.",
    rarity: "RARO",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 4,
    hp: null,
    damage: 45,
    movementTiles: null,
    rangeTiles: 5,
    attackType: null,
    spellEffectJson: {
      type: "AREA_DAMAGE",
      target: "AREA_ENEMIES",
      areaRadius: 1, // Raio 1 = 3x3 tiles
      damage: 45,
      damageElement: "ARCANE",
    },
    spriteUrl: "/sprites/arcane-arrow-barrage.png",
  },
  {
    name: "Égide Divina de Proteção",
    description: "Cria uma barreira sagrada translúcida em volta de um aliado que absorve até 80 de dano recebido.",
    rarity: "RARO",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 3,
    hp: null,
    damage: null,
    movementTiles: null,
    rangeTiles: 3,
    attackType: null,
    spellEffectJson: {
      type: "SHIELD",
      target: "SINGLE_ALLY",
      shieldAmount: 80,
      durationTurns: 3,
    },
    spriteUrl: "/sprites/divine-protection-aegis.png",
  },
  {
    name: "Correntes Etéreas Seladoras",
    description: "Aprisiona uma criatura oponente com elos espectrais, imobilizando-a totalmente por 1 rodada e causando 30 de dano.",
    rarity: "RARO",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 4,
    hp: null,
    damage: 30,
    movementTiles: null,
    rangeTiles: 4,
    attackType: null,
    spellEffectJson: {
      type: "ROOT_AND_DAMAGE",
      target: "SINGLE_ENEMY",
      damage: 30,
      rootDurationTurns: 1,
      statusEffect: "IMMOBILIZED",
    },
    spriteUrl: "/sprites/ethereal-binding-chains.png",
  },
  {
    name: "Torrente de Regeneração Coletiva",
    description: "Evoca uma cascata de águas purificadoras que regenera 65 de HP para todos os aliados em um raio de 2 casas.",
    rarity: "EPICO",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 5,
    hp: null,
    damage: null,
    movementTiles: null,
    rangeTiles: 4,
    attackType: null,
    spellEffectJson: {
      type: "AREA_HEAL",
      target: "AREA_ALLIES",
      areaRadius: 2,
      healAmount: 65,
    },
    spriteUrl: "/sprites/collective-regeneration-torrent.png",
  },
  {
    name: "Meteoro Devastador do Cataclismo",
    description: "Convoca uma rocha estelar incandescente do vácuo causando 95 de dano em área de 3x3 e queimando o solo por 2 turnos.",
    rarity: "EPICO",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 6,
    hp: null,
    damage: 95,
    movementTiles: null,
    rangeTiles: 5,
    attackType: null,
    spellEffectJson: {
      type: "AREA_DAMAGE",
      target: "AREA_ALL",
      areaRadius: 1,
      damage: 95,
      burnDamagePerTurn: 20,
      burnDurationTurns: 2,
    },
    spriteUrl: "/sprites/cataclysm-meteor.png",
  },
  {
    name: "Tempestade de Relâmpagos em Cadeia",
    description: "Desencadeia três arcos voltaicos violentos que saltam entre inimigos aleatórios causando 75 de dano a cada um.",
    rarity: "EPICO",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 7,
    hp: null,
    damage: 75,
    movementTiles: null,
    rangeTiles: 5,
    attackType: null,
    spellEffectJson: {
      type: "CHAIN_DAMAGE",
      target: "MULTI_ENEMY",
      bounces: 3,
      damagePerBounce: 75,
      damageElement: "LIGHTNING",
    },
    spriteUrl: "/sprites/chain-lightning-storm.png",
  },
  {
    name: "Sobrecarga de Éter Cósmico",
    description: "Canaliza um fluxo avassalador de energia arcana pura, injetando +4 pontos de mana imediatos na reserva do jogador.",
    rarity: "EPICO",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 3,
    hp: null,
    damage: null,
    movementTiles: null,
    rangeTiles: null,
    attackType: null,
    spellEffectJson: {
      type: "RESOURCE_GAIN",
      target: "PLAYER",
      manaBonus: 4,
      instant: true,
    },
    spriteUrl: "/sprites/cosmic-ether-overload.png",
  },
  {
    name: "Dança dos Ventos Célere",
    description: "Envolve uma unidade companheira em brisas velozes, concedendo +2 casas de movimento e imunidade a lentidão por 2 turnos.",
    rarity: "INCOMUM",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 2,
    hp: null,
    damage: null,
    movementTiles: null,
    rangeTiles: 4,
    attackType: null,
    spellEffectJson: {
      type: "BUFF",
      target: "SINGLE_ALLY",
      buff: {
        stat: "movementTiles",
        increase: 2,
        durationTurns: 2,
      },
      statusImmunity: ["SLOWED"],
    },
    spriteUrl: "/sprites/swift-wind-dance.png",
  },
  {
    name: "Praga da Decomposição Vital",
    description: "Infesta uma criatura oponente com miasma corruptor que reduz seu ataque em 30% e drena 20 de HP por turno durante 3 turnos.",
    rarity: "RARO",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 5,
    hp: null,
    damage: 20,
    movementTiles: null,
    rangeTiles: 4,
    attackType: null,
    spellEffectJson: {
      type: "DAMAGE_OVER_TIME",
      target: "SINGLE_ENEMY",
      damagePerTurn: 20,
      durationTurns: 3,
      debuff: {
        stat: "damage",
        reductionPercent: 30,
        durationTurns: 3,
      },
    },
    spriteUrl: "/sprites/decay-plague.png",
  },
  {
    name: "Julgamento do Apocalipse",
    description: "O feitiço supremo de obliteração divina: estilhaça o firmamento e inflige 150 de dano a todas as unidades inimigas no tabuleiro.",
    rarity: "LENDARIO",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 10,
    hp: null,
    damage: 150,
    movementTiles: null,
    rangeTiles: null,
    attackType: null,
    spellEffectJson: {
      type: "GLOBAL_BOARD_DAMAGE",
      target: "ALL_ENEMIES",
      damage: 150,
      ignoreArmor: true,
      animation: "CELESTIAL_SMITE",
    },
    spriteUrl: "/sprites/apocalypse-judgment.png",
  },
  ...EXPANDED_CARDS_DATA,
];

// =========================================================================
// 2. DEFINIÇÃO DAS 5 FASES DA CAMPANHA PvE (PROGRESSÃO E OBSTÁCULOS TÁTICOS)
// =========================================================================

const campaignStagesData: schema.NewCampaignStage[] = [
  {
    stageNumber: 1,
    name: "Bosque dos Primeiros Confrontos",
    aiCoreHp: 200,
    goldReward: 100,
    boardLayoutJson: {
      width: 6,
      height: 6,
      theme: "FOREST_GLADE",
      description: "Mapa introdutório com arbustos e troncos caídos para testar a mecânica de combate frontal e linha de tiro direta.",
      obstacles: [
        { x: 2, y: 1, type: "BUSH", blocksVision: false, blocksMovement: true, destructible: true, hp: 30 },
        { x: 2, y: 4, type: "BUSH", blocksVision: false, blocksMovement: true, destructible: true, hp: 30 },
        { x: 3, y: 2, type: "TREE_TRUNK", blocksVision: true, blocksMovement: true, destructible: false },
        { x: 3, y: 3, type: "TREE_TRUNK", blocksVision: true, blocksMovement: true, destructible: false },
      ],
      playerSpawnTiles: [
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 0, y: 4 },
      ],
      aiSpawnTiles: [
        { x: 5, y: 1 },
        { x: 5, y: 2 },
        { x: 5, y: 3 },
        { x: 5, y: 4 },
      ],
      aiCorePosition: { x: 5, y: 2 },
    },
    aiDeckJson: {
      archetype: "BEAST_SCOUTS",
      difficulty: "FACIL",
      deckCards: [
        { cardName: "Lobo Cinzento Caçador", quantity: 3 },
        { cardName: "Escaravelho Batedor", quantity: 3 },
        { cardName: "Carniçal Rastejante", quantity: 2 },
      ],
    },
  },
  {
    stageNumber: 2,
    name: "Desfiladeiro dos Arqueiros Malditos",
    aiCoreHp: 350,
    goldReward: 200,
    boardLayoutJson: {
      width: 7,
      height: 7,
      theme: "STONE_GORGE",
      description: "Trincheiras rochosas e barricadas de madeira no centro. Ideal para testar a vantagem de unidades com Arremesso sobre a cobertura.",
      obstacles: [
        { x: 3, y: 1, type: "WOOD_BARRICADE", blocksVision: true, blocksMovement: true, destructible: true, hp: 50 },
        { x: 3, y: 2, type: "STONE_WALL", blocksVision: true, blocksMovement: true, destructible: false },
        { x: 3, y: 4, type: "STONE_WALL", blocksVision: true, blocksMovement: true, destructible: false },
        { x: 3, y: 5, type: "WOOD_BARRICADE", blocksVision: true, blocksMovement: true, destructible: true, hp: 50 },
        { x: 1, y: 3, type: "RUBBLE", blocksVision: false, blocksMovement: true, destructible: true, hp: 40 },
        { x: 5, y: 3, type: "RUBBLE", blocksVision: false, blocksMovement: true, destructible: true, hp: 40 },
      ],
      playerSpawnTiles: [
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 0, y: 4 },
        { x: 0, y: 5 },
      ],
      aiSpawnTiles: [
        { x: 6, y: 1 },
        { x: 6, y: 2 },
        { x: 6, y: 3 },
        { x: 6, y: 4 },
        { x: 6, y: 5 },
      ],
      aiCorePosition: { x: 6, y: 3 },
    },
    aiDeckJson: {
      archetype: "SKELETON_SNIPERS",
      difficulty: "MEDIO_INICIAL",
      deckCards: [
        { cardName: "Arqueiro Esqueleto Maldito", quantity: 4 },
        { cardName: "Carniçal Rastejante", quantity: 3 },
        { cardName: "Raio de Gelo Paralisante", quantity: 2 },
      ],
    },
  },
  {
    stageNumber: 3,
    name: "Fortaleza Mecanizada de Bronze",
    aiCoreHp: 500,
    goldReward: 300,
    boardLayoutJson: {
      width: 8,
      height: 8,
      theme: "CLOCKWORK_FACTORY",
      description: "Corredores estreitos e pilares maciços de engrenagens. Requer controle posicional apurado para não ser flanqueado.",
      obstacles: [
        { x: 2, y: 2, type: "BRONZE_PILLAR", blocksVision: true, blocksMovement: true, destructible: false },
        { x: 2, y: 5, type: "BRONZE_PILLAR", blocksVision: true, blocksMovement: true, destructible: false },
        { x: 4, y: 1, type: "STEAM_VENT", blocksVision: true, blocksMovement: false, destructible: false },
        { x: 4, y: 3, type: "IRON_DOOR", blocksVision: true, blocksMovement: true, destructible: true, hp: 80 },
        { x: 4, y: 4, type: "IRON_DOOR", blocksVision: true, blocksMovement: true, destructible: true, hp: 80 },
        { x: 4, y: 6, type: "STEAM_VENT", blocksVision: true, blocksMovement: false, destructible: false },
        { x: 5, y: 2, type: "BRONZE_PILLAR", blocksVision: true, blocksMovement: true, destructible: false },
        { x: 5, y: 5, type: "BRONZE_PILLAR", blocksVision: true, blocksMovement: true, destructible: false },
      ],
      playerSpawnTiles: [
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 0, y: 4 },
        { x: 0, y: 5 },
      ],
      aiSpawnTiles: [
        { x: 7, y: 2 },
        { x: 7, y: 3 },
        { x: 7, y: 4 },
        { x: 7, y: 5 },
      ],
      aiCorePosition: { x: 7, y: 3 },
    },
    aiDeckJson: {
      archetype: "MECHANICAL_SIEGE",
      difficulty: "MEDIO",
      deckCards: [
        { cardName: "Drone Batedor a Vapor", quantity: 3 },
        { cardName: "Sentinela de Engrenagens", quantity: 3 },
        { cardName: "Catapulta a Vapor Blindada", quantity: 2 },
        { cardName: "Bola de Fogo Concentrada", quantity: 2 },
      ],
    },
  },
  {
    stageNumber: 4,
    name: "Catacumbas dos Espíritos Esquecidos",
    aiCoreHp: 700,
    goldReward: 400,
    boardLayoutJson: {
      width: 8,
      height: 8,
      theme: "ETHEREAL_CATACOMBS",
      description: "Abismos abissais dividem as alas do tabuleiro: o movimento terrestre é barrado, mas ataques de Arremesso e feitiços atravessam livremente.",
      obstacles: [
        { x: 3, y: 0, type: "CHASM", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 3, y: 1, type: "CHASM", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 3, y: 2, type: "CHASM", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 3, y: 5, type: "CHASM", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 3, y: 6, type: "CHASM", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 3, y: 7, type: "CHASM", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 2, y: 3, type: "CURSED_TOMB", blocksVision: true, blocksMovement: true, destructible: true, hp: 60 },
        { x: 5, y: 4, type: "CURSED_TOMB", blocksVision: true, blocksMovement: true, destructible: true, hp: 60 },
      ],
      playerSpawnTiles: [
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 0, y: 4 },
        { x: 0, y: 5 },
      ],
      aiSpawnTiles: [
        { x: 7, y: 2 },
        { x: 7, y: 3 },
        { x: 7, y: 4 },
        { x: 7, y: 5 },
      ],
      aiCorePosition: { x: 7, y: 4 },
    },
    aiDeckJson: {
      archetype: "GHOST_HORDE",
      difficulty: "DIFICIL",
      deckCards: [
        { cardName: "Fogo-Fátuo Ilusório", quantity: 3 },
        { cardName: "Banshee Lamuriante", quantity: 2 },
        { cardName: "Necromante do Sepulcro", quantity: 2 },
        { cardName: "Correntes Etéreas Seladoras", quantity: 2 },
        { cardName: "Torrente de Regeneração Coletiva", quantity: 1 },
      ],
    },
  },
  {
    stageNumber: 5,
    name: "Cidadela do Dragão Supremo",
    aiCoreHp: 1000,
    goldReward: 500,
    boardLayoutJson: {
      width: 10,
      height: 10,
      theme: "DRAGON_SANCTUARY",
      description: "Campo de batalha épico com poços de lava ardente, muralhas defensivas e o colossal Núcleo Dracônico com 1000 de HP.",
      obstacles: [
        { x: 3, y: 2, type: "LAVA_PIT", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 3, y: 3, type: "LAVA_PIT", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 3, y: 6, type: "LAVA_PIT", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 3, y: 7, type: "LAVA_PIT", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 5, y: 1, type: "OBSIDIAN_WALL", blocksVision: true, blocksMovement: true, destructible: false },
        { x: 5, y: 4, type: "DRAGON_GATE", blocksVision: true, blocksMovement: true, destructible: true, hp: 120 },
        { x: 5, y: 5, type: "DRAGON_GATE", blocksVision: true, blocksMovement: true, destructible: true, hp: 120 },
        { x: 5, y: 8, type: "OBSIDIAN_WALL", blocksVision: true, blocksMovement: true, destructible: false },
        { x: 7, y: 3, type: "LAVA_PIT", blocksVision: false, blocksMovement: true, destructible: false },
        { x: 7, y: 6, type: "LAVA_PIT", blocksVision: false, blocksMovement: true, destructible: false },
      ],
      playerSpawnTiles: [
        { x: 0, y: 3 },
        { x: 0, y: 4 },
        { x: 0, y: 5 },
        { x: 0, y: 6 },
        { x: 1, y: 4 },
        { x: 1, y: 5 },
      ],
      aiSpawnTiles: [
        { x: 9, y: 3 },
        { x: 9, y: 4 },
        { x: 9, y: 5 },
        { x: 9, y: 6 },
        { x: 8, y: 4 },
        { x: 8, y: 5 },
      ],
      aiCorePosition: { x: 9, y: 4 },
    },
    aiDeckJson: {
      archetype: "DRAGON_APOCALYPSE",
      difficulty: "EXTREMO_BOSS",
      deckCards: [
        { cardName: "Dragão Ancestral de Platina", quantity: 1 },
        { cardName: "Fênix Renascida do Fogo", quantity: 1 },
        { cardName: "Meteoro Devastador do Cataclismo", quantity: 2 },
        { cardName: "Lorde Comandante da Aliança", quantity: 2 },
        { cardName: "Colosso de Latão e Vapor", quantity: 2 },
        { cardName: "Julgamento do Apocalipse", quantity: 1 },
      ],
    },
  },
];

// =========================================================================
// 3. EXECUÇÃO DO SEED COM RECONCILIAÇÃO E CRIAÇÃO DO DECK DE 30 CARTAS
// =========================================================================

async function runSeed() {
  console.log("=========================================================");
  console.log("🎮 [KazTactics] Iniciando Seed Completo do NeonDB...");
  console.log("=========================================================");

  // 1. Limpeza segura das tabelas (com base nas chaves estrangeiras)
  console.log("🧹 Limpando dados legados para garantir integridade...");
  await db.delete(schema.deckCards);
  await db.delete(schema.userCards);
  await db.delete(schema.decks);
  await db.delete(schema.campaignStages);
  await db.delete(schema.users);
  await db.delete(schema.cards);
  console.log("✅ Banco pronto para receber novas sementes.");

  // 2. Inserção das 50 cartas
  console.log(`🎴 Inserindo ${allCardsData.length} cartas no catálogo...`);
  const insertedCards = await db
    .insert(schema.cards)
    .values(allCardsData)
    .returning();
  console.log(`✨ ${insertedCards.length} cartas cadastradas com sucesso!`);

  // Indexar cartas por nome para fácil montagem de decks
  const cardMap = new Map<string, typeof insertedCards[0]>();
  for (const c of insertedCards) {
    cardMap.set(c.name, c);
  }

  // 3. Inserção das 5 Fases da Campanha PvE
  console.log(`🏰 Cadastrando ${campaignStagesData.length} fases da Campanha PvE...`);
  const insertedStages = await db
    .insert(schema.campaignStages)
    .values(campaignStagesData)
    .returning();

  for (const stg of insertedStages) {
    console.log(
      `   ⭐ Fase ${stg.stageNumber}: "${stg.name}" | HP Núcleo: ${stg.aiCoreHp} | Recompensa: ${stg.goldReward} Ouro`
    );
  }

  // 4. Criação do Usuário Padrão de Teste
  console.log("👤 Criando usuário de testes do jogo...");
  const [user] = await db
    .insert(schema.users)
    .values({
      username: "EstrategistaKaz",
      gold: 500,
      currentStage: 1,
    })
    .returning();
  console.log(`   👉 Usuário criado: "${user.username}" (ID: ${user.id})`);

  // 5. Conceder Coleção Completa ao Jogador (user_cards)
  // Concede 3 cópias de cada uma das 50 cartas para livre montagem
  console.log("📦 Atribuindo coleção do jogador (user_cards)...");
  const userCardsPayload = insertedCards.map((c) => ({
    userId: user.id,
    cardId: c.id,
    quantity: 3,
  }));
  await db.insert(schema.userCards).values(userCardsPayload);
  console.log(`   🎁 ${userCardsPayload.length} tipos de cartas adicionados à coleção do jogador!`);

  // 6. Criar Baralho Inicial Válido (decks)
  console.log("⚔️ Montando Baralho Inicial Ativo (30 cartas: 20 Monstros + 10 Feitiços)...");
  const [deck] = await db
    .insert(schema.decks)
    .values({
      userId: user.id,
      name: "Baralho Tático Inicial (30 Cartas)",
      isActive: true,
    })
    .returning();

  // Seleção precisa: 10 Monstros (2 cópias cada = 20 Monstros) + 5 Feitiços (2 cópias cada = 10 Feitiços)
  const deckMonsters = [
    "Escaravelho Batedor",           // 2x (Artrópodes, Mana 1)
    "Lobo Cinzento Caçador",         // 2x (Bestiais, Mana 2)
    "Caçadora Élfica da Fronteira",   // 2x (Humanoides, Mana 2, Alcance 4)
    "Arqueiro Esqueleto Maldito",     // 2x (Mortos-Vivos, Mana 3, Alcance 4)
    "Sentinela de Engrenagens",       // 2x (Mecânicos, Mana 3, Alcance 3)
    "Banshee Lamuriante",            // 2x (Espíritos, Mana 3, Arremesso)
    "Minotauro do Labirinto",         // 2x (Mitológicos, Mana 4)
    "Louva-a-Deus Ceifador",         // 2x (Artrópodes, Mana 4)
    "Catapulta a Vapor Blindada",     // 2x (Mecânicos, Mana 5, Arremesso 5)
    "Cavaleiro da Morte Decrépito",   // 2x (Mortos-Vivos, Mana 5)
  ];

  const deckSpells = [
    "Toque Restaurador",              // 2x (Feitiço de Cura, Mana 1)
    "Raio de Gelo Paralisante",       // 2x (Feitiço de Dano + Lentidão, Mana 2)
    "Cristais de Mana Fluídos",       // 2x (Feitiço de Ganho de Mana, Mana 1)
    "Bola de Fogo Concentrada",       // 2x (Feitiço de Dano Direto, Mana 3)
    "Chuva de Flechas Arcanas",       // 2x (Feitiço de Dano em Área 3x3, Mana 4)
  ];

  const deckCardsPayload: schema.NewDeckCard[] = [];
  let totalMonsters = 0;
  let totalSpells = 0;

  for (const monsterName of deckMonsters) {
    const card = cardMap.get(monsterName);
    if (!card) throw new Error(`Carta não encontrada: ${monsterName}`);
    deckCardsPayload.push({
      deckId: deck.id,
      cardId: card.id,
      quantity: 2,
    });
    totalMonsters += 2;
  }

  for (const spellName of deckSpells) {
    const card = cardMap.get(spellName);
    if (!card) throw new Error(`Carta de feitiço não encontrada: ${spellName}`);
    deckCardsPayload.push({
      deckId: deck.id,
      cardId: card.id,
      quantity: 2,
    });
    totalSpells += 2;
  }

  await db.insert(schema.deckCards).values(deckCardsPayload);

  const totalDeckCards = totalMonsters + totalSpells;
  console.log("---------------------------------------------------------");
  console.log(`🎯 Baralho Ativo: "${deck.name}"`);
  console.log(`   - Total de Monstros : ${totalMonsters} cartas (10 tipos x 2)`);
  console.log(`   - Total de Feitiços : ${totalSpells} cartas (5 tipos x 2)`);
  console.log(`   - Total no Baralho  : ${totalDeckCards} cartas (Exatamente 30)`);
  console.log("---------------------------------------------------------");
  console.log("🏁 [KazTactics] Seed concluído com 100% de sucesso!");
  console.log("=========================================================");
}

runSeed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Falha fatal ao executar o seed:", error);
    process.exit(1);
  });
