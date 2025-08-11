import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IUseCases } from "../IUseCases";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { SaleProps } from "../../domain/entities/sale/Sale";

import { GoalType } from "@prisma/client";
import { GoalUtils } from "../../shared/utils/GoalUtils";
import {
  SellerWithStats,
  SellerStatsHelper,
} from "../../shared/utils/SellerStatsHelper";
import { AuthTokenService } from "../../service/AuthTokenService";
import { IInviteGateway } from "../../domain/entities/invite/IInviteGateway";
import { ForbiddenError } from "../../shared/errors/ForbiddenError";
import { LeadProps } from "../../domain/entities/lead/Lead";

export type GuestAccessOutputDto = {
  token: TokenType;
  guest: SellerDto;
};

export type TokenType = {
  accessToken: string;
};

export type SellerDto = {
  id: string;
  rank: number;
  name: string;
  goal: number;
  email: string;
  photo: string;
  phone: string;
  sales: SaleProps[];
  leads: LeadProps[];

  event: {
    id: string;
    name: string;
    isActive: boolean;
    goal: number;
    isValueVisible?: boolean;
    goalType: GoalType;
    allSellers: SellerWithStats[];
  };
  totalSalesCount: number;
  totalSalesValue: number;
};

export type GuestAccessInputDto = {
  invite: string;
};

export class GuestAccess
  implements IUseCases<GuestAccessInputDto, GuestAccessOutputDto>
{
  private constructor(
    private readonly companyGateway: ICompanyGateway,
    private readonly eventGateway: IEventGateway,
    private readonly sellerGateway: ISellerGateway,
    private readonly inviteGateway: IInviteGateway,
    private readonly authorization: AuthTokenService
  ) {}

  static create(
    companyGateway: ICompanyGateway,
    eventGateway: IEventGateway,
    sellerGateway: ISellerGateway,
    inviteGateway: IInviteGateway,
    authorization: AuthTokenService
  ) {
    return new GuestAccess(
      companyGateway,
      eventGateway,
      sellerGateway,
      inviteGateway,
      authorization
    );
  }

  async execute(input: GuestAccessInputDto): Promise<GuestAccessOutputDto> {
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

    const sellerEventsFormatted =
      event.sellerEvents?.map((sellerEvent): any => ({
        id: sellerEvent.sellerId,
        sellerEventId: sellerEvent.id,
        name: sellerEvent.seller?.name ?? "",
        photo: sellerEvent.seller?.photo ?? "",
        phone: sellerEvent.seller?.phone ?? "",
        goal: sellerEvent.goal,
      })) ?? [];

    const stats = SellerStatsHelper.computeStats(
      event.sales ?? [],
      company.products ?? []
    );

    const wasPresentMap = SellerStatsHelper.computeWasPresentPerSeller(
      event.leads ?? []
    );

    const sellersWithStats = SellerStatsHelper.applyStatsToSellers(
      sellerEventsFormatted,
      stats,
      wasPresentMap
    );

    const allSellers = SellerStatsHelper.sortByGoalType(
      sellersWithStats,
      event.goalType
    );

    const sellerId = invite.sellerEvent?.sellerId;
    if (!sellerId) throw new NotFoundError("SellerEventId");

    const seller = await this.sellerGateway.findById({ sellerId, companyId });
    if (!seller) throw new NotFoundError("Seller");

    const filteredSales = (seller.sales ?? []).filter(
      (sale) => sale.eventId === event.id
    );

    const { count: totalSalesCount, total: totalSalesValue } = stats[
      seller.id
    ] ?? { count: 0, total: 0 };

    const rank = allSellers.findIndex((s) => s.id === seller.id) + 1;

    const user = company.users?.[0];
    const accessToken = this.authorization.generateToken(
      {
        id: user?.id ?? "",
        email: user?.email ?? "",
        companyId: company.id,
      },
      "1d"
    );

    //   if (event.wasPresent)
    // await this.socketServer.emit(
    //   "lead:updated",
    //   `${updatedLead.name} acabou de confirmar presença no evento!`
    // );

    console.log(event.leads?.filter((le) => le.sellerId === seller?.id));

    return {
      token: { accessToken },
      guest: {
        id: seller.id,
        rank,
        name: seller.name,
        email: seller.email,
        phone: seller.phone ?? "",
        photo: seller.photo ?? "",
        sales: filteredSales,
        goal: allSellers.find((sl) => sl.id === seller.id)?.goal ?? 0,
        leads: seller.leads ?? [],
        totalSalesCount,
        totalSalesValue,
        event: {
          id: event.id,
          name: event.name,
          isActive: event.isActive,
          goal: event.goal,
          goalType: event.goalType,
          isValueVisible:
            event.goalType === "QUANTITY" ? company.isValueVisible : true,
          allSellers,
        },
      },
    };
  }
}
