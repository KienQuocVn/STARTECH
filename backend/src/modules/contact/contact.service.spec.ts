import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../../shared/mail/mail.service';
import { GoogleSheetsService } from '../../shared/google-sheet/google-sheet.service';

describe('ContactService', () => {
  let service: ContactService;
  let mailService: jest.Mocked<MailService>;
  let googleSheetsService: jest.Mocked<GoogleSheetsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
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
    it('should create a contact and send email and append to Google Sheets', async () => {
      const createDto = {
        name: 'Nguyễn Văn A',
        company: 'Công ty ABC',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        service: 'Web Development',
        message: 'Hello, this is a test message.',
      };

      const mockContact = {
        success: true,
        message: 'Liên hệ thành công!',
        status: 'Chờ đợi',
      };
      mailService.sendMail.mockResolvedValue(undefined);
      googleSheetsService.appendRow.mockResolvedValue(undefined);

      const result = await service.submitForm(createDto);

      expect(result).toEqual(mockContact);
      expect(mailService.sendMail).toHaveBeenCalled();
      expect(googleSheetsService.appendRow).toHaveBeenCalled();
    });

    it('should handle google sheets errors', async () => {
      const createDto = {
        name: 'Nguyễn Văn A',
        company: 'Công ty ABC',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        service: 'Web Development',
        message: 'Hello, this is a test message.',
      };

      googleSheetsService.appendRow.mockRejectedValue(new Error('Google Sheets error'));
      mailService.sendMail.mockResolvedValue(undefined);

      await expect(service.submitForm(createDto)).rejects.toThrow('Có lỗi xảy ra. Vui lòng thử lại sau.');
    });

    it('should handle mail service errors', async () => {
      const createDto = {
        name: 'Nguyễn Văn A',
        company: 'Công ty ABC',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        service: 'Web Development',
        message: 'Hello, this is a test message.',
      };

      mailService.sendMail.mockRejectedValue(new Error('Mail service error'));
      googleSheetsService.appendRow.mockResolvedValue(undefined);

      await expect(service.submitForm(createDto)).rejects.toThrow('Có lỗi xảy ra. Vui lòng thử lại sau.');
    });
  });
});
