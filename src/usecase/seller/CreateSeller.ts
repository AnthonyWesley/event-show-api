import { IUseCases } from "../IUseCases";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { Seller } from "../../domain/entities/seller/Seller";
import { ValidationError } from "../../shared/errors/ValidationError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

export type CreateSellerInputDto = {
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  companyId: string;
  // sales     Sale[]
  // createdAt: Date;
};

export type CreateSellerOutputDto = {
  id: string;
};

export class CreateSeller
  implements IUseCases<CreateSellerInputDto, CreateSellerOutputDto>
{
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    sellerGateway: ISellerGateway,
    companyGateway: ICompanyGateway
  ) {
    return new CreateSeller(sellerGateway, companyGateway);
  }

  public async execute(
    input: CreateSellerInputDto
  ): Promise<CreateSellerOutputDto> {
    if (!input.name || !input.email || !input.companyId) {
      throw new ValidationError(
        "All fields are required: name, email, companyId."
      );
    }

    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
    }

    // ✅ Check for existing seller by email
    const existingSeller = await this.sellerGateway.findByEmail({
      email: input.email,
      companyId: input.companyId,
    });

    if (existingSeller) {
      throw new ValidationError("A seller with this email already exists.");
    }

    const anEvent = Seller.create(
      input.name,
      input.email,
      companyExists.id,
      input.phone ?? "",
      input.photo ?? ""
    );

    await this.sellerGateway.save(anEvent);

    return { id: anEvent.id };
  }
}
