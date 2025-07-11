import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type UpdateProductInputDto = {
  companyId: string;
  productId: string;
  name?: string;
  price?: number;
  photo?: string;
  photoPublicId?: string;
};

export type UpdateProductResponseDto = {
  id: string;
  name: string;
  price: number;
  companyId: string;
  photo?: string;
  photoPublicId?: string;
};

export class UpdateProduct {
  private constructor(
    private readonly productGateway: IProductGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  static create(
    productGateway: IProductGateway,
    companyGateway: ICompanyGateway
  ) {
    return new UpdateProduct(productGateway, companyGateway);
  }

  async execute(
    input: UpdateProductInputDto
  ): Promise<UpdateProductResponseDto> {
    try {
      const companyExists = await this.companyGateway.findById(input.companyId);
      if (!companyExists) {
        throw new NotFoundError("Company");
      }

      const existingProduct = await this.productGateway.findById(input);
      if (!existingProduct) {
        throw new NotFoundError("Product");
      }

      const updatedProduct = await this.productGateway.update(input);
      if (!updatedProduct) {
        throw new Error("Failed to update product");
      }

      return {
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        companyId: updatedProduct.companyId,
      };
    } catch (error: any) {
      console.error("Error updating product:", error.message);
      throw new Error("Failed to update product.");
    }
  }
}
