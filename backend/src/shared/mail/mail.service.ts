import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      this.logger.warn('SMTP is not configured. Email sending will be skipped.');
      return;
    }

    const transportOptions: SMTPTransport.Options = {
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    };

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async sendMail(to: string, subject: string, templateName: string, context: Record<string, any>, from?: string) {
    try {
      if (!this.transporter) {
        this.logger.warn(`Skipping email to ${to} because SMTP is not configured.`);
        return null;
      }

      const sourceTemplatePath = path.join(process.cwd(), 'src', 'shared', 'templates', 'emails', `${templateName}.html`);
      const distTemplatePath = path.join(process.cwd(), 'dist', 'src', 'shared', 'templates', 'emails', `${templateName}.html`);
      const templatePath = fs.existsSync(sourceTemplatePath) ? sourceTemplatePath : distTemplatePath;

      this.logger.log(`Looking for template at: ${templatePath}`);

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
      }

      const source = fs.readFileSync(templatePath, 'utf8');
      const compiled = handlebars.compile(source);
      const html = compiled(context);

      const mailOptions = {
        from: from || `"${process.env.FROM_NAME || 'StarTech'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      };

      this.logger.log(`Sending mail to: ${to}`);
      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Mail sent successfully: ${result.messageId}`);

      return result;
    } catch (error) {
      this.logger.error(`Failed to send mail: ${error.message}`);
      throw error;
    }
  }
}
