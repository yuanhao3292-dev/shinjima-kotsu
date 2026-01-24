'use client';

import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import type { Vehicle, Language } from '../types/vehicle';

interface SeatLayoutModalProps {
  vehicle: Vehicle;
  lang: Language;
  t: (key: string) => string;
  onClose: () => void;
}

export default function SeatLayoutModal({ vehicle, lang, t, onClose }: SeatLayoutModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    // Save the currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    // Cleanup: restore focus when modal closes
    return () => {
      previousFocusRef.current?.focus();
    };
  }, []);

  // Focus trap: keep focus inside modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab') {
      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Tab + Shift
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 id="modal-title" className="font-bold text-lg text-gray-900">
              {vehicle.name[lang]}
            </h3>
            <p className="text-sm text-gray-500">{t('seatConfig')}</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label={t('closeModal')}
          >
            <X size={20} className="text-gray-500" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-4">
            <div className="inline-block bg-gray-800 text-white text-xs px-4 py-1 rounded-full">
              {t('front')}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 mb-4" role="img" aria-label={`${vehicle.name[lang]} ${t('seatConfig')}`}>
            {vehicle.seatLayout.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 justify-center">
                {row.map((seat, seatIndex) => {
                  let bgColor = 'bg-gray-100';
                  let textColor = 'text-gray-400';
                  let content = '';
                  let title = '';

                  if (seat === 'D') {
                    bgColor = 'bg-blue-500';
                    textColor = 'text-white';
                    content = t('driverShort');
                    title = t('driver');
                  } else if (seat === 'P') {
                    bgColor = 'bg-orange-100 border border-orange-300';
                    textColor = 'text-orange-600';
                    const seatNumber = vehicle.seatLayout.rows
                      .slice(0, rowIndex + 1)
                      .reduce((count, r, idx) => {
                        if (idx < rowIndex) {
                          return count + r.filter(s => s === 'P').length;
                        }
                        return count + r.slice(0, seatIndex).filter(s => s === 'P').length + 1;
                      }, 0);
                    content = String(seatNumber);
                    title = `${t('seatLabel')} ${content}`;
                  } else if (seat === '🚪') {
                    bgColor = 'bg-green-100 border border-green-300';
                    textColor = 'text-green-600';
                    content = t('doorShort');
                    title = t('door');
                  } else if (seat === '—') {
                    bgColor = 'bg-transparent';
                    content = '';
                    title = t('aisle');
                  }

                  return (
                    <div
                      key={seatIndex}
                      className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded ${bgColor} ${textColor}`}
                      title={title}
                      aria-label={title || undefined}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <div className="inline-block bg-gray-300 text-gray-600 text-xs px-4 py-1 rounded-full">
              {t('rear')}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-4" role="list">
            <div className="flex items-center gap-1" role="listitem">
              <span className="w-4 h-4 bg-blue-500 rounded" aria-hidden="true"></span> {t('driver')}
            </div>
            <div className="flex items-center gap-1" role="listitem">
              <span className="w-4 h-4 bg-orange-100 border border-orange-300 rounded" aria-hidden="true"></span> {t('passengerSeat')}
            </div>
            <div className="flex items-center gap-1" role="listitem">
              <span className="w-4 h-4 bg-green-100 border border-green-300 rounded" aria-hidden="true"></span> {t('door')}
            </div>
          </div>

          {vehicle.seatLayout.legend && (
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">{vehicle.seatLayout.legend[lang]}</p>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4">
          <p className="text-xs text-gray-400 text-center">
            {t('seatDisclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
