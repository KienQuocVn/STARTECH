import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MailModule } from '../../shared/mail/mail.module';
import { GoogleSheetsModule } from '../../shared/google-sheet/google-sheet.module';

@Module({
  imports: [MailModule, GoogleSheetsModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
