import { Prisma, PrismaClient } from "@prisma/client";
import {
  ILeadGateway,
  LeadWithField,
} from "../../../domain/entities/lead/ILeadGateway";
import { Lead, LeadProps } from "../../../domain/entities/lead/Lead";
import { ObjectHelper } from "../../../shared/utils/ObjectHelper";
import { DeleteLeadInputDto } from "../../../usecase/lead/DeleteLead";
import { FindLeadInputDto } from "../../../usecase/lead/FindLead";
import { UpdateLeadInputDto } from "../../../usecase/lead/UpdateLead";
import { LeadCustomValue } from "../../../domain/entities/leadCustomValue/LeadCustomValue";

export class LeadRepositoryPrisma implements ILeadGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new LeadRepositoryPrisma(prisma);
  }

  async save(lead: Lead): Promise<void> {
    try {
      const createdLead = await this.prisma.lead.create({
        data: {
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          wasPresent: lead.wasPresent,
          notes: lead.notes,
          customInterest: lead.customInterest,
          leadSourceId: lead.leadSourceId ?? undefined,
          sellerId: lead.sellerId ?? undefined,
          eventId: lead.eventId,
          companyId: lead.companyId,
          createdAt: lead.createdAt,
          convertedAt: lead.convertedAt ?? undefined,
          products: {
            connect: lead.products.map((product) => ({ id: product.id })),
          },
        },
      });

      if (!createdLead.sellerId)
        await this.prisma.lead.update({
          where: { id: createdLead.id },
          data: { wasPresent: true },
        });
    } catch (error: any) {
      throw new Error("Error saving lead: " + error.message);
    }
  }

  async update(input: UpdateLeadInputDto): Promise<Lead> {
    try {
      const {
        companyId,
        leadId,
        products,
        leadSourceId,
        sellerId,
        customValues,
        ...rest
      } = ObjectHelper.removeUndefinedFields(input);

      // Função auxiliar para validar ID
      const isValidId = (value: unknown): value is string =>
        typeof value === "string" && value.trim().length > 0;

      // Validação de obrigatoriedade mínima
      // if (!isValidId(leadSourceId) && !isValidId(sellerId)) {
      //   throw new Error("É necessário informar leadSourceId ou sellerId.");
      // }

      const updateData: any = {
        ...rest,
      };

      if (isValidId(leadSourceId)) {
        updateData.leadSourceId = leadSourceId.trim();
      }

      if (isValidId(sellerId)) {
        updateData.sellerId = sellerId.trim();
      }

      if (products && products.length > 0) {
        updateData.products = {
          set: [],
          connect: products.map((p) => ({ id: p.id })),
        };
      }

      const updated = await this.prisma.lead.update({
        where: {
          id: leadId,
          companyId,
        },
        data: updateData,
        include: {
          products: true,
          leadSource: true,
          seller: true,
          event: true,
          customValues: {
            include: {
              field: true,
            },
          },
        },
      });

      return this.toEntity(updated);
    } catch (error: any) {
      throw new Error("Error updating lead: " + error.message);
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
        customValues: true,
      },
    });
  }

  async listByEvent(
    eventId: string,
    search?: string
  ): Promise<LeadWithField[]> {
    const filters: any = {
      eventId,
    };

    if (search?.trim()) {
      filters.OR = [
        {
          name: {
            contains: search,
            // mode: "insensitive",
          },
        },
        {
          customValues: {
            some: {
              field: {
                key: "phone",
              },
              value: {
                contains: search,
              },
            },
          },
        },
      ];
    }

    return this.prisma.lead.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: {
        products: { select: { id: true, name: true } },
        leadSource: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
        event: { select: { id: true, name: true } },
        customValues: { include: { field: true } },
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
      phone: raw.phone,
      notes: raw.notes ?? undefined,
      customInterest: raw.customInterest ?? undefined,
      leadSourceId: raw.leadSourceId ?? undefined,
      sellerId: raw.sellerId ?? undefined,
      eventId: raw.eventId,
      companyId: raw.companyId,
      createdAt: raw.createdAt,
      convertedAt: raw.convertedAt ?? undefined,
      wasPresent: raw.wasPresent,
      status: raw.status,
      products: raw.products ?? [],
      sales: raw.sales ?? [],
      event: raw.event ?? undefined,
      seller: raw.seller ?? undefined,
      leadSource: raw.leadSource ?? undefined,
      customValues: (raw.customValues ?? []).map((cv: any) =>
        LeadCustomValue.with({
          id: cv.id,
          leadId: cv.leadId,
          fieldId: cv.fieldId,
          value: cv.value,
          field: cv.field
            ? {
                id: cv.field.id,
                name: cv.field.name,
                key: cv.field.key,
                type: cv.field.type,
                required: cv.field.required,
                order: cv.field.order,
                companyId: cv.field.companyId,
              }
            : undefined,
        })
      ),
    });
  }
}
