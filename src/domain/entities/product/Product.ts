import { generateId } from "../../../shared/utils/IdGenerator";

export type ProductProps = {
  id: string;
  name: string;
  price: number;
  photo?: string;
  photoPublicId?: string;
  companyId: string;
  createdAt: Date;
};

export class Product {
  private constructor(private readonly props: ProductProps) {}

  public static create(
    name: string,
    price: number,
    companyId: string,
    photo?: string
  ) {
    if (!name.trim()) {
      throw new Error("Product name is required.");
    }

    if (isNaN(price) || price < 0) {
      throw new Error(
        "Product price must be a positive number greater than zero."
      );
    }

    if (!companyId.trim()) {
      throw new Error("Company ID is required.");
    }

    return new Product({
      id: generateId(),
      name,
      price,
      photo,
      companyId,
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

  public get photo() {
    return this.props.photo;
  }

  public get photoPublicId() {
    return this.props.photoPublicId;
  }

  public get companyId() {
    return this.props.companyId;
  }

  public get createdAt() {
    return this.props.createdAt;
  }
}
