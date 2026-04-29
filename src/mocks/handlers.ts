import { http, HttpResponse, delay } from 'msw';
import { mockVehicles } from './data';
import type { Vehicle } from '../types';

// In-memory store so PATCH mutations persist during the session
const vehicles: Vehicle[] = [...mockVehicles];

export const handlers = [
  // GET /api/v1/vehicles
  http.get('http://localhost:3000/api/v1/vehicles', async ({ request }) => {
    await delay(400); // simulate network latency

    const url = new URL(request.url);
    const dealershipId = url.searchParams.get('dealershipId');
    const make = url.searchParams.get('make');
    const model = url.searchParams.get('model');
    const agingOnly = url.searchParams.get('agingOnly');

    if (!dealershipId) {
      return HttpResponse.json(
        { error: 'dealershipId is required' },
        { status: 400 }
      );
    }

    let result = vehicles.filter(
      (v) => v.dealership_id === Number(dealershipId)
    );

    if (make) {
      result = result.filter(
        (v) => v.make.toLowerCase() === make.toLowerCase()
      );
    }

    if (model) {
      result = result.filter((v) =>
        v.model.toLowerCase().includes(model.toLowerCase())
      );
    }

    if (agingOnly === 'true') {
      result = result.filter((v) => v.isAging);
    }

    return HttpResponse.json(result);
  }),

  // PATCH /api/v1/vehicles/:id/action
  http.patch<{ id: string }>(
    'http://localhost:3000/api/v1/vehicles/:id/action',
    async ({ params, request }) => {
      await delay(300);

      const vehicleId = Number(params.id);
      const body = (await request.json()) as { status: string; note: string };

      const index = vehicles.findIndex((v) => v.id === vehicleId);
      if (index === -1) {
        return HttpResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        );
      }

      vehicles[index] = {
        ...vehicles[index],
        current_status: body.status as Vehicle['current_status'],
        current_status_note: body.note,
        current_status_updated_at: new Date().toISOString(),
      };

      return HttpResponse.json(vehicles[index]);
    }
  ),
];
