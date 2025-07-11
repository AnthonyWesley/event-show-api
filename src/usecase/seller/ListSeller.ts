import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type ListSellerInputDto = {
  companyId: string;
  // sellerId: string;
  search?: string;
};

export type ListSellerOutputDto = {
  sellers: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photo?: string;
    photoPublicId?: string;
    companyId: string;
    createdAt: Date;
  }[];
};

export class ListSeller
  implements IUseCases<ListSellerInputDto, ListSellerOutputDto>
{
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    sellerGateway: ISellerGateway,
    companyGateway: ICompanyGateway
  ) {
    return new ListSeller(sellerGateway, companyGateway);
  }

  public async execute(
    input: ListSellerInputDto
  ): Promise<ListSellerOutputDto> {
    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
    }

    const aSeller = await this.sellerGateway.list(
      companyExists.id,
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
          companyId: c.companyId,
          createdAt: c.createdAt,
        };
      }),
    };
  }
}
