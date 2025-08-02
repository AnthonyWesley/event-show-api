import dotenv from "dotenv";
import { IWhatsAppService } from "./IWhatsAppService";
dotenv.config();

if (
  !process.env.EVOLUTION_URL ||
  !process.env.EVOLUTION_INSTANCE ||
  !process.env.EVOLUTION_API_KEY
) {
  throw new Error(
    "❌ Variáveis de ambiente do EVOLUTION API não estão configuradas corretamente."
  );
}

export class WhatsAppService implements IWhatsAppService {
  async sendMessage(to: string, message: string) {
    const url = `${process.env.EVOLUTION_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`;

    const options: any = {
      method: "POST",
      headers: {
        apikey: process.env.EVOLUTION_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number: `55${to}`, // apenas números
        options: {
          delay: 0,
          presence: "composing",
        },
        text: message,
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.dir(data, { depth: null });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }
}
