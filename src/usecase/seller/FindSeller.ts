import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { SaleProps } from "../../domain/entities/sale/Sale";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindSellerInputDto = {
  companyId: string;
  sellerId: string;
};

export type FindSellerOutputDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  photoPublicId?: string;
  companyId: string;
  sales: SaleProps[];
  createdAt: Date;
};

export class FindSeller
  implements IUseCases<FindSellerInputDto, FindSellerOutputDto>
{
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    sellerGateway: ISellerGateway,
    companyGateway: ICompanyGateway
  ) {
    return new FindSeller(sellerGateway, companyGateway);
  }

  public async execute(
    input: FindSellerInputDto
  ): Promise<FindSellerOutputDto> {
    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new Error("Company not found.");
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
      photoPublicId: seller.photoPublicId,
      sales: seller.sales ?? [],
      companyId: seller.companyId,
      createdAt: seller.createdAt,
    };
  }
}
