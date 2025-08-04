import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { SocketServer } from "../../infra/socket/SocketServer";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { UpdateSellersGoalService } from "../event/UpdateSellersGoalService";
import { IUseCases } from "../IUseCases";

export type DeleteSellerEventInputDto = {
  sellerId: string;
  eventId: string;
};

export class DeleteSellerEvent
  implements IUseCases<DeleteSellerEventInputDto, void>
{
  private constructor(
    private readonly sellerEventGateway: ISellerEventGateway,
    private readonly socketServer?: SocketServer,
    private readonly updateSellersGoalService?: UpdateSellersGoalService
  ) {}

  public static create(
    sellerEventGateway: ISellerEventGateway,
    socketServer?: SocketServer,
    updateSellersGoalService?: UpdateSellersGoalService
  ) {
    return new DeleteSellerEvent(
      sellerEventGateway,
      socketServer,
      updateSellersGoalService
    );
  }

  public async execute(input: DeleteSellerEventInputDto): Promise<void> {
    if (!input.sellerId || !input.eventId) {
      throw new ValidationError("Seller ID and Event ID are required.");
    }

    const exists = await this.sellerEventGateway.findByEventAndSeller(
      input.sellerId,
      input.eventId
    );

    if (!exists) {
      throw new NotFoundError("SellerEvent relation");
    }

    await this.sellerEventGateway.delete(input.sellerId, input.eventId);
    this.socketServer?.emit("sellerEvent:deleted", { id: input.sellerId });

    const allSellersByEvent = await this.sellerEventGateway.listSellersByEvent(
      input.eventId
    );

    await this.updateSellersGoalService?.execute(allSellersByEvent[0].event);
  }
}
