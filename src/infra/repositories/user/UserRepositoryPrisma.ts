import { PrismaClient } from "@prisma/client";
import { IUserGateway } from "../../../domain/entities/user/IUserGateway";
import { User } from "../../../domain/entities/user/User";
import { CompanyProps } from "../../../domain/entities/company/Company";
import { ObjectHelper } from "../../../shared/utils/ObjectHelper";

export class UserRepositoryPrisma implements IUserGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new UserRepositoryPrisma(prisma);
  }

  async save(user: User): Promise<void> {
    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existing) {
        throw new Error("E-mail já cadastrado.");
      }

      const data: any = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        photo: user.photo,
        photoPublicId: user.photoPublicId,
        phone: user.phone,
        refreshToken: user.refreshToken,
        createdAt: user.createdAt,
      };

      if (user.companyId) {
        data.company = {
          connect: { id: user.companyId },
        };
      }

      await this.prisma.user.create({ data, include: { company: true } });
    } catch (error: any) {
      throw new Error("Error saving user: " + error.message);
    }
  }

  private static mapCompanyPartial(company: any): Partial<CompanyProps> {
    return {
      id: company.id,
      name: company.name,
      plan: company.plan,
      status: company.status,
      photo: company.photo ?? undefined,
      photoPublicId: company.photoPublicId ?? undefined,
      accessExpiresAt: company.accessExpiresAt ?? undefined,
      createdAt: company.createdAt,
    };
  }

  private toEntity(user: any): User {
    return User.with({
      ...user,
      phone: user.phone ?? undefined,
      photo: user.photo ?? undefined,
      photoPublicId: user.photoPublicId ?? undefined,
      refreshToken: user.refreshToken ?? undefined,
      companyId: user.companyId ?? undefined,
      company: user.company
        ? UserRepositoryPrisma.mapCompanyPartial(user.company)
        : undefined,
    });
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { company: true },
      });
      return user ? this.toEntity(user) : null;
    } catch (error: any) {
      throw new Error("Error finding user by id: " + error.message);
    }
  }

  async countByCompany(companyId: string): Promise<number> {
    return await this.prisma.user.count({
      where: { companyId },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: { company: true },
      });
      return user ? this.toEntity(user) : null;
    } catch (error: any) {
      throw new Error("Error finding user by email: " + error.message);
    }
  }

  async findByRefreshToken(refreshToken: string): Promise<string | null> {
    const user = await this.prisma.user.findFirst({
      where: { refreshToken },
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
    }

    return user?.refreshToken ?? null;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken },
      });
    } catch (error: any) {
      throw new Error("Error updating refresh token: " + error.message);
    }
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      const dataToUpdate = ObjectHelper.removeUndefinedFields({
        name: data.name,
        companyId: data.companyId,
        email: data.email,
        password: data.password,
        phone: data.phone,
        photo: data.photo,
        photoPublicId: data.photoPublicId,
        refreshToken: data.refreshToken,
      });

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
        include: { company: true },
      });

      return this.toEntity(updatedUser);
    } catch (error: any) {
      throw new Error("Error updating user: " + error.message);
    }
  }

  async list(search?: string): Promise<User[]> {
    try {
      const filters: any = {};

      if (search) {
        filters.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ];
      }

      const users = await this.prisma.user.findMany({
        where: filters,
        include: { company: true },
      });

      return users.map((u) => this.toEntity(u));
    } catch (error: any) {
      throw new Error("Error listing users: " + error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error: any) {
      throw new Error("Error deleting user: " + error.message);
    }
  }
}
