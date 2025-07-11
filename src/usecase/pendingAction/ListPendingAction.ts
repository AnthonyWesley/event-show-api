import { ActionType, ActionStatus } from "@prisma/client";
import { IPendingActionGateway } from "../../domain/entities/pendingAction/IPendingActionGateway";
import { IUseCases } from "../IUseCases";

export type ListPendingActionInputDto = {
  companyId: string;
};

export type ListPendingActionOutputDto = {
  listPendingActions: {
    id: string;
    sellerId: string;
    eventId: string;
    targetId: string | null;
    payload: any;
    actionType: ActionType;
    createdAt: Date;
    status: ActionStatus;
  }[];
};

export class ListPendingAction
  implements IUseCases<ListPendingActionInputDto, ListPendingActionOutputDto>
{
  private constructor(
    private readonly pendingActionGateway: IPendingActionGateway
  ) {}

  public static create(pendingActionGateway: IPendingActionGateway) {
    return new ListPendingAction(pendingActionGateway);
  }

  async execute(
    input: ListPendingActionInputDto
  ): Promise<ListPendingActionOutputDto> {
    const pendingActions = await this.pendingActionGateway.findAllByCompanyId(
      input.companyId
    );

    const listPendingActions = pendingActions.map((action) => ({
      id: action.id,
      sellerId: action.sellerId,
      eventId: action.eventId,
      targetId: action.targetId,
      payload: action.payload,
      actionType: action.actionType,
      createdAt: action.createdAt,
      status: action.status,
    }));

    return { listPendingActions };
  }
}
