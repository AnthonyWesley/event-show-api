import { PrismaClient } from "@prisma/client";
import { ISubscriptionGateway } from "../../../domain/entities/subscription/ISubscriptionGateway";
import { Subscription } from "../../../domain/entities/subscription/Subscription";
import { ObjectHelper } from "../../../shared/utils/ObjectHelper";

export class SubscriptionRepositoryPrisma implements ISubscriptionGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new SubscriptionRepositoryPrisma(prisma);
  }

  async findActiveByCompany(companyId: string): Promise<Subscription | null> {
    try {
      const data = await this.prisma.subscription.findFirst({
        where: {
          companyId,
          status: "ACTIVE",
        },
      });
      return data ? this.toEntity(data) : null;
    } catch (error: any) {
      throw new Error("Error finding active subscription: " + error.message);
    }
  }

  async findById(id: string): Promise<Subscription | null> {
    try {
      const data = await this.prisma.subscription.findUnique({ where: { id } });
      return data ? this.toEntity(data) : null;
    } catch (error: any) {
      throw new Error("Error finding subscription by id: " + error.message);
    }
  }

  async update(subscription: Subscription): Promise<void> {
    try {
      const data = subscription.toResponse();
      const updateData = ObjectHelper.removeUndefinedFields({
        status: data.status,
        canceledAt: data.canceledAt,
        expiresAt: data.expiresAt,
      });

      await this.prisma.subscription.update({
        where: { id: data.id },
        data: updateData,
      });
    } catch (error: any) {
      throw new Error("Error updating subscription: " + error.message);
    }
  }

  async save(subscription: Subscription): Promise<void> {
    try {
      const data = subscription.toResponse();

      await this.prisma.subscription.create({
        data: {
          id: data.id,
          companyId: data.companyId,
          externalId: data.externalId,
          planId: data.planId,
          status: data.status,
          startedAt: data.startedAt,
          expiresAt: data.expiresAt,
          canceledAt: data.canceledAt,
          createdAt: data.createdAt,
        },
      });
    } catch (error: any) {
      throw new Error("Error saving subscription: " + error.message);
    }
  }

  private toEntity(data: any): Subscription {
    return Subscription.with({
      id: data.id,
      companyId: data.companyId,
      externalId: data.externalId,
      planId: data.planId,
      status: data.status,
      startedAt: data.startedAt,
      expiresAt: data.expiresAt,
      canceledAt: data.canceledAt,
      createdAt: data.createdAt,
    });
  }
}
