import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindProductInputDto = {
  companyId: string;
  productId: string;
};

export type FindProductOutputDto = {
  id: string;
  name: string;
  price: number;
  photo: string;
  photoPublicId: string;
  companyId: string;
  createdAt: Date;
};

export class FindProduct
  implements IUseCases<FindProductInputDto, FindProductOutputDto>
{
  private constructor(
    private readonly productGateway: IProductGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    productGateway: IProductGateway,
    companyGateway: ICompanyGateway
  ) {
    return new FindProduct(productGateway, companyGateway);
  }

  public async execute(
    input: FindProductInputDto
  ): Promise<FindProductOutputDto> {
    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new Error("Company not found.");
    }

    const product = await this.productGateway.findById(input);
    if (!product) {
      throw new NotFoundError("Product");
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      photo: product.photo ?? "",
      photoPublicId: product.photoPublicId ?? "",
      companyId: product.companyId,
      createdAt: product.createdAt,
    };
  }
}
