
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'host';
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: string[];
  images: string[];
  hostId: string;
  host?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  listing?: Listing;
  guest?: User;
  createdAt: string;
}

export interface ListingFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}
