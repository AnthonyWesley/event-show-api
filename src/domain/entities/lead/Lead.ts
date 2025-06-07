import { generateId } from "../../../shared/utils/IdGenerator";
import { ProductProps } from "../product/Product";

export type LeadProps = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  products?: { id: string }[];
  customInterest?: string;
  notes?: string;
  source: string;
  eventId: string;
  partnerId: string;
  createdAt: Date;
};

export class Lead {
  private constructor(private props: LeadProps) {}

  public static create(
    name: string,
    products: { id: string }[],
    source: string,
    eventId: string,
    partnerId: string,
    email?: string,
    phone?: string,
    customInterest?: string,
    notes?: string
  ) {
    if (!name.trim()) {
      throw new Error("Lead name is required.");
    }

    if (!source.trim()) {
      throw new Error("Lead source is required.");
    }

    const createdAt = new Date();

    return new Lead({
      id: generateId(),
      name,
      email,
      phone: Lead.normalizePhone(phone),
      products,
      customInterest,
      notes,
      source,
      eventId,
      partnerId,
      createdAt,
    });
  }

  public static with(props: LeadProps) {
    return new Lead({
      ...props,
      phone: Lead.normalizePhone(props.phone ?? ""),
    });
  }

  private static normalizePhone(phone?: string): string | undefined {
    return phone?.replace(/\D/g, "");
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

  public get products() {
    return this.props.products;
  }

  public get customInterest() {
    return this.props.customInterest;
  }

  public get notes() {
    return this.props.notes;
  }

  public get source() {
    return this.props.source;
  }

  public get eventId() {
    return this.props.eventId;
  }

  public get partnerId() {
    return this.props.partnerId;
  }

  public get createdAt() {
    return this.props.createdAt;
  }
}
