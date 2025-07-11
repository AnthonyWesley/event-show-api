import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type DeleteLeadInputDto = {
  companyId: string;
  leadId: string;
};

export class DeleteLead {
  constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  static create(leadGateway: ILeadGateway, companyGateway: ICompanyGateway) {
    return new DeleteLead(leadGateway, companyGateway);
  }

  async execute(input: DeleteLeadInputDto): Promise<void> {
    const company = await this.companyGateway.findById(input.companyId);
    if (!company) {
      throw new NotFoundError("Company");
    }

    const lead = await this.leadGateway.findById({
      leadId: input.leadId,
      companyId: input.companyId,
    });
    if (!lead) {
      throw new NotFoundError("Lead");
    }

    await this.leadGateway.delete(input);
  }
}
