import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type UpdateEventSellerInputDto = {
  partnerId: string;
  sellerId: string;
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  // sales     Sale[]
};

export type UpdateEventSellerResponseDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  // sales     Sale[]
};

export class UpdateEventSeller {
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  static create(
    sellerGateway: ISellerGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new UpdateEventSeller(sellerGateway, partnerGateway);
  }

  async execute(
    input: UpdateEventSellerInputDto
  ): Promise<UpdateEventSellerResponseDto> {
    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new NotFoundError("Partner");
    }

    const existingSeller = await this.sellerGateway.findById(input);
    if (!existingSeller) {
      throw new NotFoundError("Seller");
    }

    const updatedSeller = await this.sellerGateway.update(input);
    if (!updatedSeller) {
      throw new Error("Failed to update seller");
    }
    return {
      id: updatedSeller.id,
      name: updatedSeller.name,
      email: updatedSeller.email,
      phone: updatedSeller.phone,
      photo: updatedSeller.photo,
    };
  }
}
