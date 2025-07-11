import { GoalType } from "@prisma/client";
import { Goal } from "../../domain/entities/event/Event";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { SaleProps } from "../../domain/entities/sale/Sale";
import { SellerStatsHelper } from "../../helpers/SellerStatsHelper";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import { SellerEventProps } from "../../domain/entities/sellerEvent/SellerEvent";
import { SellerProps } from "../../domain/entities/seller/Seller";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

export type ListEventInputDto = { companyId: string; search?: string };

export type ListEventOutputDto = {
  events: {
    id: string;
    name: string;
    startDate: Date;
    endDate?: Date;
    sellerEvents: SellerEventProps[];
    sales: SaleProps[];
    photo?: string;
    photoPublicId?: string;
    file?: any;
    goal: number;
    goalType: GoalType;
    isActive?: boolean;
    companyId: string;
    createdAt: Date;
    allSellers: (SellerProps & {
      totalSalesCount: number;
      totalSalesValue: number;
    })[];
  }[];
};

export class ListEvent
  implements IUseCases<ListEventInputDto, ListEventOutputDto>
{
  private constructor(
    private readonly eventGateway: IEventGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    eventGateway: IEventGateway,
    companyGateway: ICompanyGateway
  ) {
    return new ListEvent(eventGateway, companyGateway);
  }

  public async execute(input: ListEventInputDto): Promise<ListEventOutputDto> {
    const company = await this.companyGateway.findById(input.companyId);
    if (!company) throw new NotFoundError("Company");

    const events = await this.eventGateway.list(company.id, input.search);
    if (!events || events.length === 0) return { events: [] };

    return {
      events: events.map((event) => {
        const sellerIds = event.sellerEvents.map((se) => se.sellerId);
        const eventSellers = (company.sellers ?? []).filter((s: any) =>
          sellerIds.includes(s.id)
        );

        const stats = SellerStatsHelper.computeStats(
          event.sales,
          company.products ?? []
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
          photo: event.photo,
          photoPublicId: event.photoPublicId,
          startDate: event.startDate,
          endDate: event.endDate ?? undefined,
          sales: event.sales,
          sellerEvents: event.sellerEvents,
          isActive: event.isActive,
          goal: event.goal,
          goalType: event.goalType as GoalType,
          companyId: event.companyId,
          createdAt: event.createdAt,
          allSellers,
        };
      }),
    };
  }
}
