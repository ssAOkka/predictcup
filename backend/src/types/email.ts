export interface EmailService {
  sendPasswordReset(email: string, resetToken: string): Promise<void>;
  sendWelcome(email: string, username: string): Promise<void>;
  sendPredictionReminder(email: string, matchInfo: any): Promise<void>;
}
