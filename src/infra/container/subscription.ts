import { CancelSubscription } from "../../usecase/subscription/CancelSubscription";
import { CreateSubscription } from "../../usecase/subscription/CreateSubscription";
import { GetSubscriptionByCompany } from "../../usecase/subscription/GetSubscriptionByCompany";
import { SubscriptionRepositoryPrisma } from "../repositories/subscription/SubscriptionRepositoryPrisma";

export function makeSubscriptionUseCases(
  subscriptionRepository: SubscriptionRepositoryPrisma
) {
  return {
    create: CreateSubscription.create(subscriptionRepository),
    cancel: CancelSubscription.create(subscriptionRepository),
    getByCompany: GetSubscriptionByCompany.create(subscriptionRepository),
  };
}
