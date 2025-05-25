export interface IWhatsAppService {
  sendMessage(to: string, message: string): Promise<void>;
}
