import { PrismaClient } from "@prisma/client";

import { Product } from "../../../domain/entities/product/Product";
import { IProductGateway } from "../../../domain/entities/product/IProductGateway";
import { DeletePartnerProductInputDto } from "../../../usecase/product/DeleteProduct";
import { UpdatePartnerProductInputDto } from "../../../usecase/product/UpdateProduct";

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
      photo: product.photo,
      partnerId: product.partnerId,
      createdAt: product.createdAt,
    };

    try {
      await this.prismaClient.product.create({ data });
    } catch (error: any) {
      throw new Error("Error saving product: " + error.message);
    }
  }

  async list(partnerId: string, search: string): Promise<Product[]> {
    const filters: any = {
      partnerId,
    };

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        // { price: { contains: search } },
      ];
    }
    const products = await this.prismaClient.product.findMany({
      where: filters,
    });

    return products.map((e) =>
      Product.with({
        id: e.id,
        name: e.name,
        price: e.price,
        photo: e.photo ?? "",
        photoPublicId: e.photoPublicId ?? "",
        partnerId: e.partnerId,
        createdAt: e.createdAt,
      })
    );
  }

  async update(input: UpdatePartnerProductInputDto): Promise<Product> {
    try {
      const dataToUpdate: any = {};

      if (input.name !== undefined) dataToUpdate.name = input.name;
      if (input.price !== undefined) dataToUpdate.price = input.price;
      if (input.photo !== undefined) dataToUpdate.photo = input.photo;
      if (input.photoPublicId !== undefined)
        dataToUpdate.photoPublicId = input.photoPublicId;

      const updatedProduct = await this.prismaClient.product.update({
        where: {
          id: input.productId,
          partnerId: input.partnerId,
        },
        data: dataToUpdate,
        include: { sales: true },
      });

      return Product.with({
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        photo: updatedProduct.photo ?? "",
        photoPublicId: updatedProduct.photoPublicId ?? "",
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
        photo: product.photo ?? "",
        photoPublicId: product.photoPublicId ?? "",
        partnerId: product.partnerId,
        createdAt: product.createdAt,
      });
    } catch (error: any) {
      throw new Error("Error finding product: " + error.message);
    }
  }
}
