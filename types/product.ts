export interface Product {
  id: number;
  seller_id: number;
  title: string;
  description: string;
  price_cents: number;
  category: string | null;
  image_urls: string;
  stock: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}