import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { ISaleGateway } from "../../domain/entities/sale/ISaleGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type UpdateSaleInputDto = {
  saleId: string;
  companyId: string;
  eventId: string;

  quantity?: number;
  // total?: number;
};

export type UpdateSaleResponseDto = {
  id: string;
  companyId: string;
  eventId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  // total: number;
};

export class UpdateSale {
  private constructor(
    private readonly saleGateway: ISaleGateway,
    private readonly eventGateway: IEventGateway,
    private readonly productGateway: IProductGateway,
    private readonly sellerGateway: ISellerGateway
  ) {}

  static create(
    saleGateway: ISaleGateway,
    eventGateway: IEventGateway,
    productGateway: IProductGateway,
    sellerGateway: ISellerGateway
  ) {
    return new UpdateSale(
      saleGateway,
      eventGateway,
      productGateway,
      sellerGateway
    );
  }

  async execute(input: UpdateSaleInputDto): Promise<UpdateSaleResponseDto> {
    const [eventExists, saleExists] = await Promise.all([
      this.eventGateway.findById({
        eventId: input.eventId,
        companyId: input.companyId,
      }),

      this.saleGateway.findById(input),
    ]);
    if (!eventExists) throw new NotFoundError("Event");
    if (!saleExists) throw new NotFoundError("Sale");

    const updatedSale = await this.saleGateway.update(input);
    if (!updatedSale) {
      throw new Error("Failed to update sale");
    }

    return {
      id: updatedSale.id,
      companyId: eventExists.companyId,
      eventId: updatedSale.eventId,
      productId: updatedSale.productId,
      sellerId: updatedSale.sellerId,
      quantity: updatedSale.quantity,
      // total: updatedSale.total,
    };
  }
}
