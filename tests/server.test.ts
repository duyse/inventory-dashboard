import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { createServer } from '../src/server';
import { mockVehicles } from '../src/mocks/data';

describe('GET /api/v1/vehicles', () => {
  const app = createServer();

  it('400 when dealershipId is missing', async () => {
    const res = await request(app).get('/api/v1/vehicles');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'dealershipId is required' });
  });

  it('returns all vehicles for the dealership', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles')
      .query({ dealershipId: 42 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(mockVehicles.length);
  });

  it('returns empty array for unknown dealership', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles')
      .query({ dealershipId: 999 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('filters by make case-insensitively', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles')
      .query({ dealershipId: 42, make: 'toyota' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const v of res.body) {
      expect(v.make.toLowerCase()).toBe('toyota');
    }
  });

  it('filters by model substring case-insensitively', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles')
      .query({ dealershipId: 42, model: 'model-1' });
    expect(res.status).toBe(200);
    for (const v of res.body) {
      expect(v.model.toLowerCase()).toContain('model-1');
    }
    // Should match Model-1, Model-10..Model-19
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('agingOnly=true returns only aging vehicles', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles')
      .query({ dealershipId: 42, agingOnly: 'true' });
    expect(res.status).toBe(200);
    for (const v of res.body) {
      expect(v.isAging).toBe(true);
    }
  });

  it('agingOnly=false returns all vehicles (string-compared to "true")', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles')
      .query({ dealershipId: 42, agingOnly: 'false' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(mockVehicles.length);
  });

  it('combines make + agingOnly filters', async () => {
    const res = await request(app).get('/api/v1/vehicles').query({
      dealershipId: 42,
      make: 'Ford',
      agingOnly: 'true',
    });
    expect(res.status).toBe(200);
    for (const v of res.body) {
      expect(v.make).toBe('Ford');
      expect(v.isAging).toBe(true);
    }
  });
});

describe('PATCH /api/v1/vehicles/:id/action', () => {
  it('updates an existing vehicle and returns it', async () => {
    const app = createServer();
    const res = await request(app)
      .patch('/api/v1/vehicles/1/action')
      .send({ status: 'IN_REPAIR', note: 'engine check' });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.current_status).toBe('IN_REPAIR');
    expect(res.body.current_status_note).toBe('engine check');
    expect(typeof res.body.current_status_updated_at).toBe('string');
    expect(() => new Date(res.body.current_status_updated_at)).not.toThrow();
  });

  it('persists mutation across subsequent GETs on the same server instance', async () => {
    const app = createServer();
    await request(app)
      .patch('/api/v1/vehicles/3/action')
      .send({ status: 'SEND_TO_AUCTION', note: 'old' });

    const res = await request(app)
      .get('/api/v1/vehicles')
      .query({ dealershipId: 42 });

    const v3 = res.body.find((v: { id: number }) => v.id === 3);
    expect(v3.current_status).toBe('SEND_TO_AUCTION');
    expect(v3.current_status_note).toBe('old');
  });

  it('isolates state between server instances', async () => {
    const a = createServer();
    await request(a)
      .patch('/api/v1/vehicles/5/action')
      .send({ status: 'IN_REPAIR', note: 'a' });

    const b = createServer();
    const res = await request(b)
      .get('/api/v1/vehicles')
      .query({ dealershipId: 42 });
    const v5 = res.body.find((v: { id: number }) => v.id === 5);
    expect(v5.current_status).toBeNull();
  });

  it('404 when vehicle does not exist', async () => {
    const app = createServer();
    const res = await request(app)
      .patch('/api/v1/vehicles/99999/action')
      .send({ status: 'IN_REPAIR', note: '' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Vehicle not found' });
  });

  it('accepts each valid status value', async () => {
    const app = createServer();
    for (const status of [
      'PRICE_REDUCTION_PLANNED',
      'SEND_TO_AUCTION',
      'IN_REPAIR',
    ]) {
      const res = await request(app)
        .patch('/api/v1/vehicles/2/action')
        .send({ status, note: 'n' });
      expect(res.status).toBe(200);
      expect(res.body.current_status).toBe(status);
    }
  });
});
