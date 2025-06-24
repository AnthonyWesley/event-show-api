import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type UpdateSellerInputDto = {
  partnerId: string;
  sellerId: string;
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  photoPublicId?: string;
  // sales     Sale[]
};

export type UpdateSellerResponseDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  photoPublicId?: string;
  // sales     Sale[]
};

export class UpdateSeller {
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  static create(
    sellerGateway: ISellerGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new UpdateSeller(sellerGateway, partnerGateway);
  }

  async execute(input: UpdateSellerInputDto): Promise<UpdateSellerResponseDto> {
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
      photoPublicId: updatedSeller.photoPublicId,
    };
  }
}
