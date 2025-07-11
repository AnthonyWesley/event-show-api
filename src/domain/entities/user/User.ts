import { generateId } from "../../../shared/utils/IdGenerator";
import bcrypt from "bcryptjs";
import { CompanyProps } from "../company/Company";

export type UserRole = "ADMIN" | "MANAGER" | "GUEST";

export type UserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  photo?: string;
  phone?: string;
  photoPublicId?: string;
  companyId?: string;
  refreshToken?: string;
  createdAt: Date;
  company?: Partial<CompanyProps>;
};

export class User {
  private constructor(private readonly props: UserProps) {}

  public static async create(
    name: string,
    email: string,
    password: string,
    phone: string,
    companyId?: string,
    company?: Partial<CompanyProps>,
    photo?: string
  ) {
    if (!name.trim()) throw new Error("User name is required.");
    if (!User.isValidEmail(email)) throw new Error("Invalid email.");
    if (!User.isValidPassword(password)) throw new Error("Weak password.");

    const hashedPassword = await bcrypt.hash(password, 10);

    return new User({
      id: generateId(),
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: companyId ? "MANAGER" : "ADMIN",
      companyId,
      company,
      photo,
      phone,
      createdAt: new Date(),
    });
  }

  public static with(props: UserProps): User {
    return new User({
      ...props,
      email: props.email.trim().toLowerCase(),
      company: props.company
        ? {
            ...props.company,
            email: props.company.email?.trim().toLowerCase(),
          }
        : undefined,
    });
  }

  private static isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private static isValidPassword(password: string) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  }

  public toResponse() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      phone: this.phone,
      photo: this.photo,
      photoPublicId: this.photoPublicId,
      companyId: this.companyId,
      createdAt: this.createdAt,
      company: this.company
        ? {
            id: this.company.id,
            name: this.company.name,
            plan: this.company.plan,
            status: this.company.status,
            photo: this.company.photo,
            photoPublicId: this.company.photoPublicId,
            accessExpiresAt: this.company.accessExpiresAt,
            createdAt: this.company.createdAt,
          }
        : null,
    };
  }

  // Getters
  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get email() {
    return this.props.email;
  }

  public get role() {
    return this.props.role;
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

  public get refreshToken() {
    return this.props.refreshToken;
  }

  public get password() {
    return this.props.password;
  }

  public get company() {
    return this.props.company;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  // Setters
  public setRefreshToken(token: string) {
    this.props.refreshToken = token;
  }

  public setCompanyId(companyId: string) {
    this.props.companyId = companyId;
  }
}
