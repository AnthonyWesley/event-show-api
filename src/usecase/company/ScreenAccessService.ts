import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IUseCases } from "../IUseCases";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { AuthTokenService } from "../../service/AuthTokenService";
import { IInviteGateway } from "../../domain/entities/invite/IInviteGateway";
import { ForbiddenError } from "../../shared/errors/ForbiddenError";
import { LeadProps, LeadStatus } from "../../domain/entities/lead/Lead";
import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { ScreenAccessType } from "./SendScreenAccessInvite";
import { GoalType } from "@prisma/client";
import { SaleProps } from "../../domain/entities/sale/Sale";
import { SellerEventProps } from "../../domain/entities/sellerEvent/SellerEvent";
import { GoalUtils } from "../../shared/utils/GoalUtils";
import { SellerStatsHelper } from "../../shared/utils/SellerStatsHelper";
import { EventProps } from "../../domain/entities/event/Event";
import { FindEventOutputDto } from "../event/FindEvent";

export type ScreenAccessServiceOutputDto = {
  token: TokenType;
  leadCollector: LeadProps[];
  event: Partial<FindEventOutputDto>;
};

export type TokenType = {
  accessToken: string;
};

export type ScreenAccessServiceInputDto = {
  screenAccess: ScreenAccessType;

  invite: string;
  // companyId: string;
  // eventId: string;
  search?: string;
};

export class ScreenAccessService
  implements
    IUseCases<ScreenAccessServiceInputDto, ScreenAccessServiceOutputDto>
{
  private constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly eventGateway: IEventGateway,
    private readonly inviteGateway: IInviteGateway,
    private readonly authorization: AuthTokenService
  ) {}

  static create(
    leadGateway: ILeadGateway,
    companyGateway: ICompanyGateway,
    eventGateway: IEventGateway,
    inviteGateway: IInviteGateway,
    authorization: AuthTokenService
  ) {
    return new ScreenAccessService(
      leadGateway,
      companyGateway,
      eventGateway,
      inviteGateway,
      authorization
    );
  }

  async execute(
    input: ScreenAccessServiceInputDto
  ): Promise<ScreenAccessServiceOutputDto> {
    const validTypes: ScreenAccessType[] = ["leadCollector", "ranking"];

    if (!validTypes.includes(input.screenAccess)) {
      throw new Error("Invalid screenAccess type");
    }
    const invite = await this.inviteGateway.findByCode(input.invite);
    if (!invite) throw new NotFoundError("Invite");

    if (invite.expiresAt < new Date()) {
      throw new ForbiddenError("Expired invitation");
    }

    const companyId = invite.event?.companyId ?? "";
    const eventId = invite.eventId;

    const company = await this.companyGateway.findById(companyId);
    if (!company) throw new UnauthorizedError("Invalid email.");

    const event = await this.eventGateway.findById({ companyId, eventId });
    if (!event) throw new NotFoundError("Event");

    const leadsByEvent = await this.leadGateway.listByEvent(
      event.id,
      input.search
    );

    const stats = SellerStatsHelper.computeStats(
      event.sales ?? [],
      company.products ?? []
    );

    const wasPresentMap = SellerStatsHelper.computeWasPresentPerSeller(
      event?.leads ?? []
    );

    const formattedSellerEvent: any = event.sellerEvents?.map(
      (sellerEvent: SellerEventProps) => ({
        id: sellerEvent.sellerId,
        sellerEventId: sellerEvent.id,
        name: sellerEvent.seller?.name,
        photo: sellerEvent.seller?.photo,
        email: sellerEvent.seller?.email,
        phone: sellerEvent.seller?.phone,
        goal: sellerEvent.goal,
      })
    );

    const sellersWithStats = SellerStatsHelper.applyStatsToSellers(
      formattedSellerEvent,
      stats,
      // event.goal,
      wasPresentMap
    );

    const allSellers = SellerStatsHelper.sortByGoalType(
      sellersWithStats,
      event.goalType as GoalType
    );

    const totalSalesValue = GoalUtils.sumSellerProgressForGoal(
      allSellers,
      event.goalType
    );

    const totalUnitsSold =
      event?.sales?.reduce(
        (acc: number, sale: SaleProps) => acc + (sale?.quantity ?? 0),
        0
      ) ?? 0;

    const user = company.users?.[0];
    const accessToken = this.authorization.generateToken(
      {
        id: user?.id ?? "",
        email: user?.email ?? "",
        companyId: company.id,
      },
      "1d"
    );

    return {
      token: { accessToken },
      event: {
        id: event.id,
        name: event.name,
        isActive: event.isActive,
        sales: event.sales ?? [],
        goal: event.goal,
        goalType: event.goalType,
        allSellers,
        totalUnitsSold,
        totalSalesValue,
      },
      leadCollector: leadsByEvent.map((lead) => ({
        id: lead.id,
        name: lead.name,
        phone: lead.phone ?? "",
        wasPresent: lead.wasPresent,
        eventId: lead.eventId,
        status: lead.status as LeadStatus,
        notes: lead.notes ?? undefined,
        customInterest: lead.customInterest ?? undefined,
        companyId: lead.companyId,
        createdAt: lead.createdAt,
        convertedAt: lead.convertedAt ?? undefined,
        // customValues: lead.customValues ?? undefined,
        event: {
          id: lead.event?.id ?? lead.eventId,
          name: lead.event?.name ?? "Evento desconhecido",
        },
        seller: lead.seller
          ? { id: lead.seller.id, name: lead.seller.name }
          : undefined,

        source: lead.leadSource
          ? { id: lead.leadSource?.id, name: lead.leadSource.name }
          : undefined,
        products:
          lead.products?.map((p) => ({
            id: p.id,
            name: p.name,
          })) ?? [],
      })),
    };
  }
}
