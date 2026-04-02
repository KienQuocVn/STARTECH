import { Injectable } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

type SiteSettingsValue = string | number | boolean | Record<string, unknown> | null;

function detectType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'json';
  const valueType = typeof value;
  if (valueType === 'object') return 'json';
  if (valueType === 'number') return 'number';
  if (valueType === 'boolean') return 'boolean';
  return 'string';
}

function serializeValue(value: unknown) {
  if (typeof value === 'string') return value;
  if (value === null) return 'null';
  return JSON.stringify(value);
}

function parseValue(raw: string, type: string): SiteSettingsValue {
  if (type === 'number') return Number(raw);
  if (type === 'boolean') return raw === 'true';
  if (type === 'null') return null;
  if (type === 'json') {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  return raw;
}

@Injectable()
export class SiteSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessEvents: BusinessEventsService,
  ) {}

  async findAll() {
    const items = await this.prisma.siteSetting.findMany({
      where: { deletedAt: null },
      orderBy: { settingKey: 'asc' },
    });

    const settings = items.reduce<Record<string, SiteSettingsValue>>((acc, item) => {
      acc[item.settingKey] = parseValue(item.settingVal, item.type);
      return acc;
    }, {});

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lay site settings thanh cong.',
      data: settings,
    };
  }

  async findPublic() {
    const items = await this.prisma.siteSetting.findMany({
      where: {
        deletedAt: null,
        settingKey: {
          startsWith: 'public_',
        },
      },
      orderBy: { settingKey: 'asc' },
    });

    const settings = items.reduce<Record<string, SiteSettingsValue>>((acc, item) => {
      acc[item.settingKey] = parseValue(item.settingVal, item.type);
      return acc;
    }, {});

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lay public site settings thanh cong.',
      data: settings,
    };
  }

  async update(dto: UpdateSiteSettingsDto, actor?: JwtPayload | null) {
    const entries = Object.entries(dto.settings ?? {});

    await this.prisma.$transaction(
      entries.map(([settingKey, value]) =>
        this.prisma.siteSetting.upsert({
          where: { settingKey },
          update: {
            settingVal: serializeValue(value),
            type: detectType(value),
          },
          create: {
            settingKey,
            settingVal: serializeValue(value),
            type: detectType(value),
          },
        }),
      ),
    );

    this.businessEvents.log({
      entity: 'site_setting',
      action: 'settings.bulk.update',
      actor,
      metadata: {
        keys: entries.map(([settingKey]) => settingKey),
      },
    });

    return this.findAll();
  }
}
