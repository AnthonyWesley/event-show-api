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

  async list(partnerId: string): Promise<Seller[]> {
    try {
      const Sellers = await this.prismaClient.seller.findMany({
        where: { partnerId },
        include: { sales: true },
      });

      return Sellers.map((s) =>
        Seller.with({
          id: s.id,
          name: s.name,
          email: s.email,
          phone: s.phone ?? "",
          photo: s.photo ?? "",
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
      if (input.email) {
        const emailExist = await this.findByEmail({ email: input.email });

        if (emailExist && emailExist.id !== input.sellerId) {
          throw new Error("Email already in use by another seller.");
        }
      }

      const updatedSeller = await this.prismaClient.seller.update({
        where: { id: input.sellerId, partnerId: input.partnerId },
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          photo: input.photo,
          partnerId: input.partnerId,
        },
      });
      return Seller.with({
        id: updatedSeller.id,
        name: updatedSeller.name,
        email: updatedSeller.email,
        phone: updatedSeller.phone ?? "",
        photo: updatedSeller.photo ?? "",
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
        partnerId: seller.partnerId,
        createdAt: seller.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding partner: " + error.message);
    }
  }
}
