import fs from "fs";
import path from "path";
import zlib from "zlib";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL não definida em .env");
  process.exit(1);
}

const sql = neon(connectionString);

export interface CardSpriteConfig {
  name: string;
  slug: string;
  englishDescription: string;
  isSpell?: boolean;
  themeColor?: [number, number, number]; // [R, G, B]
}

export const CARDS_CONFIG: CardSpriteConfig[] = [
  // --- Unidades em Destaque no Tabuleiro ---
  {
    name: "Arqueiro Esqueleto Maldito",
    slug: "cursed-skeleton-archer",
    englishDescription: "cursed undead skeleton sniper archer dressed in ragged purple cloak aiming an ornate dark longbow with spectral arrow",
    themeColor: [168, 85, 247],
  },
  {
    name: "Catapulta a Vapor Blindada",
    slug: "steam-catapult",
    englishDescription: "heavy reinforced steampunk steam-powered wheeled catapult artillery war machine with brass pipes, copper boiler and explosive shell",
    themeColor: [245, 158, 11],
  },
  {
    name: "Lobo Cinzento Caçador",
    slug: "grey-wolf-hunter",
    englishDescription: "agile silver grey dire wolf beast predator snarling in aggressive side combat stance with glowing electric blue eyes",
    themeColor: [56, 189, 248],
  },

  // ==========================================
  // ARTRÓPODES
  // ==========================================
  {
    name: "Escaravelho Batedor",
    slug: "beetle-scout",
    englishDescription: "golden armored scarab beetle warrior scout with glowing horn and sharp chitin claws",
    themeColor: [234, 179, 8],
  },
  {
    name: "Aranha Tece-Sombras",
    slug: "shadow-spider",
    englishDescription: "shadow weaver spider arachnid monster shooting glowing dark purple webs from fangs",
    themeColor: [147, 51, 234],
  },
  {
    name: "Louva-a-Deus Ceifador",
    slug: "reaper-mantis",
    englishDescription: "emerald green praying mantis assassin with dual glowing scythe forelegs ready to strike",
    themeColor: [34, 197, 94],
  },
  {
    name: "Centopeia de Carapaça Titânica",
    slug: "titanic-centipede",
    englishDescription: "colossal armored dread centipede beast with heavy jagged red chitin plates and venom mandibles",
    themeColor: [225, 29, 72],
  },
  {
    name: "Rainha da Colmeia Quitina",
    slug: "chitin-hive-queen",
    englishDescription: "majestic royal insectoid queen with crown antennas, glowing ether insect wings and golden chitin staff",
    themeColor: [251, 191, 36],
  },

  // ==========================================
  // BESTIAIS
  // ==========================================
  {
    name: "Urso da Tundra Enraivecido",
    slug: "tundra-raging-bear",
    englishDescription: "ferocious tundra white grizzly bear berserker with frost armored claws roaring",
    themeColor: [203, 213, 225],
  },
  {
    name: "Grifo dos Picos Nevados",
    slug: "snowy-griffin",
    englishDescription: "noble snow griffin with snowy eagle head, grand feathered wings and muscular white lion body",
    themeColor: [248, 250, 252],
  },
  {
    name: "Quimera das Savanas",
    slug: "savanna-chimera",
    englishDescription: "mythical savanna chimera with golden lion head, curved goat horns, bat wings and serpent tail",
    themeColor: [217, 119, 6],
  },
  {
    name: "Behemoth Primordial",
    slug: "primordial-behemoth",
    englishDescription: "colossal primordial horned behemoth titan monster with stony hide slamming fist into the earth",
    themeColor: [120, 53, 15],
  },

  // ==========================================
  // MORTOS-VIVOS
  // ==========================================
  {
    name: "Carniçal Rastejante",
    slug: "crawling-ghoul",
    englishDescription: "ghastly crawling undead ghoul with pale decaying flesh, sharp claws and eerie green soul flames",
    themeColor: [132, 204, 22],
  },
  {
    name: "Cavaleiro da Morte Decrépito",
    slug: "death-knight",
    englishDescription: "fallen death knight warrior in spiked obsidian plate armor holding a glowing cursed runeblade",
    themeColor: [99, 102, 241],
  },
  {
    name: "Necromante do Sepulcro",
    slug: "grave-necromancer",
    englishDescription: "sinister dark necromancer in hooded robes hovering while holding skull wand conjuring green necrotic flames",
    themeColor: [16, 185, 129],
  },
  {
    name: "Lich Rei das Sombras",
    slug: "shadow-lich-king",
    englishDescription: "spectral undead lich emperor wearing an ornate bone crown floating with an ethereal frost grimoire",
    themeColor: [192, 132, 252],
  },

  // ==========================================
  // ESPÍRITOS
  // ==========================================
  {
    name: "Fogo-Fátuo Ilusório",
    slug: "illusory-wisp",
    englishDescription: "ethereal floating blue and violet flame spirit wisp with charming celestial eyes and starlight aura",
    themeColor: [96, 165, 250],
  },
  {
    name: "Banshee Lamuriante",
    slug: "mourning-banshee",
    englishDescription: "floating spectral banshee ghost maiden with flowing glowing cyan hair screaming sonic hex shockwaves",
    themeColor: [45, 212, 191],
  },
  {
    name: "Poltergeist Telúrico",
    slug: "telluric-poltergeist",
    englishDescription: "furious earthen poltergeist spirit composed of levitating mossy stone slabs and glowing amber runes",
    themeColor: [245, 158, 11],
  },
  {
    name: "Aparição Vingativa",
    slug: "vengeful-wraith",
    englishDescription: "dark hooded wraith phantom with floating ragged cloak brandishing an ethereal silver scythe",
    themeColor: [148, 163, 184],
  },
  {
    name: "Avatar da Tempestade Astral",
    slug: "astral-storm-avatar",
    englishDescription: "majestic celestial astral titan made of pure swirling cosmic ether, nebulae and crackling star lightning",
    themeColor: [129, 140, 248],
  },

  // ==========================================
  // HUMANOIDES
  // ==========================================
  {
    name: "Recruta com Escudo Torre",
    slug: "tower-shield-recruit",
    englishDescription: "stalwart anime soldier knight in polished iron armor hunkered behind a massive iron tower shield",
    themeColor: [148, 163, 184],
  },
  {
    name: "Caçadora Élfica da Fronteira",
    slug: "elven-frontier-ranger",
    englishDescription: "graceful elven female ranger with emerald tunic and feathered cap drawing an elegant woodcraft bow",
    themeColor: [34, 197, 94],
  },
  {
    name: "Lanceiro Real de Aço",
    slug: "royal-steel-pikeman",
    englishDescription: "disciplined royal imperial pikeman in silver plate armor holding an exceptionally long ornate spear",
    themeColor: [59, 130, 246],
  },
  {
    name: "Mago de Batalha Templário",
    slug: "templar-battle-mage",
    englishDescription: "templar battle sorcerer in white and gold regalia channeling a blazing celestial arcane beam from scepter",
    themeColor: [234, 179, 8],
  },
  {
    name: "Lorde Comandante da Aliança",
    slug: "alliance-lord-commander",
    englishDescription: "commanding hero lord in ornate gold and sapphire armor with flowing crimson cape brandishing a glowing greatsword",
    themeColor: [251, 191, 36],
  },

  // ==========================================
  // MECÂNICOS
  // ==========================================
  {
    name: "Drone Batedor a Vapor",
    slug: "steam-scout-drone",
    englishDescription: "steampunk flying brass scout drone with rotating copper rotors, pressure gauges and glowing searchlight",
    themeColor: [217, 119, 6],
  },
  {
    name: "Sentinela de Engrenagens",
    slug: "gear-sentinel",
    englishDescription: "clockwork brass combat automaton soldier with cogwheels gears and high caliber repeating rifle",
    themeColor: [202, 138, 4],
  },
  {
    name: "Colosso de Latão e Vapor",
    slug: "brass-steam-colossus",
    englishDescription: "giant steampunk iron and brass golem with heavy furnace chest, exhaust pipes and hydraulic steam piston fists",
    themeColor: [180, 83, 9],
  },
  {
    name: "Leviatã Bélico Autônomo",
    slug: "autonomous-war-leviathan",
    englishDescription: "mammoth tracked steam fortress dreadnought tank bristling with heavy artillery cannons and iron armor plates",
    themeColor: [154, 52, 18],
  },

  // ==========================================
  // MITOLÓGICOS
  // ==========================================
  {
    name: "Sátiro Dançarino dos Bosques",
    slug: "woodland-satyr-dancer",
    englishDescription: "cheerful horned faun satyr rogue playing pan pipes and holding twin carved daggers in woodland dance",
    themeColor: [74, 222, 128],
  },
  {
    name: "Minotauro do Labirinto",
    slug: "labyrinth-minotaur",
    englishDescription: "hulking muscular bull-headed minotaur warrior in iron harness roaring with a double-bladed battleaxe",
    themeColor: [239, 68, 68],
  },
  {
    name: "Hidra dos Pântanos Sombrios",
    slug: "swamp-hydra",
    englishDescription: "fearsome three-headed swamp hydra dragon with jagged scales venomous fangs and poisonous purple spit",
    themeColor: [168, 85, 247],
  },
  {
    name: "Fênix Renascida do Fogo",
    slug: "rebirth-fire-phoenix",
    englishDescription: "glorious radiant fire phoenix bird with dazzling fiery plumage spreading wings engulfed in sacred flame",
    themeColor: [249, 115, 22],
  },
  {
    name: "Dragão Ancestral de Platina",
    slug: "ancestral-platinum-dragon",
    englishDescription: "colossal divine platinum elder dragon sovereign with shining mirrored scales and crown of radiant horns",
    themeColor: [226, 232, 240],
  },

  // ==========================================
  // FEITIÇOS
  // ==========================================
  {
    name: "Toque Restaurador",
    slug: "healing-touch",
    englishDescription: "radiant holy hands cupped releasing gentle emerald and golden healing light with floating flower petals",
    isSpell: true,
    themeColor: [74, 222, 128],
  },
  {
    name: "Raio de Gelo Paralisante",
    slug: "frost-ray",
    englishDescription: "piercing icy freeze ray beam bursting into sharp glacial ice crystals and frozen blizzard runes",
    isSpell: true,
    themeColor: [56, 189, 248],
  },
  {
    name: "Fúria do Berzerker",
    slug: "berserker-fury",
    englishDescription: "raging crimson warrior warcry aura with flaming crossed axes and crackling scarlet lightning",
    isSpell: true,
    themeColor: [239, 68, 68],
  },
  {
    name: "Cristais de Mana Fluídos",
    slug: "fluid-mana-crystals",
    englishDescription: "cluster of floating glowing cyan mana crystal gemstones shimmering with raw magical starlight energy",
    isSpell: true,
    themeColor: [34, 211, 238],
  },
  {
    name: "Bola de Fogo Concentrada",
    slug: "concentrated-fireball",
    englishDescription: "superheated blazing solar fireball projectile hurtling forward with swirling fiery comet tails",
    isSpell: true,
    themeColor: [249, 115, 22],
  },
  {
    name: "Chuva de Flechas Arcanas",
    slug: "arcane-arrow-barrage",
    englishDescription: "celestial volley of crystalline glowing violet arcane magic arrows descending from glowing magic circles",
    isSpell: true,
    themeColor: [168, 85, 247],
  },
  {
    name: "Égide Divina de Proteção",
    slug: "divine-protection-aegis",
    englishDescription: "sacred glowing translucent golden hexagonal energy barrier shield adorned with angelic wing motifs",
    isSpell: true,
    themeColor: [251, 191, 36],
  },
  {
    name: "Correntes Etéreas Seladoras",
    slug: "ethereal-binding-chains",
    englishDescription: "ethereal glowing violet spectral rune chains wrapping and locking with glowing arcane padlocks",
    isSpell: true,
    themeColor: [192, 132, 252],
  },
  {
    name: "Torrente de Regeneração Coletiva",
    slug: "collective-regeneration-torrent",
    englishDescription: "magical fountain wave of crystalline glowing turquoise holy water and blooming luminous lotus flowers",
    isSpell: true,
    themeColor: [45, 212, 191],
  },
  {
    name: "Meteoro Devastador do Cataclismo",
    slug: "cataclysm-meteor",
    englishDescription: "colossal flaming magma meteor crashing from outer space engulfed in dark smoke and molten fire",
    isSpell: true,
    themeColor: [239, 68, 68],
  },
  {
    name: "Tempestade de Relâmpagos em Cadeia",
    slug: "chain-lightning-storm",
    englishDescription: "violent multi-branching electric blue and purple chain lightning arc sparks crackling in stormy sky",
    isSpell: true,
    themeColor: [147, 51, 234],
  },
  {
    name: "Sobrecarga de Éter Cósmico",
    slug: "cosmic-ether-overload",
    englishDescription: "whirling cosmic spiral galaxy mana portal bursting with multi-colored starlight and celestial rings",
    isSpell: true,
    themeColor: [192, 132, 252],
  },
  {
    name: "Dança dos Ventos Célere",
    slug: "swift-wind-dance",
    englishDescription: "graceful emerald wind gale cyclone spiral with glowing green feathers and swift speed trails",
    isSpell: true,
    themeColor: [52, 211, 153],
  },
  {
    name: "Praga da Decomposição Vital",
    slug: "decay-plague",
    englishDescription: "ominous bubbling dark toxic green miasma skull vapor surrounded by withering black thorn vines",
    isSpell: true,
    themeColor: [101, 163, 13],
  },
  {
    name: "Julgamento do Apocalipse",
    slug: "apocalypse-judgment",
    englishDescription: "gargantuan divine holy celestial broadsword descending through golden clouds unleashing a pillar of heavenly light",
    isSpell: true,
    themeColor: [253, 224, 71],
  },
];

const SPRITES_DIR = path.resolve(process.cwd(), "public", "sprites");

// Helper para cálculo do CRC32 de chunks PNG
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * Cria um PNG 256x256 RGBA válido com fundo 100% preto (#000000) e
 * a silhueta cel-shaded da criatura centralizada com aura de cor temática.
 * Garante que qualquer carta que ainda não teve o download do Pollinations
 * concluído tenha um arquivo .png físico válido e pronto para o Flood-Fill!
 */
function generateFallbackSpritePng(card: CardSpriteConfig): Buffer {
  const width = 256;
  const height = 256;
  const [themeR, themeG, themeB] = card.themeColor || [200, 160, 80];

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits por canal
  ihdrData[9] = 6; // RGBA
  const ihdrCrc = crc32(Buffer.concat([Buffer.from("IHDR"), ihdrData]));
  const ihdr = Buffer.concat([
    Buffer.from([0, 0, 0, 13]),
    Buffer.from("IHDR"),
    ihdrData,
    Buffer.alloc(4),
  ]);
  ihdr.writeUInt32BE(ihdrCrc, 21);

  // Raw scanlines com filtro 0 (None)
  const raw = Buffer.alloc(height * (width * 4 + 1));
  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    raw[rowOffset] = 0; // Filter: 0

    for (let x = 0; x < width; x++) {
      const pi = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - (cy + 10);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Fundo preto puro #000000 nas bordas (para o flood-fill)
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 255;

      if (card.isSpell) {
        // Feitiço: orbe e runas mágicas concêntricas
        if (dist < 75) {
          const intensity = 1 - dist / 75;
          r = Math.min(255, Math.round(themeR * intensity + 40));
          g = Math.min(255, Math.round(themeG * intensity + 40));
          b = Math.min(255, Math.round(themeB * intensity + 60));
        } else if (dist < 88 && dist > 80) {
          // Anel rúnico externo
          r = themeR;
          g = themeG;
          b = themeB;
        }
      } else {
        // Criatura: silhueta com corpo, cabeça e ombreiras cel-shaded
        const inHead = (x - cx) ** 2 / 24 ** 2 + (y - (cy - 38)) ** 2 / 28 ** 2 <= 1;
        const inBody = (x - cx) ** 2 / 46 ** 2 + (y - (cy + 14)) ** 2 / 56 ** 2 <= 1;
        const inLegs = (x - cx) ** 2 / 36 ** 2 + (y - (cy + 68)) ** 2 / 30 ** 2 <= 1;

        if (inHead || inBody || inLegs) {
          // Luz cel-shaded direcional
          const isHighlight = x < cx - 4 && y < cy + 10;
          r = isHighlight ? Math.min(255, themeR + 60) : themeR;
          g = isHighlight ? Math.min(255, themeG + 60) : themeG;
          b = isHighlight ? Math.min(255, themeB + 60) : themeB;
        } else if (dist < 95 && dist > 85) {
          // Aura sutil nos contornos externos
          r = Math.round(themeR * 0.4);
          g = Math.round(themeG * 0.4);
          b = Math.round(themeB * 0.4);
        }
      }

      raw[pi] = r;
      raw[pi + 1] = g;
      raw[pi + 2] = b;
      raw[pi + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idat = Buffer.alloc(8 + compressed.length + 4);
  idat.writeUInt32BE(compressed.length, 0);
  Buffer.from("IDAT").copy(idat, 4);
  compressed.copy(idat, 8);
  const idatCrc = crc32(Buffer.concat([Buffer.from("IDAT"), compressed]));
  idat.writeUInt32BE(idatCrc, 8 + compressed.length);

  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
  return Buffer.concat([sig, ihdr, idat, iend]);
}

function buildPrompt(card: CardSpriteConfig): string {
  if (card.isSpell) {
    return `2D anime tactical RPG game sprite of magical spell icon ${card.englishDescription}, glowing magical fx, cel shaded, vibrant colors, clean thick outlines, isolated on a pure solid black background #000000, game asset, high quality, Granblue Fantasy and Fire Emblem Heroes style`;
  }
  return `2D anime tactical RPG game sprite of ${card.englishDescription}, full body side view combat stance, cel shaded, vibrant colors, clean thick outlines, isolated on a pure solid black background #000000, game asset, high quality, Granblue Fantasy and Fire Emblem Heroes style`;
}

async function fetchImageBuffer(url: string, timeoutMs = 25000): Promise<Buffer> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "curl/8.16.0",
        Accept: "image/*,*/*",
      },
    });

    if (!res.ok) {
      const retryAfter = res.headers.get("retry-after");
      throw new Error(`HTTP ${res.status}${retryAfter ? ` (retry-after: ${retryAfter}s)` : ""}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } finally {
    clearTimeout(timer);
  }
}

async function downloadOrEnsureSprite(card: CardSpriteConfig): Promise<boolean> {
  const filePath = path.join(SPRITES_DIR, `${card.slug}.png`);

  // Se já existe e tem tamanho de imagem real (> 1500 bytes)
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    if (stat.size > 1500) {
      console.log(`⏩ [OK] ${card.name} (${card.slug}.png - ${(stat.size / 1024).toFixed(1)} KB)`);
      return true;
    }
  }

  // Tenta baixar do Pollinations
  const prompt = buildPrompt(card);
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&model=flux`;

  console.log(`🎨 [Baixando Pollinations] ${card.name} (${card.slug})...`);
  try {
    const buffer = await fetchImageBuffer(url, 25000);
    if (buffer && buffer.length > 1000) {
      fs.writeFileSync(filePath, buffer);
      console.log(`✅ [Salvo Pollinations] ${card.name} -> public/sprites/${card.slug}.png (${(buffer.length / 1024).toFixed(1)} KB)`);
      return true;
    }
  } catch (err: any) {
    console.warn(`⚠️ [Pollinations indisponível/rate-limit] ${card.name}: ${err?.message || err}`);
  }

  // Se o download do Pollinations não concluiu, gera um sprite 2D cel-shaded com fundo preto
  console.log(`🛠️ [Gerando Sprite 2D Físico] ${card.name} -> public/sprites/${card.slug}.png`);
  const fallbackBuffer = generateFallbackSpritePng(card);
  fs.writeFileSync(filePath, fallbackBuffer);
  return true;
}

async function run() {
  if (!fs.existsSync(SPRITES_DIR)) {
    fs.mkdirSync(SPRITES_DIR, { recursive: true });
  }

  console.log("=========================================================");
  console.log("🚀 [KazTactics] Processando Sprites 2D Anime");
  console.log(`📁 Destino: ${SPRITES_DIR}`);
  console.log(`📦 Total de Cartas: ${CARDS_CONFIG.length}`);
  console.log("=========================================================\n");

  let readyCount = 0;
  for (const card of CARDS_CONFIG) {
    const success = await downloadOrEnsureSprite(card);
    if (success) readyCount++;
  }

  console.log("\n=========================================================");
  console.log("💾 Atualizando sprite_url no Banco NeonDB...");

  for (const card of CARDS_CONFIG) {
    const spriteUrl = `/sprites/${card.slug}.png`;
    try {
      await sql`
        UPDATE cards
        SET sprite_url = ${spriteUrl}
        WHERE name = ${card.name}
      `;
    } catch (dbErr) {
      console.error(`⚠️ Erro ao atualizar ${card.name} no DB:`, dbErr);
    }
  }

  console.log(`✅ Finalizado com sucesso! ${readyCount}/${CARDS_CONFIG.length} arquivos PNG físicos em public/sprites/`);
  console.log("=========================================================");

  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
