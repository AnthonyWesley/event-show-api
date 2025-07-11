import { Plan } from "@prisma/client";
import { generateId } from "../../../shared/utils/IdGenerator";
import { InvoiceProps } from "../invoice/Invoice";

export type SubscriptionStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "CANCELED"
  | "PAST_DUE";

export const SubscriptionStatus = {
  ACTIVE: "ACTIVE" as SubscriptionStatus,
  INACTIVE: "INACTIVE" as SubscriptionStatus,
  CANCELED: "CANCELED" as SubscriptionStatus,
  PAST_DUE: "PAST_DUE" as SubscriptionStatus,
};

export type SubscriptionProps = {
  id: string;
  companyId: string;
  externalId: string;
  plan: Plan;
  status: SubscriptionStatus;
  startedAt: Date;
  expiresAt?: Date | null;
  canceledAt?: Date | null;
  createdAt: Date;
  invoices?: InvoiceProps[];
};

export class Subscription {
  private constructor(private readonly props: SubscriptionProps) {}

  public static create(
    props: Omit<SubscriptionProps, "id" | "createdAt">
  ): Subscription {
    return new Subscription({
      ...props,
      id: generateId(),
      createdAt: new Date(),
    });
  }

  public static with(props: SubscriptionProps): Subscription {
    return new Subscription(props);
  }

  public toResponse() {
    return {
      id: this.id,
      companyId: this.companyId,
      externalId: this.externalId,
      plan: this.plan,
      status: this.status,
      startedAt: this.startedAt,
      expiresAt: this.expiresAt,
      canceledAt: this.canceledAt,
      createdAt: this.createdAt,
    };
  }

  public cancel() {
    if (this.props.status !== "ACTIVE") {
      throw new Error("Only active subscriptions can be cancelled.");
    }

    this.props.status = "CANCELED";
    this.props.canceledAt = new Date();
  }

  // Getters
  get id() {
    return this.props.id;
  }

  get companyId() {
    return this.props.companyId;
  }

  get externalId() {
    return this.props.externalId;
  }

  get plan() {
    return this.props.plan;
  }

  get status() {
    return this.props.status;
  }

  get startedAt() {
    return this.props.startedAt;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get canceledAt() {
    return this.props.canceledAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
