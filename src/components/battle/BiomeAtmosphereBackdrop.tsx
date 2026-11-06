"use client";

import React from "react";
import { BiomeType } from "@/types/game";
import { BIOME_CONFIGS } from "@/lib/tactics/biomes";

interface BiomeAtmosphereBackdropProps {
  biome: BiomeType;
}

const PARTICLE_SEEDS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: (i * 17 + 7) % 96,
  top: (i * 23 + 11) % 92,
  size: 4 + (i % 4) * 2,
  delay: (i * 0.4) % 5,
  duration: 4 + (i % 4) * 1.5,
}));

/**
 * Camada 1 do Sistema de Biomas: Fundo da Tela + Silhuetas 2D Cartoon + Partículas Atmosféricas
 */
export function BiomeAtmosphereBackdrop({
  biome,
}: BiomeAtmosphereBackdropProps) {
  const config = BIOME_CONFIGS[biome] || BIOME_CONFIGS.FLORESTA;

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden transition-all duration-500"
      style={{
        background: config.screenBgGradient,
      }}
    >
      {/* Silhuetas de Cenário 2D Cartoon com Contorno Preto Grosso (#09090B) */}
      <svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 w-full h-full object-cover opacity-55"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#09090B" strokeWidth="4" strokeLinejoin="round">
          {biome === "FLORESTA" && (
            <>
              {/* Copa de Árvores Gigantes e Raízes nas Bordas da Floresta Noturna */}
              <path
                d="M0 0 H240 C220 120, 140 160, 90 220 C50 280, 100 560, 130 900 H0 Z"
                fill="#05140A"
              />
              <path
                d="M1440 0 H1200 C1220 120, 1300 160, 1350 220 C1390 280, 1340 560, 1310 900 H1440 Z"
                fill="#05140A"
              />
              {/* Arbustos no horizonte inferior */}
              <path
                d="M0 900 Q120 810 260 870 Q400 800 560 880 H0 Z"
                fill="#0B2614"
              />
              <path
                d="M1440 900 Q1320 810 1180 870 Q1040 800 880 880 H1440 Z"
                fill="#0B2614"
              />
            </>
          )}

          {biome === "DESERTO" && (
            <>
              {/* Dunas e Formações de Cânion ao Pôr-do-Sol */}
              <polygon
                points="0,900 0,560 120,560 160,680 340,680 390,900"
                fill="#3B1504"
              />
              <polygon
                points="1440,900 1440,520 1310,520 1270,660 1120,660 1060,900"
                fill="#3B1504"
              />
              <path
                d="M0 900 Q360 760 720 850 T1440 810 V900 H0 Z"
                fill="#5C2409"
              />
            </>
          )}

          {biome === "GELO" && (
            <>
              {/* Picos Glaciais Pontiagudos nas Laterais */}
              <polygon
                points="0,900 0,380 90,240 190,460 260,340 380,900"
                fill="#062338"
              />
              <polygon
                points="1440,900 1440,360 1340,220 1240,450 1170,330 1050,900"
                fill="#062338"
              />
              <path
                d="M0 900 Q360 810 720 860 T1440 820 V900 H0 Z"
                fill="#0C4A6E"
              />
            </>
          )}

          {biome === "VULCANICO" && (
            <>
              {/* Montanhas Vulcânicas Escarpadas e Rios de Magma */}
              <polygon
                points="0,900 0,440 110,280 180,280 290,540 360,900"
                fill="#140707"
              />
              <polygon
                points="1440,900 1440,420 1320,260 1250,260 1140,520 1060,900"
                fill="#140707"
              />
              {/* Fendas de lava no horizonte */}
              <path
                d="M145 280 L165 440 L120 620"
                fill="none"
                stroke="#EA580C"
                strokeWidth="5"
              />
              <path
                d="M1285 260 L1265 420 L1310 610"
                fill="none"
                stroke="#EA580C"
                strokeWidth="5"
              />
            </>
          )}

          {biome === "PANTANO" && (
            <>
              {/* Galhos Secos Retorcidos e Ruínas Submersas */}
              <path
                d="M0 0 H180 L120 260 L210 320 L110 420 L90 900 H0 Z"
                fill="#0B130E"
              />
              <path
                d="M1440 0 H1260 L1320 260 L1230 320 L1330 420 L1350 900 H1440 Z"
                fill="#0B130E"
              />
              {/* Névoa baixa do pântano */}
              <ellipse
                cx="720"
                cy="860"
                rx="680"
                ry="80"
                fill="#365314"
                opacity="0.35"
                stroke="none"
              />
            </>
          )}
        </g>
      </svg>

      {/* Névoa Baixa extra para o Bioma Pântano */}
      {biome === "PANTANO" && (
        <div
          className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-45"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(132,204,22,0.18) 50%, rgba(88,28,135,0.28) 100%)",
          }}
        />
      )}

      {/* Partículas Atmosféricas Animadas de cada Bioma */}
      <div className="absolute inset-0">
        {PARTICLE_SEEDS.map((p) => {
          // Vagalumes e folhas na Floresta
          if (biome === "FLORESTA") {
            const isFirefly = p.id % 2 === 0;
            return (
              <div
                key={p.id}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: isFirefly ? `${p.size}px` : `${p.size + 4}px`,
                  height: isFirefly ? `${p.size}px` : `${p.size}px`,
                  backgroundColor: isFirefly
                    ? "#BEF264"
                    : "#65A30D",
                  boxShadow: isFirefly
                    ? "0 0 10px #BEF264, 0 0 18px #84CC16"
                    : "none",
                  border: isFirefly ? "none" : "1.5px solid #09090B",
                  transform: isFirefly ? "none" : "rotate(35deg)",
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  opacity: 0.75,
                }}
              />
            );
          }

          // Poeira dourada soprando horizontalmente no Deserto
          if (biome === "DESERTO") {
            return (
              <div
                key={p.id}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: `${p.size * 2.5}px`,
                  height: "3px",
                  backgroundColor: p.id % 2 === 0 ? "#FDE68A" : "#F59E0B",
                  opacity: 0.55,
                  animationDuration: `${p.duration * 0.8}s`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            );
          }

          // Flocos de neve caindo na Tundra de Gelo
          if (biome === "GELO") {
            return (
              <div
                key={p.id}
                className="absolute rounded-full bg-[#F0F9FF] border border-[#09090B]/40 animate-bounce"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: `${p.size + 2}px`,
                  height: `${p.size + 2}px`,
                  boxShadow: "0 0 8px rgba(224,242,254,0.8)",
                  animationDuration: `${p.duration + 1}s`,
                  animationDelay: `${p.delay}s`,
                  opacity: 0.85,
                }}
              />
            );
          }

          // Brasas acesas subindo na Terra Vulcânica
          if (biome === "VULCANICO") {
            return (
              <div
                key={p.id}
                className="absolute rounded-full animate-ping"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.id % 2 === 0 ? "#EA580C" : "#FACC15",
                  boxShadow: "0 0 10px #EA580C",
                  animationDuration: `${p.duration * 0.7}s`,
                  animationDelay: `${p.delay}s`,
                  opacity: 0.8,
                }}
              />
            );
          }

          // Esporos e bolhas místicas no Pântano
          return (
            <div
              key={p.id}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size + 2}px`,
                height: `${p.size + 2}px`,
                backgroundColor: p.id % 2 === 0 ? "#A3E635" : "#C084FC",
                boxShadow:
                  p.id % 2 === 0
                    ? "0 0 10px rgba(163,230,53,0.7)"
                    : "0 0 10px rgba(192,132,252,0.7)",
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                opacity: 0.65,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

