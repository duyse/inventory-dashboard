import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { fetchVehicles, updateVehicleAction } from '../src/api';
import type { Vehicle } from '../src/types';

const sampleVehicle: Vehicle = {
  id: 1,
  dealership_id: 42,
  vin: 'V1',
  make: 'Toyota',
  model: 'Model-1',
  year: 2024,
  trim: 'Base',
  price: 30000,
  received_at: '2026-01-01T00:00:00.000Z',
  current_status: null,
  current_status_note: null,
  current_status_updated_at: null,
  isAging: false,
};

describe('fetchVehicles', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn() as unknown as jest.Mock;
    (global as any).fetch = fetchMock;
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  function mockOk(data: unknown) {
    (fetchMock as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => data,
    });
  }
  function mockErr(status: number, statusText = 'Error') {
    (fetchMock as any).mockResolvedValueOnce({
      ok: false,
      status,
      statusText,
      json: async () => ({ error: 'fail' }),
    });
  }

  it('builds URL with only dealershipId by default', async () => {
    mockOk([sampleVehicle]);
    await fetchVehicles({ dealershipId: 42 });
    const calledWith = fetchMock.mock.calls[0][0] as string;
    const url = new URL(calledWith);
    expect(url.pathname).toBe('/api/v1/vehicles');
    expect(url.searchParams.get('dealershipId')).toBe('42');
    expect(url.searchParams.has('make')).toBe(false);
    expect(url.searchParams.has('model')).toBe(false);
    expect(url.searchParams.has('agingOnly')).toBe(false);
  });

  it('includes make, model and agingOnly when provided', async () => {
    mockOk([]);
    await fetchVehicles({
      dealershipId: 42,
      make: 'Toyota',
      model: 'Model-2',
      agingOnly: true,
    });
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.searchParams.get('make')).toBe('Toyota');
    expect(url.searchParams.get('model')).toBe('Model-2');
    expect(url.searchParams.get('agingOnly')).toBe('true');
  });

  it('serializes agingOnly=false (since it is defined)', async () => {
    mockOk([]);
    await fetchVehicles({ dealershipId: 1, agingOnly: false });
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.searchParams.get('agingOnly')).toBe('false');
  });

  it('omits empty make/model strings', async () => {
    mockOk([]);
    await fetchVehicles({ dealershipId: 1, make: '', model: '' });
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.searchParams.has('make')).toBe(false);
    expect(url.searchParams.has('model')).toBe(false);
  });

  it('returns parsed JSON on success', async () => {
    mockOk([sampleVehicle]);
    const out = await fetchVehicles({ dealershipId: 42 });
    expect(out).toEqual([sampleVehicle]);
  });

  it('throws when response is not ok', async () => {
    mockErr(500, 'Server Error');
    await expect(fetchVehicles({ dealershipId: 42 })).rejects.toThrow(
      /Failed to fetch vehicles: 500 Server Error/
    );
  });
});

describe('updateVehicleAction', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn() as unknown as jest.Mock;
    (global as any).fetch = fetchMock;
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('PATCHes the action endpoint with JSON body', async () => {
    (fetchMock as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => sampleVehicle,
    });

    const result = await updateVehicleAction(1, {
      status: 'IN_REPAIR',
      note: 'hi',
    });

    expect(result).toEqual(sampleVehicle);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:3000/api/v1/vehicles/1/action');
    expect(init.method).toBe('PATCH');
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body as string)).toEqual({ status: 'IN_REPAIR', note: 'hi' });
  });

  it('throws when response is not ok', async () => {
    (fetchMock as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({}),
    });
    await expect(
      updateVehicleAction(999, { status: 'IN_REPAIR', note: '' })
    ).rejects.toThrow(/Failed to update vehicle action: 404 Not Found/);
  });
});
