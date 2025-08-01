import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { ILeadSourceGateway } from "../../domain/entities/leadSource/ILeadSourceGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type DeleteLeadSourceInputDto = {
  companyId: string;
  leadSourceId: string;
};
export class DeleteLeadSource
  implements IUseCases<DeleteLeadSourceInputDto, void>
{
  private constructor(
    private readonly leadSourceGateway: ILeadSourceGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    leadSourceGateway: ILeadSourceGateway,
    companyGateway: ICompanyGateway
  ) {
    return new DeleteLeadSource(leadSourceGateway, companyGateway);
  }

  public async execute(input: DeleteLeadSourceInputDto): Promise<void> {
    const existCompany = await this.companyGateway.findById(input.companyId);
    if (!existCompany) {
      throw new NotFoundError("Company");
    }
    await this.leadSourceGateway.delete(input.leadSourceId);
  }
}
