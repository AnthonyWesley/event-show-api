import { PrismaClient } from "@prisma/client";
import { IAdminGateway } from "../../../domain/entities/admin/IAdminGateway";
import { Admin } from "../../../domain/entities/admin/Admin";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class AdminRepositoryPrisma implements IAdminGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new AdminRepositoryPrisma(prisma);
  }

  async save(admin: Admin): Promise<void> {
    try {
      await this.prisma.admin.create({
        data: {
          id: admin.id,
          email: admin.email,
          password: admin.password,
          createdAt: admin.createdAt,
        },
      });
    } catch (error: any) {
      throw new Error("Error saving admin: " + error.message);
    }
  }

  async findById(id: string): Promise<Admin | null> {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: { id },
      });

      return admin ? this.toEntity(admin) : null;
    } catch (error: any) {
      throw new Error("Error finding admin by ID: " + error.message);
    }
  }

  async findByEmail(email: string): Promise<Admin | null> {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: { email },
      });

      return admin ? this.toEntity(admin) : null;
    } catch (error: any) {
      throw new Error("Error finding admin by email: " + error.message);
    }
  }

  async findByRefreshToken(refreshToken: string): Promise<string | null> {
    try {
      const admin = await this.prisma.admin.findFirst({
        where: { refreshToken },
      });

      if (admin) {
        await this.prisma.admin.update({
          where: { id: admin.id },
          data: { refreshToken: null },
        });
      }

      return admin?.refreshToken ?? null;
    } catch (error: any) {
      throw new Error("Error finding admin by refresh token: " + error.message);
    }
  }

  private toEntity(raw: any): Admin {
    return Admin.with({
      id: raw.id,
      email: raw.email,
      password: raw.password,
      createdAt: raw.createdAt,
    });
  }
}
