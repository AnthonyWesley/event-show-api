import { ISubscriptionGateway } from "../../domain/entities/subscription/ISubscriptionGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export class CancelSubscription {
  constructor(private readonly subscriptionGateway: ISubscriptionGateway) {}

  public static create(subscriptionGateway: ISubscriptionGateway) {
    return new CancelSubscription(subscriptionGateway);
  }

  public async execute(id: string): Promise<void> {
    const subscription = await this.subscriptionGateway.findById(id);

    if (!subscription) throw new NotFoundError("Subscription not found.");

    subscription.cancel();

    await this.subscriptionGateway.update(subscription);
  }
}
