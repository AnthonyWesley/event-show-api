import { ApproveOrRejectPendingAction } from "../../usecase/pendingAction/ApproveOrRejectPendingAction ";
import { CreatePendingAction } from "../../usecase/pendingAction/CreatePendingAction";
import { ListPendingAction } from "../../usecase/pendingAction/ListPendingAction";
import { makeUseCases } from "../Container";
import { PendingActionRepositoryPrisma } from "../repositories/pendingAction/PendingActionRepositoryPrisma";
import { SaleRepositoryPrisma } from "../repositories/sale/SaleRepositoryPrisma";
import { SocketServer } from "../socket/SocketServer";

export function makePendingActionUseCases(
  pendingActionRepository: PendingActionRepositoryPrisma,
  saleRepository: SaleRepositoryPrisma,
  socketServer?: SocketServer
) {
  return {
    create: CreatePendingAction.create(pendingActionRepository, socketServer),
    list: ListPendingAction.create(pendingActionRepository),
    approveOrReject: ApproveOrRejectPendingAction.create(
      pendingActionRepository,
      saleRepository
    ),
  };
}
