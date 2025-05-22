import { ActionStatus, PrismaClient } from "@prisma/client";
import { PendingAction } from "../../../domain/entities/pendingAction/PendingAction";
import { IPendingActionGateway } from "../../../domain/entities/pendingAction/IPendingActionGateway";

export class PendingActionRepositoryPrisma implements IPendingActionGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new PendingActionRepositoryPrisma(prisma);
  }

  async save(pendingAction: PendingAction): Promise<void> {
    const data = {
      id: pendingAction.id,
      partnerId: pendingAction.partnerId,
      eventId: pendingAction.eventId,
      sellerId: pendingAction.sellerId,
      actionType: pendingAction.actionType,
      payload: pendingAction.payload,
      targetId: pendingAction.targetId,
      createdAt: pendingAction.createdAt,
    };
    try {
      await this.prisma.pendingAction.create({ data });
    } catch (error: any) {
      throw new Error("Error saving Pending action: " + error.message);
    }
  }

  async findAllByPartnerId(partnerId: string): Promise<PendingAction[]> {
    try {
      const actions = await this.prisma.pendingAction.findMany({
        where: {
          partnerId: partnerId,
          status: "PENDING",
        },
      });

      return actions.map((action) => {
        return PendingAction.with({
          id: action.id,
          partnerId: action.partnerId,
          eventId: action.eventId,
          sellerId: action.sellerId,
          targetId: action.targetId,
          payload: action.payload,
          actionType: action.actionType,
          status: action.status,
          createdAt: action.createdAt,
        });
      });
    } catch (error: any) {
      throw new Error("Error finding Pending action: " + error.message);
    }
  }

  async findById(pendingActionId: string): Promise<PendingAction | null> {
    const aPendingAction = await this.prisma.pendingAction.findUnique({
      where: {
        id: pendingActionId,
      },
    });

    if (!aPendingAction) return null;

    return PendingAction.with({
      id: aPendingAction.id,
      partnerId: aPendingAction.partnerId,
      eventId: aPendingAction.eventId,
      sellerId: aPendingAction.sellerId,
      targetId: aPendingAction.targetId,
      payload: aPendingAction.payload,
      actionType: aPendingAction.actionType,
      status: aPendingAction.status,
      createdAt: aPendingAction.createdAt,
    });
  }

  async update(
    pendingActionId: string,
    status: ActionStatus
  ): Promise<PendingAction | null> {
    try {
      const aPendingAction = await this.findById(pendingActionId);

      if (!aPendingAction) return null;

      const pendingAction = await this.prisma.pendingAction.update({
        where: {
          id: pendingActionId,
        },
        data: {
          status,
        },
      });

      return PendingAction.with({
        id: pendingAction.id,
        partnerId: pendingAction.partnerId,
        eventId: pendingAction.eventId,
        sellerId: pendingAction.sellerId,
        targetId: pendingAction.targetId,
        payload: pendingAction.payload,
        actionType: pendingAction.actionType,
        status: pendingAction.status,
        createdAt: pendingAction.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error updating Pending action: " + error.message);
    }
  }
}
