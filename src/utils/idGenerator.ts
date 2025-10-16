// Universal ID Generator for Government Services
// Format: {TYPE}-{STATE}-{DISTRICTCODE}-{YYYY}-{SEQ}-{CHK}

export type IDType = 'GRV' | 'DSP' | 'TDL' | 'CMR' | 'EDU' | 'CSR' | 'APP' | 'RSC' | 'RQT';

export interface IDComponents {
  type: IDType;
  state: string;
  district: string;
  year: number;
  sequence: number;
  checksum: string;
}

// District codes mapping
export const DISTRICT_CODES: Record<string, string> = {
  'SPSR Nellore': 'NLR',
  'Guntur': 'GTR',
  'Vijayawada': 'VJW',
  'Visakhapatnam': 'VSP',
  'Krishna': 'KRS',
  'West Godavari': 'WGD',
  'East Godavari': 'EGD',
  'Chittoor': 'CTR',
  'Kadapa': 'KDP',
  'Anantapur': 'ATP',
  'Kurnool': 'KNL',
  'Prakasam': 'PKM',
  'Srikakulam': 'SKL',
  'Vizianagaram': 'VZM'
};

// Luhn-mod36 checksum algorithm
function calculateChecksum(input: string): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let sum = 0;
  let alternate = false;
  
  // Process from right to left
  for (let i = input.length - 1; i >= 0; i--) {
    let n = chars.indexOf(input[i].toUpperCase());
    if (n === -1) continue; // Skip invalid characters
    
    if (alternate) {
      n *= 2;
      if (n >= 36) n = Math.floor(n / 36) + (n % 36);
    }
    
    sum += n;
    alternate = !alternate;
  }
  
  const checksum = (36 - (sum % 36)) % 36;
  return chars[Math.floor(checksum / 36)] + chars[checksum % 36];
}

// Generate next sequence number (mock implementation - in real system would query database)
let sequenceCounters: Record<string, number> = {};

function getNextSequence(type: IDType, district: string, year: number): number {
  const key = `${type}-${district}-${year}`;
  if (!sequenceCounters[key]) {
    sequenceCounters[key] = 0;
  }
  return ++sequenceCounters[key];
}

// Main ID generation function
export function generateID(
  type: IDType, 
  districtName: string, 
  year?: number
): string {
  const currentYear = year || new Date().getFullYear();
  const districtCode = DISTRICT_CODES[districtName] || 'UNK';
  const sequence = getNextSequence(type, districtCode, currentYear);
  
  const sequenceStr = sequence.toString().padStart(6, '0');
  const baseString = `${type}-AP-${districtCode}-${currentYear}-${sequenceStr}`;
  const checksum = calculateChecksum(baseString.replace(/-/g, ''));
  
  return `${baseString}-${checksum}`;
}

// Parse ID back to components
export function parseID(id: string): IDComponents | null {
  const pattern = /^([A-Z]{3})-([A-Z]{2})-([A-Z]{3})-(\d{4})-(\d{6})-([A-Z0-9]{2})$/;
  const match = id.match(pattern);
  
  if (!match) return null;
  
  return {
    type: match[1] as IDType,
    state: match[2],
    district: match[3],
    year: parseInt(match[4]),
    sequence: parseInt(match[5]),
    checksum: match[6]
  };
}

// Validate ID checksum
export function validateID(id: string): boolean {
  const components = parseID(id);
  if (!components) return false;
  
  const baseString = `${components.type}-${components.state}-${components.district}-${components.year}-${components.sequence.toString().padStart(6, '0')}`;
  const expectedChecksum = calculateChecksum(baseString.replace(/-/g, ''));
  
  return expectedChecksum === components.checksum;
}

// Generate short URL token from ID
export function generateShortURL(id: string): string {
  // Simple base36 encoding of hash for demo - in production would use proper URL shortening
  const hash = id.split('-').join('').slice(-8);
  return `https://gov.ap.in/t/${hash}`;
}