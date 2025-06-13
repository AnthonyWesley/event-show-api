import { generateId } from "../../../shared/utils/IdGenerator";
import { addDays } from "date-fns";
import { EventProps } from "../event/Event";
import bcrypt from "bcryptjs";
import { ProductProps } from "../product/Product";
import { SellerProps } from "../seller/Seller";

export type PlanType = "FREE" | "BASIC" | "PREMIUM";
export type StatusType = "ACTIVE" | "SUSPENDED";

export const PlanType = {
  FREE: "FREE" as PlanType,
  BASIC: "BASIC" as PlanType,
  PREMIUM: "PREMIUM" as PlanType,
} as const;

export const StatusType = {
  ACTIVE: "ACTIVE" as StatusType,
  SUSPENDED: "SUSPENDED" as StatusType,
  TRIAL_EXPIRED: "TRIAL_EXPIRED" as StatusType,
} as const;

export type PartnerProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  plan: PlanType;
  status: StatusType;
  refreshToken?: string;
  products?: ProductProps[];
  events?: EventProps[];
  sellers?: SellerProps[];
  accessExpiresAt: Date;
  createdAt: Date;
};

export class Partner {
  private constructor(private readonly props: PartnerProps) {}

  public static async create(
    name: string,
    email: string,
    password: string,
    phone: string,
    plan: PlanType
  ) {
    if (!name.trim()) {
      throw new Error("Partner name is required.");
    }

    if (!Partner.isValidEmail(email)) {
      throw new Error("Invalid email format.");
    }

    if (!Partner.isValidPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
      );
    }

    const normalizedPhone = Partner.normalizePhone(phone);

    if (!Partner.isValidPhone(normalizedPhone)) {
      throw new Error("Invalid phone number.");
    }

    if (!["FREE", "BASIC", "PREMIUM"].includes(plan)) {
      throw new Error("Invalid plan type.");
    }

    const createdAt = new Date();
    const accessExpiresAt =
      plan === "FREE" ? addDays(createdAt, 7) : addDays(createdAt, 30);
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Partner({
      id: generateId(),
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone: normalizedPhone,
      plan,
      status: "ACTIVE",
      refreshToken: undefined,
      products: [],
      events: [],
      sellers: [],
      accessExpiresAt,
      createdAt,
    });
  }

  public static with(props: PartnerProps) {
    return new Partner({
      ...props,
      email: props.email.trim().toLowerCase(),
      phone: Partner.normalizePhone(props.phone ?? ""),
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
      maxConcurrentEvents: this.maxConcurrentEvents, // ✅ aqui ele entra
    };
  }

  public updateEmail(newEmail: string) {
    if (!Partner.isValidEmail(newEmail)) {
      throw new Error("Invalid email format.");
    }
    this.props.email = newEmail.trim().toLowerCase();
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  private static normalizePhone(phone: string): string {
    return phone.replace(/\D/g, ""); // remove tudo que não é número
  }

  private static isValidPhone(phone: string): boolean {
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

  public get password() {
    return this.props.password;
  }

  public get phone() {
    return this.props.phone;
  }

  public get plan() {
    return this.props.plan;
  }

  public get status() {
    return this.props.status;
  }

  public get refreshToken() {
    return this.props.refreshToken;
  }

  public get events() {
    return this.props.events;
  }

  public get sellers() {
    return this.props.sellers;
  }

  public get products() {
    return this.props.products;
  }

  public get accessExpiresAt() {
    return this.props.accessExpiresAt;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get maxConcurrentEvents(): number {
    switch (this.props.plan) {
      case "PREMIUM":
        return 5;
      default:
        return 1;
    }
  }

  public setRefreshToken(token: string) {
    this.props.refreshToken = token;
  }
}
