import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AdminRole, JwtPayload } from './interfaces/jwt-payload.interface';

const ADMIN_ROLES: Record<AdminRole, { label: string; description: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    description: 'Toan quyen quan tri he thong, noi dung va cau hinh.',
  },
  EDITOR: {
    label: 'Editor',
    description: 'Cap nhat du an, noi dung trang va xu ly lead.',
  },
  VIEWER: {
    label: 'Viewer',
    description: 'Chi xem dashboard, lead va bao cao.',
  },
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private getRefreshTtlMs() {
    return 1000 * 60 * 60 * 24 * 14;
  }

  private async issueTokens(user: { id: number; email: string; role: AdminRole }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      {
        expiresIn: '14d',
      },
    );

    await (this.prisma as any).refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: new Date(Date.now() + this.getRefreshTtlMs()),
      },
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer' as const,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await (this.prisma as any).user.findUnique({
      where: {
        email: loginDto.email.toLowerCase().trim(),
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Tai khoan quan tri khong ton tai hoac da bi khoa.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoac mat khau khong dung.');
    }

    await (this.prisma as any).user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.issueTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Dang nhap thanh cong.',
      data: {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          lastLoginAt: new Date().toISOString(),
        },
      },
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
      secret: process.env.JWT_SECRET || 'startech-dev-secret',
    });

    const storedTokens = await (this.prisma as any).refreshToken.findMany({
      where: {
        userId: payload.sub,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const matchedToken = await Promise.any(
      storedTokens.map(async (storedToken: { id: number; tokenHash: string }) => {
        const isMatch = await bcrypt.compare(refreshTokenDto.refreshToken, storedToken.tokenHash);
        if (!isMatch) {
          throw new Error('No match');
        }

        return storedToken;
      }),
    ).catch(() => null);

    if (!matchedToken) {
      throw new UnauthorizedException('Refresh token khong hop le.');
    }

    await (this.prisma as any).refreshToken.update({
      where: { id: matchedToken.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.issueTokens({
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lam moi phien dang nhap thanh cong.',
      data: tokens,
    };
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    const storedTokens = await (this.prisma as any).refreshToken.findMany({
      where: {
        revokedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    for (const storedToken of storedTokens) {
      const isMatch = await bcrypt.compare(refreshTokenDto.refreshToken, storedToken.tokenHash);
      if (isMatch) {
        await (this.prisma as any).refreshToken.update({
          where: { id: storedToken.id },
          data: { revokedAt: new Date() },
        });
        break;
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Dang xuat thanh cong.',
      data: null,
    };
  }

  async getProfile(userId: number) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Phien dang nhap khong hop le.');
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lay thong tin nguoi dung thanh cong.',
      data: user,
    };
  }

  getAdminSummary() {
    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lay cau hinh vai tro quan tri thanh cong.',
      data: {
        roles: Object.entries(ADMIN_ROLES).map(([value, config]) => ({
          value,
          label: config.label,
          description: config.description,
        })),
      },
    };
  }
}
