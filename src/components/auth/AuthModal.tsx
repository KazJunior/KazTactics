"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  User as UserIcon,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  loginAction,
  registerAction,
  requestPasswordResetAction,
  resetPasswordWithCodeAction,
} from "@/actions/auth";
import { useRouter } from "next/navigation";

export type AuthMode = "login" | "register" | "recovery";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onSuccess?: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccess,
}: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Campos de Login (Apenas Usuário e Senha)
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Campos de Cadastro (Apenas Usuário e Senha)
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Campos de Recuperação de Senha (Pelo Nome de Usuário)
  const [recoveryUsername, setRecoveryUsername] = useState("");
  const [recoveryStep, setRecoveryStep] = useState<1 | 2>(1);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(false);
  };

  const handleSwitchMode = (nextMode: AuthMode) => {
    resetState();
    setMode(nextMode);
  };

  // Submit de Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setIsLoading(true);

    try {
      const res = await loginAction({
        username: loginUsername,
        password: loginPassword,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Falha no login.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(res.message || "Login realizado com sucesso!");
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage("Erro de conexão. Tente novamente.");
      setIsLoading(false);
    }
  };

  // Submit de Cadastro
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("A confirmação de senha não confere.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerAction({
        username: regUsername,
        password: regPassword,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Falha ao cadastrar.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        "Conta criada com sucesso! Redirecionando para o Tutorial Tático de Recrutas..."
      );
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        router.push("/tutorial");
        router.refresh();
      }, 900);
    } catch {
      setErrorMessage("Erro de conexão. Tente novamente.");
      setIsLoading(false);
    }
  };

  // Etapa 1: Solicitar Código de Recuperação
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setIsLoading(true);

    try {
      const res = await requestPasswordResetAction({
        username: recoveryUsername,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "Falha ao gerar código.");
        setIsLoading(false);
        return;
      }

      setGeneratedCode(res.data.code);
      setInputCode(res.data.code); // Preenche automaticamente para facilitar o teste
      setRecoveryStep(2);
      setSuccessMessage(
        `Código de 6 dígitos gerado com sucesso para o usuário "${res.data.username}"!`
      );
      setIsLoading(false);
    } catch {
      setErrorMessage("Erro ao solicitar código de recuperação.");
      setIsLoading(false);
    }
  };

  // Etapa 2: Redefinir Senha com o Código
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("A confirmação de senha não confere.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPasswordWithCodeAction({
        username: recoveryUsername,
        code: inputCode,
        newPassword,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Código inválido ou expirado.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        "Senha alterada com sucesso! Você já está autenticado."
      );
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        router.refresh();
      }, 900);
    } catch {
      setErrorMessage("Erro de conexão ao redefinir senha.");
      setIsLoading(false);
    }
  };

  // Login de Demonstração Rápida
  const handleDemoLogin = async () => {
    setLoginUsername("EstrategistaKaz");
    setLoginPassword("kaz123456");
    resetState();
    setIsLoading(true);

    try {
      const res = await loginAction({
        username: "EstrategistaKaz",
        password: "kaz123456",
      });

      if (res.success) {
        setSuccessMessage("Entrando como EstrategistaKaz...");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
          router.refresh();
        }, 700);
      } else {
        setErrorMessage(res.error || "Falha no login demo.");
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Erro no login demo.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-[#1C1635] via-[#140F28] to-[#0A0716] border-2 border-[#F59E0B]/50 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden"
        style={{
          boxShadow:
            "0 10px 0 #09090B, 0 16px 40px rgba(0,0,0,0.9), inset 0 2px 0 rgba(245,158,11,0.4)",
        }}
      >
        {/* Topo Decorativo com Abas */}
        <div className="relative px-6 pt-5 pb-4 border-b border-[#F59E0B]/20 bg-[#140F26]/70">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#F59E0B] text-[#0A0716] shadow-[0_0_15px_rgba(245,158,11,0.6)]">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-gothic font-black text-xl text-[#F8FAFC] tracking-wider">
                {mode === "login" && "Acesso ao Santuário"}
                {mode === "register" && "Recrutamento de Comandante"}
                {mode === "recovery" && "Recuperação de Senha"}
              </h2>
              <p className="text-[11px] font-parchment text-[#C084FC]">
                {mode === "login" && "Entre com seu usuário e senha para comandar tropas"}
                {mode === "register" && "Crie sua conta apenas com usuário e senha"}
                {mode === "recovery" && "Redefina sua senha utilizando o código gerado"}
              </p>
            </div>
          </div>

          {/* Abas Alternáveis */}
          <div className="flex items-center gap-1 p-1 bg-[#0D0A1C] border border-[#2D244D] rounded-xl">
            <button
              type="button"
              onClick={() => handleSwitchMode("login")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-gothic font-bold transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-[#252147] text-[#F59E0B] border border-[#F59E0B]/40 shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode("register")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-gothic font-bold transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-[#252147] text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              Cadastrar
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode("recovery")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-gothic font-bold transition-all cursor-pointer ${
                mode === "recovery"
                  ? "bg-[#252147] text-[#C084FC] border border-[#C084FC]/40 shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              Recuperar
            </button>
          </div>
        </div>

        {/* Mensagens de Feedback */}
        <div className="px-6 pt-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* FORMULÁRIO 1: LOGIN (APENAS USUÁRIO E SENHA)                   */}
        {/* ============================================================== */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-gothic font-bold text-[#CBD5E1] mb-1.5">
                Nome de Usuário
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Seu nome de comandante"
                  className="w-full bg-[#0E0B1A] border border-[#382E59] focus:border-[#F59E0B] rounded-xl pl-9 pr-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-gothic font-bold text-[#CBD5E1]">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("recovery")}
                  className="text-[11px] font-parchment text-[#C084FC] hover:text-[#38BDF8] underline cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="w-full bg-[#0E0B1A] border border-[#382E59] focus:border-[#F59E0B] rounded-xl pl-9 pr-10 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  className="absolute right-3 top-3 text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-gothic font-black text-sm tracking-wide bg-gradient-to-r from-[#FF7A00] to-[#F59E0B] hover:from-[#FF8A1A] hover:to-[#FBBF24] text-[#0A0716] shadow-[0_4px_16px_rgba(245,158,11,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Entrar na Batalha</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Acesso Rápido de Teste */}
            <div className="pt-2 border-t border-[#2D244D] flex items-center justify-between">
              <span className="text-[11px] font-parchment text-[#94A3B8]">
                Conta de testes rápida:
              </span>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-[11px] font-gothic font-bold text-[#38BDF8] hover:underline cursor-pointer"
              >
                Entrar como EstrategistaKaz
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* FORMULÁRIO 2: CADASTRO (APENAS USUÁRIO E SENHA)                */}
        {/* ============================================================== */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-gothic font-bold text-[#CBD5E1] mb-1.5">
                Nome de Comandante (Usuário)
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={30}
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Ex: LordeArtur_99"
                  className="w-full bg-[#0E0B1A] border border-[#382E59] focus:border-[#38BDF8] rounded-xl pl-9 pr-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-gothic font-bold text-[#CBD5E1] mb-1.5">
                Senha (mínimo 6 caracteres)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showRegPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Crie sua senha segura"
                  className="w-full bg-[#0E0B1A] border border-[#382E59] focus:border-[#38BDF8] rounded-xl pl-9 pr-10 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword((v) => !v)}
                  className="absolute right-3 top-3 text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  {showRegPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-gothic font-bold text-[#CBD5E1] mb-1.5">
                Confirmar Senha
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Repita a senha para confirmar"
                  className="w-full bg-[#0E0B1A] border border-[#382E59] focus:border-[#38BDF8] rounded-xl pl-9 pr-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Bônus de Boas-Vindas */}
            <div className="p-3 bg-[#141C2E]/80 border border-[#38BDF8]/30 rounded-xl flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span className="text-[11px] font-parchment text-[#93C5FD]">
                Bônus de Cadastro: <strong>500 Ouro</strong> +{" "}
                <strong>Baralho Inicial de 30 Cartas</strong> ativado na sua conta!
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-gothic font-black text-sm tracking-wide bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white shadow-[0_4px_16px_rgba(56,189,248,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Criando Conta...</span>
                </>
              ) : (
                <>
                  <span>Criar Minha Conta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* FORMULÁRIO 3: RECUPERAÇÃO DE SENHA COM CÓDIGO (PELO USUÁRIO)   */}
        {/* ============================================================== */}
        {mode === "recovery" && (
          <div className="p-6 space-y-4">
            {recoveryStep === 1 ? (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <p className="text-xs font-parchment text-[#CBD5E1] leading-relaxed">
                  Informe o seu nome de usuário. Um código de recuperação de 6
                  dígitos será gerado para sua conta e exibido na tela para você
                  redefinir sua senha com segurança.
                </p>

                <div>
                  <label className="block text-xs font-gothic font-bold text-[#CBD5E1] mb-1.5">
                    Nome de Usuário
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="text"
                      required
                      value={recoveryUsername}
                      onChange={(e) => setRecoveryUsername(e.target.value)}
                      placeholder="Ex: EstrategistaKaz"
                      className="w-full bg-[#0E0B1A] border border-[#382E59] focus:border-[#C084FC] rounded-xl pl-9 pr-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl font-gothic font-black text-sm tracking-wide bg-gradient-to-r from-[#9333EA] to-[#C084FC] hover:from-[#7E22CE] hover:to-[#A855F7] text-white shadow-[0_4px_16px_rgba(168,85,247,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gerando Código...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Gerar Código de Recuperação</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                {/* Pergaminho com o Código Gerado em Destaque */}
                {generatedCode && (
                  <div className="p-3 bg-[#24133B] border-2 border-[#A855F7] rounded-xl text-center space-y-1 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <span className="text-[10px] font-gothic font-bold uppercase tracking-wider text-[#D8B4FE]">
                      Código de Recuperação Gerado
                    </span>
                    <div className="font-numbers font-black text-2xl tracking-widest text-[#FACC15] select-all">
                      {generatedCode}
                    </div>
                    <span className="text-[10px] font-parchment text-[#A855F7] block">
                      Válido por 15 minutos (preenchido automaticamente)
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-gothic font-bold text-[#CBD5E1] mb-1">
                    Código de 6 Dígitos
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="000000"
                      className="w-full bg-[#0E0B1A] border border-[#382E59] focus:border-[#C084FC] rounded-xl pl-9 pr-3 py-2 text-sm text-[#FACC15] font-numbers font-bold tracking-widest placeholder:text-[#64748B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-gothic font-bold text-[#CBD5E1] mb-1">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo de 6 caracteres"
                      className="w-full bg-[#0E0B1A] border border-[#382E59] focus:border-[#C084FC] rounded-xl pl-9 pr-10 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="absolute right-3 top-3 text-[#94A3B8] hover:text-white cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-gothic font-bold text-[#CBD5E1] mb-1">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full bg-[#0E0B1A] border border-[#382E59] focus:border-[#C084FC] rounded-xl pl-9 pr-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRecoveryStep(1)}
                    className="py-2.5 px-3 rounded-xl font-gothic text-xs text-[#94A3B8] hover:text-white bg-[#1A152E] border border-[#382E59] cursor-pointer"
                  >
                    Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 rounded-xl font-gothic font-black text-sm tracking-wide bg-gradient-to-r from-[#9333EA] to-[#C084FC] hover:from-[#7E22CE] hover:to-[#A855F7] text-white shadow-[0_4px_16px_rgba(168,85,247,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Redefinindo...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Redefinir Senha e Entrar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
