// CreatePendingAction.ts
import { IUseCases } from "../IUseCases";
import {
  ActionType,
  PendingAction,
} from "../../domain/entities/pendingAction/PendingAction";
import { IPendingActionGateway } from "../../domain/entities/pendingAction/IPendingActionGateway";
import { SocketServer } from "../../infra/socket/SocketServer";

export type CreatePendingActionInputDto = {
  companyId: string;
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
    private readonly pendingActionGateway: IPendingActionGateway,
    private readonly socketServer?: SocketServer
  ) {}

  public static create(
    pendingActionGateway: IPendingActionGateway,
    socketServer?: SocketServer
  ) {
    return new CreatePendingAction(pendingActionGateway, socketServer);
  }

  async execute(
    input: CreatePendingActionInputDto
  ): Promise<CreatePendingActionOutputDto> {
    const action = PendingAction.create(
      input.companyId,
      input.eventId,
      input.sellerId,
      input.actionType,
      input.payload,
      input.targetId
    );

    await this.pendingActionGateway.save(action);

    this.socketServer?.emitPendingCreated({
      id: action.id,
      companyId: input.companyId,
      eventId: input.eventId,
      sellerId: input.sellerId,
      targetId: input.targetId,
      actionType: input.actionType,
      payload: input.payload,
      createdAt: action.createdAt,
    });

    return { id: action.id };
  }
}
