import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type DeleteProductInputDto = {
  companyId: string;
  productId: string;
};

export class DeleteProduct implements IUseCases<DeleteProductInputDto, void> {
  private constructor(
    private readonly productGateway: IProductGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  static create(
    productGateway: IProductGateway,
    companyGateway: ICompanyGateway
  ) {
    return new DeleteProduct(productGateway, companyGateway);
  }

  async execute(input: DeleteProductInputDto): Promise<void> {
    const companyExists = await this.companyGateway.findById(input.companyId);

    if (!companyExists) {
      throw new NotFoundError("Company not found.");
    }
    await this.productGateway.delete(input);
  }
}
