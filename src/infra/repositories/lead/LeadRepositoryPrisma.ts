import { PrismaClient } from "@prisma/client";
import { Lead } from "../../../domain/entities/lead/Lead";
import { ILeadGateway } from "../../../domain/entities/lead/ILeadGateway";
import { UpdateLeadInputDto } from "../../../usecase/lead/UpdateLead";
import { DeleteLeadInputDto } from "../../../usecase/lead/DeleteLead";
import { FindLeadInputDto } from "../../../usecase/lead/FindLead";
import { ObjectHelper } from "../../../shared/utils/ObjectHelper";

export class LeadRepositoryPrisma implements ILeadGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new LeadRepositoryPrisma(prisma);
  }

  async save(lead: Lead): Promise<void> {
    const data = {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      notes: lead.notes,
      customInterest: lead.customInterest,
      ...(lead.leadSourceId ? { leadSourceId: lead.leadSourceId } : {}),
      ...(lead.sellerId ? { sellerId: lead.sellerId } : {}),
      products: {
        connect: lead.products.map((product) => ({ id: product.id })),
      },
      eventId: lead.eventId,
      companyId: lead.companyId,
      createdAt: lead.createdAt,
      convertedAt: lead.convertedAt,
    };

    try {
      await this.prisma.lead.create({ data });
    } catch (error: any) {
      throw new Error("Error saving lead: " + error.message);
    }
  }

  async listByCompany(companyId: string): Promise<any[]> {
    return this.prisma.lead.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      include: {
        products: { select: { id: true, name: true } },
        leadSource: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
        event: { select: { id: true, name: true } },
      },
    });
  }

  async listByEvent(eventId: string): Promise<any[]> {
    return this.prisma.lead.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      include: {
        products: { select: { id: true, name: true } },
        leadSource: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
        event: { select: { id: true, name: true } },
      },
    });
  }

  async findById(input: FindLeadInputDto): Promise<any | null> {
    try {
      const lead = await this.prisma.lead.findUnique({
        where: { id: input.leadId, companyId: input.companyId },
        include: {
          products: { select: { id: true, name: true } },
          leadSource: { select: { id: true, name: true } },
          seller: { select: { id: true, name: true } },
          event: { select: { id: true, name: true } },
        },
      });

      return lead;
    } catch (error: any) {
      throw new Error("Error finding lead: " + error.message);
    }
  }

  async update(input: UpdateLeadInputDto): Promise<Lead> {
    try {
      const cleanData = ObjectHelper.removeUndefinedFields(input);
      const { companyId, leadSourceId, products, leadId, ...rest } = cleanData;

      const data: any = {
        ...rest,
      };

      if (leadSourceId) {
        data.leadSource = { connect: { id: leadSourceId } };
      }

      const updated = await this.prisma.lead.update({
        where: { id: leadId },

        data,
        include: {
          products: true,
          leadSource: true,
          seller: true,
          event: true,
        },
      });

      return this.toEntity(updated);
    } catch (error: any) {
      throw new Error("Error updating lead: " + error.message);
    }
  }

  async delete(input: DeleteLeadInputDto): Promise<void> {
    const lead = await this.findById({
      leadId: input.leadId,
      companyId: input.companyId,
    });
    if (!lead) throw new Error("Lead not found.");

    try {
      await this.prisma.lead.delete({
        where: {
          id: lead.id,
          companyId: lead.companyId,
          eventId: lead.eventId,
        },
      });
    } catch (error: any) {
      throw new Error("Error deleting lead: " + error.message);
    }
  }

  private toEntity(raw: any): Lead {
    return Lead.with({
      id: raw.id,
      name: raw.name,
      email: raw.email ?? undefined,
      phone: raw.phone ?? undefined,
      notes: raw.notes ?? undefined,
      customInterest: raw.customInterest ?? undefined,
      leadSourceId: raw.leadSourceId,
      sellerId: raw.sellerId,
      eventId: raw.eventId,
      companyId: raw.companyId,
      createdAt: raw.createdAt,
      products: raw.products,
      convertedAt: raw.convertedAt,

      sales: raw.sales,
      leadSource: raw.leadSource,
    });
  }
}
