import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { ILeadSourceGateway } from "../../domain/entities/leadSource/ILeadSourceGateway";
import { LeadSource } from "../../domain/entities/leadSource/LeadSource";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type ListLeadSourceInputDto = {
  companyId: string;
  // leadSourceId: string;
  search?: string;
};

export class ListLeadSource
  implements IUseCases<ListLeadSourceInputDto, LeadSource[]>
{
  private constructor(
    private readonly leadSourceGateway: ILeadSourceGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    leadSourceGateway: ILeadSourceGateway,
    companyGateway: ICompanyGateway
  ) {
    return new ListLeadSource(leadSourceGateway, companyGateway);
  }

  public async execute(input: ListLeadSourceInputDto): Promise<LeadSource[]> {
    const existCompany = await this.companyGateway.findById(input.companyId);
    if (!existCompany) {
      throw new NotFoundError("Company");
    }
    return this.leadSourceGateway.list(input.companyId, input.search);
  }
}
