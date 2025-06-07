import { ApproveOrRejectPendingAction } from "../../usecase/pendingAction/ApproveOrRejectPendingAction ";
import { CreatePendingAction } from "../../usecase/pendingAction/CreatePendingAction";
import { ListPendingAction } from "../../usecase/pendingAction/ListPendingAction";
import { saleRepository } from "../Container";
import { PendingActionRepositoryPrisma } from "../repositories/pendingAction/PendingActionRepositoryPrisma";

export function makePendingActionUseCases(
  pendingActionRepository: PendingActionRepositoryPrisma
) {
  return {
    create: CreatePendingAction.create(pendingActionRepository),
    list: ListPendingAction.create(pendingActionRepository),
    approveOrReject: ApproveOrRejectPendingAction.create(
      pendingActionRepository,
      saleRepository
    ),
  };
}
