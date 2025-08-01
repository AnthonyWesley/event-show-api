import { generateId } from "../../../shared/utils/IdGenerator";

export type LeadProps = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  leadSourceId: string | undefined;
  sellerId?: string | undefined;
  eventId: string;
  companyId: string;
  products: { id: string; name: string }[];
  sales?: { id: string; name: string }[];
  event?: { id: string; name: string };
  seller?: { id: string; name: string };
  leadSource?: { id: string; name: string };
  customInterest?: string;
  notes?: string;
  convertedAt?: Date;
  createdAt: Date;
};

export class Lead {
  private constructor(private props: LeadProps) {}

  public static create(props: Omit<LeadProps, "id" | "createdAt">): Lead {
    if (!props.name.trim()) throw new Error("Lead name is required.");

    return new Lead({
      ...props,
      id: generateId(),
      phone: Lead.normalizePhone(props.phone),
      createdAt: new Date(),
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

  public get sales() {
    return this.props.sales;
  }
  public get products() {
    return this.props.products;
  }
  public get event() {
    return this.props.event;
  }
  public get seller() {
    return this.props.seller;
  }

  public get leadSource() {
    return this.props.leadSource;
  }

  public get customInterest() {
    return this.props.customInterest;
  }

  public get notes() {
    return this.props.notes;
  }

  public get leadSourceId() {
    return this.props.leadSourceId;
  }

  public get sellerId() {
    return this.props.sellerId;
  }

  public get eventId() {
    return this.props.eventId;
  }

  public get companyId() {
    return this.props.companyId;
  }

  public get convertedAt() {
    return this.props.convertedAt;
  }
  public get createdAt() {
    return this.props.createdAt;
  }
}
