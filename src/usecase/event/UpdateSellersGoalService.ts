import { EventProps } from "../../domain/entities/event/Event";
import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { GoalUtils } from "../../shared/utils/GoalUtils";

export class UpdateSellersGoalService {
  constructor(private readonly sellerEventGateway: ISellerEventGateway) {}

  async execute(
    event: Partial<Pick<EventProps, "id" | "goal" | "goalMode">>
  ): Promise<void> {
    if (!event.id) {
      throw new Error("Event ID is required to update seller goals.");
    }

    if (typeof event.goal !== "number") {
      throw new Error("Event goal must be a number to update seller goals.");
    }

    // ⛔️ Pula atualização se as metas forem manuais
    if (event.goalMode === "manual") {
      console.warn(
        `Skipping seller goal update: Event ${event.id} has custom seller goals`
      );
      return;
    }

    const allSellers = await this.sellerEventGateway.listSellersByEvent(
      event.id
    );
    if (!allSellers.length) return;

    const individualGoal = GoalUtils.calculateIndividualSellerGoal(
      allSellers,
      event.goal
    );

    await Promise.all(
      allSellers.map((sellerEvent) =>
        this.sellerEventGateway.updateById(
          sellerEvent.sellerId, // correto: usar ID do SellerEvent
          sellerEvent.eventId,
          individualGoal
        )
      )
    );
  }
}
