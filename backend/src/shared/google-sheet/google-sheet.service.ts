import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

@Injectable()
export class GoogleSheetsService implements OnModuleInit {
  private readonly logger = new Logger(GoogleSheetsService.name);
  private sheets: ReturnType<typeof google.sheets> | null = null;
  private readonly spreadsheetId = process.env.GOOGLE_SHEET_ID;
  private readonly enabled: boolean;

  // ==================== CẤU HÌNH TÊN SHEET ====================
  private readonly SHEET_NAME = 'Thong tin lien he';           // Tên sheet thật
  private readonly HEADER_RANGE = `'${this.SHEET_NAME}'!A1:H1`;   // Đúng format
  private readonly DATA_RANGE = `'${this.SHEET_NAME}'!A:H`;       // Đúng format

  constructor() {
    const base64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
    this.enabled = Boolean(base64 && this.spreadsheetId);

    if (!this.enabled || !base64) {
      this.logger.warn('Google Sheets is not configured. Sheet sync will be skipped.');
      return;
    }

    try {
      const decoded = Buffer.from(base64, 'base64').toString('utf8');
      const credentials = JSON.parse(decoded);

      const auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
    } catch (error) {
      this.logger.error('Failed to initialize Google Sheets auth', error);
    }
  }

  async onModuleInit() {
    if (!this.enabled || !this.sheets || !this.spreadsheetId) return;

    try {
      await this.ensureSheetSetup();
      this.logger.log('Google Sheets auto-setup completed successfully');
    } catch (error) {
      this.logger.warn(`Google Sheets auto-setup failed: ${error.message}`);
    }
  }

  async appendRow(values: string[]) {
    if (!this.enabled || !this.sheets || !this.spreadsheetId) {
      this.logger.warn('Skipping Google Sheets append because configuration is missing.');
      return;
    }

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: this.DATA_RANGE,                    // ← Sửa ở đây
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [values] },
      });

      this.logger.log('Row appended to Google Sheets successfully');
    } catch (err) {
      this.logger.error('Failed to append row to Google Sheets', err);
      throw err;
    }
  }

  async createHeaders() {
    if (!this.enabled || !this.sheets || !this.spreadsheetId) return;

    const headers = ['Thoi gian', 'Ten', 'Email', 'Dien thoai', 'Cong ty', 'Dich vu', 'Noi dung', 'Trang thai'];

    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: this.HEADER_RANGE,                  // ← Sửa ở đây
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers] },
      });

      this.logger.log('Google Sheets headers created successfully');
    } catch (err) {
      this.logger.error('Failed to create Google Sheets headers', err);
      throw err;
    }
  }

  private async ensureSheetSetup() {
    if (!this.sheets || !this.spreadsheetId) return;

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: this.HEADER_RANGE,                  // ← Sửa ở đây
      });

      if (!response.data.values || response.data.values.length === 0) {
        await this.createHeaders();
        await this.setupStatusDropdown();
      }
    } catch {
      // Sheet chưa có header hoặc chưa tồn tại
      await this.createHeaders();
      await this.setupStatusDropdown();
    }
  }

  private async setupStatusDropdown() {
    if (!this.sheets || !this.spreadsheetId) return;

    try {
      const requests = [
        {
          setDataValidation: {
            range: {
              sheetId: 0,                    // Thường là sheet đầu tiên
              startRowIndex: 1,
              endRowIndex: 1000,
              startColumnIndex: 7,           // Cột H (Trang thai)
              endColumnIndex: 8,
            },
            rule: {
              condition: {
                type: 'ONE_OF_LIST',
                values: [
                  { userEnteredValue: 'Cho doi' },
                  { userEnteredValue: 'Da xem' },
                  { userEnteredValue: 'Da xu ly' },
                ],
              },
              inputMessage: 'Chon trang thai phu hop',
              strict: true,
              showCustomUi: true,
            },
          },
        },
      ];

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: { requests },
      });

      this.logger.log('Google Sheets status dropdown setup successfully');
    } catch (err) {
      this.logger.error('Failed to setup Google Sheets status dropdown', err);
      // Không throw ở đây để tránh làm crash app
    }
  }
}