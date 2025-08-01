import { IUseCases } from "../IUseCases";
import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";

import { NotFoundError } from "../../shared/errors/NotFoundError";
import { SaleProps } from "../../domain/entities/sale/Sale";
import {
  SellerStatsHelper,
  SellerWithStats,
} from "../../shared/utils/SellerStatsHelper";

export type ListSellerByEventInputDto = {
  // sellerId: string;
  eventId: string;
  companyId: string;
};

// export type ListSellerByEventOutputDto = {
//   topSellers: SellerWithStats[];
//   otherSellers: SellerWithStats[];
// };
export type ListSellerByEventOutputDto = {
  SellerWithStats: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photo?: string;
    sales: SaleProps[];
    createdAt: Date;
    totalValue: number;
    totalQuantity: number;
  }[];
};

export class ListSellerByEvent
  implements IUseCases<ListSellerByEventInputDto, ListSellerByEventOutputDto>
{
  private constructor(
    private readonly sellerEventGateway: ISellerEventGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly eventGateway: IEventGateway
  ) {}

  public static create(
    sellerEventGateway: ISellerEventGateway,
    companyGateway: ICompanyGateway,
    eventGateway: IEventGateway
  ) {
    return new ListSellerByEvent(
      sellerEventGateway,
      companyGateway,
      eventGateway
    );
  }

  public async execute(
    input: ListSellerByEventInputDto
  ): Promise<ListSellerByEventOutputDto> {
    const [sellerEvents, company, event] = await Promise.all([
      this.sellerEventGateway.listSellersByEvent(input.eventId),
      this.companyGateway.findById(input.companyId),
      this.eventGateway.findById({
        eventId: input.eventId,
        companyId: input.companyId,
      }),
    ]);

    if (!sellerEvents || sellerEvents.length === 0)
      throw new NotFoundError("SellerEvent");
    if (!company) throw new NotFoundError("Company");
    if (!event) throw new NotFoundError("Event");

    const sales = event.sales ?? [];
    const products = company.products ?? [];

    const sellers = sellerEvents.map((se) => se.seller); // já populado

    const stats = SellerStatsHelper.computeStats(sales, products);

    const sellersWithStats = SellerStatsHelper.applyStatsToSellers(
      sellers,
      stats,
      event.goal
    );

    return {
      SellerWithStats: sellersWithStats.map(
        (sellerWithStats: SellerWithStats) => ({
          id: sellerWithStats.id,
          name: sellerWithStats.name,
          email: sellerWithStats.email,
          phone: sellerWithStats.phone,
          photo: sellerWithStats.photo,
          sales: sellerWithStats.sales,
          createdAt: sellerWithStats.createdAt,
          totalValue: sellerWithStats.totalSalesValue,
          totalQuantity: sellerWithStats.totalSalesCount,
        })
      ),
    };
  }
}
