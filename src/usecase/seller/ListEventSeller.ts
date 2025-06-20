import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type ListEventSellerInputDto = {
  partnerId: string;
  // sellerId: string;
  search?: string;
};

export type ListEventSellerOutputDto = {
  sellers: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photo?: string;
    photoPublicId?: string;
    partnerId: string;
    createdAt: Date;
  }[];
};

export class ListEventSeller
  implements IUseCases<ListEventSellerInputDto, ListEventSellerOutputDto>
{
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    sellerGateway: ISellerGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new ListEventSeller(sellerGateway, partnerGateway);
  }

  public async execute(
    input: ListEventSellerInputDto
  ): Promise<ListEventSellerOutputDto> {
    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new NotFoundError("Partner");
    }

    const aSeller = await this.sellerGateway.list(
      partnerExists.id,
      input.search
    );
    if (!aSeller) {
      throw new Error("Failed to list sellers");
    }

    return {
      sellers: aSeller.map((c) => {
        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          photo: c.photo,
          partnerId: c.partnerId,
          createdAt: c.createdAt,
        };
      }),
    };
  }
}
