import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { ConflictError } from "../../shared/errors/ConflictError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindSellerByEmailInputDto = {
  companyId?: string;
  email: string;
};

export type FindSellerByEmailOutputDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  photoPublicId?: string;
  companyId: string;
  // sales     Sale[]
  createdAt: Date;
};

export class FindSellerByEmail
  implements IUseCases<FindSellerByEmailInputDto, FindSellerByEmailOutputDto>
{
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    sellerGateway: ISellerGateway,
    companyGateway: ICompanyGateway
  ) {
    return new FindSellerByEmail(sellerGateway, companyGateway);
  }

  public async execute(
    input: FindSellerByEmailInputDto
  ): Promise<FindSellerByEmailOutputDto> {
    const companyExists = await this.companyGateway.findById(
      input.companyId ?? ""
    );
    if (!companyExists) {
      throw new Error("Company not found.");
    }
    const seller = await this.sellerGateway.findByEmail(input);
    if (!seller) {
      throw new ConflictError("Seller");
    }

    return {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      photo: seller.photo,
      companyId: seller.companyId,
      createdAt: seller.createdAt,
    };
  }
}
