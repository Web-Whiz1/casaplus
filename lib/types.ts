export type PropertyStatus = 'nou' | 'rezervat' | 'vandut' | 'inchiriat' | 'disponibil';
export type PropertyType = 'apartament' | 'casa' | 'teren' | 'penthouse' | 'vila';
export type Currency = 'EUR' | 'RON';

export interface Property {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  price: number;
  currency: Currency;
  type: PropertyType;
  status: PropertyStatus;
  location: string;
  area: number;          // sqm
  rooms: number;
  bathrooms: number;
  floor?: string;
  year_built?: number;
  heating?: string;
  parking?: boolean;
  balcony?: boolean;
  storage?: boolean;
  latitude?: number;
  longitude?: number;
  cover_image: string;
  gallery: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
}
