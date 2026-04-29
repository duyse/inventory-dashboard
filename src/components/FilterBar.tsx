import type { FilterParams } from '../types';

interface FilterBarProps {
  filters: FilterParams;
  onChange: (filters: FilterParams) => void;
  uniqueMakes: string[];
  totalCount: number;
  agingCount: number;
}

export function FilterBar({
  filters,
  onChange,
  uniqueMakes,
  totalCount,
  agingCount,
}: FilterBarProps) {
  const update = (patch: Partial<FilterParams>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {/* Stats Row */}
      <div className="flex flex-wrap gap-3 mb-5">
        <StatCard
          label="Total Vehicles"
          value={totalCount}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 1h5l3-5.5V9a1 1 0 00-1-1h-1" />
            </svg>
          }
          color="text-accent-400"
        />
        <StatCard
          label="Aging Stock"
          value={agingCount}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
          color="text-amber-400"
          highlight
        />
        <StatCard
          label="Fresh Inventory"
          value={totalCount - agingCount}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="text-green-400"
        />
      </div>

      {/* Filter Controls */}
      <div
        id="filter-bar"
        className="flex flex-wrap items-end gap-4 p-4 rounded-xl bg-surface-800/60 border border-surface-600/40 backdrop-blur-sm"
      >
        {/* Dealership ID */}
        <div className="flex flex-col gap-1.5 min-w-[120px]">
          <label
            htmlFor="filter-dealership"
            className="text-xs font-medium text-text-secondary tracking-wide uppercase"
          >
            Dealership ID
          </label>
          <input
            id="filter-dealership"
            type="number"
            value={filters.dealershipId}
            onChange={(e) =>
              update({ dealershipId: Number(e.target.value) || 42 })
            }
            className="h-10 px-3 rounded-lg bg-surface-700/80 border border-surface-600/60 text-text-primary text-sm
              placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50
              transition-all duration-200"
          />
        </div>

        {/* Make */}
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label
            htmlFor="filter-make"
            className="text-xs font-medium text-text-secondary tracking-wide uppercase"
          >
            Make
          </label>
          <div className="relative">
            <select
              id="filter-make"
              value={filters.make}
              onChange={(e) => update({ make: e.target.value })}
              className="w-full h-10 px-3 pr-10 rounded-lg bg-surface-700/80 border border-surface-600/60 text-text-primary text-sm
                focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50
                transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">All Makes</option>
              {uniqueMakes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Model */}
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label
            htmlFor="filter-model"
            className="text-xs font-medium text-text-secondary tracking-wide uppercase"
          >
            Model
          </label>
          <input
            id="filter-model"
            type="text"
            value={filters.model}
            placeholder="Search model…"
            onChange={(e) => update({ model: e.target.value })}
            className="h-10 px-3 rounded-lg bg-surface-700/80 border border-surface-600/60 text-text-primary text-sm
              placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50
              transition-all duration-200"
          />
        </div>

        {/* Aging Toggle */}
        <div className="flex items-center gap-2.5 h-10 ml-auto">
          <button
            id="filter-aging-toggle"
            type="button"
            role="switch"
            aria-checked={filters.agingOnly}
            onClick={() => update({ agingOnly: !filters.agingOnly })}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-500/50
              ${filters.agingOnly ? 'bg-amber-500' : 'bg-surface-600'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg
                transform ring-0 transition-transform duration-200 ease-in-out
                ${filters.agingOnly ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
          <label
            htmlFor="filter-aging-toggle"
            className="text-sm font-medium text-text-secondary cursor-pointer select-none whitespace-nowrap"
          >
            Aging Only{' '}
            <span className="text-xs text-text-muted">(&gt;90 days)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon,
  color,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-sm flex-1 min-w-[180px]
        transition-all duration-300 hover:scale-[1.02]
        ${
          highlight
            ? 'bg-amber-500/5 border-amber-500/20'
            : 'bg-surface-800/50 border-surface-600/30'
        }
      `}
    >
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-lg ${
          highlight ? 'bg-amber-500/15' : 'bg-surface-700/60'
        } ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-text-muted font-medium">{label}</p>
      </div>
    </div>
  );
}
