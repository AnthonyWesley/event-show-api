import { PrismaClient } from "@prisma/client";
import { ISellerGateway } from "../../../domain/entities/seller/ISellerGateway";
import { Seller } from "../../../domain/entities/seller/Seller";
import { FindEventSellerInputDto } from "../../../usecase/seller/FindEventSeller";
import { DeleteEventSellerInputDto } from "../../../usecase/seller/DeleteEventSeller";
import { UpdateEventSellerInputDto } from "../../../usecase/seller/UpdateEventSeller";
import { FindEventSellerByEmailInputDto } from "../../../usecase/seller/FindEventSellerByEmail";

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
      partnerId: seller.partnerId,
      createdAt: seller.createdAt,
    };

    try {
      await this.prismaClient.seller.create({ data });
    } catch (error: any) {
      throw new Error("Error saving Seller: " + error.message);
    }
  }

  async list(partnerId: string, search?: string): Promise<Seller[]> {
    try {
      const filters: any = {
        partnerId,
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
          partnerId: s.partnerId,
          createdAt: s.createdAt,
        })
      );
    } catch (error: any) {
      throw new Error("Error listing seller: " + error.message);
    }
  }

  async update(input: UpdateEventSellerInputDto): Promise<Seller> {
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
        where: { id: input.sellerId, partnerId: input.partnerId },
        data: dataToUpdate,
      });

      return Seller.with({
        id: updatedSeller.id,
        name: updatedSeller.name,
        email: updatedSeller.email,
        phone: updatedSeller.phone ?? "",
        photo: updatedSeller.photo ?? "",
        photoPublicId: updatedSeller.photoPublicId ?? "",
        partnerId: updatedSeller.partnerId,
        createdAt: updatedSeller.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error updating seller: " + error.message);
    }
  }

  async delete(input: DeleteEventSellerInputDto): Promise<void> {
    const aSeller = await this.prismaClient.seller.findUnique({
      where: { id: input.sellerId, partnerId: input.partnerId },
    });

    if (!aSeller) {
      throw new Error("Seller not found.");
    }

    try {
      await this.prismaClient.seller.delete({
        where: { id: input.sellerId, partnerId: input.partnerId },
      });
    } catch (error: any) {
      throw new Error("Error deleting seller: " + error.message);
    }
  }

  async findById(input: FindEventSellerInputDto): Promise<Seller | null> {
    try {
      const sellers = await this.prismaClient.seller.findUnique({
        where: { id: input.sellerId, partnerId: input.partnerId },
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
        partnerId: sellers.partnerId,
        createdAt: sellers.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding Event: " + error.message);
    }
  }

  async findByEmail(
    input: FindEventSellerByEmailInputDto
  ): Promise<Seller | null> {
    try {
      const seller = await this.prismaClient.seller.findUnique({
        where: {
          partnerId_email: {
            email: input.email,
            partnerId: input.partnerId ?? "",
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
        partnerId: seller.partnerId,
        createdAt: seller.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding partner: " + error.message);
    }
  }
}
