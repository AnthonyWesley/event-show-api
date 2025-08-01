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
      companyId: pendingAction.companyId,
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

  async findAllByCompanyId(companyId: string): Promise<PendingAction[]> {
    try {
      const actions = await this.prisma.pendingAction.findMany({
        where: {
          companyId,
          status: "PENDING",
        },
      });

      return actions.map(this.toEntity);
    } catch (error: any) {
      throw new Error("Error finding Pending action: " + error.message);
    }
  }

  async findById(pendingActionId: string): Promise<PendingAction | null> {
    try {
      const raw = await this.prisma.pendingAction.findUnique({
        where: {
          id: pendingActionId,
        },
      });

      if (!raw) return null;

      return this.toEntity(raw);
    } catch (error: any) {
      throw new Error("Error finding Pending action by ID: " + error.message);
    }
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

      return this.toEntity(pendingAction);
    } catch (error: any) {
      throw new Error("Error updating Pending action: " + error.message);
    }
  }

  private toEntity(raw: any): PendingAction {
    return PendingAction.with({
      id: raw.id,
      companyId: raw.companyId,
      eventId: raw.eventId,
      sellerId: raw.sellerId,
      targetId: raw.targetId,
      payload: raw.payload,
      actionType: raw.actionType,
      status: raw.status,
      createdAt: raw.createdAt,
    });
  }
}
