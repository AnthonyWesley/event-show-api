import { GoalMode, GoalType } from "@prisma/client";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { SaleProps } from "../../domain/entities/sale/Sale";

import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import { SellerEventProps } from "../../domain/entities/sellerEvent/SellerEvent";
import { GoalUtils } from "../../shared/utils/GoalUtils";
import {
  SellerStatsHelper,
  SellerWithStats,
} from "../../shared/utils/SellerStatsHelper";
import { SellerProps } from "../../domain/entities/seller/Seller";
import { LeadProps } from "../../domain/entities/lead/Lead";

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
  goalMode: GoalMode;
  sales: SaleProps[];
  goal: number;
  isActive?: boolean;
  isValueVisible?: boolean;
  totalSalesValue: number;
  totalUnitsSold: number;
  goalType: GoalType;
  companyId: string;
  createdAt: Date;
  allSellers: SellerWithStats[];
  leads: LeadProps[];
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

    return {
      id: event.id,
      name: event.name,
      photo: event.photo,
      photoPublicId: event.photoPublicId,
      startDate: event.startDate,
      endDate: event.endDate ?? undefined,
      sales: event.sales ?? [],
      isActive: event.isActive,
      goal: event.goal,
      goalMode: event.goalMode ?? "auto",
      isValueVisible: company.isValueVisible,
      goalType: event.goalType as GoalType,
      companyId: event.companyId,
      createdAt: event.createdAt,
      leads: event.leads ?? [],
      totalSalesValue,
      totalUnitsSold,
      allSellers,
    };
  }
}
