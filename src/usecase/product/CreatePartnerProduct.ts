import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { IUseCases } from "../IUseCases";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { Product } from "../../domain/entities/product/Product";
import { ValidationError } from "../../shared/errors/ValidationError";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type CreatePartnerProductInputDto = {
  name: string;
  price: number;
  partnerId: string;
};

export type CreatePartnerProductOutputDto = {
  id: string;
};

export class CreatePartnerProduct
  implements
    IUseCases<CreatePartnerProductInputDto, CreatePartnerProductOutputDto>
{
  private constructor(
    private readonly productGateway: IProductGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    productGateway: IProductGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new CreatePartnerProduct(productGateway, partnerGateway);
  }

  public async execute(
    input: CreatePartnerProductInputDto
  ): Promise<CreatePartnerProductOutputDto> {
    if (!input.name || !input.price || !input.partnerId) {
      throw new ValidationError(
        "All fields are required: name, price, partnerId."
      );
    }
    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new NotFoundError("Partner");
    }

    const anProduct = Product.create(input.name, input.price, partnerExists.id);
    await this.productGateway.save(anProduct);

    return { id: anProduct.id };
  }
}
