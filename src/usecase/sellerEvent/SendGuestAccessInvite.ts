import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";

import { Authorization } from "../../infra/http/middlewares/Authorization";
import { IMailerService } from "../../infra/mail/IMailerService";
import { IWhatsAppService } from "../../infra/mail/IWhatsAppService";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";
import { Resend } from "resend";

export type SendGuestAccessInviteInputDto = {
  partnerId: string;
  eventId: string;
  sellerId: string;
};

export type SendGuestAccessInviteOutputDto = {
  //   id: string;
  link: string;
};

export class SendGuestAccessInvite
  implements
    IUseCases<SendGuestAccessInviteInputDto, SendGuestAccessInviteOutputDto>
{
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly authorization: Authorization,
    private readonly mailerService: IMailerService,
    private readonly whatsappService: IWhatsAppService
  ) {}

  public static create(
    sellerGateway: ISellerGateway,
    authorization: Authorization,
    mailerService: IMailerService,
    whatsappService: IWhatsAppService
  ) {
    return new SendGuestAccessInvite(
      sellerGateway,
      authorization,
      mailerService,
      whatsappService
    );
  }

  public async execute(
    input: SendGuestAccessInviteInputDto
  ): Promise<SendGuestAccessInviteOutputDto> {
    if (!input.sellerId || !input.eventId) {
      throw new ValidationError("Seller ID and Event ID are required.");
    }

    const seller = await this.sellerGateway.findById({
      partnerId: input.partnerId,
      sellerId: input.sellerId,
    });

    if (!seller) {
      throw new NotFoundError("Seller");
    }
    // const guestToken = this.authorization.generateToken(
    //   { id: seller.id, email: seller.email },
    //   "1m"
    // );

    const partnerToken = this.authorization.generateToken(
      { id: input.partnerId },
      "1d"
    );

    // const link = `http://localhost:5173/guest/${seller.id}?partnerToken=${partnerToken}&guestToken=${guestToken}`;
    const link = `http://localhost:5173/guest/${seller.id}?partnerToken=${partnerToken}`;

    // await this.mailerService.sendMail(
    //   seller.email,
    //   "Event Flow",
    //   ` <h2>Olá, ${seller.name}!</h2>
    //     <p>Você foi cadastrado no sistema de ranking de vendas.</p>
    //     <p>Clique no link abaixo para acessar os detalhes de suas vendas:</p>
    //     <a href="${link}">${link}</a>
    //     <p><i>Este link expira em 24 horas.</i></p>`
    // );
    console.log(seller.phone);

    const message =
      `Olá, ${seller.name}! Você foi cadastrado no sistema de ranking de vendas.\n\n` +
      `Acesse o link abaixo para ver seus detalhes de vendas (expira em 24h):\n` +
      `${link}`;

    await this.whatsappService.sendMessage(seller.phone ?? "", message);

    return { link };
  }
}
