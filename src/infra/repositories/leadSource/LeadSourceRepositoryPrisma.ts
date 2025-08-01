import { PrismaClient } from "@prisma/client";
import { ILeadSourceGateway } from "../../../domain/entities/leadSource/ILeadSourceGateway";
import { LeadSource } from "../../../domain/entities/leadSource/LeadSource";
import { ObjectHelper } from "../../../shared/utils/ObjectHelper";

export class LeadSourceRepositoryPrisma implements ILeadSourceGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new LeadSourceRepositoryPrisma(prisma);
  }

  async save(leadSource: LeadSource): Promise<void> {
    const data = {
      id: leadSource.id,
      name: leadSource.name,
      description: leadSource.description,
      companyId: leadSource.companyId,
      createdAt: leadSource.createdAt,
    };

    try {
      await this.prisma.leadSource.create({ data });
    } catch (error: any) {
      throw new Error("Error saving leadSource: " + error.message);
    }
  }

  async list(companyId: string, search?: string): Promise<LeadSource[]> {
    const filters: any = { companyId };

    if (search) {
      filters.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    const leadSources = await this.prisma.leadSource.findMany({
      where: filters,
      include: { leads: true },
    });

    return leadSources.map(this.toEntity);
  }

  async findById(leadSourceId: string): Promise<LeadSource | null> {
    try {
      const leadSource = await this.prisma.leadSource.findUnique({
        where: { id: leadSourceId },
        include: { leads: true },
      });

      if (!leadSource) return null;

      return this.toEntity(leadSource);
    } catch (error: any) {
      throw new Error("Error finding leadSource: " + error.message);
    }
  }

  async update(leadSourceId: string, data: LeadSource): Promise<void> {
    try {
      const dataToUpdate = ObjectHelper.removeUndefinedFields({
        name: data.name,
        description: data.description,
      });

      const updated = await this.prisma.leadSource.update({
        where: {
          id: leadSourceId,
        },
        data: dataToUpdate,
      });

      this.toEntity(updated);
    } catch (error: any) {
      throw new Error("Error updating lead: " + error.message);
    }
  }

  async delete(leadSourceId: string): Promise<void> {
    const leadSource = await this.findById(leadSourceId);
    if (!leadSource) throw new Error("LeadSource not found.");

    try {
      await this.prisma.leadSource.delete({
        where: {
          id: leadSource.id,
        },
      });
    } catch (error: any) {
      throw new Error("Error deleting lead: " + error.message);
    }
  }

  private toEntity(raw: any): LeadSource {
    return LeadSource.with({
      id: raw.id,
      name: raw.name,
      photo: raw.photo,
      photoPublicId: raw.photoPublicId,
      description: raw.description,
      companyId: raw.companyId,
      createdAt: raw.createdAt,
    });
  }
}
