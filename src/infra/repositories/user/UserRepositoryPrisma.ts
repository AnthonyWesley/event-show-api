import { PrismaClient } from "@prisma/client";
import { IUserGateway } from "../../../domain/entities/user/IUserGateway";
import { User } from "../../../domain/entities/user/User";
import { CompanyProps } from "../../../domain/entities/company/Company";

export class UserRepositoryPrisma implements IUserGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new UserRepositoryPrisma(prisma);
  }

  async save(user: User): Promise<void> {
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
      // companyId: user.companyId,
      // company: {
      //   connect: { id: user.companyId },
      // },
    };

    if (user.companyId) {
      data.company = {
        connect: { id: user.companyId },
      };
    }

    await this.prisma.user.create({ data, include: { company: true } });
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

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!user) return null;

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

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) return null;

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
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async update(id: string, data: User): Promise<User> {
    const dataToUpdate: any = {};

    if (data.name !== undefined) dataToUpdate.name = data.name;
    if (data.companyId !== undefined) dataToUpdate.companyId = data.companyId;
    if (data.email !== undefined) dataToUpdate.email = data.email;
    if (data.password !== undefined) dataToUpdate.password = data.password;
    if (data.phone !== undefined) dataToUpdate.phone = data.phone;
    if (data.photo !== undefined) dataToUpdate.photo = data.photo;
    if (data.photoPublicId !== undefined)
      dataToUpdate.photoPublicId = data.photoPublicId;
    if (data.refreshToken !== undefined)
      dataToUpdate.refreshToken = data.refreshToken;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return User.with({
      ...updatedUser,
      phone: updatedUser.phone ?? undefined,
      photo: updatedUser.photo ?? undefined,
      photoPublicId: updatedUser.photoPublicId ?? undefined,
      refreshToken: updatedUser.refreshToken ?? undefined,
      companyId: updatedUser.companyId ?? undefined,
    });
  }

  async list(search?: string): Promise<User[]> {
    const filters: any = {};

    if (search) {
      filters.OR = [
        {
          name: {
            contains: search,
            //  mode: "insensitive"
          },
        },
        {
          email: {
            contains: search, //mode: "insensitive"
          },
        },
        {
          phone: {
            contains: search,
            // mode: "insensitive"
          },
        },
      ];
    }

    const users = await this.prisma.user.findMany({
      where: filters,
      include: { company: true },
    });

    return users.map((u) =>
      User.with({
        ...u,
        phone: u.phone ?? undefined,
        photo: u.photo ?? undefined,
        photoPublicId: u.photoPublicId ?? undefined,
        refreshToken: u.refreshToken ?? undefined,
        companyId: u.companyId ?? undefined,
        company: u.company
          ? UserRepositoryPrisma.mapCompanyPartial(u.company)
          : undefined,
      })
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
