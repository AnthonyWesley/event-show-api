import { IMailerService } from "./IMailerService";
import { Resend } from "resend";

export class ResendAdapter implements IMailerService {
  constructor(private readonly resend: Resend) {}

  static create(resend: Resend) {
    return new ResendAdapter(resend);
  }
  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      throw new Error("Falha ao enviar email");
    }
  }
}
