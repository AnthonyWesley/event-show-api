import { EventProps } from "../../domain/entities/event/Event";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { PlanType, StatusType } from "../../domain/entities/company/Company";
import { IUseCases } from "../IUseCases";
import { UserProps } from "../../domain/entities/user/User";

export type ListCompanyInputDto = { search?: string };

export type ListCompanyOutputDto = {
  companies: {
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

    photo?: string;

    status: StatusType;
    accessExpiresAt: Date;
    createdAt: Date;
    users: UserProps[];
  }[];
};

export class ListCompany
  implements IUseCases<ListCompanyInputDto, ListCompanyOutputDto>
{
  private constructor(private readonly companyGateway: ICompanyGateway) {}

  public static create(companyGateway: ICompanyGateway) {
    return new ListCompany(companyGateway);
  }

  public async execute(
    input: ListCompanyInputDto
  ): Promise<ListCompanyOutputDto> {
    const aCompanies = await this.companyGateway.list(input.search);
    if (!aCompanies) {
      throw new Error("Failed do list companies");
    }

    return {
      companies: aCompanies.map((c) => ({
        id: c.id,
        name: c.name,
        cnpj: c.cnpj,
        ie: c.ie,
        email: c.email,
        phone: c.phone,
        responsibleName: c.responsibleName,
        address: c.address,
        city: c.city,
        state: c.state,
        zipCode: c.zipCode,
        website: c.website,
        segment: c.segment,
        notes: c.notes,

        photo: c.photo,
        // photoPublicId: c.photoPublicId,

        // plan: c.plan,

        status: c.status,
        accessExpiresAt: c.accessExpiresAt,
        createdAt: c.createdAt,
        // maxConcurrentEvents: c.maxConcurrentEvents,
        users: c.users as UserProps[],
      })),
    };
  }
}
