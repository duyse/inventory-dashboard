export type VehicleStatus =
  | 'PRICE_REDUCTION_PLANNED'
  | 'SEND_TO_AUCTION'
  | 'IN_REPAIR'
  | null;

export interface Vehicle {
  id: number;
  dealership_id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  received_at: string; // ISO 8601 date string
  current_status: VehicleStatus;
  current_status_note: string | null;
  current_status_updated_at: string | null;
  isAging: boolean; // Computed by the backend (true if age > 90 days)
}

export interface VehicleActionPayload {
  status: string;
  note: string;
}

export interface FilterParams {
  dealershipId: number;
  make: string;
  model: string;
  agingOnly: boolean;
}
