import { GoalType } from "@prisma/client";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { SaleProps } from "../../domain/entities/sale/Sale";
import {
  SellerStatsHelper,
  SellerWithStats,
} from "../../helpers/SellerStatsHelper";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import { SellerEventProps } from "../../domain/entities/sellerEvent/SellerEvent";

export type FindPartnerEventInputDto = {
  partnerId: string;
  eventId: string;
};

export type FindPartnerEventOutputDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  sellerEvents: SellerEventProps[];
  sales: SaleProps[];
  goal: number;
  isActive?: boolean;

  goalType: GoalType;
  partnerId: string;
  createdAt: Date;
  allSellers: SellerWithStats[];
};

export class FindPartnerEvent
  implements IUseCases<FindPartnerEventInputDto, FindPartnerEventOutputDto>
{
  private constructor(
    private readonly eventGateway: IEventGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    eventGateway: IEventGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new FindPartnerEvent(eventGateway, partnerGateway);
  }

  public async execute(
    input: FindPartnerEventInputDto
  ): Promise<FindPartnerEventOutputDto> {
    const event = await this.eventGateway.findById(input);
    if (!event) throw new NotFoundError("Event");

    const partner = await this.partnerGateway.findById(event.partnerId);
    if (!partner) throw new NotFoundError("Partner");

    const sellerIds = event.sellerEvents.map((se: any) => se.sellerId);
    const sellers = (partner.sellers ?? []).filter((s) =>
      sellerIds.includes(s.id)
    );

    const stats = SellerStatsHelper.computeStats(
      event.sales,
      partner.products ?? []
    );
    const sellersWithStats = SellerStatsHelper.applyStatsToSellers(
      sellers,
      stats
    );

    const allSellers = SellerStatsHelper.sortByGoalType(
      sellersWithStats,
      event.goalType as GoalType
    );

    return {
      id: event.id,
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate ?? undefined,
      sellerEvents: event.sellerEvents,
      sales: event.sales,
      isActive: event.isActive,
      goal: event.goal,
      goalType: event.goalType as GoalType,
      partnerId: event.partnerId,
      createdAt: event.createdAt,
      allSellers,
    };
  }
}
