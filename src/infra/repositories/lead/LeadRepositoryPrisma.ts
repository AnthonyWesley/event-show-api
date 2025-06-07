import { PrismaClient } from "@prisma/client";
import { Lead } from "../../../domain/entities/lead/Lead";
import { ILeadGateway } from "../../../domain/entities/lead/ILeadGateway";
import { UpdateLeadInputDto } from "../../../usecase/lead/UpdateLead";
import { DeleteLeadInputDto } from "../../../usecase/lead/DeleteLead";
import { FindLeadInputDto } from "../../../usecase/lead/FindLead";
import { product } from "../../Container";

export class LeadRepositoryPrisma implements ILeadGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new LeadRepositoryPrisma(prismaClient);
  }

  async save(lead: Lead): Promise<void> {
    const data = {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      notes: lead.notes,
      source: lead.source,
      customInterest: lead.customInterest,
      eventId: lead.eventId,
      partnerId: lead.partnerId,
      createdAt: lead.createdAt,
      products: {
        connect: lead.products?.map((p) => ({ id: p.id })) ?? [],
      },
    };

    try {
      await this.prismaClient.lead.create({ data });
    } catch (error: any) {
      throw new Error("Error saving lead: " + error.message);
    }
  }

  async listByPartner(partnerId: string): Promise<Lead[]> {
    const leads = await this.prismaClient.lead.findMany({
      where: { partnerId },
      include: { products: true },
    });

    return leads.map((l) =>
      Lead.with({
        id: l.id,
        name: l.name,
        email: l.email ?? undefined,
        phone: l.phone ?? undefined,
        notes: l.notes ?? undefined,
        source: l.source,
        customInterest: l.customInterest ?? undefined,
        eventId: l.eventId,
        partnerId: l.partnerId,
        createdAt: l.createdAt,
        products: l.products,
      })
    );
  }

  async listByEvent(eventId: string): Promise<Lead[]> {
    const leads = await this.prismaClient.lead.findMany({
      where: { eventId },
      include: { products: true },
    });

    return leads.map((l) =>
      Lead.with({
        id: l.id,
        name: l.name,
        email: l.email ?? undefined,
        phone: l.phone ?? undefined,
        notes: l.notes ?? undefined,
        source: l.source,
        customInterest: l.customInterest ?? undefined,
        eventId: l.eventId,
        partnerId: l.partnerId,
        createdAt: l.createdAt,
        products: l.products,
      })
    );
  }

  async findById(input: FindLeadInputDto): Promise<Lead | null> {
    try {
      const lead = await this.prismaClient.lead.findUnique({
        where: { id: input.leadId, partnerId: input.partnerId },
        include: { products: true },
      });

      if (!lead) return null;

      return Lead.with({
        id: lead.id,
        name: lead.name,
        email: lead.email ?? undefined,
        phone: lead.phone ?? undefined,
        notes: lead.notes ?? undefined,
        source: lead.source,
        customInterest: lead.customInterest ?? undefined,
        eventId: lead.eventId,
        partnerId: lead.partnerId,
        createdAt: lead.createdAt,
        products: lead.products,
      });
    } catch (error: any) {
      throw new Error("Error finding lead: " + error.message);
    }
  }

  async update(input: UpdateLeadInputDto): Promise<Lead> {
    try {
      const updated = await this.prismaClient.lead.update({
        where: {
          id: input.leadId,
          partnerId: input.partnerId,
        },
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          notes: input.notes,
          source: input.source,
          customInterest: input.customInterest,
          products: {
            set: [],
            connect: input.products?.map((p) => ({ id: p.id })) ?? [],
          },
        },
        include: {
          products: true,
        },
      });

      return Lead.with({
        id: updated.id,
        name: updated.name,
        email: updated.email ?? undefined,
        phone: updated.phone ?? undefined,
        notes: updated.notes ?? undefined,
        source: updated.source,
        customInterest: updated.customInterest ?? undefined,
        eventId: updated.eventId,
        partnerId: updated.partnerId,
        createdAt: updated.createdAt,
        products: updated.products,
      });
    } catch (error: any) {
      throw new Error("Error updating lead: " + error.message);
    }
  }

  async delete(input: DeleteLeadInputDto): Promise<void> {
    const lead = await this.findById({
      leadId: input.id,
      partnerId: input.partnerId,
    });
    if (!lead) throw new Error("Lead not found.");

    try {
      await this.prismaClient.lead.delete({
        where: {
          id: lead.id,
          partnerId: lead.partnerId,
          eventId: lead.eventId,
        },
      });
    } catch (error: any) {
      throw new Error("Error deleting lead: " + error.message);
    }
  }
}
