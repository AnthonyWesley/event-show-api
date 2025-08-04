import { LeadSource, PrismaClient } from "@prisma/client";
import { ICompanyGateway } from "../../../domain/entities/company/ICompanyGateway";
import {
  Company,
  CompanyProps,
  PlanType,
  StatusType,
} from "../../../domain/entities/company/Company";
import { SellerProps } from "../../../domain/entities/seller/Seller";
import { ProductProps } from "../../../domain/entities/product/Product";
import { UserProps } from "../../../domain/entities/user/User";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { SubscriptionProps } from "../../../domain/entities/subscription/Subscription";
import { ObjectHelper } from "../../../shared/utils/ObjectHelper";
import { LeadCustomFieldProps } from "../../../domain/entities/leadCustomField/LeadCustomField";

export class CompanyRepositoryPrisma implements ICompanyGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new CompanyRepositoryPrisma(prisma);
  }

  async save(company: Company, userId: string): Promise<void> {
    try {
      const newCompany = await this.prisma.company.create({
        data: {
          id: company.id,
          platformId: company.platformId,
          name: company.name,
          email: company.email,
          phone: company.phone,
          status: company.status,
          accessExpiresAt: company.accessExpiresAt,
          createdAt: company.createdAt,
          cnpj: company.cnpj,
          ie: company.ie,
          responsibleName: company.responsibleName,
          address: company.address,
          city: company.city,
          state: company.state,
          zipCode: company.zipCode,
          website: company.website,
          segment: company.segment,
          notes: company.notes,
          photo: company.photo,
          photoPublicId: company.photoPublicId,
        },
      });

      if (newCompany) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { companyId: newCompany.id },
        });
      }
    } catch (error: any) {
      throw new Error("Error saving company: " + error.message);
    }
  }

  async list(search?: string): Promise<Company[]> {
    try {
      const filters: any = {};
      if (search) {
        filters.OR = [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ];
      }

      const companies = await this.prisma.company.findMany({
        where: filters,
        include: { users: true },
      });

      return companies.map((p) => this.toEntity(p));
    } catch (error: any) {
      throw new Error("Error listing companies: " + error.message);
    }
  }

  async activateCompany(companyId: string): Promise<void> {
    try {
      const now = new Date();
      const newAccess = new Date();
      newAccess.setDate(now.getDate() + 30);

      await this.prisma.company.update({
        where: { id: companyId },
        data: {
          status: "ACTIVE",
          accessExpiresAt: newAccess,
        },
      });
    } catch (error: any) {
      throw new Error("Error activating company: " + error.message);
    }
  }

  async suspendCompany(companyId: string): Promise<void> {
    try {
      const now = new Date();

      await this.prisma.event.updateMany({
        where: {
          companyId,
          isActive: true,
        },
        data: {
          isActive: false,
          endDate: now,
        },
      });

      await this.prisma.company.update({
        where: { id: companyId },
        data: {
          status: "SUSPENDED",
          accessExpiresAt: now,
        },
      });
    } catch (error: any) {
      throw new Error("Error suspending company: " + error.message);
    }
  }

  async updateCompanyAccessStatus(companyId: string): Promise<void> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        select: { accessExpiresAt: true, status: true },
      });

      if (!company) throw new Error("Company not found.");

      const now = new Date();

      if (
        company.accessExpiresAt &&
        company.accessExpiresAt <= now &&
        company.status !== "SUSPENDED"
      ) {
        await this.suspendCompany(companyId);
      } else if (
        company.accessExpiresAt &&
        company.accessExpiresAt > now &&
        company.status !== "ACTIVE"
      ) {
        await this.activateCompany(companyId);
      }
    } catch (error: any) {
      throw new Error("Error updating company access status: " + error.message);
    }
  }

  async update(id: string, data: Partial<CompanyProps>): Promise<Company> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new NotFoundError("Company");
      }

      // Limpa valores undefined
      const cleanedData = ObjectHelper.removeUndefinedFields(data);

      // Remove relacionamentos proibidos (por precaução)
      const {
        users,
        events,
        products,
        sources,
        sellers,
        subscriptions,
        leadsCustomField,
        createdAt,
        accessExpiresAt,
        status, // protegidos também
        ...safeData
      } = cleanedData;

      const updatedCompany = await this.prisma.company.update({
        where: { id },
        data: safeData,
      });

      return this.toEntity(updatedCompany);
    } catch (error: any) {
      throw new Error("Error updating company: " + error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const company = await this.findById(id);
      if (!company) {
        throw new Error("Company not found.");
      }

      await this.prisma.company.delete({ where: { id } });
    } catch (error: any) {
      throw new Error("Error deleting company: " + error.message);
    }
  }

  async findById(id: string): Promise<Company | null> {
    try {
      await this.updateCompanyAccessStatus(id);

      const company = await this.prisma.company.findUnique({
        where: { id },
        include: {
          events: true,
          products: true,
          sellers: true,
          users: true,
          sources: true,
          subscriptions: true,
          leadsCustomField: true,
        },
      });

      if (!company) return null;

      return this.toEntity(company);
    } catch (error: any) {
      throw new Error("Error finding company: " + error.message);
    }
  }

  async findByEmail(email: string): Promise<Company | null> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { email },
        include: { events: true },
      });

      if (!company) return null;

      return this.toEntity(company);
    } catch (error: any) {
      throw new Error("Error finding company: " + error.message);
    }
  }

  private toEntity(raw: any): Company {
    return Company.with({
      id: raw.id,
      platformId: raw.platformId,
      name: raw.name,
      email: raw.email ?? "",
      phone: raw.phone ?? "",
      isValueVisible: raw.isValueVisible,
      status: raw.status as StatusType,
      accessExpiresAt: raw.accessExpiresAt ?? new Date(),
      createdAt: raw.createdAt,
      cnpj: raw.cnpj ?? "",
      ie: raw.ie ?? "",
      responsibleName: raw.responsibleName ?? "",
      address: raw.address ?? "",
      city: raw.city ?? "",
      state: raw.state ?? "",
      zipCode: raw.zipCode ?? "",
      website: raw.website ?? "",
      segment: raw.segment ?? "",
      notes: raw.notes ?? "",
      photo: raw.photo ?? "",
      photoPublicId: raw.photoPublicId ?? "",
      events: raw.events ?? [],
      products: (raw.products as ProductProps[]) ?? [],
      subscriptions: (raw.subscriptions as SubscriptionProps[]) ?? [],
      sources: (raw.source as LeadSource[]) ?? [],
      sellers: (raw.sellers as SellerProps[]) ?? [],
      users: (raw.users as UserProps[]) ?? [],
      leadsCustomField: (raw.leadsCustomField as LeadCustomFieldProps[]) ?? [],
    });
  }
}
