# Role and Context
You are an expert frontend engineer. Your task is to build a React Single Page Application (SPA) for an "Intelligent Inventory Dashboard" - a supply domain tool for dealership managers.
This application must fulfil the following core business requirements:
1. **Inventory Visualization:** Display a filterable list of all vehicles in a dealership's inventory (e.g., filter by make, model, age)
2. **Aging Stock Identification:** Automatically identify and prominently display "aging stock" (vehicles in inventory for >90 days)
3. **Actionable Insights:** Allow a manager to log and persist a status or proposed action for each aging vehicle (e.g., "Price Reduction Planned")
# Tech Stack
* **Framework:** React with TypeScript (bootstrap using Vite).
* **Styling:** Tailwind CSS (for clean, rapid UI development).
* **Data Fetching:** React Query (or standard `fetch` with `useEffect` if keeping it minimal) to interact with the backend API.
* **Routing:** React Router (if navigating between multiple views, though a single dashboard view is the primary focus).
# Backend API Contract
The backend is a RESTful API. You do not need to build the backend, but you must build the API service layer in the frontend to communicate with these endpoints. Assume the base URL is `http://localhost:3000/api`.
**1. GET `/v1/vehicles`**
* **Query Params:** `dealershipId` (required), `make` (optional), `model` (optional), `agingOnly` (boolean, optional).
* **Response:** An array of vehicle objects.
* **Vehicle Interface:**
    ```typescript
    interface Vehicle {
      id: number;
      dealership_id: number;
      vin: string;
      make: string;
      model: string;
      year: number;
      trim: string;
      price: number;
      received_at: string; // ISO 8601 date string
      current_status: 'PRICE_REDUCTION_PLANNED' | 'SEND_TO_AUCTION' | 'IN_REPAIR' | null;
      current_status_note: string | null;
      current_status_updated_at: string | null;
      isAging: boolean; // Computed by the backend (true if age > 90 days)
    }
    ```
**2. PATCH `/v1/vehicles/:id/action`**
* **Payload:** `{ status: string, note: string }`
* **Response:** The updated vehicle object.
# UI/UX Requirements
1.  **Dashboard Layout:** A clean, full-width data table or data grid layout.
2.  **Filter Bar:** Placed above the table. Include inputs for:
    * Dealership ID (Default to `42` for testing).
    * Make (Dropdown or text input).
    * Model (Text input).
    * A toggle/checkbox for "Show Aging Stock Only".
3.  **Inventory Table:**
    * Columns: VIN, Make, Model, Year, Price, Days in Inventory (calculated from `received_at` vs today), Current Status.
    * **Visual Flagging:** Rows where `isAging === true` must be visually distinct (e.g., a subtle red or amber background/border to draw the manager's attention).
4.  **Action Form (Modal or Inline):**
    * When a user clicks on an aging vehicle's status cell or an "Edit Action" button, open a form.
    * The form should have a dropdown for `status` (e.g., Price Reduction Planned, Send to Auction, Needs Inspection) and a text area for a `note`.
    * Submitting the form should call the `PATCH` endpoint, update the UI optimistically or trigger a refetch, and close the form.
# Instructions for Execution
1.  Generate the initial project structure and component tree.
2.  Provide the complete TypeScript code for:
    * The API client/service layer (`api.ts`).
    * The main Dashboard component (`Dashboard.tsx`).
    * The Table component (`VehicleTable.tsx`).
    * The Filter component (`FilterBar.tsx`).
    * The Action Modal component (`ActionModal.tsx`).
3.  Include a mocked `db.json` or a mock service worker (MSW) setup so the frontend can be run and tested entirely locally without the actual Node.js backend.
4.  Ensure all components are strictly typed and handle loading/error states gracefully.