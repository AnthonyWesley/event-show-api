import { IPendingActionGateway } from "../../domain/entities/pendingAction/IPendingActionGateway";
import { ISaleGateway } from "../../domain/entities/sale/ISaleGateway";
import { Sale } from "../../domain/entities/sale/Sale";
import { SocketServer } from "../../infra/socket/SocketServer";
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
    private readonly saleGateway: ISaleGateway,
    private readonly socketServer?: SocketServer
  ) {}
  public static create(
    pendingGateway: IPendingActionGateway,
    saleGateway: ISaleGateway,
    socketServer?: SocketServer
  ) {
    return new ApproveOrRejectPendingAction(
      pendingGateway,
      saleGateway,
      socketServer
    );
  }
  async execute(
    input: ApproveOrRejectPendingActionInputDto
  ): Promise<ApproveOrRejectPendingActionOutputDto> {
    const action = await this.pendingGateway.findById(input.pendingActionId);

    if (!action) throw new NotFoundError("Pending Action");

    if (!input.approve) {
      await this.pendingGateway.update(input.pendingActionId, "REJECTED");
      return { pendingActionId: action.id, status: "Action rejected" };
    }

    const directionAction = {
      CREATE_SALE: async () => {
        const payload = action.payload;
        const leadWithCompanyId = {
          ...payload.lead,
          companyId: action.companyId,
        };

        const sale = Sale.create({
          eventId: payload.eventId,
          productId: payload.productId,
          sellerId: payload.sellerId,
          quantity: payload.quantity,
          leadId: payload.lead?.id,
        });

        await this.saleGateway.save(sale, leadWithCompanyId);
      },

      UPDATE_SALE: async () => {
        if (!action.targetId) {
          throw new Error("Target ID is required to update a sale.");
        }

        await this.saleGateway.update({
          saleId: action.targetId,
          quantity: action.payload.quantity,
          companyId: action.companyId,
          eventId: action.eventId,
        });
      },

      DELETE_SALE: async () => {
        if (!action.targetId) {
          throw new Error("Target ID is required to delete a sale.");
        }

        await this.saleGateway.delete({
          saleId: action.targetId,
          companyId: action.companyId,
          eventId: action.eventId,
        });
      },
    };

    const performAction = directionAction[action.actionType];

    if (!performAction) {
      throw new Error(`Unsupported action type: ${action.actionType}`);
    }

    await performAction();

    await this.pendingGateway.update(input.pendingActionId, "APPROVED");

    await this.socketServer?.emit("sale:created", { id: input.approve });

    return { pendingActionId: action.id, status: "Action approved" };
  }
}
