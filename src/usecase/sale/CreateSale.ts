import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { ISaleGateway } from "../../domain/entities/sale/ISaleGateway";
import { Sale } from "../../domain/entities/sale/Sale";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type CreateSaleInputDto = {
  partnerId: string;
  eventId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  // total: number;
};

export type CreateSaleOutputDto = {
  id: string;
};

export class CreateSale
  implements IUseCases<CreateSaleInputDto, CreateSaleOutputDto>
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
    return new CreateSale(
      saleGateway,
      eventGateway,
      productGateway,
      sellerGateway
    );
  }

  public async execute(
    input: CreateSaleInputDto
  ): Promise<CreateSaleOutputDto> {
    if (!input.productId || !input.sellerId || !input.quantity) {
      throw new ValidationError(
        "All fields are required: sellerI, eventId, quantity."
      );
    }

    const [eventExists, productExists, sellerExists] = await Promise.all([
      this.eventGateway.findById({
        eventId: input.eventId,
        partnerId: input.partnerId,
      }),
      this.productGateway.findById({
        productId: input.productId,
        partnerId: input.partnerId,
      }),
      this.sellerGateway.findById({
        partnerId: input.partnerId,
        sellerId: input.sellerId,
      }),
    ]);

    if (!eventExists) throw new NotFoundError("Event");
    if (!productExists) throw new NotFoundError("Product");
    if (!sellerExists) throw new NotFoundError("Seller");

    const anSale = Sale.create(
      input.eventId,
      input.productId,
      input.sellerId,
      input.quantity
    );

    await this.saleGateway.save(anSale);

    return { id: anSale.id };
  }
}
