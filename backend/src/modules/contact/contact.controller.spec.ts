import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ContactStatus } from '../../global/globalEnum';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

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
            findAll: jest.fn(),
            updateStatus: jest.fn(),
            remove: jest.fn(),
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

  describe('create', () => {
    const createDto = {
      name: 'Nguyen Van A',
      company: 'Cong ty ABC',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      service: 'Web Development',
      message: 'Hello, this is a test message.',
    };

    it('returns success payload when service succeeds', async () => {
      const mockResult = {
        success: true,
        message: 'Lien he thanh cong!',
        status: ContactStatus.WAITING,
        data: {
          id: 1,
          createdAt: new Date('2026-04-02T00:00:00.000Z'),
        },
      };

      service.submitForm.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(service.submitForm).toHaveBeenCalledWith(createDto);
    });

    it('rethrows service errors', async () => {
      const internalError = new InternalServerErrorException({
        success: false,
        message: 'Co loi xay ra. Vui long thu lai sau.',
        details: 'Google sheet error',
      });

      service.submitForm.mockRejectedValue(internalError);

      await expect(controller.create(createDto)).rejects.toThrow('Co loi xay ra. Vui long thu lai sau.');
    });
  });
});
