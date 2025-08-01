import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IUseCases } from "../IUseCases";
import { AuthorizationRoute } from "../../infra/http/middlewares/AuthorizationRoute";
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
import { Invite } from "../../domain/entities/invite/Invite";
import { IInviteGateway } from "../../domain/entities/invite/IInviteGateway";
import { ForbiddenError } from "../../shared/errors/ForbiddenError";

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

  event: {
    id: string;
    name: string;
    isActive: boolean;
    goal: number;
    goalType: GoalType;
    allSellers: SellerWithStats[];
  };
  totalProgress: number;
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
    if (!invite) {
      throw new NotFoundError("Invite");
    }

    if (invite.expiresAt < new Date()) {
      throw new ForbiddenError("Expired invitation");
    }

    const company = await this.companyGateway.findById(
      invite.event?.companyId ?? ""
    );
    if (!company) {
      throw new UnauthorizedError("Invalid email.");
    }

    const event = await this.eventGateway.findById({
      companyId: invite.event?.companyId ?? "",
      eventId: invite.eventId,
    });
    if (!event) {
      throw new NotFoundError("Seller");
    }

    const sellerIds = event.sellerEvents.map((se: any) => se.sellerId);
    const eventSellers = (company.sellers ?? []).filter((s) =>
      sellerIds.includes(s.id)
    );

    const sellerEventId = await invite.sellerEvent?.sellerId;
    if (!sellerEventId) {
      throw new NotFoundError("SellerEventId");
    }

    const seller = await this.sellerGateway.findById({
      sellerId: sellerEventId,
      companyId: invite.event?.companyId ?? "",
    });
    if (!seller) {
      throw new NotFoundError("Seller");
    }

    const filteredSales = (seller?.sales ?? []).filter(
      (sale) => sale.eventId === event.id
    );

    const stats = SellerStatsHelper.computeStats(
      event.sales,
      company.products ?? []
    );

    const sellersWithStats = SellerStatsHelper.applyStatsToSellers(
      eventSellers,
      stats,
      event.goal
    );

    const totalProgress = GoalUtils.sumSellerProgressForGoal(
      sellersWithStats,
      event.goalType
    );

    const allSellers = SellerStatsHelper.sortByGoalType(
      sellersWithStats,
      event.goalType as GoalType
    );

    const { count: totalSalesCount, total: totalSalesValue } = stats[
      seller.id
    ] ?? { count: 0, total: 0 };

    const currentIndex = Array.isArray(allSellers)
      ? allSellers.findIndex((s: any) => s.name === seller?.name) + 1
      : 0;

    const accessToken = this.authorization.generateToken(
      {
        id: company.users && company?.users[0].id,
        email: company.users && company?.users[0].email,
        companyId: company.id,
      },
      "1d"
    );

    return {
      token: { accessToken },

      guest: {
        id: seller.id,
        rank: currentIndex,
        name: seller.name,
        email: seller.email,
        phone: seller.phone ?? "",
        photo: seller.photo ?? "",
        sales: filteredSales ?? [],
        goal: allSellers.find((sl) => sl.id === seller.id)?.goal ?? 0,
        totalProgress,
        totalSalesCount,
        totalSalesValue,
        event: {
          id: event?.id,
          name: event?.name,
          isActive: event?.isActive,
          goal: event?.goal,
          goalType: event?.goalType,
          allSellers,
        },
      },
    };
  }
}
