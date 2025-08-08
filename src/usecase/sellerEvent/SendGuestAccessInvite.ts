import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IInviteGateway } from "../../domain/entities/invite/IInviteGateway";
import { Invite } from "../../domain/entities/invite/Invite";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { IWhatsAppService } from "../../infra/mail/IWhatsAppService";
import { AuthTokenService } from "../../service/AuthTokenService";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { generateInviteCode } from "../../shared/utils/IdGenerator";
import { IUseCases } from "../IUseCases";

export type SendGuestAccessInviteInputDto = {
  sellerId: string;
  eventId: string;
  companyId: string;
};

export type SendGuestAccessInviteOutputDto = {
  link: string;
};

export class SendGuestAccessInvite
  implements
    IUseCases<SendGuestAccessInviteInputDto, SendGuestAccessInviteOutputDto>
{
  private constructor(
    private readonly companyGateway: ICompanyGateway,
    private readonly eventGateway: IEventGateway,
    private readonly sellerGateway: ISellerGateway,
    private readonly inviteGateway: IInviteGateway,

    private readonly sendMessageService?: IWhatsAppService,
    private readonly tokenService?: AuthTokenService
  ) {}

  public static create(
    companyGateway: ICompanyGateway,
    eventGateway: IEventGateway,
    sellerGateway: ISellerGateway,
    inviteGateway: IInviteGateway,
    sendMessageService?: IWhatsAppService,
    tokenService?: AuthTokenService
  ) {
    return new SendGuestAccessInvite(
      companyGateway,
      eventGateway,
      sellerGateway,
      inviteGateway,
      sendMessageService,
      tokenService
    );
  }

  public async execute(
    input: SendGuestAccessInviteInputDto
  ): Promise<SendGuestAccessInviteOutputDto> {
    if (!input.sellerId || !input.eventId) {
      throw new ValidationError("Seller ID and Event ID are required.");
    }

    const existCompany = await this.companyGateway.findById(input.companyId);
    if (!existCompany) {
      throw new NotFoundError("Company");
    }

    const existEvent = await this.eventGateway.findById({
      companyId: input.companyId,
      eventId: input.eventId,
    });
    if (!existEvent) {
      throw new NotFoundError("Event");
    }

    const existSeller = await this.sellerGateway.findById({
      companyId: input.companyId,
      sellerId: input.sellerId,
    });
    if (!existSeller) {
      throw new NotFoundError("Seller");
    }

    const findSellerEvent = existEvent?.sellerEvents?.find(
      (se) => se.sellerId === existSeller?.id
    );
    if (!findSellerEvent) {
      throw new NotFoundError("SellerEvent");
    }

    const invite = await this.inviteGateway.findBySellerEventId(
      findSellerEvent?.id ?? ""
    );

    let newInvite = invite;
    if (!invite || invite.expiresAt < new Date()) {
      const code = generateInviteCode();

      newInvite = await Invite.create({
        sellerEventId: findSellerEvent?.id,
        code,
        eventId: existEvent?.id,
        expiresAt: new Date(
          Date.now() +
            (existEvent?.inviteValidityDays ?? 1) * 24 * 60 * 60 * 1000
        ), // 24h
        phone: "",
      });

      await this.inviteGateway.save(newInvite);
    }
    const urlInvite = `event-flow-awl.netlify.app/guest/${newInvite?.code}`;

    const message =
      `Você foi convidado para participar do EventShow no evento "${existEvent?.name}".\n\n` +
      `Acesse o link abaixo:\n${urlInvite}`;

    await this.sendMessageService?.sendMessage(
      existSeller?.phone ?? "",
      message
    );

    return { link: urlInvite };
  }
}
