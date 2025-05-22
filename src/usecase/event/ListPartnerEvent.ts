import { GoalType } from "@prisma/client";
import { Goal } from "../../domain/entities/event/Event";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { SaleProps } from "../../domain/entities/sale/Sale";
import { SellerStatsHelper } from "../../helpers/SellerStatsHelper";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import { SellerEventProps } from "../../domain/entities/sellerEvent/SellerEvent";
import { SellerProps } from "../../domain/entities/seller/Seller";

export type ListPartnerEventInputDto = { partnerId: string };

export type ListPartnerEventOutputDto = {
  events: {
    id: string;
    name: string;
    startDate: Date;
    endDate?: Date;
    sellerEvents: SellerEventProps[];
    sales: SaleProps[];
    goal: number;
    goalType: GoalType;
    isActive?: boolean;
    partnerId: string;
    createdAt: Date;
    allSellers: (SellerProps & {
      totalSalesCount: number;
      totalSalesValue: number;
    })[];
  }[];
};

export class ListPartnerEvent
  implements IUseCases<ListPartnerEventInputDto, ListPartnerEventOutputDto>
{
  private constructor(
    private readonly eventGateway: IEventGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    eventGateway: IEventGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new ListPartnerEvent(eventGateway, partnerGateway);
  }

  public async execute(
    input: ListPartnerEventInputDto
  ): Promise<ListPartnerEventOutputDto> {
    const partner = await this.partnerGateway.findById(input.partnerId);
    if (!partner) throw new NotFoundError("Partner");

    const events = await this.eventGateway.list(partner.id);
    if (!events || events.length === 0) return { events: [] };

    return {
      events: events.map((event) => {
        const sellerIds = event.sellerEvents.map((se) => se.sellerId);
        const eventSellers = (partner.sellers ?? []).filter((s) =>
          sellerIds.includes(s.id)
        );

        const stats = SellerStatsHelper.computeStats(
          event.sales,
          partner.products ?? []
        );

        const sellersWithStats = SellerStatsHelper.applyStatsToSellers(
          eventSellers,
          stats
        );

        const allSellers = SellerStatsHelper.sortByGoalType(
          sellersWithStats,
          event.goalType as Goal
        );

        return {
          id: event.id,
          name: event.name,
          startDate: event.startDate,
          endDate: event.endDate ?? undefined,
          sales: event.sales,
          sellerEvents: event.sellerEvents,
          isActive: event.isActive,
          goal: event.goal,
          goalType: event.goalType as GoalType,
          partnerId: event.partnerId,
          createdAt: event.createdAt,
          allSellers,
        };
      }),
    };
  }
}
