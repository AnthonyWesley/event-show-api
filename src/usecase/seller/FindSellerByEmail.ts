import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindSellerByEmailInputDto = {
  partnerId?: string;
  email: string;
};

export type FindSellerByEmailOutputDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  photoPublicId?: string;
  partnerId: string;
  // sales     Sale[]
  createdAt: Date;
};

export class FindSellerByEmail
  implements IUseCases<FindSellerByEmailInputDto, FindSellerByEmailOutputDto>
{
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    sellerGateway: ISellerGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new FindSellerByEmail(sellerGateway, partnerGateway);
  }

  public async execute(
    input: FindSellerByEmailInputDto
  ): Promise<FindSellerByEmailOutputDto> {
    const partnerExists = await this.partnerGateway.findById(
      input.partnerId ?? ""
    );
    if (!partnerExists) {
      throw new Error("Partner not found.");
    }
    const seller = await this.sellerGateway.findByEmail(input);
    if (!seller) {
      throw new NotFoundError("Seller");
    }

    return {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      photo: seller.photo,
      partnerId: seller.partnerId,
      createdAt: seller.createdAt,
    };
  }
}
