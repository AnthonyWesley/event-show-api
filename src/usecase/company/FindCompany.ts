import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { StatusType } from "../../domain/entities/company/Company";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import { LeadCustomFieldProps } from "../../domain/entities/leadCustomField/LeadCustomField";

export type FindCompanyInputDto = { id: string };

export type FindCompanyOutputDto = {
  id: string;
  name: string;
  cnpj?: string;
  ie?: string;
  email?: string;
  phone?: string;
  responsibleName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  segment?: string;
  notes?: string;
  isValueVisible?: boolean;

  photo?: string;
  // photoPublicId?: string;
  leadsCustomField: LeadCustomFieldProps[];
  planId: string;
  status: StatusType;
  accessExpiresAt: Date;
  createdAt: Date;
};

export class FindCompany
  implements IUseCases<FindCompanyInputDto, FindCompanyOutputDto>
{
  private constructor(private readonly companyGateway: ICompanyGateway) {}

  public static create(companyGateway: ICompanyGateway) {
    return new FindCompany(companyGateway);
  }

  public async execute(
    input: FindCompanyInputDto
  ): Promise<FindCompanyOutputDto> {
    const aCompany = await this.companyGateway.findById(input.id);
    if (!aCompany) throw new NotFoundError("Company");

    const planActive = aCompany.subscriptions?.find(
      (sub) => sub.status === "ACTIVE"
    );

    return {
      id: aCompany.id,
      name: aCompany.name,
      cnpj: aCompany.cnpj,
      ie: aCompany.ie,
      email: aCompany.email,
      phone: aCompany.phone,
      responsibleName: aCompany.responsibleName,
      address: aCompany.address,
      city: aCompany.city,
      state: aCompany.state,
      zipCode: aCompany.zipCode,
      website: aCompany.website,
      segment: aCompany.segment,
      isValueVisible: aCompany.isValueVisible,
      notes: aCompany.notes,
      leadsCustomField: aCompany.leadsCustomField as LeadCustomFieldProps[],
      photo: aCompany.photo,
      // photoPublicId: aCompany.photoPublicId,

      planId: planActive?.id ?? "",
      status: aCompany.status,
      accessExpiresAt: aCompany.accessExpiresAt,
      createdAt: aCompany.createdAt,
    };
  }
}
