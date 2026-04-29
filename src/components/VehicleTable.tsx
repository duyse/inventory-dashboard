import type { Vehicle } from '../types';
import { daysInInventory, formatPrice, statusLabel, statusColor } from '../utils';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEditAction: (vehicle: Vehicle) => void;
  isLoading: boolean;
}

export function VehicleTable({ vehicles, onEditAction, isLoading }: VehicleTableProps) {
  if (isLoading) return <TableSkeleton />;

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-surface-700/40 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <p className="text-text-secondary font-medium text-lg">No vehicles found</p>
        <p className="text-text-muted text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in overflow-x-auto rounded-xl border border-surface-600/30 bg-surface-800/40 backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
      <table id="inventory-table" className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-600/40">
            {['VIN', 'Vehicle', 'Year', 'Price', 'Days on Lot', 'Status', 'Action'].map((h, i) => (
              <th key={h} className={`px-4 py-3.5 text-xs font-semibold text-text-muted tracking-wider uppercase ${i === 3 ? 'text-right' : i === 4 || i === 6 ? 'text-center' : 'text-left'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <VehicleRow key={v.id} vehicle={v} onEdit={() => onEditAction(v)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VehicleRow({ vehicle, onEdit }: { vehicle: Vehicle; onEdit: () => void }) {
  const days = daysInInventory(vehicle.received_at);
  const sc = statusColor(vehicle.current_status);

  return (
    <tr className={`border-b border-surface-600/20 transition-colors duration-200 hover:bg-surface-700/30 ${vehicle.isAging ? 'bg-amber-500/[0.03]' : ''}`}>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          {vehicle.isAging && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} title="Aging stock" />}
          <code className="text-xs font-mono text-text-secondary tracking-wide">{vehicle.vin}</code>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <p className="font-semibold text-text-primary">{vehicle.make} <span className="text-text-secondary font-normal">{vehicle.model}</span></p>
        <p className="text-xs text-text-muted mt-0.5">{vehicle.trim}</p>
      </td>
      <td className="px-4 py-3.5 text-text-secondary">{vehicle.year}</td>
      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-text-primary">{formatPrice(vehicle.price)}</td>
      <td className="px-4 py-3.5 text-center">
        <span className={`inline-flex items-center justify-center min-w-[52px] px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${vehicle.isAging ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20' : days > 60 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-surface-600/40 text-text-secondary'}`}>
          {days}d
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
          {statusLabel(vehicle.current_status)}
        </span>
      </td>
      <td className="px-4 py-3.5 text-center">
        <button id={`edit-action-${vehicle.id}`} onClick={onEdit} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20 hover:bg-accent-500/20 hover:border-accent-500/40 focus:outline-none focus:ring-2 focus:ring-accent-500/40 transition-all duration-200 cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          Edit
        </button>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-surface-600/30 bg-surface-800/40 overflow-hidden">
      <div className="flex gap-4 px-4 py-3.5 border-b border-surface-600/40">
        {[120, 160, 60, 80, 80, 100, 70].map((w, i) => (
          <div key={i} className="h-3 rounded animate-shimmer" style={{ width: w }} />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-surface-600/20">
          <div className="h-4 w-32 rounded animate-shimmer" />
          <div className="h-4 w-36 rounded animate-shimmer" />
          <div className="h-4 w-12 rounded animate-shimmer" />
          <div className="h-4 w-16 rounded animate-shimmer ml-auto" />
          <div className="h-4 w-12 rounded animate-shimmer" />
          <div className="h-5 w-24 rounded-full animate-shimmer" />
          <div className="h-7 w-16 rounded-lg animate-shimmer" />
        </div>
      ))}
    </div>
  );
}
