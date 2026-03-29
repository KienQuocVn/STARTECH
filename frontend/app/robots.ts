import type { MetadataRoute } from 'next';
import { buildRobotsConfig } from '@/lib/metadata-routes';

export default function robots(): MetadataRoute.Robots {
  return buildRobotsConfig();
}
