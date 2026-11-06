"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Coins,
  Sparkles,
  Layers,
  Crosshair,
  MapPin,
  Home,
  Camera,
  LogIn,
  LogOut,
  UserPlus,
  KeyRound,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";
import { CutoutMonsterSprite } from "./battle/CutoutMonsterSprite";
import {
  ProfileAvatarModal,
  AVATAR_STORAGE_KEY,
  AVATAR_CHANGE_EVENT,
  SelectedAvatarInfo,
} from "./ProfileAvatarModal";
import { getPlayerAvatarDataAction } from "@/actions/profile";
import { getCurrentUserAction, logoutAction } from "@/actions/auth";
import { AuthModal, AuthMode } from "./auth/AuthModal";

interface NavbarProps {
  gold?: number;
  username?: string;
  initialAvatarName?: string;
}

export function Navbar({
  gold = 500,
  username = "Comandante",
  initialAvatarName,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
    email: string | null;
    gold: number;
    avatarCardName: string;
  } | null>(null);

  const [avatar, setAvatar] = useState<SelectedAvatarInfo>({
    name: initialAvatarName || "Lobo Cinzento Caçador",
    type: "BESTIAIS",
  });

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // 1. Tenta ler imediatamente do localStorage para resposta instantânea
    try {
      const saved = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) {
          setAvatar({ name: parsed.name, type: parsed.type || "BESTIAIS" });
        }
      }
    } catch {
      // ignore
    }

    // 2. Sincroniza usuário autenticado
    getCurrentUserAction()
      .then((res) => {
        if (res.isAuthenticated && res.user) {
          setCurrentUser(res.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {});

    // 3. Sincroniza avatar com o NeonDB
    getPlayerAvatarDataAction()
      .then((data) => {
        if (data?.avatarCardName) {
          const synced = {
            name: data.avatarCardName,
            type: data.avatarCardType || "BESTIAIS",
          };
          setAvatar(synced);
          try {
            localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(synced));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {});

    // 4. Escuta trocas de foto de perfil feitas no HUD de batalha ou no modal
    const handleAvatarEvent = (e: Event) => {
      const customEvent = e as CustomEvent<SelectedAvatarInfo>;
      if (customEvent.detail?.name) {
        setAvatar(customEvent.detail);
      }
    };

    window.addEventListener(AVATAR_CHANGE_EVENT, handleAvatarEvent);
    return () => {
      window.removeEventListener(AVATAR_CHANGE_EVENT, handleAvatarEvent);
    };
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logoutAction();
    setCurrentUser(null);
    router.refresh();
  };

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const effectiveGold = currentUser?.gold ?? gold;
  const effectiveUsername = currentUser?.username ?? username;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1A1633]/85 backdrop-blur-md border-b border-[#F59E0B]/30 shadow-[0_4px_25px_rgba(22,19,43,0.7)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Marca */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#F59E0B] text-[#0F0D1E] shadow-[0_0_18px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-gothic font-black text-lg tracking-wider bg-gradient-to-r from-[#F59E0B] via-[#FF7A00] to-[#38BDF8] bg-clip-text text-transparent">
                KazTactics
              </span>
              <span className="hidden sm:inline-block ml-2 text-[9px] font-numbers uppercase tracking-widest text-[#38BDF8] px-2 py-0.5 rounded-full bg-[#13182E] border border-[#38BDF8]/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                High Fantasy
              </span>
            </div>
          </Link>

          {/* Links Centrais de Navegação */}
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic tracking-wide transition-all shrink-0 ${
                pathname === "/"
                  ? "bg-[#252147] text-[#F59E0B] border border-[#F59E0B]/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#252147]/50 border border-transparent"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Santuário</span>
            </Link>

            <Link
              href="/campaign"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic tracking-wide transition-all shrink-0 ${
                pathname === "/campaign"
                  ? "bg-[#2A1E4A] text-[#F43F5E] border border-[#F43F5E]/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#252147]/50 border border-transparent"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#F43F5E]" />
              <span>Expedições</span>
            </Link>

            <Link
              href="/deckbuilder"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic tracking-wide transition-all shrink-0 ${
                pathname === "/deckbuilder"
                  ? "bg-[#182846] text-[#38BDF8] border border-[#38BDF8]/60 shadow-[0_0_12px_rgba(56,189,248,0.35)]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#252147]/50 border border-transparent"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Grimório</span>
            </Link>

            <Link
              href="/battle"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic tracking-wide transition-all shrink-0 ${
                pathname === "/battle"
                  ? "bg-gradient-to-r from-[#FF7A00]/25 to-[#F59E0B]/25 text-[#F59E0B] border border-[#F59E0B] shadow-[0_0_16px_rgba(245,158,11,0.45)]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#252147]/50 border border-transparent"
              }`}
            >
              <Crosshair className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>Arena</span>
            </Link>

            <Link
              href="/shop"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic tracking-wide transition-all shrink-0 ${
                pathname === "/shop"
                  ? "bg-[#252147] text-[#A855F7] border border-[#A855F7]/60 shadow-[0_0_12px_rgba(168,85,247,0.35)]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#252147]/50 border border-transparent"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>Invocação</span>
            </Link>
          </nav>

          {/* Informações do Usuário: Ouro & Menu de Autenticação / Perfil */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Indicador de Ouro */}
            <div className="flex items-center gap-1.5 bg-[#121024]/90 border border-[#F59E0B]/40 px-3 py-1.5 rounded-xl shadow-inner">
              <Coins className="w-4 h-4 text-[#F59E0B] animate-torch" />
              <span className="font-numbers font-black text-sm text-[#F59E0B]">
                {effectiveGold.toLocaleString()}
              </span>
            </div>

            {/* Se o Usuário Estiver Logado */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                title={`Comandante: ${effectiveUsername} (Clique para opções de conta)`}
                className="group flex items-center gap-2 bg-[#1E1938]/90 hover:bg-[#2B234D] border border-[#7C3AED]/50 hover:border-[#38BDF8] pl-1.5 pr-2.5 py-1 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <div className="relative w-8 h-8 rounded-lg bg-[#0D0A18] border border-[#A855F7]/60 group-hover:border-[#38BDF8] overflow-hidden flex items-center justify-center p-0.5 shrink-0">
                  <CutoutMonsterSprite
                    name={avatar.name}
                    type={avatar.type}
                    category="MONSTRO"
                    isEnemy={false}
                    className="w-full h-full scale-125 translate-y-0.5"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="font-gothic text-xs font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors flex items-center gap-1">
                    {effectiveUsername}
                    {currentUser && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </span>
                  <span className="text-[9px] font-parchment text-[#C084FC] truncate max-w-[100px]">
                    {currentUser ? "Conectado" : "Convidado"}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-white transition-transform" />
              </button>

              {/* Menu Dropdown de Conta / Perfil */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#16122E] border-2 border-[#F59E0B]/40 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.85)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-[#2D244D] mb-1">
                    <span className="block text-xs font-gothic font-bold text-[#F8FAFC]">
                      {effectiveUsername}
                    </span>
                    <span className="block text-[10px] font-parchment text-[#94A3B8] truncate">
                      {currentUser ? "Comandante Autenticado" : "Modo de Demonstração"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsAvatarModalOpen(true);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-gothic text-[#CBD5E1] hover:text-[#38BDF8] hover:bg-[#252147] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Trocar Foto de Perfil</span>
                  </button>

                  {currentUser ? (
                    <>
                      <button
                        type="button"
                        onClick={() => openAuth("recovery")}
                        className="w-full px-3 py-1.5 text-left text-xs font-gothic text-[#CBD5E1] hover:text-[#C084FC] hover:bg-[#252147] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-[#C084FC]" />
                        <span>Redefinir Senha</span>
                      </button>

                      <div className="my-1 border-t border-[#2D244D]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full px-3 py-1.5 text-left text-xs font-gothic text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sair da Conta</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="my-1 border-t border-[#2D244D]" />

                      <button
                        type="button"
                        onClick={() => openAuth("login")}
                        className="w-full px-3 py-1.5 text-left text-xs font-gothic text-[#F59E0B] hover:bg-[#252147] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Entrar com Outra Conta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openAuth("register")}
                        className="w-full px-3 py-1.5 text-left text-xs font-gothic text-[#38BDF8] hover:bg-[#252147] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>Criar Nova Conta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openAuth("recovery")}
                        className="w-full px-3 py-1.5 text-left text-xs font-gothic text-[#C084FC] hover:bg-[#252147] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-[#C084FC]" />
                        <span>Recuperar Senha</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Botão Rápido de Login/Cadastro quando Visitante */}
            {!currentUser && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-gothic font-bold text-[#F59E0B] hover:text-[#FBBF24] bg-[#252147]/80 hover:bg-[#252147] border border-[#F59E0B]/40 transition-all cursor-pointer flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Entrar</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-gothic font-bold text-white bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] shadow-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Cadastrar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Avatar de Criaturas */}
      <ProfileAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={avatar}
        onSelectAvatar={(next) => setAvatar(next)}
      />

      {/* Modal de Autenticação Completo (Login, Cadastro e Recuperação com Código) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => {
          getCurrentUserAction()
            .then((res) => {
              if (res.isAuthenticated && res.user) {
                setCurrentUser(res.user);
              }
            })
            .catch(() => {});
        }}
      />
    </>
  );
}
