import { PrismaClient } from "@prisma/client";

import { Product } from "../../../domain/entities/product/Product";
import { IProductGateway } from "../../../domain/entities/product/IProductGateway";
import { DeletePartnerProductInputDto } from "../../../usecase/product/DeletePartnerProduct";
import { UpdatePartnerProductInputDto } from "../../../usecase/product/UpdatePartnerProduct";

export class ProductRepositoryPrisma implements IProductGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new ProductRepositoryPrisma(prismaClient);
  }

  async save(product: Product): Promise<void> {
    const data = {
      id: product.id,
      name: product.name,
      price: product.price,
      partnerId: product.partnerId,
      createdAt: product.createdAt,
    };

    try {
      await this.prismaClient.product.create({ data });
    } catch (error: any) {
      throw new Error("Error saving product: " + error.message);
    }
  }

  async list(partnerId: string): Promise<Product[]> {
    const products = await this.prismaClient.product.findMany({
      where: { partnerId },
      include: { sales: true },
    });

    return products.map((e) =>
      Product.with({
        id: e.id,
        name: e.name,
        price: e.price,
        partnerId: e.partnerId,
        createdAt: e.createdAt,
      })
    );
  }

  async update(input: UpdatePartnerProductInputDto): Promise<Product> {
    try {
      const updatedProduct = await this.prismaClient.product.update({
        where: { id: input.productId, partnerId: input.partnerId },
        data: {
          name: input.name,
          price: input.price,
          partnerId: input.partnerId,
        },
        include: { sales: true },
      });

      return Product.with({
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        partnerId: updatedProduct.partnerId,
        createdAt: updatedProduct.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error updating product: " + error.message);
    }
  }

  async delete(input: DeletePartnerProductInputDto): Promise<void> {
    const product = await this.prismaClient.product.findUnique({
      where: { id: input.productId, partnerId: input.partnerId },
    });

    if (!product) {
      throw new Error("Product not found or does not belong to the partner.");
    }

    try {
      await this.prismaClient.product.delete({
        where: { id: input.productId, partnerId: input.partnerId },
      });
    } catch (error: any) {
      throw new Error("Error deleting product: " + error.message);
    }
  }

  async findById(input: DeletePartnerProductInputDto): Promise<Product | null> {
    try {
      const product = await this.prismaClient.product.findUnique({
        where: { id: input.productId, partnerId: input.partnerId },
        include: { sales: true },
      });

      if (!product) return null;

      return Product.with({
        id: product.id,
        name: product.name,
        price: product.price,
        partnerId: product.partnerId,
        createdAt: product.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding product: " + error.message);
    }
  }
}
