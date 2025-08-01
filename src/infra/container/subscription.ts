import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ServiceTokenService } from "../../service/ServiceTokenService";
import { CancelSubscription } from "../../usecase/subscription/CancelSubscription";
import { CreateSubscription } from "../../usecase/subscription/CreateSubscription";
import { GetSubscriptionByCompany } from "../../usecase/subscription/GetSubscriptionByCompany";
import { SubscriptionRepositoryPrisma } from "../repositories/subscription/SubscriptionRepositoryPrisma";

export function makeSubscriptionUseCases(
  subscriptionRepository: SubscriptionRepositoryPrisma,
  companyGateway: ICompanyGateway,
  serviceToken: ServiceTokenService
) {
  return {
    create: CreateSubscription.create(subscriptionRepository),
    cancel: CancelSubscription.create(subscriptionRepository),
    getByCompany: GetSubscriptionByCompany.create(
      subscriptionRepository,
      companyGateway,
      serviceToken
    ),
  };
}
