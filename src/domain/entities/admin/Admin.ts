import { generateId } from "../../../shared/utils/IdGenerator";
import bcrypt from "bcryptjs";

export type PlanType = "FREE" | "BASIC" | "PREMIUM";
export type StatusType = "ACTIVE" | "SUSPENDED" | "TRIAL_EXPIRED";

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

export type AdminProps = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
};

export class Admin {
  private constructor(private readonly props: AdminProps) {}

  public static async create(email: string, password: string) {
    if (!Admin.isValidEmail(email)) {
      throw new Error("Invalid email format.");
    }

    if (!Admin.isValidPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
      );
    }

    const createdAt = new Date();
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Admin({
      id: generateId(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      createdAt,
    });
  }

  public static with(props: AdminProps) {
    return new Admin({
      ...props,
      email: props.email.trim().toLowerCase(),
    });
  }

  public updateEmail(newEmail: string) {
    if (!Admin.isValidEmail(newEmail)) {
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

  public get id() {
    return this.props.id;
  }

  public get email() {
    return this.props.email;
  }

  public get password() {
    return this.props.password;
  }

  public get createdAt() {
    return this.props.createdAt;
  }
}
