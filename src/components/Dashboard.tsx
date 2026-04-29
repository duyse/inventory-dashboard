import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchVehicles, updateVehicleAction } from '../api';
import { FilterBar } from './FilterBar';
import { VehicleTable } from './VehicleTable';
import { ActionModal } from './ActionModal';
import type { Vehicle, FilterParams } from '../types';

export function Dashboard() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<FilterParams>({
    dealershipId: 42,
    make: '',
    model: '',
    agingOnly: false,
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setPage(1);
  };

  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Fetch vehicles
  const { data: vehicles = [], isLoading, isError, error } = useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () =>
      fetchVehicles({
        dealershipId: filters.dealershipId,
        make: filters.make || undefined,
        model: filters.model || undefined,
        agingOnly: filters.agingOnly || undefined,
      }),
  });

  // Mutation
  const mutation = useMutation({
    mutationFn: ({ vehicleId, status, note }: { vehicleId: number; status: string; note: string }) =>
      updateVehicleAction(vehicleId, { status, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const handleSubmitAction = useCallback(
    async (vehicleId: number, status: string, note: string) => {
      await mutation.mutateAsync({ vehicleId, status, note });
    },
    [mutation]
  );

  // Derived data
  const uniqueMakes = useMemo(() => {
    const makes = new Set(vehicles.map((v) => v.make));
    return Array.from(makes).sort();
  }, [vehicles]);

  const agingCount = useMemo(
    () => vehicles.filter((v) => v.isAging).length,
    [vehicles]
  );

  const paginatedVehicles = useMemo(() => {
    const start = (page - 1) * limit;
    return vehicles.slice(start, start + limit);
  }, [vehicles, page, limit]);

  return (
    <div className="min-h-screen bg-surface-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-surface-600/30 bg-surface-900/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-400 flex items-center justify-center shadow-lg shadow-accent-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Inventory Dashboard</h1>
              <p className="text-xs text-text-muted">Intelligent Stock Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-surface-700/50 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 mr-1.5" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
              Live
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          uniqueMakes={uniqueMakes}
          totalCount={vehicles.length}
          agingCount={agingCount}
        />

        {isError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm animate-fade-in">
            <p className="font-semibold">Error loading vehicles</p>
            <p className="text-xs mt-1 text-red-600/70 dark:text-red-400/70">{(error as Error).message}</p>
          </div>
        )}

        <VehicleTable
          vehicles={paginatedVehicles}
          onEditAction={setEditingVehicle}
          isLoading={isLoading}
        />

        {vehicles.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-surface-800/40 border border-surface-600/30 rounded-xl mt-4 animate-fade-in">
            <div className="text-sm text-text-secondary">
              Showing <span className="font-medium text-text-primary">{(page - 1) * limit + 1}</span> to <span className="font-medium text-text-primary">{Math.min(page * limit, vehicles.length)}</span> of <span className="font-medium text-text-primary">{vehicles.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-surface-700/60 text-text-primary hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= vehicles.length}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-surface-700/60 text-text-primary hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {editingVehicle && (
        <ActionModal
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSubmit={handleSubmitAction}
        />
      )}
    </div>
  );
}
