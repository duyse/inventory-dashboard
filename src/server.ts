import express, { type Request, type Response } from 'express';
import { mockVehicles } from './mocks/data';
import type { Vehicle } from './types';

export function createServer() {
  const app = express();
  app.use(express.json());

  const vehicles: Vehicle[] = mockVehicles.map((v) => ({ ...v }));

  app.get('/api/v1/vehicles', (req: Request, res: Response) => {
    const { dealershipId, make, model, agingOnly } = req.query as Record<
      string,
      string | undefined
    >;

    if (!dealershipId) {
      return res.status(400).json({ error: 'dealershipId is required' });
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

    return res.json(result);
  });

  app.patch('/api/v1/vehicles/:id/action', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status, note } = req.body ?? {};

    const idx = vehicles.findIndex((v) => v.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    vehicles[idx] = {
      ...vehicles[idx],
      current_status: status as Vehicle['current_status'],
      current_status_note: note ?? null,
      current_status_updated_at: new Date().toISOString(),
    };

    return res.json(vehicles[idx]);
  });

  return app;
}
