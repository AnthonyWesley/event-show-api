import { PrismaClient } from "@prisma/client";
import { ISellerGateway } from "../../../domain/entities/seller/ISellerGateway";
import { Seller } from "../../../domain/entities/seller/Seller";
import { FindSellerInputDto } from "../../../usecase/seller/FindSeller";
import { DeleteSellerInputDto } from "../../../usecase/seller/DeleteSeller";
import { UpdateSellerInputDto } from "../../../usecase/seller/UpdateSeller";
import { FindSellerByEmailInputDto } from "../../../usecase/seller/FindSellerByEmail";

export class SellerRepositoryPrisma implements ISellerGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new SellerRepositoryPrisma(prismaClient);
  }

  async save(seller: Seller): Promise<void> {
    const data = {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      photo: seller.photo,
      companyId: seller.companyId,
      createdAt: seller.createdAt,
    };

    try {
      await this.prismaClient.seller.create({ data });
    } catch (error: any) {
      throw new Error("Error saving Seller: " + error.message);
    }
  }

  async list(companyId: string, search?: string): Promise<Seller[]> {
    try {
      const filters: any = {
        companyId,
      };

      if (search) {
        filters.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ];
      }

      const sellers = await this.prismaClient.seller.findMany({
        where: filters,
        include: { sales: true },
      });

      return sellers.map((s) =>
        Seller.with({
          id: s.id,
          name: s.name,
          email: s.email,
          phone: s.phone ?? "",
          photo: s.photo ?? "",
          photoPublicId: s.photoPublicId ?? "",
          companyId: s.companyId,
          createdAt: s.createdAt,
        })
      );
    } catch (error: any) {
      throw new Error("Error listing seller: " + error.message);
    }
  }

  async update(input: UpdateSellerInputDto): Promise<Seller> {
    try {
      const dataToUpdate: any = {};

      if (input.name !== undefined) dataToUpdate.name = input.name;

      if (input.email !== undefined) {
        const emailExist = await this.findByEmail({ email: input.email });
        if (emailExist && emailExist.id !== input.sellerId) {
          throw new Error("Email already in use by another seller.");
        }
        dataToUpdate.email = input.email;
      }

      if (input.phone !== undefined) dataToUpdate.phone = input.phone;
      if (input.photo !== undefined) dataToUpdate.photo = input.photo;
      if (input.photoPublicId !== undefined)
        dataToUpdate.photoPublicId = input.photoPublicId;

      const updatedSeller = await this.prismaClient.seller.update({
        where: { id: input.sellerId, companyId: input.companyId },
        data: dataToUpdate,
      });

      return Seller.with({
        id: updatedSeller.id,
        name: updatedSeller.name,
        email: updatedSeller.email,
        phone: updatedSeller.phone ?? "",
        photo: updatedSeller.photo ?? "",
        photoPublicId: updatedSeller.photoPublicId ?? "",
        companyId: updatedSeller.companyId,
        createdAt: updatedSeller.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error updating seller: " + error.message);
    }
  }

  async delete(input: DeleteSellerInputDto): Promise<void> {
    const aSeller = await this.prismaClient.seller.findUnique({
      where: { id: input.sellerId, companyId: input.companyId },
    });

    if (!aSeller) {
      throw new Error("Seller not found.");
    }

    try {
      await this.prismaClient.seller.delete({
        where: { id: input.sellerId, companyId: input.companyId },
      });
    } catch (error: any) {
      throw new Error("Error deleting seller: " + error.message);
    }
  }

  async findById(input: FindSellerInputDto): Promise<Seller | null> {
    try {
      const sellers = await this.prismaClient.seller.findUnique({
        where: { id: input.sellerId, companyId: input.companyId },
        include: { sales: true },
      });

      if (!sellers) return null;

      return Seller.with({
        id: sellers.id,
        name: sellers.name,
        email: sellers.email,
        phone: sellers.phone ?? "",
        photo: sellers.photo ?? "",
        photoPublicId: sellers.photoPublicId ?? "",
        sales: sellers.sales,
        companyId: sellers.companyId,
        createdAt: sellers.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding Event: " + error.message);
    }
  }

  async findByEmail(input: FindSellerByEmailInputDto): Promise<Seller | null> {
    try {
      const seller = await this.prismaClient.seller.findUnique({
        where: {
          companyId_email: {
            email: input.email,
            companyId: input.companyId ?? "",
          },
        },
        // include: { events: true },
      });

      if (!seller) return null;

      return Seller.with({
        id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone ?? "",
        photo: seller.photo ?? "",
        photoPublicId: seller.photoPublicId ?? "",
        companyId: seller.companyId,
        createdAt: seller.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding company: " + error.message);
    }
  }
}
