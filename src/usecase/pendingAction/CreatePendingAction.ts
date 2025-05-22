import { IUseCases } from "../IUseCases";
import {
  ActionType,
  PendingAction,
} from "../../domain/entities/pendingAction/PendingAction";
import { IPendingActionGateway } from "../../domain/entities/pendingAction/IPendingActionGateway";

export type CreatePendingActionInputDto = {
  partnerId: string;
  eventId: string;
  sellerId: string;
  targetId: string;
  payload: any;
  actionType: ActionType;
};

export type CreatePendingActionOutputDto = {
  id: string;
};

export class CreatePendingAction
  implements
    IUseCases<CreatePendingActionInputDto, CreatePendingActionOutputDto>
{
  private constructor(
    private readonly pendingActionGateway: IPendingActionGateway
  ) {}

  public static create(pendingActionGateway: IPendingActionGateway) {
    return new CreatePendingAction(pendingActionGateway);
  }

  async execute(
    input: CreatePendingActionInputDto
  ): Promise<CreatePendingActionOutputDto> {
    const action = PendingAction.create(
      input.partnerId,
      input.eventId,
      input.sellerId,
      input.actionType,
      input.payload,
      input.targetId
    );
    await this.pendingActionGateway.save(action);
    return { id: action.id };
  }
}
