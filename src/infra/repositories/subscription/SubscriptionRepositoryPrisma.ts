import { PrismaClient } from "@prisma/client";
import { ISubscriptionGateway } from "../../../domain/entities/subscription/ISubscriptionGateway";
import { Subscription } from "../../../domain/entities/subscription/Subscription";

export class SubscriptionRepositoryPrisma implements ISubscriptionGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new SubscriptionRepositoryPrisma(prisma);
  }

  async findActiveByCompany(companyId: string): Promise<Subscription | null> {
    const data = await this.prisma.subscription.findFirst({
      where: {
        companyId,
        status: "ACTIVE",
      },
    });

    return data ? Subscription.with(data) : null;
  }

  async findById(id: string): Promise<Subscription | null> {
    const data = await this.prisma.subscription.findUnique({ where: { id } });
    return data ? Subscription.with(data) : null;
  }

  async update(subscription: Subscription): Promise<void> {
    const data = subscription.toResponse();

    await this.prisma.subscription.update({
      where: { id: data.id },
      data: {
        status: data.status,
        canceledAt: data.canceledAt,
        expiresAt: data.expiresAt,
      },
    });
  }

  async save(subscription: Subscription): Promise<void> {
    const data = subscription.toResponse();

    await this.prisma.subscription.create({
      data: {
        id: data.id,
        companyId: data.companyId,
        externalId: data.externalId,
        plan: data.plan,
        status: data.status,
        startedAt: data.startedAt,
        expiresAt: data.expiresAt,
        canceledAt: data.canceledAt,
        createdAt: data.createdAt,
      },
    });
  }
}
