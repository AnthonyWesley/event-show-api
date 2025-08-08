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

export type SendLeadCollectorAccessInviteInputDto = {
  sellerId?: string;
  eventId: string;
  companyId: string;
  phone: string;
  screenAccess: ScreenAccessType;
};

export type SendScreenAccessInviteOutputDto = {
  message: string;
};
export type ScreenAccessType = "leadCollector" | "ranking";

export class SendScreenAccessInvite
  implements
    IUseCases<
      SendLeadCollectorAccessInviteInputDto,
      SendScreenAccessInviteOutputDto
    >
{
  private constructor(
    private readonly companyGateway: ICompanyGateway,
    private readonly eventGateway: IEventGateway,
    private readonly inviteGateway: IInviteGateway,
    private readonly sendMessageService?: IWhatsAppService,
    private readonly tokenService?: AuthTokenService
  ) {}

  public static create(
    companyGateway: ICompanyGateway,
    eventGateway: IEventGateway,
    inviteGateway: IInviteGateway,
    sendMessageService?: IWhatsAppService,
    tokenService?: AuthTokenService
  ) {
    return new SendScreenAccessInvite(
      companyGateway,
      eventGateway,
      inviteGateway,
      sendMessageService,
      tokenService
    );
  }

  public async execute(
    input: SendLeadCollectorAccessInviteInputDto
  ): Promise<SendScreenAccessInviteOutputDto> {
    if (!input.eventId || !input.phone) {
      throw new ValidationError("Event ID and phone are required.");
    }

    const existCompany = await this.companyGateway.findById(input.companyId);
    if (!existCompany) throw new NotFoundError("Company");

    const existEvent = await this.eventGateway.findById({
      companyId: input.companyId,
      eventId: input.eventId,
    });
    if (!existEvent) throw new NotFoundError("Event");

    // Regra: 1 código por telefone + evento
    const existingInvite = await this.inviteGateway.findByPhone(
      input.eventId,
      input.phone
    );

    let invite = existingInvite;
    if (!invite || invite.expiresAt < new Date()) {
      const code = generateInviteCode();

      invite = await Invite.create({
        code,
        eventId: input.eventId,
        expiresAt: new Date(
          Date.now() +
            (existEvent?.inviteValidityDays ?? 1) * 24 * 60 * 60 * 1000
        ),
        sellerEventId: "",
        phone: input.phone,
        // opcional, se LeadCollector for um model:
        // leadCollectorId: await this.createOrFindCollector(input),
      });

      await this.inviteGateway.save(invite);
    }
    const screenAccessInvite = {
      leadCollector: {
        message:
          `Você foi convidado para coletar leads no evento "${existEvent.name}".\n\n` +
          `Acesse o link abaixo para cadastrar os participantes:\nevent-flow-awl.netlify.app/leadCollector/${invite.code}`,
      },
      ranking: {
        message:
          `Você foi convidado para assistir o evento "${existEvent.name}".\n\n` +
          `Acesse o link abaixo para conferir o andamento:\nevent-flow-awl.netlify.app/ranking/guest/${invite.code}`,
      },
    };
    const url = `event-flow-awl.netlify.app/lead-collector/${invite.code}`;

    const message =
      `Você foi convidado para coletar leads no evento "${existEvent.name}".\n\n` +
      `Acesse o link abaixo para cadastrar os participantes:\n${url}`;

    await this.sendMessageService?.sendMessage(
      input.phone,
      screenAccessInvite[input.screenAccess].message
    );

    return { message: screenAccessInvite[input.screenAccess].message };
  }
}
