import { EmailService } from '@/types/email';
import { NodemailerProvider } from './nodemailer.provider';

export class EmailServiceFactory {
  static create(provider?: string): EmailService {
    return new NodemailerProvider();
  }
}
