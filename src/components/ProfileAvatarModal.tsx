"use client";

import React, { useState, useEffect } from "react";
import { CutoutMonsterSprite } from "./battle/CutoutMonsterSprite";
import {
  getPlayerAvatarDataAction,
  updatePlayerAvatarAction,
  UnlockedCreatureAvatar,
} from "@/actions/profile";
import { RARITY_THEMES, CARD_TYPE_THEMES } from "@/lib/cardVisuals";
import { CardType, Rarity } from "@/types";
import { X, Check, Sparkles, UserCheck, Loader2 } from "lucide-react";

export const AVATAR_STORAGE_KEY = "kaztactics_avatar_creature";
export const AVATAR_CHANGE_EVENT = "kaztactics-avatar-changed";

export interface SelectedAvatarInfo {
  name: string;
  type: string;
}

interface ProfileAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: SelectedAvatarInfo;
  onSelectAvatar: (avatar: SelectedAvatarInfo) => void;
  fallbackCreatures?: UnlockedCreatureAvatar[];
}

export function ProfileAvatarModal({
  isOpen,
  onClose,
  currentAvatar,
  onSelectAvatar,
  fallbackCreatures = [],
}: ProfileAvatarModalProps) {
  const [unlockedCreatures, setUnlockedCreatures] = useState<
    UnlockedCreatureAvatar[]
  >(fallbackCreatures);
  const [loading, setLoading] = useState<boolean>(false);
  const [savingName, setSavingName] = useState<string | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("TODOS");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);
    getPlayerAvatarDataAction()
      .then((data) => {
        if (!isMounted) return;
        if (data && data.unlockedCreatures.length > 0) {
          setUnlockedCreatures(data.unlockedCreatures);
        } else if (fallbackCreatures.length > 0) {
          setUnlockedCreatures(fallbackCreatures);
        }
      })
      .catch(() => {
        if (isMounted && fallbackCreatures.length > 0) {
          setUnlockedCreatures(fallbackCreatures);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCreatures = unlockedCreatures.filter((c) =>
    selectedTypeFilter === "TODOS" ? true : c.type === selectedTypeFilter
  );

  const handleChooseCreature = async (creature: UnlockedCreatureAvatar) => {
    const nextAvatar: SelectedAvatarInfo = {
      name: creature.name,
      type: creature.type,
    };

    setSavingName(creature.name);
    onSelectAvatar(nextAvatar);

    try {
      localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(nextAvatar));
      window.dispatchEvent(
        new CustomEvent(AVATAR_CHANGE_EVENT, { detail: nextAvatar })
      );
    } catch {
      // Ignore storage errors
    }

    const res = await updatePlayerAvatarAction(creature.name);
    setSavingName(null);

    if (res.success) {
      setFeedback(`"${creature.name}" definido como sua foto de perfil!`);
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  const filterTypes = [
    { key: "TODOS", label: "Todas" },
    { key: "BESTIAIS", label: "Bestiais" },
    { key: "ESPIRITOS", label: "Espíritos" },
    { key: "MORTOS_VIVOS", label: "Mortos-Vivos" },
    { key: "MITOLOGICOS", label: "Mitológicos" },
    { key: "MECANICOS", label: "Mecânicos" },
    { key: "HUMANOIDES", label: "Humanóides" },
    { key: "ARTROPODES", label: "Artrópodes" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-xl bg-[#0D0B14] border-2 border-[#7C3AED] shadow-[0_0_50px_rgba(124,58,237,0.45)] overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1A142E] via-[#140F24] to-[#0D0B14] border-b border-[#3E355B]">
          <div className="flex items-center gap-4">
            {/* Preview do Avatar Atual em Moldura Octogonal */}
            <div
              className="w-14 h-14 p-[2px] bg-gradient-to-br from-[#38BDF8] via-[#A855F7] to-[#6D28D9] shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              style={{
                clipPath:
                  "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
              }}
            >
              <div
                className="w-full h-full bg-[#120E20] flex items-center justify-center overflow-hidden p-1"
                style={{
                  clipPath:
                    "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
                }}
              >
                <CutoutMonsterSprite
                  name={currentAvatar.name}
                  type={currentAvatar.type}
                  category="MONSTRO"
                  isEnemy={false}
                  className="w-full h-full scale-125 translate-y-0.5"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C084FC]" />
                <h2 className="text-lg sm:text-xl font-gothic font-black text-white tracking-wide">
                  Foto de Perfil &middot; Criaturas Desbloqueadas
                </h2>
              </div>
              <p className="text-xs font-parchment text-[#94A3B8] mt-0.5">
                Escolha qualquer criatura desbloqueada na sua coleção ({unlockedCreatures.length} disponíveis) para representar seu ícone de Comandante.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#1E1930] hover:bg-[#F43F5E] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Filtros por Tipo de Criatura */}
        <div className="px-6 py-3 bg-[#110E1B] border-b border-[#262138] flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {filterTypes.map((ft) => (
            <button
              key={ft.key}
              onClick={() => setSelectedTypeFilter(ft.key)}
              className={`px-3 py-1 rounded-md text-[11px] font-gothic font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                selectedTypeFilter === ft.key
                  ? "bg-[#7C3AED] text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]"
                  : "bg-[#1A162B] text-[#94A3B8] hover:text-white hover:bg-[#251F3D] border border-[#2E2746]"
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>

        {/* Mensagem de Feedback */}
        {feedback && (
          <div className="mx-6 mt-3 px-4 py-2 rounded-lg bg-[#064E3B]/90 border border-[#10B981] text-[#A7F3D0] text-xs font-gothic font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#34D399]" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Grade de Criaturas Desbloqueadas */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading && unlockedCreatures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#94A3B8] gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#A855F7]" />
              <span className="text-xs font-gothic">
                Carregando criaturas desbloqueadas no NeonDB...
              </span>
            </div>
          ) : filteredCreatures.length === 0 ? (
            <div className="text-center py-12 text-xs font-parchment text-[#94A3B8]">
              Nenhuma criatura desbloqueada encontrada para este filtro. Abra pacotes na Tenda do Antiquário para desbloquear mais criaturas!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {filteredCreatures.map((creature) => {
                const isSelected = currentAvatar.name === creature.name;
                const isSaving = savingName === creature.name;
                const rarityTheme =
                  RARITY_THEMES[creature.rarity as Rarity] ||
                  RARITY_THEMES.COMUM;
                const typeTheme =
                  CARD_TYPE_THEMES[creature.type as CardType] ||
                  CARD_TYPE_THEMES.BESTIAIS;

                return (
                  <button
                    key={creature.id}
                    onClick={() => handleChooseCreature(creature)}
                    className={`group relative p-3 rounded-xl border-2 flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#1E1638] border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.45)] scale-[1.02]"
                        : "bg-[#131020] border-[#29233D] hover:border-[#A855F7] hover:bg-[#19142B]"
                    }`}
                  >
                    {/* Badge de Selecionado */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-20 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#0284C7] text-white text-[9px] font-gothic font-bold uppercase shadow">
                        <Check className="w-2.5 h-2.5" /> Em Uso
                      </div>
                    )}

                    {/* Moldura Octogonal do Ícone da Criatura */}
                    <div
                      className={`relative w-20 h-20 p-[2px] transition-transform duration-200 group-hover:scale-105 ${
                        isSelected
                          ? "bg-gradient-to-br from-[#38BDF8] via-[#A855F7] to-[#6D28D9]"
                          : "bg-gradient-to-br from-[#5B4E80] to-[#1E1B2E] group-hover:from-[#A855F7] group-hover:to-[#38BDF8]"
                      }`}
                      style={{
                        clipPath:
                          "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
                      }}
                    >
                      <div
                        className="w-full h-full bg-[#09080E] flex items-center justify-center overflow-hidden p-1.5"
                        style={{
                          clipPath:
                            "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
                        }}
                      >
                        <div
                          className="absolute inset-0 pointer-events-none opacity-35"
                          style={{
                            background: `radial-gradient(circle at 50% 50%, ${typeTheme.ornamentColor}, transparent 70%)`,
                          }}
                        />
                        <CutoutMonsterSprite
                          name={creature.name}
                          type={creature.type}
                          category="MONSTRO"
                          isEnemy={false}
                          className="w-full h-full scale-125 translate-y-0.5"
                        />
                      </div>
                    </div>

                    {/* Nome da Criatura */}
                    <span className="mt-2.5 font-gothic font-bold text-xs text-[#F8FAFC] line-clamp-1 group-hover:text-[#38BDF8] transition-colors">
                      {creature.name}
                    </span>

                    {/* Subtítulo: Tipo & Raridade */}
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span
                        className="text-[9px] font-gothic uppercase font-bold"
                        style={{ color: typeTheme.accentColor }}
                      >
                        {typeTheme.shortLabel}
                      </span>
                      <span className="text-[#475569] text-[9px]">&bull;</span>
                      <span className="text-[9px] font-numbers text-[#94A3B8]">
                        { isSaving ? "Salvando..." : `${creature.quantity}x` }
                      </span>
                    </div>

                    <span
                      className={`mt-1 text-[8px] font-gothic font-bold uppercase px-1.5 py-0.2 rounded border ${rarityTheme.badgeBg} ${rarityTheme.badgeText} ${rarityTheme.badgeBorder}`}
                    >
                      {rarityTheme.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="px-6 py-3 bg-[#110E1B] border-t border-[#262138] flex items-center justify-between text-xs text-[#94A3B8]">
          <span>
            Avatar ativo:{" "}
            <strong className="text-white font-gothic">
              {currentAvatar.name}
            </strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#9333EA] text-white font-gothic font-bold text-xs cursor-pointer transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}

