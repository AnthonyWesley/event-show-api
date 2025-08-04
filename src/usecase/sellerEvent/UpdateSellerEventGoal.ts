import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type UpdateSellerEventGoalInputDto = {
  sellerEventId: string;
  companyId: string;
  eventId: string;
  newGoal: number;
};

export class UpdateSellerEventGoal {
  constructor(
    private readonly sellerEventGateway: ISellerEventGateway,
    private readonly eventGateway: IEventGateway
  ) {}

  async execute(input: UpdateSellerEventGoalInputDto): Promise<void> {
    const sellerEvent = await this.sellerEventGateway.findByEventAndSeller(
      input.sellerEventId,
      input.eventId
    );
    if (!sellerEvent) {
      throw new NotFoundError("SellerEvent");
    }

    const event = await this.eventGateway.findById({
      eventId: input.eventId,
      companyId: input.companyId,
    });
    if (!event) {
      throw new NotFoundError("Event");
    }

    // Atualiza a meta individual do vendedor
    await this.sellerEventGateway.updateById(
      input.sellerEventId,
      input.newGoal
    );

    // Marca o evento como customizado
    if (!event.isSellerGoalCustom) {
      await this.eventGateway.setIsSellerGoalCustom(event.id, true);
    }
  }
}
