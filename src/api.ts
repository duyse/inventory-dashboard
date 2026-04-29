import type { Vehicle, VehicleActionPayload } from './types';

const BASE_URL = 'http://localhost:3000/api';

export async function fetchVehicles(params: {
  dealershipId: number;
  make?: string;
  model?: string;
  agingOnly?: boolean;
}): Promise<Vehicle[]> {
  const url = new URL(`${BASE_URL}/v1/vehicles`);
  url.searchParams.set('dealershipId', String(params.dealershipId));
  if (params.make) url.searchParams.set('make', params.make);
  if (params.model) url.searchParams.set('model', params.model);
  if (params.agingOnly !== undefined)
    url.searchParams.set('agingOnly', String(params.agingOnly));

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch vehicles: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function updateVehicleAction(
  vehicleId: number,
  payload: VehicleActionPayload
): Promise<Vehicle> {
  const res = await fetch(`${BASE_URL}/v1/vehicles/${vehicleId}/action`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to update vehicle action: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
