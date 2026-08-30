export type RideType = 'private' | 'shared';

export type RideStatus =
  | 'idle'
  | 'searching'
  | 'matched'
  | 'arriving'
  | 'in_progress'
  | 'completed';

export interface Location {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  vehicle: string;
  plate: string;
  color: string;
  eta: number;
}

export const MAFRAQ_LOCATIONS: Location[] = [
  { id: 'mf-center', name: 'وسط المفرق', area: 'المفرق', lat: 32.3426, lng: 36.2020 },
  { id: 'mf-uni', name: 'جامعة آل البيت', area: 'المفرق', lat: 32.3533, lng: 36.1886 },
  { id: 'mf-industrial', name: 'المنطقة الصناعية', area: 'المفرق', lat: 32.3280, lng: 36.2150 },
  { id: 'mf-bus', name: 'محطة باص المفرق', area: 'المفرق', lat: 32.3380, lng: 36.1980 },
];

export const AMMAN_LOCATIONS: Location[] = [
  { id: 'am-dakhleyeh', name: 'دوار الداخلية', area: 'عمان', lat: 31.9539, lng: 35.9106 },
  { id: 'am-abdoun', name: 'عبدون', area: 'عمان', lat: 31.9360, lng: 35.8740 },
  { id: 'am-jubeiha', name: 'الجبيهة', area: 'عمان', lat: 32.0180, lng: 35.8720 },
  { id: 'am-marka', name: 'ماركا', area: 'عمان', lat: 31.9900, lng: 35.9900 },
  { id: 'am-7th', name: 'الدوار السابع', area: 'عمان', lat: 31.9690, lng: 35.8990 },
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'd1',
    name: 'أحمد الخطيب',
    rating: 4.9,
    trips: 1240,
    vehicle: 'تويوتا كورولا',
    plate: '12-45678',
    color: 'أبيض',
    eta: 4,
  },
  {
    id: 'd2',
    name: 'محمد العواملة',
    rating: 4.8,
    trips: 890,
    vehicle: 'هيونداي إلنترا',
    plate: '15-32109',
    color: 'فضي',
    eta: 6,
  },
  {
    id: 'd3',
    name: 'خالد الشمالي',
    rating: 4.7,
    trips: 2100,
    vehicle: 'كيا سيراتو',
    plate: '18-76543',
    color: 'أسود',
    eta: 3,
  },
];

const DISTANCE_KM = 78;
const BASE_FARE = 2;
const PER_KM = 0.08;
const PER_MIN = 0.02;
const DURATION_MIN = 55;

export function calculateFare(rideType: RideType): number {
  const base = BASE_FARE + DISTANCE_KM * PER_KM + DURATION_MIN * PER_MIN;
  return rideType === 'shared' ? Math.round(base * 0.38 * 10) / 10 : Math.round(base * 10) / 10;
}

export function getDuration(): number {
  return DURATION_MIN;
}

export function getDistance(): number {
  return DISTANCE_KM;
}
