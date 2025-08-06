import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type UpdateSellerEventGoalInputDto = {
  sellerId: string;
  companyId: string;
  eventId: string;
  goal: number;
};

export class UpdateSellerEventGoal {
  constructor(
    private readonly sellerEventGateway: ISellerEventGateway,
    private readonly eventGateway: IEventGateway
  ) {}

  static create(
    sellerEventGateway: ISellerEventGateway,
    eventGateway: IEventGateway
  ) {
    return new UpdateSellerEventGoal(sellerEventGateway, eventGateway);
  }
  async execute(input: UpdateSellerEventGoalInputDto): Promise<void> {
    const sellerEvent = await this.sellerEventGateway.findByEventAndSeller(
      input.sellerId,
      input.eventId
    );
    if (!sellerEvent) throw new NotFoundError("SellerEvent");

    const event = await this.eventGateway.findById({
      eventId: input.eventId,
      companyId: input.companyId,
    });
    if (!event) throw new NotFoundError("Event");

    await this.sellerEventGateway.updateById(
      sellerEvent.sellerId,
      sellerEvent.eventId,
      input.goal
    );

    if (event.goalMode === "auto") {
      await this.eventGateway.setIsSellerGoalCustom(event.id, "manual");
    }

    const allSellers = await this.sellerEventGateway.listSellersByEvent(
      event.id
    );
    const updatedTotalGoal = allSellers.reduce((acc, s) => acc + s.goal, 0);

    await this.eventGateway.update({
      eventId: event.id,
      companyId: event.companyId,
      goal: updatedTotalGoal,
      isActive: event.isActive,
    });
  }
}
