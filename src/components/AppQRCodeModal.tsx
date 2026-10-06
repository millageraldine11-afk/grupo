import React, { useState } from 'react';
import { QrCode, X, Copy, Check, Download, Smartphone, Sparkles, ExternalLink } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface AppQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const AppQRCodeModal: React.FC<AppQRCodeModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  // SVG QR Code generator representation
  const qrMatrixSize = 25;
  // Deterministic pattern generation based on the app URL string
  const cells: boolean[][] = [];
  for (let r = 0; r < qrMatrixSize; r++) {
    cells[r] = [];
    for (let c = 0; c < qrMatrixSize; c++) {
      // Finder patterns in corners
      if (
        (r < 7 && c < 7) ||
        (r < 7 && c >= qrMatrixSize - 7) ||
        (r >= qrMatrixSize - 7 && c < 7)
      ) {
        // Inner and outer rings of finder patterns
        const inOuter = (r === 0 || r === 6 || c === 0 || c === 6 ||
                         r === qrMatrixSize - 7 || r === qrMatrixSize - 1 ||
                         c === qrMatrixSize - 7 || c === qrMatrixSize - 1);
        const inInner = ((r >= 2 && r <= 4) && (c >= 2 && c <= 4 || c >= qrMatrixSize - 5 && c <= qrMatrixSize - 3)) ||
                        ((r >= qrMatrixSize - 5 && r <= qrMatrixSize - 3) && (c >= 2 && c <= 4));
        cells[r][c] = inOuter || inInner;
      } else {
        // Pseudorandom hash pattern
        const val = (r * 31 + c * 17 + appUrl.charCodeAt((r + c) % appUrl.length)) % 7;
        cells[r][c] = val === 0 || val === 2 || val === 5;
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-sky-400/50 bg-gradient-to-b from-slate-900 via-sky-950/80 to-slate-950 p-6 sm:p-8 text-center shadow-[0_0_40px_rgba(14,165,233,0.35)]">
        {/* Glow sheen */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-950/60 px-3 py-1 text-xs font-semibold text-sky-300 mb-2">
            <Smartphone className="h-3.5 w-3.5 text-sky-400" />
            <span>Acceso Móvil Instantáneo</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Código QR de la Aplicación
          </h3>
          <p className="text-xs text-sky-200/80 mt-1">
            Escanea con la cámara de tu smartphone para abrir Biosecurity Challenge en tu celular
          </p>
        </div>

        {/* QR Code Container with Celeste Border */}
        <div className="my-5 mx-auto flex h-64 w-64 items-center justify-center rounded-3xl bg-white p-4 shadow-2xl ring-4 ring-sky-400/30 relative">
          <svg
            viewBox={`0 0 ${qrMatrixSize} ${qrMatrixSize}`}
            className="h-full w-full shape-rendering-crispEdges"
          >
            {cells.map((row, r) =>
              row.map((active, c) =>
                active ? (
                  <rect
                    key={`${r}-${c}`}
                    x={c}
                    y={r}
                    width={1}
                    height={1}
                    fill="#0284c7"
                  />
                ) : null
              )
            )}
          </svg>

          {/* Micro Icon Badge in center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 border-2 border-sky-400 text-sky-300 shadow-xl">
              <Sparkles className="h-6 w-6 text-sky-400 animate-spin" />
            </div>
          </div>
        </div>

        {/* URL Box & Copy */}
        <div className="rounded-2xl border border-sky-500/20 bg-slate-950/80 p-3 flex items-center justify-between gap-2 mb-4 text-left">
          <div className="truncate text-xs font-mono text-sky-200">
            {appUrl}
          </div>
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1.5 rounded-xl bg-sky-500/20 border border-sky-400/40 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/30 transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-sky-400" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-3 text-xs font-black text-slate-950 hover:from-sky-300 hover:to-cyan-200 transition-all shadow-lg"
          >
            <span>Abrir en Nueva Pestaña</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
