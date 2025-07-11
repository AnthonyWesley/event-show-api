import { Subscription } from "./Subscription";

export interface ISubscriptionGateway {
  save(subscription: Subscription): Promise<void>;
  findActiveByCompany(companyId: string): Promise<Subscription | null>;
  findById(id: string): Promise<Subscription | null>;
  update(subscription: Subscription): Promise<void>;
}
