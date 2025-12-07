// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// React island - Article detail modal with client:idle hydration

import React, { useState, useEffect, useCallback } from 'react';
import { format, isValid } from 'date-fns';
import type { RSSItem } from '../../lib/types';

interface ItemModalProps {
  item: RSSItem | null;
  onClose: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, onClose }) => {
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Reset copy feedback when item changes
  useEffect(() => {
    setCopyFeedback(false);
  }, [item]);

  const handleCopy = useCallback(() => {
    if (!item) return;
    navigator.clipboard.writeText(item.link);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  }, [item]);

  if (!item) return null;

  const safeDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    return isValid(d) ? d : new Date();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0f172a] border border-white/10 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-black/20">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest bg-white/10 text-white"
                style={{ color: item.color }}
              >
                {item.sourceName}
              </span>
              <span className="text-xs font-medium text-gray-500">
                {format(safeDate(item.pubDate), 'PPP p')}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white leading-snug tracking-tight">
              {item.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 text-sm text-gray-400 font-medium leading-relaxed space-y-4 tracking-wide">
          <p>
            {item.description?.replace(/<[^>]*>?/gm, '') || 'No description provided by source feed.'}
            <span className="inline-block w-2 h-4 bg-cyan-500 ml-1 animate-pulse align-middle shadow-[0_0_8px_#06b6d4]" />
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-4">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-lg font-bold transition-all text-xs uppercase tracking-widest border border-white/5 ${
              copyFeedback ? 'text-green-400 border-green-500/30 bg-green-900/10' : ''
            }`}
          >
            {copyFeedback ? (
              <>
                <span>Copied!</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </>
            ) : (
              <>
                <span>Copy Link</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </>
            )}
          </button>

          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold transition-colors text-xs uppercase tracking-widest"
          >
            <span>Open Source Document</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
