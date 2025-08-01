import { PrismaClient } from "@prisma/client";
import { Product } from "../../../domain/entities/product/Product";
import { IProductGateway } from "../../../domain/entities/product/IProductGateway";
import { DeleteProductInputDto } from "../../../usecase/product/DeleteProduct";
import { UpdateProductInputDto } from "../../../usecase/product/UpdateProduct";
import { ObjectHelper } from "../../../shared/utils/ObjectHelper";

export class ProductRepositoryPrisma implements IProductGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new ProductRepositoryPrisma(prisma);
  }

  async save(product: Product): Promise<void> {
    const data = {
      id: product.id,
      name: product.name,
      price: product.price,
      photo: product.photo,
      companyId: product.companyId,
      createdAt: product.createdAt,
    };

    try {
      await this.prisma.product.create({ data });
    } catch (error: any) {
      throw new Error("Error saving product: " + error.message);
    }
  }

  async list(companyId: string, search?: string): Promise<Product[]> {
    const filters: any = { companyId };

    if (search) {
      filters.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    const products = await this.prisma.product.findMany({
      where: filters,
    });

    return products.map(this.toEntity);
  }

  async countByCompany(companyId: string): Promise<number> {
    return await this.prisma.product.count({
      where: { companyId },
    });
  }

  async update(input: UpdateProductInputDto): Promise<Product> {
    try {
      const dataToUpdate = ObjectHelper.removeUndefinedFields({
        name: input.name,
        price: input.price,
        photo: input.photo,
        photoPublicId: input.photoPublicId,
      });

      const updatedProduct = await this.prisma.product.update({
        where: {
          id: input.productId,
          companyId: input.companyId,
        },
        data: dataToUpdate,
        include: { sales: true },
      });

      return this.toEntity(updatedProduct);
    } catch (error: any) {
      throw new Error("Error updating product: " + error.message);
    }
  }

  async delete(input: DeleteProductInputDto): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: input.productId, companyId: input.companyId },
    });

    if (!product) {
      throw new Error("Product not found or does not belong to the company.");
    }

    try {
      await this.prisma.product.delete({
        where: { id: input.productId, companyId: input.companyId },
      });
    } catch (error: any) {
      throw new Error("Error deleting product: " + error.message);
    }
  }

  async findById(input: DeleteProductInputDto): Promise<Product | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: input.productId, companyId: input.companyId },
        include: { sales: true },
      });

      if (!product) return null;

      return this.toEntity(product);
    } catch (error: any) {
      throw new Error("Error finding product: " + error.message);
    }
  }

  private toEntity(raw: any): Product {
    return Product.with({
      id: raw.id,
      name: raw.name,
      price: raw.price,
      photo: raw.photo ?? "",
      photoPublicId: raw.photoPublicId ?? "",
      companyId: raw.companyId,
      createdAt: raw.createdAt,
    });
  }
}
