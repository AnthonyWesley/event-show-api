import { PrismaClient } from "@prisma/client";
import { ICompanyGateway } from "../../../domain/entities/company/ICompanyGateway";
import {
  Company,
  PlanType,
  StatusType,
} from "../../../domain/entities/company/Company";
import { SellerProps } from "../../../domain/entities/seller/Seller";
import { ProductProps } from "../../../domain/entities/product/Product";
import { CreateCompanyInputDto } from "../../../usecase/company/CreateCompany";
import { UserProps } from "../../../domain/entities/user/User";
import { generateId } from "../../../shared/utils/IdGenerator";

export class CompanyRepositoryPrisma implements ICompanyGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new CompanyRepositoryPrisma(prismaClient);
  }

  async save(company: Company, userId: string): Promise<void> {
    const data = {
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      plan: company.plan,
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
    };

    try {
      const newCompany = await this.prismaClient.company.create({ data });
      if (newCompany) {
        await this.prismaClient.user.update({
          where: { id: userId },
          data: { companyId: newCompany.id },
        });
        await this.prismaClient.subscription.create({
          data: {
            id: generateId(),
            companyId: newCompany?.id,
            externalId: "",
            plan: "TEST",
            status: "ACTIVE",
            startedAt: new Date(),
            expiresAt: null,
          },
        });
      }
    } catch (error: any) {
      throw new Error("Error saving company: " + error.message);
    }
  }

  async list(search?: string): Promise<Company[]> {
    const filters: any = {};

    if (search) {
      filters.OR = [
        {
          name: {
            contains: search,
            // mode: "insensitive"
          },
        },
        {
          email: {
            contains: search,
            // mode: "insensitive"
          },
        },
        {
          phone: {
            contains: search,
            // mode: "insensitive"
          },
        },
      ];
    }
    const companies = await this.prismaClient.company.findMany({
      where: filters,
      include: { events: true, users: true },
    });

    return companies.map((p) =>
      Company.with({
        id: p.id,
        name: p.name,
        email: p.email ?? "",
        photo: p.photo ?? "",
        photoPublicId: p.photoPublicId ?? "",
        phone: p.phone as string,
        plan: p.plan as PlanType,
        status: p.status as StatusType,
        accessExpiresAt: p.accessExpiresAt ?? new Date(),
        createdAt: p.createdAt,
        cnpj: p.cnpj ?? "",
        ie: p.ie ?? "",
        responsibleName: p.responsibleName ?? "",
        address: p.address ?? "",
        city: p.city ?? "",
        state: p.state ?? "",
        zipCode: p.zipCode ?? "",
        website: p.website ?? "",
        segment: p.segment ?? "",
        notes: p.notes ?? "",
        users: p.users as UserProps[],
      })
    );
  }

  async activateCompany(companyId: string): Promise<void> {
    const now = new Date();
    const newAccess = new Date();
    newAccess.setDate(now.getDate() + 30);

    await this.prismaClient.company.update({
      where: { id: companyId },
      data: {
        status: "ACTIVE",
        accessExpiresAt: newAccess,
      },
    });
  }

  async suspendCompany(companyId: string): Promise<void> {
    const now = new Date();

    await this.prismaClient.event.updateMany({
      where: {
        companyId,
        isActive: true,
      },
      data: {
        isActive: false,
        endDate: now,
      },
    });

    await this.prismaClient.company.update({
      where: { id: companyId },
      data: {
        status: "SUSPENDED",
        accessExpiresAt: now,
      },
    });
  }

  async updateCompanyAccessStatus(companyId: string): Promise<void> {
    const company = await this.prismaClient.company.findUnique({
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
    }

    if (
      company.accessExpiresAt &&
      company.accessExpiresAt > now &&
      company.status !== "ACTIVE"
    ) {
      await this.activateCompany(companyId);
    }
  }

  async update(id: string, data: Company): Promise<Company> {
    try {
      const dataToUpdate: any = {};

      if (data.name !== undefined) dataToUpdate.name = data.name;
      if (data.email !== undefined) dataToUpdate.email = data.email;
      if (data.phone !== undefined) dataToUpdate.phone = data.phone;
      if (data.photo !== undefined) dataToUpdate.photo = data.photo;
      if (data.photoPublicId !== undefined)
        dataToUpdate.photoPublicId = data.photoPublicId;
      if (data.plan !== undefined) dataToUpdate.plan = data.plan;
      if (data.status !== undefined) dataToUpdate.status = data.status;

      if (data.accessExpiresAt !== undefined)
        dataToUpdate.accessExpiresAt = data.accessExpiresAt;
      if (data.cnpj !== undefined) dataToUpdate.cnpj = data.cnpj;
      if (data.ie !== undefined) dataToUpdate.ie = data.ie;
      if (data.responsibleName !== undefined)
        dataToUpdate.responsibleName = data.responsibleName;
      if (data.address !== undefined) dataToUpdate.address = data.address;
      if (data.city !== undefined) dataToUpdate.city = data.city;
      if (data.state !== undefined) dataToUpdate.state = data.state;
      if (data.zipCode !== undefined) dataToUpdate.zipCode = data.zipCode;
      if (data.website !== undefined) dataToUpdate.website = data.website;
      if (data.segment !== undefined) dataToUpdate.segment = data.segment;
      if (data.notes !== undefined) dataToUpdate.notes = data.notes;

      const updatedCompany = await this.prismaClient.company.update({
        where: { id },
        data: dataToUpdate,
        include: { events: true },
      });

      return Company.with({
        id: updatedCompany.id,
        name: updatedCompany.name,
        email: updatedCompany.email ?? "",
        phone: updatedCompany.phone ?? "",
        photo: updatedCompany.photo ?? "",
        photoPublicId: updatedCompany.photoPublicId ?? "",
        plan: updatedCompany.plan as PlanType,
        status: updatedCompany.status as StatusType,
        accessExpiresAt: updatedCompany.accessExpiresAt ?? new Date(),
        createdAt: updatedCompany.createdAt,
        cnpj: updatedCompany.cnpj ?? "",
        ie: updatedCompany.ie ?? "",
        responsibleName: updatedCompany.responsibleName ?? "",
        address: updatedCompany.address ?? "",
        city: updatedCompany.city ?? "",
        state: updatedCompany.state ?? "",
        zipCode: updatedCompany.zipCode ?? "",
        website: updatedCompany.website ?? "",
        segment: updatedCompany.segment ?? "",
        notes: updatedCompany.notes ?? "",
      });
    } catch (error: any) {
      throw new Error("Error updating company: " + error.message);
    }
  }

  async delete(id: string): Promise<void> {
    const aCompany = await this.findById(id);

    if (!aCompany) {
      throw new Error("Company not found.");
    }

    try {
      await this.prismaClient.company.delete({ where: { id } });
    } catch (error: any) {
      throw new Error("Error deleting company: " + error.message);
    }
  }

  async findById(id: string): Promise<Company | null> {
    await this.updateCompanyAccessStatus(id);

    try {
      const company = await this.prismaClient.company.findUnique({
        where: { id },
        include: { events: true, products: true, sellers: true, users: true },
      });

      if (!company) return null;

      return Company.with({
        id: company.id,
        name: company.name,
        email: company.email ?? "",
        phone: company.phone ?? "",
        plan: company.plan,
        status: company.status,
        accessExpiresAt: company.accessExpiresAt ?? new Date(),
        createdAt: company.createdAt,
        cnpj: company.cnpj ?? "",
        ie: company.ie ?? "",
        responsibleName: company.responsibleName ?? "",
        address: company.address ?? "",
        city: company.city ?? "",
        state: company.state ?? "",
        zipCode: company.zipCode ?? "",
        website: company.website ?? "",
        segment: company.segment ?? "",
        notes: company.notes ?? "",
        photo: company.photo ?? "",
        photoPublicId: company.photoPublicId ?? "",
        events: [],
        products: company.products as ProductProps[],

        sellers: company.sellers as SellerProps[],
        users: company.users as UserProps[],
      });
    } catch (error: any) {
      throw new Error("Error finding company: " + error.message);
    }
  }

  async findByEmail(email: string): Promise<Company | null> {
    try {
      const company = await this.prismaClient.company.findUnique({
        where: { email },
        include: { events: true },
      });

      if (!company) return null;

      return Company.with({
        id: company.id,
        name: company.name,
        email: company.email ?? "",
        phone: company.phone as string,
        photo: company.photo ?? "",
        photoPublicId: company.photoPublicId ?? "",
        events: [],
        plan: company.plan as PlanType,
        status: company.status as StatusType,

        accessExpiresAt: company.accessExpiresAt ?? new Date(),
        createdAt: company.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding company: " + error.message);
    }
  }
}
