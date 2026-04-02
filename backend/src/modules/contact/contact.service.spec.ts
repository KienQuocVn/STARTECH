import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ContactStatus } from '../../global/globalEnum';
import { GoogleSheetsService } from '../../shared/google-sheet/google-sheet.service';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { MailService } from '../../shared/mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let prismaService: {
    contactSubmission: {
      create: jest.Mock;
    };
  };
  let mailService: jest.Mocked<MailService>;
  let googleSheetsService: jest.Mocked<GoogleSheetsService>;
  let businessEvents: { log: jest.Mock };

  beforeEach(async () => {
    prismaService = {
      contactSubmission: {
        create: jest.fn(),
      },
    };
    businessEvents = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: GoogleSheetsService,
          useValue: {
            appendRow: jest.fn(),
          },
        },
        {
          provide: BusinessEventsService,
          useValue: businessEvents,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    mailService = module.get(MailService);
    googleSheetsService = module.get(GoogleSheetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitForm', () => {
    const createDto = {
      name: 'Nguyen Van A',
      company: 'Cong ty ABC',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      service: 'Web Development',
      message: 'Hello, this is a test message.',
    };

    it('creates a contact, sends notifications, and logs the event', async () => {
      const createdAt = new Date('2026-04-02T00:00:00.000Z');
      prismaService.contactSubmission.create.mockResolvedValue({
        id: 101,
        createdAt,
      });
      mailService.sendMail.mockResolvedValue(undefined);
      googleSheetsService.appendRow.mockResolvedValue(undefined);

      const result = await service.submitForm(createDto);

      expect(result).toEqual({
        success: true,
        message: 'Liên hệ thành công!',
        status: ContactStatus.WAITING,
        data: {
          id: 101,
          createdAt,
        },
      });
      expect(prismaService.contactSubmission.create).toHaveBeenCalled();
      expect(mailService.sendMail).toHaveBeenCalled();
      expect(googleSheetsService.appendRow).toHaveBeenCalled();
      expect(businessEvents.log).toHaveBeenCalledWith(
        expect.objectContaining({
          entity: 'contact_submission',
          action: 'contact.submit',
          entityId: 101,
        }),
      );
    });

    it('still succeeds when sheets or mail side-effects fail', async () => {
      prismaService.contactSubmission.create.mockResolvedValue({
        id: 102,
        createdAt: new Date('2026-04-02T00:00:00.000Z'),
      });
      mailService.sendMail.mockRejectedValue(new Error('Mail service error'));
      googleSheetsService.appendRow.mockRejectedValue(new Error('Google Sheets error'));

      const result = await service.submitForm(createDto);

      expect(result.success).toBe(true);
      expect(result.status).toBe(ContactStatus.WAITING);
    });

    it('throws when database persistence fails', async () => {
      prismaService.contactSubmission.create.mockRejectedValue(new Error('Database error'));

      await expect(service.submitForm(createDto)).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });
});

