export interface Accommodation {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  price_per_night: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  max_guests: number;
  google_maps_link: string;
  whatsapp_number: string;
  created_at?: string;
}

export interface AccommodationImage {
  id: string;
  accommodation_id: string;
  image_url: string;
  created_at?: string;
}

export interface Amenity {
  id: string;
  accommodation_id: string;
  amenity_name: string;
}

export interface Host {
  id: string;
  name: string;
  photo_url: string;
  bio: string;
  created_at?: string;
}

export interface Settings {
  id: string;
  company_name: string;
  whatsapp_number: string;
  email: string;
  about_text: string;
}
