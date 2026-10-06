import React from 'react';
import { X, ZoomIn, Download, ExternalLink, Sparkles } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageTitle: string;
  description?: string;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageTitle,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border-2 border-sky-400/60 bg-slate-950 shadow-[0_0_50px_rgba(14,165,233,0.35)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-500/20 bg-slate-900/90 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-black text-white truncate max-w-md">
              {imageTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Big Zoomed Image */}
        <div className="relative flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60">
          <img
            src={imageSrc}
            alt={imageTitle}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-sky-500/30"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Footer with Description and hint */}
        {description && (
          <div className="border-t border-sky-500/20 bg-slate-950/90 p-4 text-xs text-sky-200">
            <p className="max-w-3xl leading-relaxed">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
