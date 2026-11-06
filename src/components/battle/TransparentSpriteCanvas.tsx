"use client";

import React, { useEffect, useRef, useState } from "react";

interface TransparentSpriteCanvasProps {
  src: string;
  alt?: string;
  isAi?: boolean;
  className?: string;
  threshold?: number;
  preserveBackground?: boolean; // Se true, exibe a arte original sem flood-fill (para molduras completas)
}

// Cache global em memória para não reprocessar a mesma imagem repetidas vezes
const processedSpriteCache = new Map<string, string>();

/**
 * Remove o fundo preto/escuro utilizando Flood-Fill a partir das 4 bordas
 * da imagem. Isso garante que partes escuras dentro da criatura (pupilas,
 * contornos pretos, armaduras escuras) permaneçam intactas!
 */
function removeBlackBackgroundFloodFill(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  threshold = 34
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const totalPixels = width * height;

  // 0 = não visitado, 1 = visitado/transparente
  const visited = new Uint8Array(totalPixels);

  // Fila circular ou ponteiro para BFS de alta performance
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const isDark = (idx: number) => {
    const pi = idx * 4;
    const r = data[pi];
    const g = data[pi + 1];
    const b = data[pi + 2];
    const a = data[pi + 3];
    if (a < 10) return true; // Já transparente
    return r <= threshold && g <= threshold && b <= threshold;
  };

  // 1. Inicializar a fila com os pixels das 4 bordas da imagem
  // Borda superior e inferior
  for (let x = 0; x < width; x++) {
    const topIdx = x;
    const btmIdx = (height - 1) * width + x;

    if (!visited[topIdx] && isDark(topIdx)) {
      visited[topIdx] = 1;
      data[topIdx * 4 + 3] = 0; // Transparente
      queue[tail++] = topIdx;
    }
    if (!visited[btmIdx] && isDark(btmIdx)) {
      visited[btmIdx] = 1;
      data[btmIdx * 4 + 3] = 0;
      queue[tail++] = btmIdx;
    }
  }

  // Borda esquerda e direita
  for (let y = 0; y < height; y++) {
    const leftIdx = y * width;
    const rightIdx = y * width + (width - 1);

    if (!visited[leftIdx] && isDark(leftIdx)) {
      visited[leftIdx] = 1;
      data[leftIdx * 4 + 3] = 0;
      queue[tail++] = leftIdx;
    }
    if (!visited[rightIdx] && isDark(rightIdx)) {
      visited[rightIdx] = 1;
      data[rightIdx * 4 + 3] = 0;
      queue[tail++] = rightIdx;
    }
  }

  // 2. BFS Flood-Fill para os 4 vizinhos adjacentes
  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    // 4 vizinhos (Cima, Baixo, Esquerda, Direita)
    const neighbors = [
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
    ];

    for (const n of neighbors) {
      if (n === -1 || visited[n]) continue;

      const npi = n * 4;
      const r = data[npi];
      const g = data[npi + 1];
      const b = data[npi + 2];
      const maxVal = Math.max(r, g, b);

      if (maxVal <= threshold) {
        visited[n] = 1;
        data[npi + 3] = 0; // Torna transparente
        queue[tail++] = n;
      } else if (maxVal <= threshold + 18) {
        // Suavização das bordas (Anti-aliasing sutil no contorno da silhueta)
        visited[n] = 1;
        const alphaFactor = (maxVal - threshold) / 18;
        data[npi + 3] = Math.round(data[npi + 3] * alphaFactor);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function TransparentSpriteCanvas({
  src,
  alt = "Sprite 2D",
  isAi = false,
  className = "",
  threshold = 36,
  preserveBackground = false,
}: TransparentSpriteCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cachedUrl, setCachedUrl] = useState<string | null>(() => {
    return processedSpriteCache.get(src) || null;
  });
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!cachedUrl);

  useEffect(() => {
    if (!src) return;

    if (preserveBackground) {
      setCachedUrl(src);
      setIsLoading(false);
      return;
    }

    // Se já foi processado e está em cache
    const existing = processedSpriteCache.get(src);
    if (existing) {
      setCachedUrl(existing);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const offscreen = document.createElement("canvas");
        offscreen.width = img.naturalWidth || 512;
        offscreen.height = img.naturalHeight || 512;
        const ctx = offscreen.getContext("2d", { willReadFrequently: true });

        if (!ctx) {
          setCachedUrl(src);
          setIsLoading(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        removeBlackBackgroundFloodFill(ctx, offscreen.width, offscreen.height, threshold);

        const dataUrl = offscreen.toDataURL("image/png");
        processedSpriteCache.set(src, dataUrl);
        setCachedUrl(dataUrl);
      } catch (err) {
        console.warn("Flood fill fallback to raw image:", err);
        setCachedUrl(src);
      } finally {
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
  }, [src, threshold, preserveBackground]);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center text-xs text-slate-500 ${className}`}>
        [Sprite indisponível]
      </div>
    );
  }

  const finalSrc = cachedUrl || src;

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none transition-transform duration-300 ${
        isAi ? "scale-x-[-1]" : ""
      } ${className}`}
      style={{
        transformOrigin: "center bottom",
      }}
    >
      {/* Imagem transparente renderizada */}
      <img
        src={finalSrc}
        alt={alt}
        className={`w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${
          isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
        } transition-all duration-200`}
        draggable={false}
      />

      {/* Indicador suave de carregamento enquanto o canvas processa */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

