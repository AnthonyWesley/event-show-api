import { generateId } from "../../../shared/utils/IdGenerator";
import { SaleProps } from "../sale/Sale";

export type SellerProps = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  partnerId: string;
  sales?: SaleProps[];
  createdAt: Date;
};

export class Seller {
  private constructor(private readonly props: SellerProps) {}

  public static create(
    name: string,
    email: string,
    partnerId: string,
    phone?: string,
    photo?: string
  ) {
    if (!name.trim()) {
      throw new Error("Seller name is required.");
    }

    if (!Seller.isValidEmail(email)) {
      throw new Error("Invalid email format.");
    }

    if (!partnerId.trim()) {
      throw new Error("Event ID is required.");
    }

    const normalizedPhone = Seller.normalizePhone(phone ?? "");

    return new Seller({
      id: generateId(),
      name,
      email: email.trim().toLowerCase(),
      partnerId,
      phone: normalizedPhone,
      photo,
      sales: [],
      createdAt: new Date(),
    });
  }

  public static with(props: SellerProps) {
    return new Seller(props);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static normalizePhone(phone: string): string {
    return phone.replace(/\D/g, ""); // remove tudo que não é número
  }

  private static isValidPhone(phone: string): boolean {
    // Esperado: DDD (2 dígitos) + número (8 ou 9 dígitos)
    const phoneRegex = /^(\d{10}|\d{11})$/;
    return phoneRegex.test(phone);
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get email() {
    return this.props.email;
  }

  public get phone() {
    return this.props.phone;
  }

  public get photo() {
    return this.props.photo;
  }

  public get partnerId() {
    return this.props.partnerId;
  }
  public get sales() {
    return this.props.sales;
  }

  public get createdAt() {
    return this.props.createdAt;
  }
}
