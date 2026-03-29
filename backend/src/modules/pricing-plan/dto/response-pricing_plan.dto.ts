import { Expose } from 'class-transformer';
import { ApiResponse } from '../../../shared/dto/api-response.dto';

export class PricingPlanData {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number | null;

  @Expose()
  price_Type?: 'FIXED' | 'CONTACT';

  @Expose()
  features: { id: number; name: string; description: string }[];
}

export class ResponsePricingPlanDto extends ApiResponse {
  @Expose()
  data: PricingPlanData[] | null;
}
