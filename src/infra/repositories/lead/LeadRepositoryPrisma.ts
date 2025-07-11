import { PrismaClient } from "@prisma/client";
import { Lead } from "../../../domain/entities/lead/Lead";
import { ILeadGateway } from "../../../domain/entities/lead/ILeadGateway";
import { UpdateLeadInputDto } from "../../../usecase/lead/UpdateLead";
import { DeleteLeadInputDto } from "../../../usecase/lead/DeleteLead";
import { FindLeadInputDto } from "../../../usecase/lead/FindLead";

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
      companyId: lead.companyId,
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

  async listByCompany(companyId: string): Promise<Lead[]> {
    const leads = await this.prismaClient.lead.findMany({
      where: { companyId },
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
        companyId: l.companyId,
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
        companyId: l.companyId,
        createdAt: l.createdAt,
        products: l.products,
      })
    );
  }

  async findById(input: FindLeadInputDto): Promise<Lead | null> {
    try {
      const lead = await this.prismaClient.lead.findUnique({
        where: { id: input.leadId, companyId: input.companyId },
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
        companyId: lead.companyId,
        createdAt: lead.createdAt,
        products: lead.products,
      });
    } catch (error: any) {
      throw new Error("Error finding lead: " + error.message);
    }
  }

  async update(input: UpdateLeadInputDto): Promise<Lead> {
    try {
      const dataToUpdate: any = {};

      if (input.name !== undefined) dataToUpdate.name = input.name;
      if (input.email !== undefined) dataToUpdate.email = input.email;
      if (input.phone !== undefined) dataToUpdate.phone = input.phone;
      if (input.notes !== undefined) dataToUpdate.notes = input.notes;
      if (input.source !== undefined) dataToUpdate.source = input.source;
      if (input.customInterest !== undefined)
        dataToUpdate.customInterest = input.customInterest;

      if (input.products !== undefined) {
        dataToUpdate.products = {
          set: [],
          connect: input.products.map((p) => ({ id: p.id })),
        };
      }

      const updated = await this.prismaClient.lead.update({
        where: {
          id: input.leadId,
          companyId: input.companyId,
        },
        data: dataToUpdate,
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
        companyId: updated.companyId,
        createdAt: updated.createdAt,
        products: updated.products,
      });
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
      await this.prismaClient.lead.delete({
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
}
