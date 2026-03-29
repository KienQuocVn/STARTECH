import { SetMetadata } from '@nestjs/common';
import type { AdminPermission } from './permissions';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: AdminPermission[]) => SetMetadata(PERMISSIONS_KEY, permissions);
