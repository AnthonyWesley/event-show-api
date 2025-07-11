import { Plan, SubscriptionStatus } from "@prisma/client";
import { ISubscriptionGateway } from "../../domain/entities/subscription/ISubscriptionGateway";
import { Subscription } from "../../domain/entities/subscription/Subscription";
import { ValidationError } from "../../shared/errors/ValidationError";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

export type CreateSubscriptionInputDto = {
  companyId: string;
  externalId: string;
  plan: Plan;
  startedAt: Date;
  expiresAt?: Date;
};

export type CreateSubscriptionOutputDto = {
  id: string;
};

export class CreateSubscription {
  private constructor(
    private readonly subscriptionGateway: ISubscriptionGateway
  ) {}

  public static create(subscriptionGateway: ISubscriptionGateway) {
    return new CreateSubscription(subscriptionGateway);
  }

  public async execute(
    input: CreateSubscriptionInputDto
  ): Promise<CreateSubscriptionOutputDto> {
    if (
      !input.companyId ||
      !input.externalId ||
      !input.plan ||
      !input.startedAt
    ) {
      throw new ValidationError("Missing required subscription fields.");
    }

    const active = await this.subscriptionGateway.findActiveByCompany(
      input.companyId
    );
    if (active) {
      throw new ValidationError("Company already has an active subscription.");
    }

    const subscription = Subscription.create({
      companyId: input.companyId,
      externalId: input.externalId,
      plan: input.plan,
      status: SubscriptionStatus.ACTIVE,
      startedAt: input.startedAt,
      expiresAt: input.expiresAt,
      canceledAt: null,
    });

    await this.subscriptionGateway.save(subscription);

    return { id: subscription.id };
  }
}
