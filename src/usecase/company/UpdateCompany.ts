import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { PlanType, Company } from "../../domain/entities/company/Company";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type UpdateCompanyInputDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plan: PlanType;
  cnpj?: string;
  ie?: string;
  responsibleName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  segment?: string;
  notes?: string;
  photo?: string;
  photoPublicId?: string;
  maxConcurrentEvents: number;
};
export type UpdateCompanyOutputDto = {
  id: string;
};

export class UpdateCompany
  implements IUseCases<UpdateCompanyInputDto, UpdateCompanyOutputDto>
{
  private constructor(private readonly companyGateway: ICompanyGateway) {}

  static create(companyGateway: ICompanyGateway) {
    return new UpdateCompany(companyGateway);
  }

  async execute(input: UpdateCompanyInputDto): Promise<UpdateCompanyOutputDto> {
    const existingCompany = await this.companyGateway.findById(input.id);
    if (!existingCompany) {
      throw new NotFoundError("Company");
    }

    const updatedCompany = Company.with({
      id: existingCompany.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      plan: existingCompany.plan,
      products: existingCompany.products,
      status: existingCompany.status,
      events: existingCompany.events,
      accessExpiresAt: existingCompany.accessExpiresAt,
      createdAt: existingCompany.createdAt,
      cnpj: input.cnpj,
      ie: input.ie,
      responsibleName: input.responsibleName,
      address: input.address,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      website: input.website,
      segment: input.segment,
      notes: input.notes,
      photo: input.photo,
      photoPublicId: input.photoPublicId,
    });

    if (input.plan !== existingCompany.plan) {
      updatedCompany.updatePlan(input.plan);
    }

    await this.companyGateway.update(updatedCompany.id, updatedCompany);

    return { id: updatedCompany.id };
  }
}
