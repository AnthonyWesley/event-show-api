import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type ListProductInputDto = {
  companyId: string;
  // sellerId: string;
  search?: string;
};

export type ListProductOutputDto = {
  products: {
    id: string;
    name: string;
    price: number;
    photo: string;
    photoPublicId: string;
    companyId: string;
    createdAt: Date;
  }[];
};

export class ListProduct
  implements IUseCases<ListProductInputDto, ListProductOutputDto>
{
  private constructor(
    private readonly productGateway: IProductGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    productGateway: IProductGateway,
    companyGateway: ICompanyGateway
  ) {
    return new ListProduct(productGateway, companyGateway);
  }

  public async execute(
    input: ListProductInputDto
  ): Promise<ListProductOutputDto> {
    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
    }
    const aProducts = await this.productGateway.list(
      companyExists.id,
      input.search
    );
    if (!aProducts) {
      throw new Error("Failed do list products");
    }
    return {
      products: aProducts.map((p) => {
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          photo: p.photo ?? "",
          photoPublicId: p.photoPublicId ?? "",
          companyId: p.companyId,
          createdAt: p.createdAt,
        };
      }),
    };
  }
}
