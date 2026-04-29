const fs = require('fs');

const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Kia'];
const statuses = ['PRICE_REDUCTION_PLANNED', 'SEND_TO_AUCTION', 'IN_REPAIR', null, null, null];

const data = [];
for (let i = 1; i <= 55; i++) {
  const days = Math.floor(Math.random() * 200) + 1;
  const isAging = days > 90;
  const status = isAging ? statuses[Math.floor(Math.random() * statuses.length)] : null;
  const make = makes[Math.floor(Math.random() * makes.length)];
  
  data.push({
    id: i,
    dealership_id: 42,
    vin: `1HGCM82633A0043${i.toString().padStart(2, '0')}`,
    make: make,
    model: `Model-${i}`,
    year: 2020 + Math.floor(Math.random() * 5),
    trim: 'Base',
    price: 20000 + Math.floor(Math.random() * 30000),
    received_at: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
    current_status: status,
    current_status_note: status ? 'Note for status' : null,
    current_status_updated_at: status ? new Date().toISOString() : null,
    isAging: isAging,
  });
}

const content = `import type { Vehicle } from '../types';\n\nexport const mockVehicles: Vehicle[] = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync('src/mocks/data.ts', content);
