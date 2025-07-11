import { PrismaClient } from "@prisma/client";
import { Sale } from "../../../domain/entities/sale/Sale";
import { ISaleGateway } from "../../../domain/entities/sale/ISaleGateway";
import { UpdateSaleInputDto } from "../../../usecase/sale/UpdateSale";
import { DeleteSaleInputDto } from "../../../usecase/sale/DeleteSale";
import {
  FindSaleInputDto,
  FindSaleOutputDto,
} from "../../../usecase/sale/FindSale";

export class SaleRepositoryPrisma implements ISaleGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new SaleRepositoryPrisma(prismaClient);
  }

  async save(sale: Sale): Promise<void> {
    const data = {
      id: sale.id,
      productId: sale.productId,
      eventId: sale.eventId,
      sellerId: sale.sellerId,
      quantity: sale.quantity,
      // total: sale.total,

      createdAt: sale.createdAt,
    };

    try {
      await this.prismaClient.sale.create({ data });
    } catch (error: any) {
      throw new Error("Error saving product: " + error.message);
    }
  }

  async list(eventId: string): Promise<Sale[]> {
    const sales = await this.prismaClient.sale.findMany({
      where: { eventId },
      // include: { sales: true },
    });

    return sales.map((s) =>
      Sale.with({
        id: s.id,
        eventId: s.eventId,
        sellerId: s.sellerId,
        productId: s.productId,
        quantity: s.quantity,
        createdAt: s.createdAt,
        // total: s.total,
      })
    );
  }

  async update(input: UpdateSaleInputDto): Promise<Sale> {
    try {
      const updatedSale = await this.prismaClient.sale.update({
        where: {
          id: input.saleId,
        },
        data: {
          quantity: input.quantity,
        },
      });

      return Sale.with({
        id: updatedSale.id,
        quantity: updatedSale.quantity,
        // total: updatedSale.total,
        eventId: updatedSale.eventId,
        productId: updatedSale.productId,
        sellerId: updatedSale.sellerId,
        createdAt: updatedSale.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error updating sale: " + error.message);
    }
  }

  async delete(input: DeleteSaleInputDto): Promise<void> {
    const product = await this.prismaClient.sale.findUnique({
      where: { id: input.saleId },
    });

    if (!product) {
      throw new Error("Sale not found or does not belong to the company.");
    }

    try {
      await this.prismaClient.sale.delete({
        where: { id: input.saleId, eventId: input.eventId },
      });
    } catch (error: any) {
      throw new Error("Error deleting product: " + error.message);
    }
  }

  async findById(input: FindSaleInputDto): Promise<FindSaleOutputDto | null> {
    try {
      const sale = await this.prismaClient.sale.findUnique({
        where: {
          id: input.saleId,
          eventId: input.eventId,
        },
        include: { seller: true, product: true },
      });

      if (!sale) return null;

      return Sale.with({
        id: sale.id,
        eventId: sale.eventId,
        sellerId: sale.sellerId,
        productId: sale.productId,
        quantity: sale.quantity,
        product: {
          id: sale.product.id,
          name: sale.product.name,
          price: sale.product.price,
        },
        seller: {
          id: sale.seller.id,
          name: sale.seller.name,
        },
        createdAt: sale.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding product: " + error.message);
    }
  }
}
