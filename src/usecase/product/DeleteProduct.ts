import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type DeleteProductInputDto = {
  partnerId: string;
  productId: string;
};

export class DeleteProduct implements IUseCases<DeleteProductInputDto, void> {
  private constructor(
    private readonly productGateway: IProductGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  static create(
    productGateway: IProductGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new DeleteProduct(productGateway, partnerGateway);
  }

  async execute(input: DeleteProductInputDto): Promise<void> {
    const partnerExists = await this.partnerGateway.findById(input.partnerId);

    if (!partnerExists) {
      throw new NotFoundError("Partner not found.");
    }
    await this.productGateway.delete(input);
  }
}
