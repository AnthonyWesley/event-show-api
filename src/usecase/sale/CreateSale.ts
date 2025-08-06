import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { ISaleGateway } from "../../domain/entities/sale/ISaleGateway";
import { Sale } from "../../domain/entities/sale/Sale";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { ISocketServer } from "../../infra/socket/ISocketServer";
import { SocketServer } from "../../infra/socket/SocketServer";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type CreateSaleInputDto = {
  companyId: string;
  eventId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  leadId: string;
  lead: any;
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
    private readonly sellerGateway: ISellerGateway,
    private readonly socketServer: ISocketServer
  ) {}

  public static create(
    saleGateway: ISaleGateway,
    eventGateway: IEventGateway,
    productGateway: IProductGateway,
    sellerGateway: ISellerGateway,
    socketServer: ISocketServer
  ) {
    return new CreateSale(
      saleGateway,
      eventGateway,
      productGateway,
      sellerGateway,
      socketServer
    );
  }

  public async execute(
    input: CreateSaleInputDto
  ): Promise<CreateSaleOutputDto> {
    if (
      !input.productId ||
      !input.sellerId ||
      !input.quantity
      // !input.leadId
    ) {
      throw new ValidationError(
        "All fields are required: sellerI, eventId, quantity."
      );
    }

    const [eventExists, productExists, sellerExists] = await Promise.all([
      this.eventGateway.findById({
        eventId: input.eventId,
        companyId: input.companyId,
      }),
      this.productGateway.findById({
        productId: input.productId,
        companyId: input.companyId,
      }),
      this.sellerGateway.findById({
        companyId: input.companyId,
        sellerId: input.sellerId,
      }),
    ]);

    if (!eventExists) throw new NotFoundError("Event");
    if (!productExists) throw new NotFoundError("Product");
    if (!sellerExists) throw new NotFoundError("Seller");

    const anSale = Sale.create({
      eventId: input.eventId,
      productId: input.productId,
      sellerId: input.sellerId,
      quantity: input.quantity,
      leadId: input.leadId,
    });

    const leadWithCompanyId = {
      ...input.lead,
      companyId: input.companyId,
    };

    await this.saleGateway.save(anSale, leadWithCompanyId);
    this.socketServer?.emit("sale:created", { id: input.sellerId });
    this.socketServer?.emit("sale:message", {
      message: `${sellerExists?.name} acabou de realizar uma venda!`,
    });

    return { id: anSale.id };
  }
}
