import { GridTile, BoardUnit, BoardCore } from "@/types/game";

export interface TrajectoryPoint {
  x: number;
  y: number;
}

export interface LineOfSightResult {
  isBlocked: boolean;
  blockedAt?: { x: number; y: number; reason: "OBSTACLE" | "UNIT" };
  path: TrajectoryPoint[];
}

export interface ArremessoResult {
  isPossible: boolean;
  path: TrajectoryPoint[];
}

/**
 * Traçado de reta de Bresenham em Grid 2D
 * Retorna todos os pontos intermediários e o ponto final
 */
export function getBresenhamLine(
  x0: number,
  y0: number,
  x1: number,
  y1: number
): TrajectoryPoint[] {
  const points: TrajectoryPoint[] = [];

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let currX = x0;
  let currY = y0;

  while (true) {
    points.push({ x: currX, y: currY });

    if (currX === x1 && currY === y1) break;

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

  return points;
}

/**
 * Validação detalhada de Linha de Visão (Line of Sight)
 * Se qualquer célula intermediária contiver um obstáculo ou outra criatura, o ataque é bloqueado!
 */
export function checkLineOfSight(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  grid: GridTile[][],
  units: BoardUnit[]
): LineOfSightResult {
  const line = getBresenhamLine(x0, y0, x1, y1);

  // Criar mapa de criaturas para checagem rápida
  const unitMap = new Map<string, BoardUnit>();
  for (const u of units) {
    unitMap.set(`${u.x},${u.y}`, u);
  }

  // Percorre as células intermediárias (ignora a origem x0,y0 e o destino x1,y1)
  for (let i = 1; i < line.length - 1; i++) {
    const pt = line[i];

    // 1. Checa se é obstáculo
    const tile = grid[pt.y]?.[pt.x];
    if (tile && tile.type === "OBSTACLE") {
      return {
        isBlocked: true,
        blockedAt: { x: pt.x, y: pt.y, reason: "OBSTACLE" },
        path: line,
      };
    }

    // 2. Checa se é outra criatura no caminho intermediário
    const obstacleUnit = unitMap.get(`${pt.x},${pt.y}`);
    if (obstacleUnit) {
      return {
        isBlocked: true,
        blockedAt: { x: pt.x, y: pt.y, reason: "UNIT" },
        path: line,
      };
    }
  }

  return {
    isBlocked: false,
    path: line,
  };
}

/**
 * Validação de Arremesso (Ataque em Arco Parabólico)
 * Ignora obstáculos e unidades intermediárias!
 */
export function checkArremesso(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  maxRange: number
): ArremessoResult {
  const distance = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  const isPossible = distance <= maxRange && !(x0 === x1 && y0 === y1);
  const path = getBresenhamLine(x0, y0, x1, y1);

  return {
    isPossible,
    path,
  };
}

export interface FloatingDamage {
  id: string;
  x: number;
  y: number;
  damage: number;
  isFatal?: boolean;
}

