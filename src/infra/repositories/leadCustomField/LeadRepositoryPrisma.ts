import { PrismaClient } from "@prisma/client";
import {
  ILeadCustomFieldGateway,
  CreateLeadCustomFieldInputDto,
  UpdateLeadCustomFieldInputDto,
} from "../../../domain/entities/leadCustomField/ILeadCustomFieldGateway";
import { LeadCustomField } from "../../../domain/entities/leadCustomField/LeadCustomField";

export class LeadCustomFieldRepositoryPrisma
  implements ILeadCustomFieldGateway
{
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new LeadCustomFieldRepositoryPrisma(prisma);
  }

  async save(input: CreateLeadCustomFieldInputDto): Promise<LeadCustomField> {
    try {
      const created = await this.prisma.leadCustomField.create({ data: input });
      return this.toEntity(created);
    } catch (error: any) {
      throw new Error("Error saving LeadCustomField: " + error.message);
    }
  }

  async update(input: UpdateLeadCustomFieldInputDto): Promise<LeadCustomField> {
    try {
      const { id, companyId, ...data } = input;

      // Opcional: validar se pertence à empresa
      const existing = await this.prisma.leadCustomField.findFirst({
        where: { id, companyId },
      });
      if (!existing) throw new Error("Field not found for company.");

      const updated = await this.prisma.leadCustomField.update({
        where: { id },
        data,
      });

      return this.toEntity(updated);
    } catch (error: any) {
      throw new Error("Error updating LeadCustomField: " + error.message);
    }
  }

  async delete(fieldId: string, companyId: string): Promise<void> {
    try {
      const field = await this.prisma.leadCustomField.findFirst({
        where: { id: fieldId, companyId },
      });
      if (!field) throw new Error("Field not found.");

      await this.prisma.leadCustomField.delete({
        where: { id: field.id },
      });
    } catch (error: any) {
      throw new Error("Error deleting LeadCustomField: " + error.message);
    }
  }

  async findByCompany(companyId: string): Promise<LeadCustomField[]> {
    try {
      const fields = await this.prisma.leadCustomField.findMany({
        where: { companyId },
        orderBy: { order: "asc" },
      });

      return fields.map(this.toEntity);
    } catch (error: any) {
      throw new Error("Error listing LeadCustomFields: " + error.message);
    }
  }

  async findById(
    fieldId: string,
    companyId: string
  ): Promise<LeadCustomField | null> {
    try {
      const field = await this.prisma.leadCustomField.findFirst({
        where: { id: fieldId, companyId },
      });

      return field ? this.toEntity(field) : null;
    } catch (error: any) {
      throw new Error("Error finding LeadCustomField: " + error.message);
    }
  }

  private toEntity(raw: any): LeadCustomField {
    return LeadCustomField.with({
      id: raw.id,
      companyId: raw.companyId,
      name: raw.name,
      key: raw.key,
      type: raw.type,
      required: raw.required,
      order: raw.order,
    });
  }
}
