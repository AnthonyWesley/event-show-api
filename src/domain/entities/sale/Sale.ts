import { generateId } from "../../../shared/utils/IdGenerator";

export type SaleProps = {
  id: string;
  eventId: string;
  productId: string;
  sellerId: string;
  leadId: string;
  quantity: number;
  seller?: any;
  product?: any;
  lead?: any;
  createdAt: Date;
};

export class Sale {
  private constructor(private readonly props: SaleProps) {}

  public static create(props: Omit<SaleProps, "id" | "createdAt">): Sale {
    if (!props.eventId.trim()) {
      throw new Error("Event ID is required.");
    }

    if (!props.productId.trim()) {
      throw new Error("Product ID is required.");
    }

    if (!props.sellerId.trim()) {
      throw new Error("Seller ID is required.");
    }

    if (!Number.isInteger(props.quantity) || props.quantity <= 0) {
      throw new Error("Quantity must be a positive integer.");
    }
    return new Sale({ ...props, id: generateId(), createdAt: new Date() });
  }

  public static with(props: SaleProps) {
    return new Sale(props);
  }

  public get id() {
    return this.props.id;
  }

  public get eventId() {
    return this.props.eventId;
  }

  public get productId() {
    return this.props.productId;
  }

  public get sellerId() {
    return this.props.sellerId;
  }

  public get quantity() {
    return this.props.quantity;
  }
  public get product() {
    return this.props.product;
  }

  public get seller() {
    return this.props.seller;
  }

  public get leadId() {
    return this.props.leadId;
  }
  public get lead() {
    return this.props.lead;
  }

  public get createdAt() {
    return this.props.createdAt;
  }
}
