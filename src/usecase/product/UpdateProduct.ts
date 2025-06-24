import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type UpdateProductInputDto = {
  partnerId: string;
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
  partnerId: string;
  photo?: string;
  photoPublicId?: string;
};

export class UpdateProduct {
  private constructor(
    private readonly productGateway: IProductGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  static create(
    productGateway: IProductGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new UpdateProduct(productGateway, partnerGateway);
  }

  async execute(
    input: UpdateProductInputDto
  ): Promise<UpdateProductResponseDto> {
    try {
      const partnerExists = await this.partnerGateway.findById(input.partnerId);
      if (!partnerExists) {
        throw new NotFoundError("Partner");
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
        partnerId: updatedProduct.partnerId,
      };
    } catch (error: any) {
      console.error("Error updating product:", error.message);
      throw new Error("Failed to update product.");
    }
  }
}
