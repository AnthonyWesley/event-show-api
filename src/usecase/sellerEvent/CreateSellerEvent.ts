import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { SellerEvent } from "../../domain/entities/sellerEvent/SellerEvent";
import { SocketServer } from "../../infra/socket/SocketServer";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type CreateSellerEventInputDto = {
  sellerId: string;
  eventId: string;
};

export type CreateSellerEventOutputDto = {
  id: string;
};

export class CreateSellerEvent
  implements IUseCases<CreateSellerEventInputDto, CreateSellerEventOutputDto>
{
  private constructor(
    private readonly sellerEventGateway: ISellerEventGateway,
    private readonly socketServer?: SocketServer
  ) {}

  public static create(
    sellerEventGateway: ISellerEventGateway,
    socketServer?: SocketServer
  ) {
    return new CreateSellerEvent(sellerEventGateway, socketServer);
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

    const sellerEvent = SellerEvent.create(input.sellerId, input.eventId);

    await this.sellerEventGateway.save(sellerEvent);
    this.socketServer?.emit("sellerEvent:created", { id: sellerEvent.id });

    return { id: sellerEvent.id };
  }
}
