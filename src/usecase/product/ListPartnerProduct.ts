import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type ListPartnerProductInputDto = {
  partnerId: string;
  // sellerId: string;
  search?: string;
};

export type ListPartnerProductOutputDto = {
  products: {
    id: string;
    name: string;
    price: number;
    photo: string;
    photoPublicId: string;
    partnerId: string;
    createdAt: Date;
  }[];
};

export class ListPartnerProduct
  implements IUseCases<ListPartnerProductInputDto, ListPartnerProductOutputDto>
{
  private constructor(
    private readonly productGateway: IProductGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    productGateway: IProductGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new ListPartnerProduct(productGateway, partnerGateway);
  }

  public async execute(
    input: ListPartnerProductInputDto
  ): Promise<ListPartnerProductOutputDto> {
    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new NotFoundError("Partner");
    }
    const aProducts = await this.productGateway.list(
      partnerExists.id,
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
          partnerId: p.partnerId,
          createdAt: p.createdAt,
        };
      }),
    };
  }
}
