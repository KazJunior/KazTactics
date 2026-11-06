import { GridTile, TileType, BoardUnit, BoardCore } from "@/types/game";

export const BOARD_WIDTH = 15;
export const BOARD_HEIGHT = 9;

/**
 * Cria a matriz padrão do tabuleiro expandido 15x9 com obstáculos estratégicos e zonas de spawn
 */
export function createDefaultGrid(): GridTile[][] {
  const grid: GridTile[][] = [];
  const coreY = Math.floor(BOARD_HEIGHT / 2); // y = 4

  // Posições pré-definidas de obstáculos altos distribuídos na arena 15x9
  const obstacleCoordinates = new Set<string>([
    "4,2", "4,3", "4,6",
    "6,1", "6,5", "6,7",
    "7,4",
    "8,1", "8,3", "8,7",
    "10,2", "10,5", "10,6",
  ]);

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    const row: GridTile[] = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let type: TileType = "EMPTY";

      // Zonas de Invocação do Jogador (colunas 0 e 1, exceto o núcleo em 0,coreY)
      if (x <= 1 && !(x === 0 && y === coreY)) {
        type = "PLAYER_SPAWN";
      }
      // Zonas de Invocação da IA (últimas 2 colunas, exceto o núcleo em 14,coreY)
      else if (x >= BOARD_WIDTH - 2 && !(x === BOARD_WIDTH - 1 && y === coreY)) {
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

export function getValidMovementTiles(
  unit: BoardUnit,
  grid: GridTile[][],
  allUnits: BoardUnit[],
  cores: BoardCore[]
): { x: number; y: number }[] {
  // Unidades com ROOTED (Enraizadas/Teia) ficam com 0 de movimento naquele turno
  const isRooted = (unit.statusEffects || []).some(
    (s) => s.type === "ROOTED" && s.turnsLeft > 0
  );
  if (isRooted) return [];

  // Redução de movimento por SLOWED (-1 casa por 2 rodadas)
  const slowEffect = (unit.statusEffects || []).find(
    (s) => s.type === "SLOWED" && s.turnsLeft > 0
  );
  const slowPenalty = slowEffect ? slowEffect.value : 0;
  const baseMovement = unit.card.movementTiles || 0;
  const movement = Math.max(0, baseMovement - slowPenalty);
  if (movement <= 0) return [];

  // Voador: Passa por cima de obstáculos
  const descLower = (unit.card.description || "").toLowerCase();
  const nameLower = (unit.card.name || "").toLowerCase();
  const isFlying =
    descLower.includes("voador") ||
    descLower.includes("passa por cima de obstáculos") ||
    nameLower.includes("vespa caçadora") ||
    nameLower.includes("vespa cacadora") ||
    nameLower.includes("mariposa da névoa") ||
    nameLower.includes("mariposa da nevoa");

  const height = grid.length || BOARD_HEIGHT;
  const width = grid[0]?.length || BOARD_WIDTH;

  const obstacleTiles = new Set<string>();
  const occupiedTiles = new Set<string>();

  for (const row of grid) {
    for (const tile of row) {
      if (tile.type === "OBSTACLE") {
        obstacleTiles.add(`${tile.x},${tile.y}`);
      }
    }
  }

  for (const u of allUnits) {
    if (u.id !== unit.id) {
      occupiedTiles.add(`${u.x},${u.y}`);
    }
  }

  for (const c of cores) {
    occupiedTiles.add(`${c.x},${c.y}`);
  }

  const validTiles: { x: number; y: number }[] = [];
  const visited = new Map<string, number>();

  const queue: [number, number, number][] = [[unit.x, unit.y, movement]];
  visited.set(`${unit.x},${unit.y}`, 0);

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  while (queue.length > 0) {
    const [cx, cy, stepsLeft] = queue.shift()!;

    if (stepsLeft > 0) {
      for (const dir of directions) {
        const nx = cx + dir.dx;
        const ny = cy + dir.dy;
        const key = `${nx},${ny}`;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const isObstacle = obstacleTiles.has(key);
          const isOccupied = occupiedTiles.has(key);

          // Criaturas voadoras atravessam obstáculos no caminho
          const canTraverse = isFlying ? !isOccupied : (!isObstacle && !isOccupied);
          const canLand = !isObstacle && !isOccupied;

          if (canTraverse) {
            const stepsTaken = movement - stepsLeft + 1;
            const previousBest = visited.get(key);

            if (previousBest === undefined || stepsTaken < previousBest) {
              visited.set(key, stepsTaken);
              if (canLand) {
                validTiles.push({ x: nx, y: ny });
              }
              queue.push([nx, ny, stepsLeft - 1]);
            }
          }
        }
      }
    }
  }

  return validTiles;
}

export function hasLineOfSight(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  grid: GridTile[][],
  allUnits: BoardUnit[]
): boolean {
  if (x0 === x1 && y0 === y1) return true;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let currX = x0;
  let currY = y0;

  while (true) {
    if (currX === x1 && currY === y1) {
      return true;
    }

    if (!(currX === x0 && currY === y0)) {
      const tile = grid[currY]?.[currX];
      if (tile && tile.type === "OBSTACLE") {
        return false;
      }

      const hasUnit = allUnits.some((u) => u.x === currX && u.y === currY);
      if (hasUnit) {
        return false;
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

export function getValidAttackTiles(
  unit: BoardUnit,
  grid: GridTile[][],
  allUnits: BoardUnit[]
): { x: number; y: number }[] {
  const range = unit.card.rangeTiles || 0;
  if (range <= 0) return [];

  const height = grid.length || BOARD_HEIGHT;
  const width = grid[0]?.length || BOARD_WIDTH;

  const attackType = unit.card.attackType || "LINE_OF_SIGHT";
  const validTiles: { x: number; y: number }[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === unit.x && y === unit.y) continue;

      const distance = Math.max(Math.abs(x - unit.x), Math.abs(y - unit.y));

      if (distance <= range) {
        if (attackType === "ARREMESSO") {
          validTiles.push({ x, y });
        } else {
          if (hasLineOfSight(unit.x, unit.y, x, y, grid, allUnits)) {
            validTiles.push({ x, y });
          }
        }
      }
    }
  }

  return validTiles;
}
