import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { ISaleGateway } from "../../domain/entities/sale/ISaleGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindSaleInputDto = {
  saleId: string;
  companyId: string;
  eventId: string;
};

export type FindSaleOutputDto = {
  id: string;
  eventId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
  seller: {
    id: string;
    name: string;
  };
  createdAt: Date;
};

export class FindSale
  implements IUseCases<FindSaleInputDto, FindSaleOutputDto>
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
    return new FindSale(
      saleGateway,
      eventGateway,
      productGateway,
      sellerGateway
    );
  }

  public async execute(input: FindSaleInputDto): Promise<FindSaleOutputDto> {
    try {
      const eventExists = await this.eventGateway.findById({
        eventId: input.eventId,
        companyId: input.companyId,
      });

      if (!eventExists) throw new NotFoundError("Event");

      const aSale = await this.saleGateway.findById(input);
      if (!aSale) {
        throw new NotFoundError("Sale");
      }

      // const existSeller = await this.sellerGateway.findById({companyId:input.companyId,sellerId:} )

      // const seller = eventExists..find(sl=>sl.id)

      return {
        id: aSale.id,
        eventId: aSale.eventId,
        productId: aSale.productId,
        sellerId: aSale.sellerId,
        quantity: aSale.quantity,
        product: aSale.product,
        seller: aSale.seller,
        createdAt: aSale.createdAt,
      };
    } catch (error) {
      console.error("Error in FindSale.execute:", error);
      throw error;
    }
  }
}
