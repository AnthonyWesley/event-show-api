import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindPartnerProductInputDto = {
  partnerId: string;
  productId: string;
};

export type FindPartnerProductOutputDto = {
  id: string;
  name: string;
  price: number;
  partnerId: string;
  createdAt: Date;
};

export class FindPartnerProduct
  implements IUseCases<FindPartnerProductInputDto, FindPartnerProductOutputDto>
{
  private constructor(
    private readonly productGateway: IProductGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    productGateway: IProductGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new FindPartnerProduct(productGateway, partnerGateway);
  }

  public async execute(
    input: FindPartnerProductInputDto
  ): Promise<FindPartnerProductOutputDto> {
    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new Error("Partner not found.");
    }

    const product = await this.productGateway.findById(input);
    if (!product) {
      throw new NotFoundError("Product");
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      partnerId: product.partnerId,
      createdAt: product.createdAt,
    };
  }
}
