import { PrismaClient } from "@prisma/client";
import { IPartnerGateway } from "../../../domain/entities/partner/IPartnerGateway";
import {
  Partner,
  PlanType,
  PartnerProps,
  StatusType,
} from "../../../domain/entities/partner/Partner";
import { EventProps } from "../../../domain/entities/event/Event";
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
      maxConcurrentEvents: partner.maxConcurrentEvents,
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
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
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
        phone: p.phone as string,
        plan: p.plan as PlanType,
        status: p.status as StatusType,
        refreshToken: p.refreshToken as string,
        events: [],
        maxConcurrentEvents: p.maxConcurrentEvents,

        accessExpiresAt: p.accessExpiresAt ?? new Date(),
        createdAt: p.createdAt,
      })
    );
  }

  async update(
    id: string,
    data: Partial<Omit<PartnerProps, "createdAt">>
  ): Promise<Partner> {
    try {
      const updatedPartner = await this.prismaClient.partner.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          plan: data.plan,
          status: data.status,
          refreshToken: data.refreshToken,
          accessExpiresAt: data.accessExpiresAt,
        },
        include: { events: true },
      });

      return Partner.with({
        id: updatedPartner.id,
        name: updatedPartner.name,
        email: updatedPartner.email,
        password: updatedPartner.password,
        phone: updatedPartner.phone as string,
        events: [],
        maxConcurrentEvents: updatedPartner.maxConcurrentEvents,

        plan: updatedPartner.plan as PlanType,
        status: updatedPartner.status as StatusType,
        refreshToken: updatedPartner.refreshToken as string,

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
        plan: partner.plan as PlanType,
        status: partner.status as StatusType,
        refreshToken: partner.refreshToken as string,
        maxConcurrentEvents: partner.maxConcurrentEvents,

        events: [],
        products: partner.products,
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
        maxConcurrentEvents: partner.maxConcurrentEvents,

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
