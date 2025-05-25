import { Client } from "whatsapp-web.js";
import { IWhatsAppService } from "./IWhatsAppService";

export class WhatsappWebAdapter implements IWhatsAppService {
  constructor(private readonly client: Client) {}

  static create(client: Client) {
    return new WhatsappWebAdapter(client);
  }

  async sendMessage(to: string, message: string): Promise<void> {
    let onlyNumbers = to.replace(/\D/g, "");

    // Garante que começa com 55 (Brasil)
    if (!onlyNumbers.startsWith("55")) {
      onlyNumbers = "55" + onlyNumbers;
    }

    // Remover o '9' logo após o DDD (exemplo: 55 49 9 2101557 -> 55 49 2101557)
    // Considerando que DDD são os dígitos 3 e 4, o '9' será o dígito 5
    if (onlyNumbers.length === 13 && onlyNumbers.charAt(4) === "9") {
      // Remove o 9 no índice 4
      onlyNumbers = onlyNumbers.slice(0, 4) + onlyNumbers.slice(5);
    }

    const jid = onlyNumbers.includes("@c.us")
      ? onlyNumbers
      : `${onlyNumbers}@c.us`;

    try {
      await this.client.sendMessage(jid, message);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      throw new Error("Falha ao enviar mensagem");
    }
  }
}
