import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactStatus } from '../../global/globalEnum';
import { InternalServerErrorException } from '@nestjs/common';

describe('ContactController', () => {
  let controller: ContactController;
  let service: jest.Mocked<ContactService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
          useValue: {
            submitForm: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    service = module.get(ContactService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('submitForm', () => {
    const createDto = {
      name: 'Nguyễn Văn A',
      company: 'Công ty ABC',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      service: 'Web Development',
      message: 'Hello, this is a test message.',
    };

    it('should return success when service succeeds', async () => {
      const mockResult = {
        success: true,
        message: 'Liên hệ thành công!',
        status: ContactStatus.WAITING,
      };

      service.submitForm.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(service.submitForm).toHaveBeenCalledWith(createDto);
    });

    it('should return failure when service fails', async () => {
      const internalError = new InternalServerErrorException({
        success: false,
        message: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
        details: 'Google sheet error',
      });

      (service.submitForm as jest.Mock).mockRejectedValue(internalError);

      await expect(controller.create(createDto)).rejects.toThrow('Có lỗi xảy ra. Vui lòng thử lại sau.');
    });
  });
});
