"use client";

import React from "react";
import {
  EscaravelhoBatedorSprite,
  AranhaTeceSombrasSprite,
  LouvaADeusCeifadorSprite,
  CentopeiaCarapacaSprite,
  RainhaDaColmeiaSprite,
  LoboCinzentoCacadorSprite,
  UrsoDaTundraSprite,
  GrifoDosPicosSprite,
  QuimeraDasSavanasSprite,
  BehemothPrimordialSprite,
  KitsuneRaposaSprite,
} from "./creatures/ArthropodAndBeastSprites";
import {
  CarnicalRastejanteSprite,
  ArqueiroEsqueletoSprite,
  CavaleiroDaMorteSprite,
  NecromanteDoSepulcroSprite,
  LichReiDasSombrasSprite,
  FogoFatuoIlusorioSprite,
  BansheeLamurianteSprite,
  PoltergeistTeluricoSprite,
  AparicaoVingativaSprite,
  AvatarTempestadeAstralSprite,
} from "./creatures/UndeadAndSpiritSprites";
import {
  RecrutaEscudoTorreSprite,
  CacadoraElficaSprite,
  LanceiroRealSprite,
  MagoTemplarioSprite,
  LordeComandanteSprite,
  AssassinoLadinoSprite,
  DroneBatedorVaporSprite,
  SentinelaDeEngrenagensSprite,
  CatapultaAVaporSprite,
  ColossoDeLataoSprite,
  LeviataBelicoSprite,
} from "./creatures/HumanoidAndMechSprites";
import {
  SatiroDancarinoSprite,
  MinotauroLabirintoSprite,
  HidraDosPantanosSprite,
  FenixRenascidaSprite,
  DragaoAncestralPlatinaSprite,
  SpellByNameSprite,
} from "./creatures/MythicAndSpellSprites";

export interface CutoutMonsterSpriteProps {
  name: string;
  type?: string;
  category?: string;
  isEnemy?: boolean;
  className?: string;
}

/**
 * CutoutMonsterSprite:
 * Mapeamento Individual por Nome (`name.toLowerCase()`) com Design SVG 2D Único
 * para CADA UMA das 50 cartas do banco de dados/seed (35 Monstros + 15 Feitiços).
 * Zero repetição entre cartas com nomes diferentes na Coleção, Mão ou Tabuleiro.
 */
export function CutoutMonsterSprite({
  name,
  type = "BESTIAIS",
  category = "MONSTRO",
  isEnemy = false,
  className = "w-full h-full",
}: CutoutMonsterSpriteProps) {
  const lowerName = (name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const cleanUpper = lowerName.toUpperCase();
  const cleanType = (type || "").toUpperCase();
  const isSpell = category === "FEITICO" || cleanType === "FEITICOS";

  const renderUniqueSpriteByName = () => {
    if (isSpell) {
      return <SpellByNameSprite cleanName={cleanUpper} />;
    }

    // =====================================================================
    // 1. FAMÍLIA ARTRÓPODES (Cada um com sua anatomia real)
    // =====================================================================
    if (lowerName.includes("escaravelho") || lowerName.includes("besouro")) {
      return <EscaravelhoBatedorSprite />;
    }
    if (lowerName.includes("aranha") || lowerName.includes("tece-sombras")) {
      return <AranhaTeceSombrasSprite />;
    }
    if (lowerName.includes("louva-a-deus") || lowerName.includes("mantis")) {
      return <LouvaADeusCeifadorSprite />;
    }
    if (lowerName.includes("centopeia")) {
      return <CentopeiaCarapacaSprite />;
    }
    if (lowerName.includes("rainha da colmeia") || lowerName.includes("colmeia")) {
      return <RainhaDaColmeiaSprite />;
    }

    // =====================================================================
    // 2. FAMÍLIA BESTIAIS (Cada um com sua anatomia real)
    // =====================================================================
    if (lowerName.includes("lobo")) {
      return <LoboCinzentoCacadorSprite />;
    }
    if (lowerName.includes("urso")) {
      return <UrsoDaTundraSprite />;
    }
    if (lowerName.includes("grifo")) {
      return <GrifoDosPicosSprite />;
    }
    if (lowerName.includes("quimera")) {
      return <QuimeraDasSavanasSprite />;
    }
    if (lowerName.includes("behemoth")) {
      return <BehemothPrimordialSprite />;
    }
    if (lowerName.includes("raposa") || lowerName.includes("kitsune")) {
      return <KitsuneRaposaSprite />;
    }

    // =====================================================================
    // 3. FAMÍLIA MORTOS-VIVOS (Cada um com sua anatomia real)
    // =====================================================================
    if (
      lowerName.includes("carnical") ||
      lowerName.includes("zumbi") ||
      lowerName.includes("abominacao")
    ) {
      return <CarnicalRastejanteSprite />;
    }
    if (lowerName.includes("arqueiro esqueleto") || lowerName.includes("arqueiro")) {
      return <ArqueiroEsqueletoSprite />;
    }
    if (
      lowerName.includes("cavaleiro da morte") ||
      lowerName.includes("esqueleto") ||
      lowerName.includes("guerreiro")
    ) {
      return <CavaleiroDaMorteSprite />;
    }
    if (lowerName.includes("necromante")) {
      return <NecromanteDoSepulcroSprite />;
    }
    if (lowerName.includes("lich")) {
      return <LichReiDasSombrasSprite />;
    }

    // =====================================================================
    // 4. FAMÍLIA ESPÍRITOS (Cada um com sua anatomia real)
    // =====================================================================
    if (lowerName.includes("fogo-fatuo") || lowerName.includes("wisp")) {
      return <FogoFatuoIlusorioSprite />;
    }
    if (lowerName.includes("banshee")) {
      return <BansheeLamurianteSprite />;
    }
    if (lowerName.includes("poltergeist")) {
      return <PoltergeistTeluricoSprite />;
    }
    if (
      lowerName.includes("aparicao") ||
      lowerName.includes("espectro") ||
      lowerName.includes("fantasma")
    ) {
      return <AparicaoVingativaSprite />;
    }
    if (lowerName.includes("avatar") || lowerName.includes("tempestade astral")) {
      return <AvatarTempestadeAstralSprite />;
    }

    // =====================================================================
    // 5. FAMÍLIA HUMANÓIDES (Cada um com sua anatomia real)
    // =====================================================================
    if (lowerName.includes("recruta") || lowerName.includes("guarda") || lowerName.includes("escudo torre")) {
      return <RecrutaEscudoTorreSprite />;
    }
    if (lowerName.includes("cacadora") || lowerName.includes("elfica")) {
      return <CacadoraElficaSprite />;
    }
    if (lowerName.includes("lanceiro")) {
      return <LanceiroRealSprite />;
    }
    if (lowerName.includes("templario") || lowerName.includes("paladino") || lowerName.includes("mago de batalha")) {
      return <MagoTemplarioSprite />;
    }
    if (lowerName.includes("lorde comandante") || lowerName.includes("comandante")) {
      return <LordeComandanteSprite />;
    }
    if (lowerName.includes("assassino") || lowerName.includes("ladino")) {
      return <AssassinoLadinoSprite />;
    }

    // =====================================================================
    // 6. FAMÍLIA MECÂNICOS (Cada um com sua anatomia real)
    // =====================================================================
    if (lowerName.includes("drone") || lowerName.includes("balista")) {
      return <DroneBatedorVaporSprite />;
    }
    if (lowerName.includes("sentinela") || lowerName.includes("torreta") || lowerName.includes("engrenagens")) {
      return <SentinelaDeEngrenagensSprite />;
    }
    if (lowerName.includes("catapulta")) {
      return <CatapultaAVaporSprite />;
    }
    if (
      lowerName.includes("colosso") ||
      lowerName.includes("golem") ||
      lowerName.includes("automato")
    ) {
      return <ColossoDeLataoSprite />;
    }
    if (lowerName.includes("leviata")) {
      return <LeviataBelicoSprite />;
    }

    // =====================================================================
    // 7. FAMÍLIA MITOLÓGICOS (Cada um com sua anatomia real)
    // =====================================================================
    if (lowerName.includes("satiro")) {
      return <SatiroDancarinoSprite />;
    }
    if (lowerName.includes("minotauro")) {
      return <MinotauroLabirintoSprite />;
    }
    if (lowerName.includes("hidra")) {
      return <HidraDosPantanosSprite />;
    }
    if (lowerName.includes("fenix")) {
      return <FenixRenascidaSprite />;
    }
    if (lowerName.includes("dragao") || lowerName.includes("wyvern")) {
      return <DragaoAncestralPlatinaSprite />;
    }

    return <CavaleiroDaMorteSprite />;
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none transition-transform duration-200 ${
        isEnemy ? "scale-x-[-1]" : ""
      } ${className}`}
      style={{
        transformOrigin: "center bottom",
      }}
    >
      <svg
        viewBox="0 0 130 130"
        className="w-full h-full overflow-visible"
        style={{
          filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.75))",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderUniqueSpriteByName()}
      </svg>
    </div>
  );
}
