export class ProductResponse {
  id: number;
  slug: string | null;
  name: string;
  price: string;
  rating: number | null;
  like: number | null;
  completion_time: string | null;
  description: string | null;
  image_url: string | null;
  demo_url: string | null;
  product_category?: { category: { id: number; name: string } }[];
  product_service?: { id: number; service: { id: number; name: string } }[];
  images?: { id: number; url: string }[];
}

export class ProductDetail extends ProductResponse {
  declare images: { id: number; url: string }[];
  declare product_service: { id: number; service: { id: number; name: string } }[];
}

export interface ProductDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ProductDetail | null;
}
