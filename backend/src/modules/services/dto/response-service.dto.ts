import { ApiResponse } from '../../../shared/dto/api-response.dto';

export class ServiceData {
  id: number;
  name: string;
}

export class ResponseServiceDto extends ApiResponse {
  data: ServiceData[] | null;
}
