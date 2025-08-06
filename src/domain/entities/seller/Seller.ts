import { generateId } from "../../../shared/utils/IdGenerator";
import { LeadProps } from "../lead/Lead";
import { SaleProps } from "../sale/Sale";

export type SellerProps = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  photoPublicId?: string;
  companyId: string;
  sales?: SaleProps[];
  leads?: LeadProps[];
  createdAt: Date;
};

export class Seller {
  private constructor(private readonly props: SellerProps) {}

  public static create(
    name: string,
    email: string,
    companyId: string,
    phone?: string,
    photo?: string
  ) {
    if (!name.trim()) {
      throw new Error("Seller name is required.");
    }

    if (!Seller.isValidEmail(email)) {
      throw new Error("Invalid email format.");
    }

    if (!companyId.trim()) {
      throw new Error("Event ID is required.");
    }

    const normalizedPhone = Seller.normalizePhone(phone ?? "");

    return new Seller({
      id: generateId(),
      name,
      email: email.trim().toLowerCase(),
      companyId,
      phone: normalizedPhone,
      photo,
      sales: [],
      leads: [],
      createdAt: new Date(),
    });
  }
  public static with(props: SellerProps) {
    return new Seller({
      ...props,
      email: props.email.trim().toLowerCase(),
      phone: Seller.normalizePhone(props.phone ?? ""),
    });
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

  public get photoPublicId() {
    return this.props.photoPublicId;
  }

  public get companyId() {
    return this.props.companyId;
  }
  public get sales() {
    return this.props.sales;
  }
  public get leads() {
    return this.props.leads;
  }

  public get createdAt() {
    return this.props.createdAt;
  }
}
