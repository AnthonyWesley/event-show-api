import { IUseCases } from "../IUseCases";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ILeadSourceGateway } from "../../domain/entities/leadSource/ILeadSourceGateway";
import { LeadSource } from "../../domain/entities/leadSource/LeadSource";
import { ObjectHelper } from "../../shared/utils/ObjectHelper";

export type UpdateLeadSourceInputDto = {
  companyId: string;
  name: string;
  description: string;
  leadSourceId: string;
};

export class UpdateLeadSource
  implements IUseCases<UpdateLeadSourceInputDto, void>
{
  private constructor(
    private readonly leadSourceGateway: ILeadSourceGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    leadSourceGateway: ILeadSourceGateway,
    companyGateway: ICompanyGateway
  ) {
    return new UpdateLeadSource(leadSourceGateway, companyGateway);
  }

  public async execute(input: UpdateLeadSourceInputDto): Promise<void> {
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

    const merged = ObjectHelper.mergePartial(existSource, {
      name: input.name,
      description: input.description,
      companyId: input.companyId,
    });

    const aSource = LeadSource.with(merged);

    await this.leadSourceGateway.update(input.leadSourceId, aSource);
  }
}
