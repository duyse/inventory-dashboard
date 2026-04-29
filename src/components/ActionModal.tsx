import { useState, useEffect, useRef } from 'react';
import type { Vehicle, VehicleStatus } from '../types';
import { statusLabel } from '../utils';

interface ActionModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onSubmit: (vehicleId: number, status: string, note: string) => Promise<void>;
}

const STATUS_OPTIONS: { value: VehicleStatus; label: string }[] = [
  { value: 'PRICE_REDUCTION_PLANNED', label: 'Price Reduction Planned' },
  { value: 'SEND_TO_AUCTION', label: 'Send to Auction' },
  { value: 'IN_REPAIR', label: 'Needs Inspection / In Repair' },
];

export function ActionModal({ vehicle, onClose, onSubmit }: ActionModalProps) {
  const [status, setStatus] = useState(vehicle.current_status || 'PRICE_REDUCTION_PLANNED');
  const [note, setNote] = useState(vehicle.current_status_note || '');
  const [saving, setSaving] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(vehicle.id, status, note);
      onClose();
    } catch {
      setSaving(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      id="action-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="w-full max-w-md bg-surface-800 border border-surface-600/50 rounded-2xl shadow-2xl animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600/40">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Update Action</h2>
            <p className="text-xs text-text-muted mt-0.5">
              {vehicle.make} {vehicle.model} — {vehicle.vin}
            </p>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-700 transition-colors text-text-muted hover:text-text-primary cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current Status Chip */}
        {vehicle.current_status && (
          <div className="px-6 pt-4">
            <p className="text-xs text-text-muted mb-1">Current status</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-700 text-text-secondary">
              {statusLabel(vehicle.current_status)}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="action-status" className="text-xs font-medium text-text-secondary tracking-wide uppercase">
              New Status
            </label>
            <div className="relative">
              <select
                id="action-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full h-10 px-3 pr-10 rounded-lg bg-surface-700/80 border border-surface-600/60 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all duration-200 appearance-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value!}>{opt.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="action-note" className="text-xs font-medium text-text-secondary tracking-wide uppercase">
              Note
            </label>
            <textarea
              id="action-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add details about this action…"
              className="px-3 py-2.5 rounded-lg bg-surface-700/80 border border-surface-600/60 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              id="cancel-action-btn"
              onClick={onClose}
              className="flex-1 h-10 rounded-lg text-sm font-medium text-text-secondary bg-surface-700/60 border border-surface-600/40 hover:bg-surface-700 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-action-btn"
              disabled={saving}
              className="flex-1 h-10 rounded-lg text-sm font-semibold text-white bg-accent-500 hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {saving ? 'Saving…' : 'Save Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
