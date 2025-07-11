import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { ISaleGateway } from "../../domain/entities/sale/ISaleGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type ListSaleInputDto = {
  companyId: string;
  eventId: string;
};

export type ListSaleOutputDto = {
  sales: {
    id: string;
    eventId: string;
    productId: string;
    sellerId: string;
    quantity: number;
    createdAt: Date;
  }[];
};

export class ListSale
  implements IUseCases<ListSaleInputDto, ListSaleOutputDto>
{
  private constructor(
    private readonly saleGateway: ISaleGateway,
    private readonly eventGateway: IEventGateway,
    private readonly productGateway: IProductGateway,
    private readonly sellerGateway: ISellerGateway
  ) {}

  public static create(
    saleGateway: ISaleGateway,
    eventGateway: IEventGateway,
    productGateway: IProductGateway,
    sellerGateway: ISellerGateway
  ) {
    return new ListSale(
      saleGateway,
      eventGateway,
      productGateway,
      sellerGateway
    );
  }

  public async execute(input: ListSaleInputDto): Promise<ListSaleOutputDto> {
    try {
      const eventExists = await this.eventGateway.findById({
        eventId: input.eventId,
        companyId: input.companyId,
      });
      if (!eventExists) throw new NotFoundError("Event");

      const sales = await this.saleGateway.list(input.eventId);
      if (!sales) {
        throw new Error("Failed to list sales");
      }

      return {
        sales: sales.map((s) => ({
          id: s.id,
          eventId: s.eventId,
          productId: s.productId,
          sellerId: s.sellerId,
          quantity: s.quantity,
          // total: s.total,
          createdAt: s.createdAt,
        })),
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  }
}
