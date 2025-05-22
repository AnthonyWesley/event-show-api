import { IPendingActionGateway } from "../../domain/entities/pendingAction/IPendingActionGateway";
import { ISaleGateway } from "../../domain/entities/sale/ISaleGateway";
import { Sale } from "../../domain/entities/sale/Sale";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type ApproveOrRejectPendingActionInputDto = {
  pendingActionId: string;
  approve: boolean;
};
export type ApproveOrRejectPendingActionOutputDto = {
  pendingActionId: string;
  status: string;
};

export class ApproveOrRejectPendingAction
  implements
    IUseCases<
      ApproveOrRejectPendingActionInputDto,
      ApproveOrRejectPendingActionOutputDto
    >
{
  constructor(
    private readonly pendingGateway: IPendingActionGateway,
    private readonly saleGateway: ISaleGateway
  ) {}
  public static create(
    pendingGateway: IPendingActionGateway,
    saleGateway: ISaleGateway
  ) {
    return new ApproveOrRejectPendingAction(pendingGateway, saleGateway);
  }
  async execute(
    input: ApproveOrRejectPendingActionInputDto
  ): Promise<ApproveOrRejectPendingActionOutputDto> {
    const action = await this.pendingGateway.findById(input.pendingActionId);

    if (!action) throw new NotFoundError("Pending Action");

    if (!input?.approve) {
      await this.pendingGateway.update(input.pendingActionId, "REJECTED");
      return { pendingActionId: action.id, status: "Action rejected" };
    }

    const directionAction = {
      CREATE_SALE: () => {
        if (action?.actionType === "CREATE_SALE") {
          const aSale = Sale.create(
            action.payload.eventId,
            action.payload.productId,
            action.payload.sellerId,
            action.payload.quantity
          );
          this.saleGateway.save(aSale);
        }
      },
      UPDATE_SALE: () => {
        if (action?.actionType === "UPDATE_SALE") {
          if (!action.targetId) {
            throw new Error("Target ID is required to update a sale.");
          }

          this.saleGateway.update({
            saleId: action.targetId,
            quantity: action.payload.quantity,
            partnerId: action.partnerId,
            eventId: action.eventId,
          });
        }
      },

      DELETE_SALE: () => {
        if (action?.actionType === "DELETE_SALE") {
          if (!action.targetId) {
            throw new Error("Target ID is required to delete a sale.");
          }
          this.saleGateway.delete({
            saleId: action.targetId,
            partnerId: action.partnerId,
            eventId: action.eventId,
          });
        }
      },
    };

    const performAction = directionAction[action.actionType];
    if (!performAction) {
      throw new Error(`Unsupported action type: ${action.actionType}`);
    }

    await performAction();
    await this.pendingGateway.update(input.pendingActionId, "APPROVED");

    return { pendingActionId: action.id, status: "Action approved" };
  }
}
