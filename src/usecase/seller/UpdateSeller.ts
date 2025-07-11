import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type UpdateSellerInputDto = {
  companyId: string;
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
    private readonly companyGateway: ICompanyGateway
  ) {}

  static create(
    sellerGateway: ISellerGateway,
    companyGateway: ICompanyGateway
  ) {
    return new UpdateSeller(sellerGateway, companyGateway);
  }

  async execute(input: UpdateSellerInputDto): Promise<UpdateSellerResponseDto> {
    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
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
