import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { IUseCases } from "../IUseCases";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { Product } from "../../domain/entities/product/Product";
import { ValidationError } from "../../shared/errors/ValidationError";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type CreateProductInputDto = {
  name: string;
  price: number;
  companyId: string;
};

export type CreateProductOutputDto = {
  id: string;
};

export class CreateProduct
  implements IUseCases<CreateProductInputDto, CreateProductOutputDto>
{
  private constructor(
    private readonly productGateway: IProductGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    productGateway: IProductGateway,
    companyGateway: ICompanyGateway
  ) {
    return new CreateProduct(productGateway, companyGateway);
  }

  public async execute(
    input: CreateProductInputDto
  ): Promise<CreateProductOutputDto> {
    if (!input.name || !input.price || !input.companyId) {
      throw new ValidationError(
        "All fields are required: name, price, companyId."
      );
    }
    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
    }

    const anProduct = Product.create(input.name, input.price, companyExists.id);
    await this.productGateway.save(anProduct);

    return { id: anProduct.id };
  }
}
