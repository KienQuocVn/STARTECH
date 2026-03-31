import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { GoogleSheetsService } from '../../shared/google-sheet/google-sheet.service';
import { MailService } from '../../shared/mail/mail.service';
import { ContactStatus } from '../../global/globalEnum';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sheets: GoogleSheetsService,
    private readonly mailer: MailService,
    private readonly businessEvents: BusinessEventsService,
  ) {}

  async submitForm(data: CreateContactDto) {
    try {
      const contact = await this.prisma.contact_submission.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company || null,
          service: data.service || null,
          message: data.message,
          status: 'WAITING',
        },
      });

      await Promise.allSettled([
        this.sheets.appendRow([
          new Date().toISOString(),
          data.name,
          data.email,
          data.phone,
          data.company || '',
          data.service || '',
          data.message,
          ContactStatus.WAITING,
        ]),
        this.mailer.sendMail(data.email, 'Cảm ơn bạn đã liên hệ với StarTech!', 'contact', {
          name: data.name,
          service: data.service || 'Tư vấn tổng quan',
          message: data.message,
        }),
      ]);

      this.logger.log(`Contact form processed successfully: ${data.email}`);
      this.businessEvents.log({
        entity: 'contact_submission',
        action: 'contact.submit',
        entityId: contact.id,
        metadata: {
          email: data.email,
          service: data.service || null,
        },
      });

      return {
        success: true,
        message: 'Liên hệ thành công!',
        status: ContactStatus.WAITING,
        data: {
          id: contact.id,
          createdAt: contact.createdAt,
        },
      };
    } catch (error) {
      this.logger.error('Failed to process contact form', error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  async findAll() {
    const items = await this.prisma.contact_submission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy danh sách lead thành công.',
      data: items,
    };
  }

  async updateStatus(id: number, updateContactStatusDto: UpdateContactStatusDto) {
    const contact = await this.prisma.contact_submission.update({
      where: { id },
      data: { status: updateContactStatusDto.status },
    });

    this.businessEvents.log({
      entity: 'contact_submission',
      action: 'contact.status.update',
      entityId: id,
      metadata: {
        status: updateContactStatusDto.status,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cập nhật trạng thái lead thành công.',
      data: contact,
    };
  }

  async remove(id: number) {
    await this.prisma.contact_submission.delete({
      where: { id },
    });

    this.businessEvents.log({
      entity: 'contact_submission',
      action: 'contact.delete',
      entityId: id,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xóa lead thành công.',
      data: { id },
    };
  }
}
