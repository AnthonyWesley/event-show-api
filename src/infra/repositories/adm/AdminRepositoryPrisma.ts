import { IAdminGateway } from "../../../domain/entities/admin/IAdminGateway";
import { Admin } from "../../../domain/entities/admin/Admin";
import { PrismaClient } from "@prisma/client";

export class AdminRepositoryPrisma implements IAdminGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new AdminRepositoryPrisma(prismaClient);
  }

  async save(admin: Admin): Promise<void> {
    const data = {
      id: admin.id,
      email: admin.email,
      password: admin.password,

      createdAt: admin.createdAt,
    };

    try {
      await this.prismaClient.admin.create({ data });
    } catch (error: any) {
      throw new Error("Error saving partner: " + error.message);
    }
  }

  async findById(id: string): Promise<Admin | null> {
    try {
      const admin = await this.prismaClient.admin.findUnique({
        where: { id },
      });

      if (!admin) return null;

      return Admin.with({
        id: admin.id,
        email: admin.email,
        password: admin.password,

        createdAt: admin.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding partner: " + error.message);
    }
  }

  async findByEmail(email: string): Promise<Admin | null> {
    try {
      const admin = await this.prismaClient.admin.findUnique({
        where: { email },
      });

      if (!admin) return null;

      return Admin.with({
        id: admin.id,
        email: admin.email,
        password: admin.password,
        createdAt: admin.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding partner: " + error.message);
    }
  }
}
