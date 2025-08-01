import { IUseCases } from "../IUseCases";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ILeadSourceGateway } from "../../domain/entities/leadSource/ILeadSourceGateway";
import { LeadSource } from "../../domain/entities/leadSource/LeadSource";

export type FindLeadSourceInputDto = {
  companyId: string;
  leadSourceId: string;
};

export class FindLeadSource
  implements IUseCases<FindLeadSourceInputDto, LeadSource>
{
  private constructor(
    private readonly leadSourceGateway: ILeadSourceGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    leadSourceGateway: ILeadSourceGateway,
    companyGateway: ICompanyGateway
  ) {
    return new FindLeadSource(leadSourceGateway, companyGateway);
  }

  public async execute(input: FindLeadSourceInputDto): Promise<LeadSource> {
    const existCompany = await this.companyGateway.findById(input.companyId);
    if (!existCompany) {
      throw new NotFoundError("Company");
    }

    const existSource = await this.leadSourceGateway.findById(
      input.leadSourceId
    );
    if (!existSource) {
      throw new NotFoundError("LeadSource");
    }

    return LeadSource.with({
      id: existSource.id,
      name: existSource.name,
      description: existSource.description ?? "",
      photo: existSource.photo ?? "",
      photoPublicId: existSource.photoPublicId ?? "",
      companyId: existSource.companyId,
      createdAt: existSource.createdAt,
      leads: existSource.leads,
    });
  }
}
