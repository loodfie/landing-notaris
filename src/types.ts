export interface Platform {
  label: string;
  type: string;
  status: 'available' | 'coming_soon';
  href: string | null;
  cta: string;
  purchaseHref?: string | null;
  requiresSubscription?: boolean;
}

export interface Feature {
  icon: string;
  color: string;
  title: string;
  description: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  label?: string;
  caption?: string;
}

export interface ProductVideo {
  label?: string;
  title: string;
  youtubeId: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  categoryType: string;
  status: 'available' | 'coming_soon';
  featured: boolean;
  mockupImage: string | null;
  mockupFallback: string | null;
  platforms: Platform[];
  features: Feature[];
  images: ProductImage[];
  videos: ProductVideo[];
}

export interface ProductsData {
  products: Product[];
}
