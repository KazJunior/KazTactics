import { GridTile, TileType, BoardUnit, BoardCore } from "@/types/game";

export const BOARD_WIDTH = 11;
export const BOARD_HEIGHT = 7;

/**
 * Cria a matriz padrão do tabuleiro 11x7 com obstáculos estratégicos e zonas de spawn
 */
export function createDefaultGrid(): GridTile[][] {
  const grid: GridTile[][] = [];

  // Posições pré-definidas de obstáculos altos centrais (choke points e coberturas)
  const obstacleCoordinates = new Set<string>([
    "3,1", "3,5",
    "5,2", "5,4",
    "7,1", "7,5",
    "4,3", "6,3", // Coberturas centrais para testar Line of Sight vs Arremesso
  ]);

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    const row: GridTile[] = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let type: TileType = "EMPTY";

      // Zonas de Invocação do Jogador (colunas 0 e 1, exceto o núcleo em 0,3)
      if (x <= 1 && !(x === 0 && y === 3)) {
        type = "PLAYER_SPAWN";
      }
      // Zonas de Invocação da IA (colunas 9 e 10, exceto o núcleo em 10,3)
      else if (x >= BOARD_WIDTH - 2 && !(x === BOARD_WIDTH - 1 && y === 3)) {
        type = "AI_SPAWN";
      }
      // Obstáculos altos que bloqueiam movimento e linha de visão direta
      else if (obstacleCoordinates.has(`${x},${y}`)) {
        type = "OBSTACLE";
      }

      row.push({ x, y, type });
    }
    grid.push(row);
  }

  return grid;
}

/**
 * Algoritmo BFS para calcular as casas válidas de Movimento
 * Bloqueia movimento se a casa for OBSTACLE ou ocupada por outra unidade/núcleo.
 */
export function getValidMovementTiles(
  unit: BoardUnit,
  grid: GridTile[][],
  allUnits: BoardUnit[],
  cores: BoardCore[]
): { x: number; y: number }[] {
  const movement = unit.card.movementTiles || 0;
  if (movement <= 0) return [];

  // Conjunto de posições bloqueadas (obstáculos, outras unidades e núcleos)
  const blockedTiles = new Set<string>();

  for (const row of grid) {
    for (const tile of row) {
      if (tile.type === "OBSTACLE") {
        blockedTiles.add(`${tile.x},${tile.y}`);
      }
    }
  }

  for (const u of allUnits) {
    if (u.id !== unit.id) {
      blockedTiles.add(`${u.x},${u.y}`);
    }
  }

  for (const c of cores) {
    blockedTiles.add(`${c.x},${c.y}`);
  }

  const validTiles: { x: number; y: number }[] = [];
  const visited = new Map<string, number>(); // "x,y" -> menor custo até ali

  // Fila para BFS: [x, y, passosRestantes]
  const queue: [number, number, number][] = [[unit.x, unit.y, movement]];
  visited.set(`${unit.x},${unit.y}`, 0);

  const directions = [
    { dx: 0, dy: -1 }, // Cima
    { dx: 0, dy: 1 },  // Baixo
    { dx: -1, dy: 0 }, // Esquerda
    { dx: 1, dy: 0 },  // Direita
  ];

  while (queue.length > 0) {
    const [cx, cy, stepsLeft] = queue.shift()!;

    if (stepsLeft > 0) {
      for (const dir of directions) {
        const nx = cx + dir.dx;
        const ny = cy + dir.dy;
        const key = `${nx},${ny}`;

        // Checar limites do tabuleiro
        if (nx >= 0 && nx < BOARD_WIDTH && ny >= 0 && ny < BOARD_HEIGHT) {
          // Checar se não está bloqueado
          if (!blockedTiles.has(key)) {
            const stepsTaken = movement - stepsLeft + 1;
            const previousBest = visited.get(key);

            if (previousBest === undefined || stepsTaken < previousBest) {
              visited.set(key, stepsTaken);
              validTiles.push({ x: nx, y: ny });
              queue.push([nx, ny, stepsLeft - 1]);
            }
          }
        }
      }
    }
  }

  return validTiles;
}

/**
 * Algoritmo de traçado de raio (Raycasting / Bresenham) para verificar Linha de Visão
 * Retorna true se houver visão desobstruída entre (x0, y0) e (x1, y1)
 */
export function hasLineOfSight(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  grid: GridTile[][],
  allUnits: BoardUnit[]
): boolean {
  // Se for a mesma célula
  if (x0 === x1 && y0 === y1) return true;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let currX = x0;
  let currY = y0;

  while (true) {
    // Checar se chegamos ao destino
    if (currX === x1 && currY === y1) {
      return true;
    }

    // Se não for a origem, verificar se há obstáculo ou criatura bloqueando a linha de tiro
    if (!(currX === x0 && currY === y0)) {
      // 1. Checar se o tile é um obstáculo alto
      const tile = grid[currY]?.[currX];
      if (tile && tile.type === "OBSTACLE") {
        return false; // Bloqueado por obstáculo!
      }

      // 2. Checar se há outra criatura bloqueando a visão no caminho intermediário
      const hasUnit = allUnits.some((u) => u.x === currX && u.y === currY);
      if (hasUnit) {
        return false; // Bloqueado por outra criatura na linha de fogo!
      }
    }

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      currX += sx;
    }
    if (e2 < dx) {
      err += dx;
      currY += sy;
    }
  }
}

/**
 * Calcula as casas válidas de Ataque baseando-se em range_tiles e attack_type
 * - ARREMESSO: Ataque balístico que ignora obstáculos e unidades no caminho intermediário.
 * - LINE_OF_SIGHT: Ataque direto bloqueado por obstáculos e criaturas no trajeto.
 */
export function getValidAttackTiles(
  unit: BoardUnit,
  grid: GridTile[][],
  allUnits: BoardUnit[]
): { x: number; y: number }[] {
  const range = unit.card.rangeTiles || 0;
  if (range <= 0) return [];

  const attackType = unit.card.attackType || "LINE_OF_SIGHT";
  const validTiles: { x: number; y: number }[] = [];

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      // Não pode atacar o próprio tile onde a criatura está
      if (x === unit.x && y === unit.y) continue;

      // Distância de Manhattan (ou Chebyshev para grids ortogonais/diagonais)
      const distance = Math.max(Math.abs(x - unit.x), Math.abs(y - unit.y));

      if (distance <= range) {
        if (attackType === "ARREMESSO") {
          // Arremesso: Trajetória parabólica, não é bloqueada por obstáculos intermediários!
          validTiles.push({ x, y });
        } else {
          // Line of Sight: Requer visão direta desobstruída
          if (hasLineOfSight(unit.x, unit.y, x, y, grid, allUnits)) {
            validTiles.push({ x, y });
          }
        }
      }
    }
  }

  return validTiles;
}

