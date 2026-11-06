"use client";

import { useMemo } from "react";
import { GridTile, BoardUnit, BoardCore, BiomeType } from "@/types/game";
import { Card } from "@/db/schema";
import { BIOME_CONFIGS } from "@/lib/tactics/biomes";
import { CombatOverlay } from "./CombatOverlay";
import { FloatingDamage, checkLineOfSight } from "@/lib/tactics/combat";
import { AbilityVfxData } from "@/lib/abilities";
import { GothicTile } from "./GothicTile";
import { GothicObstacle } from "./GothicObstacle";
import { GothicCore } from "./GothicCore";
import { GothicCreatureSprite } from "./GothicCreatureSprite";
import {
  ActionFreezeFrameOverlay,
  ActionFreezeFrameData,
} from "./ActionFreezeFrameOverlay";
import {
  CriticalBannerOverlay,
  CriticalBannerData,
} from "./CriticalBannerOverlay";
import { GothicBarkBubble, BarkData } from "./GothicBarkBubble";
import { RunicSpellCircle } from "./RunicSpellCircle";

interface TacticalGridProps {
  grid: GridTile[][];
  units: BoardUnit[];
  cores: BoardCore[];
  biome?: BiomeType;
  selectedUnit: BoardUnit | null;
  hoveredUnit: BoardUnit | null;
  hoveredTile: { x: number; y: number } | null;
  movementTiles: { x: number; y: number }[];
  attackTiles: { x: number; y: number }[];
  abilityTiles?: { x: number; y: number }[];
  aoePreviewTiles?: { x: number; y: number }[];
  isDashAbility?: boolean;
  activeAbilityVfx?: AbilityVfxData | null;
  floatingDamages: FloatingDamage[];
  hitUnitId?: string | null;
  dyingUnitId?: string | null;
  actionFreezeData?: ActionFreezeFrameData | null;
  onFinishActionFreeze?: () => void;
  isScreenShaking?: boolean;
  activeSpell?: Card | null;
  criticalBanner?: CriticalBannerData | null;
  onFinishCriticalBanner?: () => void;
  activeBark?: BarkData | null;
  onFinishBark?: () => void;
  onSelectUnit: (unit: BoardUnit | null) => void;
  onHoverUnit: (unit: BoardUnit | null) => void;
  onHoverTile: (coord: { x: number; y: number } | null) => void;
  onTileClick?: (x: number, y: number) => void;
  zoomLevel?: number;
}

export function TacticalGrid({
  grid,
  units,
  cores,
  biome = "FLORESTA",
  selectedUnit,
  hoveredUnit,
  hoveredTile,
  movementTiles,
  attackTiles,
  abilityTiles = [],
  aoePreviewTiles = [],
  isDashAbility = false,
  activeAbilityVfx = null,
  floatingDamages,
  hitUnitId = null,
  dyingUnitId = null,
  actionFreezeData = null,
  onFinishActionFreeze = () => {},
  isScreenShaking = false,
  activeSpell = null,
  criticalBanner = null,
  onFinishCriticalBanner = () => {},
  activeBark = null,
  onFinishBark = () => {},
  onSelectUnit,
  onHoverUnit,
  onHoverTile,
  onTileClick,
  zoomLevel = 1.05,
}: TacticalGridProps) {
  const biomeConfig = BIOME_CONFIGS[biome] || BIOME_CONFIGS.FLORESTA;

  const unitMap = useMemo(() => {
    const map = new Map<string, BoardUnit>();
    for (const u of units) {
      map.set(`${u.x},${u.y}`, u);
    }
    return map;
  }, [units]);

  const coreMap = useMemo(() => {
    const map = new Map<string, BoardCore>();
    for (const c of cores) {
      map.set(`${c.x},${c.y}`, c);
    }
    return map;
  }, [cores]);

  const moveSet = useMemo(() => {
    return new Set(movementTiles.map((t) => `${t.x},${t.y}`));
  }, [movementTiles]);

  const attackSet = useMemo(() => {
    return new Set(attackTiles.map((t) => `${t.x},${t.y}`));
  }, [attackTiles]);

  const abilitySet = useMemo(() => {
    return new Set(abilityTiles.map((t) => `${t.x},${t.y}`));
  }, [abilityTiles]);

  const aoePreviewSet = useMemo(() => {
    return new Set(aoePreviewTiles.map((t) => `${t.x},${t.y}`));
  }, [aoePreviewTiles]);

  const vfxTileSet = useMemo(() => {
    if (!activeAbilityVfx) return new Set<string>();
    return new Set(activeAbilityVfx.tiles.map((t) => `${t.x},${t.y}`));
  }, [activeAbilityVfx]);

  // Cálculo das casas bloqueadas por Obstáculos (Sombra Vermelha de LoS)
  const { blockedLoSTiles, blockingObstacles } = useMemo(() => {
    const blockedTiles = new Set<string>();
    const obstacles = new Set<string>();

    if (!selectedUnit || selectedUnit.card.attackType !== "LINE_OF_SIGHT") {
      return { blockedLoSTiles: blockedTiles, blockingObstacles: obstacles };
    }

    const range = selectedUnit.card.rangeTiles || 1;
    const maxGridX = (grid[0]?.length || 15) - 1;
    const maxGridY = (grid.length || 9) - 1;
    const minX = Math.max(0, selectedUnit.x - range);
    const maxX = Math.min(maxGridX, selectedUnit.x + range);
    const minY = Math.max(0, selectedUnit.y - range);
    const maxY = Math.min(maxGridY, selectedUnit.y + range);

    for (let ty = minY; ty <= maxY; ty++) {
      for (let tx = minX; tx <= maxX; tx++) {
        if (tx === selectedUnit.x && ty === selectedUnit.y) continue;
        const dist = Math.max(
          Math.abs(tx - selectedUnit.x),
          Math.abs(ty - selectedUnit.y)
        );
        if (dist <= range) {
          const los = checkLineOfSight(
            selectedUnit.x,
            selectedUnit.y,
            tx,
            ty,
            grid,
            units
          );
          if (los.isBlocked && los.blockedAt?.reason === "OBSTACLE") {
            blockedTiles.add(`${tx},${ty}`);
            obstacles.add(`${los.blockedAt.x},${los.blockedAt.y}`);
          }
        }
      }
    }

    return { blockedLoSTiles: blockedTiles, blockingObstacles: obstacles };
  }, [selectedUnit, grid, units]);

  const activeUnit = selectedUnit || hoveredUnit;

  return (
    <div
      className={`flex flex-col items-center select-none w-full ${
        isScreenShaking ? "animate-screen-shake" : ""
      }`}
    >
      {/* ================================================================= */}
      {/* MOLDURA 2D CARTOON DO TABULEIRO (Personalizada por Bioma)          */}
      {/* Contorno Preto Grosso (#09090B) + Relevo 2.5D de Fantasia          */}
      {/* ================================================================= */}
      <div
        className="relative p-5 md:p-7 w-fit rounded-[26px] border-4 border-[#09090B] transition-all duration-300 origin-top"
        style={{
          background: biomeConfig.boardBgGradient,
          boxShadow: `0 12px 0 ${biomeConfig.boardLedgeColor}, 0 16px 0 #09090B, 0 28px 60px rgba(0,0,0,0.85), inset 0 3px 0 ${biomeConfig.boardInnerBorderColor}`,
          transform: `scale(${zoomLevel})`,
          marginBottom: `${(zoomLevel - 1) * 780}px`,
        }}
      >
        {/* Ornamentos 2D Cartoon nos Cantos da Moldura do Tabuleiro conforme o Bioma */}
        <svg
          viewBox="0 0 1400 840"
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-visible"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="#09090B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {biome === "FLORESTA" && (
              <>
                {/* Folhas e raízes nos cantos da moldura de madeira */}
                <path
                  d="M12 28 C12 8, 42 8, 42 28 C28 32, 18 32, 12 28 Z"
                  fill="#65A30D"
                />
                <path
                  d="M32 18 C36 4, 60 6, 56 22 Z"
                  fill="#84CC16"
                />
                <path
                  d="M1355 24 C1355 6, 1388 6, 1388 24 Z"
                  fill="#65A30D"
                />
                <path
                  d="M14 816 C14 798, 46 798, 46 816 Z"
                  fill="#4D7C0F"
                />
                <path
                  d="M1352 816 C1352 798, 1386 798, 1386 816 Z"
                  fill="#65A30D"
                />
              </>
            )}

            {biome === "DESERTO" && (
              <>
                {/* Tijolos de arenito rachados nas bordas */}
                <rect x="20" y="6" width="38" height="12" rx="3" fill="#D97706" />
                <rect x="1340" y="6" width="38" height="12" rx="3" fill="#B45309" />
                <rect x="24" y="820" width="42" height="12" rx="3" fill="#B45309" />
                <rect x="1334" y="820" width="42" height="12" rx="3" fill="#D97706" />
              </>
            )}

            {biome === "GELO" && (
              <>
                {/* Crostas de neve fofa e cristais nas quinas */}
                <path
                  d="M14 18 Q36 4 62 16 Q48 26 24 22 Z"
                  fill="#F0F9FF"
                />
                <path
                  d="M1336 16 Q1362 4 1386 18 Q1364 26 1336 16 Z"
                  fill="#F0F9FF"
                />
                <polygon points="18,826 28,806 38,826" fill="#7DD3FC" />
                <polygon points="1362,826 1372,806 1382,826" fill="#7DD3FC" />
              </>
            )}

            {biome === "VULCANICO" && (
              <>
                {/* Veios de magma incandescente na borda de obsidiana */}
                <path
                  d="M24 12 L52 16 L74 10"
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="4"
                />
                <path
                  d="M1324 12 L1352 16 L1376 10"
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="4"
                />
                <circle cx="36" cy="824" r="5" fill="#EA580C" />
                <circle cx="1364" cy="824" r="5" fill="#EA580C" />
              </>
            )}

            {biome === "PANTANO" && (
              <>
                {/* Musgo pantanoso e bolhas nas bordas de ruína */}
                <path
                  d="M16 18 Q38 6 64 18 Q42 26 16 18 Z"
                  fill="#4D7C0F"
                />
                <path
                  d="M1336 18 Q1360 6 1384 18 Q1360 26 1336 18 Z"
                  fill="#365314"
                />
                <circle cx="32" cy="822" r="5" fill="#A3E635" />
                <circle cx="1368" cy="822" r="5" fill="#84CC16" />
              </>
            )}
          </g>
        </svg>

        {/* Action Freeze-Frame Overlay */}
        <ActionFreezeFrameOverlay
          actionData={actionFreezeData}
          onFinish={onFinishActionFreeze}
        />

        {/* Letreiros Críticos Rápidos */}
        <CriticalBannerOverlay
          bannerData={criticalBanner}
          onFinish={onFinishCriticalBanner}
        />

        {/* Balão de Fala Curta ("Bark") */}
        <GothicBarkBubble bark={activeBark} onFinish={onFinishBark} />

        {/* Camada Visual de Trajetórias e Projéteis */}
        <div className="relative z-20">
          <CombatOverlay
            attacker={selectedUnit}
            targetCoord={hoveredTile}
            grid={grid}
            units={units}
            floatingDamages={floatingDamages}
            activeAbilityVfx={activeAbilityVfx}
          />

          {/* Grid Tático 15x9 com Células Ampliadas (84px) */}
          <div
            className="grid gap-1.5 min-w-[1320px]"
            style={{
              gridTemplateColumns: `repeat(${grid[0]?.length || 15}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((row, y) =>
              row.map((tile, x) => {
                const coordKey = `${x},${y}`;
                const unit = unitMap.get(coordKey);
                const core = coreMap.get(coordKey);

                const isMovement = moveSet.has(coordKey);
                const isAttack = attackSet.has(coordKey);
                const isAbility = abilitySet.has(coordKey);
                const isAoePreview = aoePreviewSet.has(coordKey);
                const vfxEffectType = vfxTileSet.has(coordKey)
                  ? activeAbilityVfx?.effectType || null
                  : null;
                const isSelected = activeUnit?.x === x && activeUnit?.y === y;
                const isLoSShadowBlocked = blockedLoSTiles.has(coordKey);
                const isObstacleProjecting = blockingObstacles.has(coordKey);

                const isSpellHoverTarget =
                  !!activeSpell &&
                  hoveredTile?.x === x &&
                  hoveredTile?.y === y;

                return (
                  <GothicTile
                    key={coordKey}
                    x={x}
                    y={y}
                    tile={tile}
                    biome={biome}
                    isSelected={isSelected}
                    isMovement={isMovement}
                    isAttack={isAttack}
                    isAbility={isAbility}
                    isDashAbility={isDashAbility}
                    isAoePreview={isAoePreview}
                    vfxEffectType={vfxEffectType}
                    isLoSShadowBlocked={isLoSShadowBlocked}
                    playerUnits={units}
                    onClick={() => {
                      if (onTileClick) onTileClick(x, y);
                    }}
                    onMouseEnter={() => {
                      onHoverTile({ x, y });
                      if (unit) onHoverUnit(unit);
                    }}
                    onMouseLeave={() => {
                      onHoverTile(null);
                      if (unit) onHoverUnit(null);
                    }}
                  >
                    {isSpellHoverTarget && (
                      <RunicSpellCircle
                        spellType={
                          (activeSpell.spellEffectJson as Record<string, any>)
                            ?.type || "DIRECT_DAMAGE"
                        }
                      />
                    )}

                    {core ? (
                      <GothicCore core={core} />
                    ) : unit ? (
                      <GothicCreatureSprite
                        unit={unit}
                        isHit={unit.id === hitUnitId}
                        isDying={unit.id === dyingUnitId}
                        isAttacking={selectedUnit?.id === unit.id && isAttack}
                      />
                    ) : tile.type === "OBSTACLE" ? (
                      <GothicObstacle
                        x={x}
                        y={y}
                        biome={biome}
                        isProjectingShadow={isObstacleProjecting}
                      />
                    ) : null}
                  </GothicTile>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
