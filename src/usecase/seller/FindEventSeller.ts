import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { SaleProps } from "../../domain/entities/sale/Sale";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindEventSellerInputDto = {
  partnerId: string;
  sellerId: string;
};

export type FindEventSellerOutputDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  partnerId: string;
  sales: SaleProps[];
  createdAt: Date;
};

export class FindEventSeller
  implements IUseCases<FindEventSellerInputDto, FindEventSellerOutputDto>
{
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    sellerGateway: ISellerGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new FindEventSeller(sellerGateway, partnerGateway);
  }

  public async execute(
    input: FindEventSellerInputDto
  ): Promise<FindEventSellerOutputDto> {
    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new Error("Partner not found.");
    }
    const seller = await this.sellerGateway.findById(input);
    if (!seller) {
      throw new NotFoundError("Seller");
    }

    return {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      photo: seller.photo,
      sales: seller.sales ?? [],
      partnerId: seller.partnerId,
      createdAt: seller.createdAt,
    };
  }
}
