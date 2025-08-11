import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { SellerEvent } from "../../domain/entities/sellerEvent/SellerEvent";
import { ISocketServer } from "../../infra/socket/ISocketServer";
import { SocketServer } from "../../infra/socket/SocketServer";
import { ValidationError } from "../../shared/errors/ValidationError";
import { GoalUtils } from "../../shared/utils/GoalUtils";
import { UpdateSellersGoalService } from "../event/UpdateSellersGoalService";
import { IUseCases } from "../IUseCases";

export type CreateSellerEventInputDto = {
  sellers: { sellerId: string }[];
  eventId: string;
  companyId: string;
};

export type CreateSellerEventOutputDto = {
  sellers: { sellerId: string }[];
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
    if (!input.sellers.length || !input.eventId) {
      throw new ValidationError("Seller ID and Event ID are required.");
    }

    const eventId = input.eventId;

    // 1. Inserir todos no banco
    for (const { sellerId } of input.sellers) {
      const exists = await this.sellerEventGateway.findByEventAndSeller(
        sellerId,
        eventId
      );

      if (!exists) {
        const sellerEvent = SellerEvent.create({ sellerId, eventId });
        await this.sellerEventGateway.save(sellerEvent);
        this.socketServer?.emit("sellerEvent:created", { id: sellerEvent.id });
      }
    }

    // 2. Buscar todos de uma vez
    const allSellersByEvent = await this.sellerEventGateway.listSellersByEvent(
      eventId
    );

    // 3. Atualizar metas só no final
    if (allSellersByEvent.length > 0 && allSellersByEvent[0].event) {
      await this.updateSellersGoalService?.execute(allSellersByEvent[0].event);
    }
    return { sellers: input.sellers };
  }
}
