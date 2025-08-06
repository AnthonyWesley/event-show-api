import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { ISaleGateway } from "../../domain/entities/sale/ISaleGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { ISocketServer } from "../../infra/socket/ISocketServer";
import { SocketServer } from "../../infra/socket/SocketServer";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type DeleteSaleInputDto = {
  saleId: string;
  companyId: string;
  eventId: string;
};

export class DeleteSale implements IUseCases<DeleteSaleInputDto, void> {
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
    return new DeleteSale(
      saleGateway,
      eventGateway,
      productGateway,
      sellerGateway,
      socketServer
    );
  }

  async execute(input: DeleteSaleInputDto): Promise<void> {
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

      await this.saleGateway.delete(input);
      this.socketServer?.emit("sale:deleted", { id: input.saleId });
    } catch (error) {
      console.error("Error in FindSale.execute:", error);
    }
  }
}
