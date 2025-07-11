import { GoalType } from "@prisma/client";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { SaleProps } from "../../domain/entities/sale/Sale";
import {
  SellerStatsHelper,
  SellerWithStats,
} from "../../helpers/SellerStatsHelper";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import { SellerEventProps } from "../../domain/entities/sellerEvent/SellerEvent";

export type FindEventInputDto = {
  companyId: string;
  eventId: string;
};

export type FindEventOutputDto = {
  id: string;
  name: string;
  photo?: string;
  photoPublicId?: string;
  file?: any;
  startDate: Date;
  endDate?: Date;
  sellerEvents: SellerEventProps[];
  sales: SaleProps[];
  goal: number;
  isActive?: boolean;

  goalType: GoalType;
  companyId: string;
  createdAt: Date;
  allSellers: SellerWithStats[];
};

export class FindEvent
  implements IUseCases<FindEventInputDto, FindEventOutputDto>
{
  private constructor(
    private readonly eventGateway: IEventGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    eventGateway: IEventGateway,
    companyGateway: ICompanyGateway
  ) {
    return new FindEvent(eventGateway, companyGateway);
  }

  public async execute(input: FindEventInputDto): Promise<FindEventOutputDto> {
    const event = await this.eventGateway.findById(input);
    if (!event) throw new NotFoundError("Event");

    const company = await this.companyGateway.findById(event.companyId);
    if (!company) throw new NotFoundError("Company");

    const sellerIds = event.sellerEvents.map((se: any) => se.sellerId);
    const sellers = (company.sellers ?? []).filter((s) =>
      sellerIds.includes(s.id)
    );

    const stats = SellerStatsHelper.computeStats(
      event.sales,
      company.products ?? []
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
      photo: event.photo,
      photoPublicId: event.photoPublicId,
      startDate: event.startDate,
      endDate: event.endDate ?? undefined,
      sellerEvents: event.sellerEvents,
      sales: event.sales,
      isActive: event.isActive,
      goal: event.goal,
      goalType: event.goalType as GoalType,
      companyId: event.companyId,
      createdAt: event.createdAt,
      allSellers,
    };
  }
}
