import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { SellerEvent } from "../../domain/entities/sellerEvent/SellerEvent";
import { ISocketServer } from "../../infra/socket/ISocketServer";
import { SocketServer } from "../../infra/socket/SocketServer";
import { ValidationError } from "../../shared/errors/ValidationError";
import { GoalUtils } from "../../shared/utils/GoalUtils";
import { UpdateSellersGoalService } from "../event/UpdateSellersGoalService";
import { IUseCases } from "../IUseCases";

export type CreateSellerEventInputDto = {
  sellerId: string;
  eventId: string;
  companyId: string;
};

export type CreateSellerEventOutputDto = {
  id: string;
};

export class CreateSellerEvent
  implements IUseCases<CreateSellerEventInputDto, CreateSellerEventOutputDto>
{
  private constructor(
    private readonly sellerEventGateway: ISellerEventGateway,
    private readonly socketServer?: ISocketServer,
    private readonly updateSellersGoalService?: UpdateSellersGoalService
  ) {}

  public static create(
    sellerEventGateway: ISellerEventGateway,
    socketServer?: ISocketServer,
    updateSellersGoalService?: UpdateSellersGoalService
  ) {
    return new CreateSellerEvent(
      sellerEventGateway,
      socketServer,
      updateSellersGoalService
    );
  }

  public async execute(
    input: CreateSellerEventInputDto
  ): Promise<CreateSellerEventOutputDto> {
    if (!input.sellerId || !input.eventId) {
      throw new ValidationError("Seller ID and Event ID are required.");
    }

    const exists = await this.sellerEventGateway.findByEventAndSeller(
      input.sellerId,
      input.eventId
    );

    if (exists) {
      return { id: exists.id };
    }

    const sellerEvent = SellerEvent.create({
      sellerId: input.sellerId,
      eventId: input.eventId,
    });
    await this.sellerEventGateway.save(sellerEvent);
    this.socketServer?.emit("sellerEvent:created", { id: sellerEvent.id });

    const allSellersByEvent = await this.sellerEventGateway.listSellersByEvent(
      input.eventId
    );

    if (allSellersByEvent.length > 0 && allSellersByEvent[0].event)
      await this.updateSellersGoalService?.execute(allSellersByEvent[0]?.event);

    return { id: sellerEvent.id };
  }
}
