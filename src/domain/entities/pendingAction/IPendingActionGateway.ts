import { ActionStatus, PendingAction } from "./PendingAction";

export interface IPendingActionGateway {
  save(pendingAction: PendingAction): Promise<void>;
  findAllByPartnerId(partnerId: string): Promise<PendingAction[]>;
  findById(pendingActionId: string): Promise<PendingAction | null>;
  update(
    pendingActionId: string,
    status: ActionStatus
  ): Promise<PendingAction | null>;
}
