import { EmailService } from '@/types/email';

export class NodemailerProvider implements EmailService {
  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    console.log(`Password reset email would be sent to ${email}`);
  }

  async sendWelcome(email: string, username: string): Promise<void> {
    console.log(`Welcome email would be sent to ${email}`);
  }

  async sendPredictionReminder(email: string, matchInfo: any): Promise<void> {
    console.log(`Prediction reminder would be sent to ${email}`);
  }
}
