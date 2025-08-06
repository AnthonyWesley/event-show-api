import { PrismaClient } from "@prisma/client";
import { ISellerGateway } from "../../../domain/entities/seller/ISellerGateway";
import { Seller } from "../../../domain/entities/seller/Seller";
import { FindSellerInputDto } from "../../../usecase/seller/FindSeller";
import { DeleteSellerInputDto } from "../../../usecase/seller/DeleteSeller";
import { UpdateSellerInputDto } from "../../../usecase/seller/UpdateSeller";
import { FindSellerByEmailInputDto } from "../../../usecase/seller/FindSellerByEmail";
import { ObjectHelper } from "../../../shared/utils/ObjectHelper";

export class SellerRepositoryPrisma implements ISellerGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new SellerRepositoryPrisma(prisma);
  }

  async save(seller: Seller): Promise<void> {
    try {
      const data = {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        companyId: seller.companyId,
        phone: seller.phone,
        photo: seller.photo,
      };
      await this.prisma.seller.create({ data });
    } catch (error: any) {
      throw new Error("Error saving seller: " + error.message);
    }
  }

  async list(companyId: string, search?: string): Promise<Seller[]> {
    try {
      const filters: any = { companyId };

      if (search) {
        filters.OR = [
          {
            name: {
              contains: search,
              // mode: "insensitive"
            },
          },
          {
            email: {
              contains: search,
              //  mode: "insensitive"
            },
          },
          {
            phone: {
              contains: search,
              //  mode: "insensitive"
            },
          },
        ];
      }

      const sellers = await this.prisma.seller.findMany({
        where: filters,
        include: {
          sales: { orderBy: { createdAt: "desc" } },
          leads: true,
        },
      });

      return sellers.map(this.toEntity);
    } catch (error: any) {
      throw new Error("Error listing sellers: " + error.message);
    }
  }

  async countByCompany(companyId: string): Promise<number> {
    return await this.prisma.seller.count({
      where: { companyId },
    });
  }

  async update(input: UpdateSellerInputDto): Promise<Seller> {
    try {
      const dataToUpdate: any = ObjectHelper.removeUndefinedFields({
        name: input.name,
        email: input.email,
        phone: input.phone,
        photo: input.photo,
        photoPublicId: input.photoPublicId,
      });

      if (input.email !== undefined) {
        const emailExist = await this.findByEmail({
          email: input.email,
          companyId: input.companyId,
        });
        if (emailExist && emailExist.id !== input.sellerId) {
          throw new Error("Email already in use by another seller.");
        }
      }

      const updatedSeller = await this.prisma.seller.update({
        where: { id: input.sellerId, companyId: input.companyId },
        data: dataToUpdate,
      });

      return this.toEntity(updatedSeller);
    } catch (error: any) {
      throw new Error("Error updating seller: " + error.message);
    }
  }

  async delete(input: DeleteSellerInputDto): Promise<void> {
    const seller = await this.prisma.seller.findUnique({
      where: { id: input.sellerId, companyId: input.companyId },
    });

    if (!seller) {
      throw new Error("Seller not found.");
    }

    try {
      await this.prisma.seller.delete({
        where: { id: input.sellerId, companyId: input.companyId },
      });
    } catch (error: any) {
      throw new Error("Error deleting seller: " + error.message);
    }
  }

  async findById(input: FindSellerInputDto): Promise<Seller | null> {
    try {
      const seller = await this.prisma.seller.findUnique({
        where: { id: input.sellerId, companyId: input.companyId },

        include: { sales: { orderBy: { createdAt: "desc" } }, leads: true },
      });

      if (!seller) return null;

      return this.toEntity(seller);
    } catch (error: any) {
      throw new Error("Error finding seller: " + error.message);
    }
  }

  async findByEmail(input: FindSellerByEmailInputDto): Promise<Seller | null> {
    try {
      const seller = await this.prisma.seller.findUnique({
        where: {
          companyId_email: {
            email: input.email,
            companyId: input.companyId ?? "",
          },
        },
      });

      if (!seller) return null;

      return this.toEntity(seller);
    } catch (error: any) {
      throw new Error("Error finding seller by email: " + error.message);
    }
  }

  private toEntity(raw: any): Seller {
    return Seller.with({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      phone: raw.phone ?? "",
      photo: raw.photo ?? "",
      photoPublicId: raw.photoPublicId ?? "",
      sales: raw.sales,
      leads: raw.leads,
      companyId: raw.companyId,
      createdAt: raw.createdAt,
    });
  }
}
