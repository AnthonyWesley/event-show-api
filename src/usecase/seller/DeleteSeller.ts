import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type DeleteSellerInputDto = {
  companyId: string;
  sellerId: string;
};

export class DeleteSeller implements IUseCases<DeleteSellerInputDto, void> {
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  static create(
    sellerGateway: ISellerGateway,
    companyGateway: ICompanyGateway
  ) {
    return new DeleteSeller(sellerGateway, companyGateway);
  }

  async execute(input: DeleteSellerInputDto): Promise<void> {
    const companyExists = await this.companyGateway.findById(input.companyId);

    if (!companyExists) {
      throw new NotFoundError("Company not found.");
    }

    await this.sellerGateway.delete(input);
  }
}
