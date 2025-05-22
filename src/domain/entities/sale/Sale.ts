import { generateId } from "../../../shared/utils/IdGenerator";

export type SaleProps = {
  id: string;
  eventId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  seller?: any;
  product?: any;
  createdAt: Date;
};

export class Sale {
  private constructor(private readonly props: SaleProps) {}

  public static create(
    eventId: string,
    productId: string,
    sellerId: string,
    quantity: number

    // total: number
  ) {
    if (!eventId.trim()) {
      throw new Error("Event ID is required.");
    }

    if (!productId.trim()) {
      throw new Error("Product ID is required.");
    }

    if (!sellerId.trim()) {
      throw new Error("Seller ID is required.");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive integer.");
    }

    // if (isNaN(total) || total <= 0) {
    //   throw new Error("Total must be a positive number greater than zero.");
    // }

    return new Sale({
      id: generateId(),
      eventId,
      productId,
      sellerId,
      quantity,

      // total,
      createdAt: new Date(),
    });
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

  // public get total() {
  //   return this.props.total;
  // }

  public get createdAt() {
    return this.props.createdAt;
  }
}
