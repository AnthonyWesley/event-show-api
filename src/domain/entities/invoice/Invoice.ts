import { generateId } from "../../../shared/utils/IdGenerator";

export type InvoiceStatus = "PENDING" | "PAID" | "CANCELED" | "FAILED";

export const InvoiceStatus = {
  PENDING: "PENDING" as InvoiceStatus,
  PAID: "PAID" as InvoiceStatus,
  CANCELED: "CANCELED" as InvoiceStatus,
  FAILED: "FAILED" as InvoiceStatus,
};

export type InvoiceProps = {
  id: string;
  companyId: string;
  subscriptionId?: string | null;
  externalId: string;
  amount: number;
  dueDate: Date;
  paidAt?: Date | null;
  status: InvoiceStatus;
  createdAt: Date;
};

export class Invoice {
  private constructor(private readonly props: InvoiceProps) {}

  public static create(props: Omit<InvoiceProps, "id" | "createdAt">): Invoice {
    return new Invoice({
      ...props,
      id: generateId(),
      createdAt: new Date(),
    });
  }

  public static with(props: InvoiceProps): Invoice {
    return new Invoice(props);
  }

  public toResponse() {
    return {
      id: this.id,
      companyId: this.companyId,
      subscriptionId: this.subscriptionId,
      externalId: this.externalId,
      amount: this.amount,
      dueDate: this.dueDate,
      paidAt: this.paidAt,
      status: this.status,
      createdAt: this.createdAt,
    };
  }

  public setPaid() {
    this.props.status = "PAID";
    this.props.paidAt = new Date();
  }

  get id() {
    return this.props.id;
  }

  get companyId() {
    return this.props.companyId;
  }

  get subscriptionId() {
    return this.props.subscriptionId;
  }

  get externalId() {
    return this.props.externalId;
  }

  get amount() {
    return this.props.amount;
  }

  get dueDate() {
    return this.props.dueDate;
  }

  get paidAt() {
    return this.props.paidAt;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
