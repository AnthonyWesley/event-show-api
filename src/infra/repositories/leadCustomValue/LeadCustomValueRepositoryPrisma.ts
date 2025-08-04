import { PrismaClient } from "@prisma/client";
import { UpsertLeadCustomValueInputDto } from "../../../domain/entities/leadCustomField/ILeadCustomFieldGateway";
import { ILeadCustomValueGateway } from "../../../domain/entities/leadCustomValue/ILeadCustomFieldGateway";
import { LeadCustomValue } from "../../../domain/entities/leadCustomValue/LeadCustomValue";

export class LeadCustomValueRepositoryPrisma
  implements ILeadCustomValueGateway
{
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new LeadCustomValueRepositoryPrisma(prisma);
  }

  async upsertMany(values: UpsertLeadCustomValueInputDto[]): Promise<void> {
    try {
      const operations = values.map((v) =>
        this.prisma.leadCustomValue.upsert({
          where: {
            leadId_fieldId: {
              leadId: v.leadId,
              fieldId: v.fieldId,
            },
          },
          update: {
            value: v.value,
          },
          create: {
            leadId: v.leadId,
            fieldId: v.fieldId,
            value: v.value,
          },
        })
      );

      await this.prisma.$transaction(operations);
    } catch (error: any) {
      throw new Error("Error upserting LeadCustomValues: " + error.message);
    }
  }

  async deleteByLead(leadId: string): Promise<void> {
    try {
      await this.prisma.leadCustomValue.deleteMany({
        where: { leadId },
      });
    } catch (error: any) {
      throw new Error("Error deleting LeadCustomValues: " + error.message);
    }
  }

  async findByLead(leadId: string): Promise<LeadCustomValue[]> {
    try {
      const result = await this.prisma.leadCustomValue.findMany({
        where: { leadId },
        include: { field: true },
      });

      return result.map(this.toEntity);
    } catch (error: any) {
      throw new Error("Error finding LeadCustomValues: " + error.message);
    }
  }

  private toEntity(raw: any): LeadCustomValue {
    return LeadCustomValue.with({
      id: raw.id,
      leadId: raw.leadId,
      fieldId: raw.fieldId,
      value: raw.value,
      field: {
        id: raw.field.id,
        companyId: raw.field.companyId,
        name: raw.field.name,
        key: raw.field.key,
        type: raw.field.type,
        required: raw.field.required,
        order: raw.field.order,
      },
    });
  }
}
