import { Module } from '@nestjs/common';
import { GoogleSheetsService } from './google-sheet.service';

@Module({
  providers: [GoogleSheetsService],
  exports: [GoogleSheetsService],
})
export class GoogleSheetsModule {}
