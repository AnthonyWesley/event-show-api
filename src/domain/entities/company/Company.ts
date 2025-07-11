import { generateId } from "../../../shared/utils/IdGenerator";
import { addDays } from "date-fns";
import { EventProps } from "../event/Event";
import { ProductProps } from "../product/Product";
import { SellerProps } from "../seller/Seller";
import { UserProps } from "../user/User";
import { Validator } from "../../../helpers/Validator";

export type PlanType = "TEST" | "BASIC" | "PREMIUM";
export type StatusType = "ACTIVE" | "SUSPENDED";

export const PlanType = {
  TEST: "TEST" as PlanType,
  BASIC: "BASIC" as PlanType,
  PREMIUM: "PREMIUM" as PlanType,
} as const;

export const StatusType = {
  ACTIVE: "ACTIVE" as StatusType,
  SUSPENDED: "SUSPENDED" as StatusType,
} as const;

export type CompanyProps = {
  id: string;
  name: string;
  cnpj?: string;
  ie?: string;
  phone?: string;
  email?: string;
  responsibleName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  segment?: string;
  notes?: string;

  photo?: string;
  photoPublicId?: string;

  plan: PlanType;
  status: StatusType;
  accessExpiresAt: Date;
  createdAt: Date;

  products?: ProductProps[];
  events?: EventProps[];
  sellers?: SellerProps[];
  users?: UserProps[];
};

export class Company {
  private constructor(private readonly props: CompanyProps) {}

  public static create(
    name: string,
    email: string,
    plan: PlanType = "TEST",
    phone?: string,
    cnpj?: string,
    ie?: string,
    responsibleName?: string,
    address?: string,
    city?: string,
    state?: string,
    zipCode?: string,
    website?: string,
    segment?: string,
    notes?: string,
    photo?: string,
    photoPublicId?: string
  ): Company {
    if (!name.trim()) {
      throw new Error("Company name is required.");
    }

    const normalizedPhone = phone ? Validator.normalizePhone(phone) : undefined;
    const normalizedCNPJ = cnpj ? Validator.normalizeCNPJ(cnpj) : undefined;

    if (normalizedPhone && !Validator.isValidPhone(normalizedPhone)) {
      throw new Error("Invalid phone number.");
    }

    const createdAt = new Date();
    const accessExpiresAt = addDays(createdAt, 30);

    return new Company({
      id: generateId(),
      name,
      email: email.trim().toLowerCase(),
      phone: normalizedPhone,
      cnpj: normalizedCNPJ,
      ie,
      responsibleName,
      address,
      city,
      state,
      zipCode,
      website,
      segment,
      notes,
      photo,
      photoPublicId,
      plan,
      status: "ACTIVE",
      accessExpiresAt,
      createdAt,
      users: [],
      events: [],
      products: [],
      sellers: [],
    });
  }

  public static with(props: CompanyProps): Company {
    return new Company({
      ...props,
      phone: props.phone ? Validator.normalizePhone(props.phone) : undefined,
      email: props.email?.trim().toLowerCase(),
      cnpj: props.cnpj ? Validator.normalizeCNPJ(props.cnpj) : undefined,
    });
  }

  public toResponse() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      plan: this.plan,
      status: this.status,
      accessExpiresAt: this.accessExpiresAt,
      createdAt: this.createdAt,
      maxConcurrentEvents: this.maxConcurrentEvents,
    };
  }

  public updatePlan(newPlan: PlanType) {
    if (!["TEST", "BASIC", "PREMIUM"].includes(newPlan)) {
      throw new Error("Invalid plan type.");
    }

    this.props.plan = newPlan;
    this.props.accessExpiresAt = addDays(new Date(), 30);
  }

  // Getters
  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get cnpj() {
    return this.props.cnpj;
  }
  get ie() {
    return this.props.ie;
  }
  get phone() {
    return this.props.phone;
  }
  get email() {
    return this.props.email;
  }
  get responsibleName() {
    return this.props.responsibleName;
  }
  get address() {
    return this.props.address;
  }
  get city() {
    return this.props.city;
  }
  get state() {
    return this.props.state;
  }
  get zipCode() {
    return this.props.zipCode;
  }
  get website() {
    return this.props.website;
  }
  get segment() {
    return this.props.segment;
  }
  get notes() {
    return this.props.notes;
  }
  get photo() {
    return this.props.photo;
  }
  get photoPublicId() {
    return this.props.photoPublicId;
  }
  get plan() {
    return this.props.plan;
  }
  get status() {
    return this.props.status;
  }
  get accessExpiresAt() {
    return this.props.accessExpiresAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get products() {
    return this.props.products;
  }
  get events() {
    return this.props.events;
  }
  get sellers() {
    return this.props.sellers;
  }
  get users() {
    return this.props.users;
  }

  get maxConcurrentEvents(): number {
    switch (this.props.plan) {
      case "PREMIUM":
        return 5;
      default:
        return 1;
    }
  }
}
