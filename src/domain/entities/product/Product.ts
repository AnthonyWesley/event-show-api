import { generateId } from "../../../shared/utils/IdGenerator";

export type ProductProps = {
  id: string;
  name: string;
  price: number;
  partnerId: string;
  createdAt: Date;
};

export class Product {
  private constructor(private readonly props: ProductProps) {}

  public static create(name: string, price: number, partnerId: string) {
    if (!name.trim()) {
      throw new Error("Product name is required.");
    }

    if (isNaN(price) || price <= 0) {
      throw new Error(
        "Product price must be a positive number greater than zero."
      );
    }

    if (!partnerId.trim()) {
      throw new Error("Partner ID is required.");
    }

    return new Product({
      id: generateId(),
      name,
      price,
      partnerId,
      createdAt: new Date(),
    });
  }

  public static with(props: ProductProps) {
    return new Product(props);
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get price() {
    return this.props.price;
  }

  public get partnerId() {
    return this.props.partnerId;
  }

  public get createdAt() {
    return this.props.createdAt;
  }
}
