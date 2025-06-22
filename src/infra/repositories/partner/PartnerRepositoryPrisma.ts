import { PrismaClient } from "@prisma/client";
import { IPartnerGateway } from "../../../domain/entities/partner/IPartnerGateway";
import {
  Partner,
  PlanType,
  PartnerProps,
  StatusType,
} from "../../../domain/entities/partner/Partner";
import { SellerProps } from "../../../domain/entities/seller/Seller";

export class PartnerRepositoryPrisma implements IPartnerGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new PartnerRepositoryPrisma(prismaClient);
  }

  async save(partner: Partner): Promise<void> {
    const data = {
      id: partner.id,
      name: partner.name,
      email: partner.email,
      password: partner.password,
      phone: partner.phone,
      plan: partner.plan,
      status: partner.status,
      accessExpiresAt: partner.accessExpiresAt,
      createdAt: partner.createdAt,
      refreshToken: partner.refreshToken,
    };

    try {
      await this.prismaClient.partner.create({ data });
    } catch (error: any) {
      throw new Error("Error saving partner: " + error.message);
    }
  }

  async list(search?: string): Promise<Partner[]> {
    const filters: any = {};

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    const partners = await this.prismaClient.partner.findMany({
      where: filters,
      include: { events: true },
    });

    return partners.map((p) =>
      Partner.with({
        id: p.id,
        name: p.name,
        email: p.email,
        password: p.password,
        photo: p.photo ?? "",
        photoPublicId: p.photoPublicId ?? "",
        phone: p.phone as string,
        plan: p.plan as PlanType,
        status: p.status as StatusType,
        refreshToken: p.refreshToken as string,
        events: [],

        accessExpiresAt: p.accessExpiresAt ?? new Date(),
        createdAt: p.createdAt,
      })
    );
  }

  async activatePartner(partnerId: string): Promise<void> {
    const now = new Date();
    const newAccess = new Date();
    newAccess.setDate(now.getDate() + 30);

    await this.prismaClient.partner.update({
      where: { id: partnerId },
      data: {
        status: "ACTIVE",
        accessExpiresAt: newAccess,
      },
    });
  }

  async suspendPartner(partnerId: string): Promise<void> {
    const now = new Date();

    await this.prismaClient.event.updateMany({
      where: {
        partnerId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    await this.prismaClient.partner.update({
      where: { id: partnerId },
      data: {
        status: "SUSPENDED",
        accessExpiresAt: now,
      },
    });
  }

  async updatePartnerAccessStatus(partnerId: string): Promise<void> {
    const partner = await this.prismaClient.partner.findUnique({
      where: { id: partnerId },
      select: { accessExpiresAt: true, status: true },
    });

    if (!partner) throw new Error("Partner not found.");

    const now = new Date();

    if (
      partner.accessExpiresAt &&
      partner.accessExpiresAt <= now &&
      partner.status !== "SUSPENDED"
    ) {
      await this.suspendPartner(partnerId);
    }

    if (
      partner.accessExpiresAt &&
      partner.accessExpiresAt > now &&
      partner.status !== "ACTIVE"
    ) {
      await this.activatePartner(partnerId);
    }
  }

  async update(id: string, data: Partner): Promise<Partner> {
    try {
      const dataToUpdate: any = {};

      if (data.name !== undefined) dataToUpdate.name = data.name;
      if (data.email !== undefined) dataToUpdate.email = data.email;
      if (data.password !== undefined) dataToUpdate.password = data.password;
      if (data.phone !== undefined) dataToUpdate.phone = data.phone;
      if (data.photo !== undefined) dataToUpdate.photo = data.photo;
      if (data.photoPublicId !== undefined)
        dataToUpdate.photoPublicId = data.photoPublicId;
      if (data.plan !== undefined) dataToUpdate.plan = data.plan;
      if (data.status !== undefined) dataToUpdate.status = data.status;
      if (data.refreshToken !== undefined)
        dataToUpdate.refreshToken = data.refreshToken;
      if (data.accessExpiresAt !== undefined)
        dataToUpdate.accessExpiresAt = data.accessExpiresAt;

      const updatedPartner = await this.prismaClient.partner.update({
        where: { id },
        data: dataToUpdate,
        include: { events: true },
      });

      return Partner.with({
        id: updatedPartner.id,
        name: updatedPartner.name,
        email: updatedPartner.email,
        password: updatedPartner.password,
        phone: updatedPartner.phone ?? "",
        photo: updatedPartner.photo ?? "",
        photoPublicId: updatedPartner.photoPublicId ?? "",
        // events: updatedPartner.events ?? [],
        plan: updatedPartner.plan as PlanType,
        status: updatedPartner.status as StatusType,
        refreshToken: updatedPartner.refreshToken ?? "",
        accessExpiresAt: updatedPartner.accessExpiresAt ?? new Date(),
        createdAt: updatedPartner.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error updating partner: " + error.message);
    }
  }

  async delete(id: string): Promise<void> {
    const aPartner = await this.findById(id);

    if (!aPartner) {
      throw new Error("Partner not found.");
    }

    try {
      await this.prismaClient.partner.delete({ where: { id } });
    } catch (error: any) {
      throw new Error("Error deleting partner: " + error.message);
    }
  }

  async findById(id: string): Promise<Partner | null> {
    await this.updatePartnerAccessStatus(id);

    try {
      const partner = await this.prismaClient.partner.findUnique({
        where: { id },
        include: { events: true, products: true, sellers: true },
      });

      if (!partner) return null;

      return Partner.with({
        id: partner.id,
        name: partner.name,
        email: partner.email,
        password: partner.password,
        phone: partner.phone as string,
        photo: partner.photo ?? "",
        photoPublicId: partner.photoPublicId ?? "",
        plan: partner.plan as PlanType,
        status: partner.status as StatusType,
        refreshToken: partner.refreshToken as string,

        events: [],
        products: [],
        sellers: partner.sellers as SellerProps[],
        accessExpiresAt: partner.accessExpiresAt ?? new Date(),
        createdAt: partner.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding partner: " + error.message);
    }
  }

  async findByEmail(email: string): Promise<Partner | null> {
    try {
      const partner = await this.prismaClient.partner.findUnique({
        where: { email },
        include: { events: true },
      });

      if (!partner) return null;

      return Partner.with({
        id: partner.id,
        name: partner.name,
        email: partner.email,
        password: partner.password,
        phone: partner.phone as string,
        photo: partner.photo ?? "",
        photoPublicId: partner.photoPublicId ?? "",
        events: [],
        plan: partner.plan as PlanType,
        status: partner.status as StatusType,
        refreshToken: partner.refreshToken as string,

        accessExpiresAt: partner.accessExpiresAt ?? new Date(),
        createdAt: partner.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding partner: " + error.message);
    }
  }

  async findByRefreshToken(refreshToken: string): Promise<string | null> {
    try {
      const partner = await this.prismaClient.partner.findFirst({
        where: { refreshToken },
      });

      if (partner) {
        await this.prismaClient.partner.update({
          where: { id: partner.id },
          data: { refreshToken: null },
        });
      }

      return partner ? partner.refreshToken : null;
    } catch (error: any) {
      throw new Error("Error finding partner: " + error.message);
    }
  }

  async updateRefreshToken(partnerId: string, refreshToken: string) {
    await this.prismaClient.partner.update({
      where: { id: partnerId },
      data: { refreshToken },
    });
  }
}
