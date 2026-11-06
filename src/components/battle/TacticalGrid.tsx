"use client";

import { useMemo } from "react";
import { GridTile, BoardUnit, BoardCore } from "@/types/game";
import { Card } from "@/db/schema";
import { CombatOverlay } from "./CombatOverlay";
import { FloatingDamage, checkLineOfSight } from "@/lib/tactics/combat";
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
import { Sparkles } from "lucide-react";

interface TacticalGridProps {
  grid: GridTile[][];
  units: BoardUnit[];
  cores: BoardCore[];
  selectedUnit: BoardUnit | null;
  hoveredUnit: BoardUnit | null;
  hoveredTile: { x: number; y: number } | null;
  movementTiles: { x: number; y: number }[];
  attackTiles: { x: number; y: number }[];
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
}

export function TacticalGrid({
  grid,
  units,
  cores,
  selectedUnit,
  hoveredUnit,
  hoveredTile,
  movementTiles,
  attackTiles,
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
}: TacticalGridProps) {
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

  // Cálculo das casas bloqueadas por Obstáculos (Sombra Vermelha de LoS)
  const { blockedLoSTiles, blockingObstacles } = useMemo(() => {
    const blockedTiles = new Set<string>();
    const obstacles = new Set<string>();

    if (!selectedUnit || selectedUnit.card.attackType !== "LINE_OF_SIGHT") {
      return { blockedLoSTiles: blockedTiles, blockingObstacles: obstacles };
    }

    const range = selectedUnit.card.rangeTiles || 1;
    const minX = Math.max(0, selectedUnit.x - range);
    const maxX = Math.min(10, selectedUnit.x + range);
    const minY = Math.max(0, selectedUnit.y - range);
    const maxY = Math.min(6, selectedUnit.y + range);

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
    <div className={`flex flex-col items-center select-none w-full ${isScreenShaking ? "animate-screen-shake" : ""}`}>
      {/* Moldura da Arena de Santuário Celeste */}
      <div className="relative p-3 md:p-5 bg-[#181433]/90 border-2 border-[#F59E0B]/35 shadow-[0_12px_45px_rgba(15,13,30,0.85)] overflow-x-auto max-w-full rounded-2xl transition-transform duration-300">
        {/* Camada Global de Iluminação: Brilho Celeste e Éter */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(56,189,248,0.14) 0%, rgba(245,158,11,0.06) 50%, transparent 100%)",
          }}
        />

        {/* Emblemas de Mana e Ouro Solar nos Cantos */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 text-[#F59E0B] opacity-90 pointer-events-none">
          <Sparkles className="w-4 h-4 animate-torch" />
          <div className="w-3.5 h-3.5 border-t-2 border-l-2 border-[#38BDF8]" />
        </div>
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1 text-[#F59E0B] opacity-90 pointer-events-none">
          <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-[#38BDF8]" />
          <Sparkles className="w-4 h-4 animate-torch" />
        </div>
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 text-[#F59E0B] opacity-90 pointer-events-none">
          <Sparkles className="w-4 h-4 animate-torch" />
          <div className="w-3.5 h-3.5 border-b-2 border-l-2 border-[#38BDF8]" />
        </div>
        <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 text-[#F59E0B] opacity-90 pointer-events-none">
          <div className="w-3.5 h-3.5 border-b-2 border-r-2 border-[#38BDF8]" />
          <Sparkles className="w-4 h-4 animate-torch" />
        </div>

        {/* Action Freeze-Frame Overlay (Darkest Dungeon Combat Dimmer & Slash Lines) */}
        <ActionFreezeFrameOverlay
          actionData={actionFreezeData}
          onFinish={onFinishActionFreeze}
        />

        {/* Letreiros Críticos Rápidos ("GOLPE MORTAL!", "OBLITERADO!", "LINHA BLOQUEADA!") */}
        <CriticalBannerOverlay
          bannerData={criticalBanner}
          onFinish={onFinishCriticalBanner}
        />

        {/* Balão de Fala Curta ("Bark") de Atmosfera Darkest Dungeon */}
        <GothicBarkBubble bark={activeBark} onFinish={onFinishBark} />

        {/* Camada Visual de Trajetórias e Projéteis */}
        <div className="relative z-20">
          <CombatOverlay
            attacker={selectedUnit}
            targetCoord={hoveredTile}
            grid={grid}
            units={units}
            floatingDamages={floatingDamages}
          />

          {/* Grid Tático 11x7 em Lajes de Pedra Gótica */}
          <div className="grid grid-cols-11 gap-1.5 md:gap-2 min-w-[770px]">
            {grid.map((row, y) =>
              row.map((tile, x) => {
                const coordKey = `${x},${y}`;
                const unit = unitMap.get(coordKey);
                const core = coreMap.get(coordKey);

                const isMovement = moveSet.has(coordKey);
                const isAttack = attackSet.has(coordKey);
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
                    isSelected={isSelected}
                    isMovement={isMovement}
                    isAttack={isAttack}
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
                    {/* Círculo Rúnico do Feitiço Ativo sobre o Alvo Hover */}
                    {isSpellHoverTarget && (
                      <RunicSpellCircle
                        spellType={
                          (activeSpell.spellEffectJson as Record<string, any>)?.type ||
                          "DIRECT_DAMAGE"
                        }
                      />
                    )}

                    {/* Conteúdo da Célula */}
                    {core ? (
                      // NÚCLEO GÓTICO: Pira Sagrada (Jogador) vs Obelisco Abissal (IA)
                      <GothicCore core={core} />
                    ) : unit ? (
                      // CRIATURA 2D ESTILO DARKEST DUNGEON COM PUPPET BREATHING E HIT-STOP
                      <GothicCreatureSprite
                        unit={unit}
                        isHit={unit.id === hitUnitId}
                        isDying={unit.id === dyingUnitId}
                        isAttacking={selectedUnit?.id === unit.id && isAttack}
                      />
                    ) : tile.type === "OBSTACLE" ? (
                      // OBSTÁCULO GÓTICO: Pilar Quebrado, Sarcófago ou Barricada
                      <GothicObstacle
                        x={x}
                        y={y}
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
