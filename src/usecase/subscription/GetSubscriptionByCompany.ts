import { ISubscriptionGateway } from "../../domain/entities/subscription/ISubscriptionGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export class GetSubscriptionByCompany {
  constructor(private readonly subscriptionGateway: ISubscriptionGateway) {}

  public static create(subscriptionGateway: ISubscriptionGateway) {
    return new GetSubscriptionByCompany(subscriptionGateway);
  }

  public async execute(companyId: string) {
    const subscription = await this.subscriptionGateway.findActiveByCompany(
      companyId
    );

    if (!subscription)
      throw new NotFoundError("Active subscription not found.");

    return subscription.toResponse();
  }
}
