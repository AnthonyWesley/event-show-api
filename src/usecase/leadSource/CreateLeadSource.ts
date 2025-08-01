import { IUseCases } from "../IUseCases";
import { ValidationError } from "../../shared/errors/ValidationError";
import { LeadSource } from "../../domain/entities/leadSource/LeadSource";
import { ILeadSourceGateway } from "../../domain/entities/leadSource/ILeadSourceGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type CreateLeadSourceInputDto = {
  companyId: string;
  name: string;
  description: string;
};

export type CreateLeadSourceOutputDto = {
  id: string;
};

export class CreateLeadSource
  implements IUseCases<CreateLeadSourceInputDto, CreateLeadSourceOutputDto>
{
  private constructor(
    private readonly leadSourceGateway: ILeadSourceGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    leadSourceGateway: ILeadSourceGateway,
    companyGateway: ICompanyGateway
  ) {
    return new CreateLeadSource(leadSourceGateway, companyGateway);
  }

  public async execute(
    input: CreateLeadSourceInputDto
  ): Promise<CreateLeadSourceOutputDto> {
    if (!input.name || !input.companyId) {
      throw new ValidationError("All fields are required: name.");
    }

    const existCompany = await this.companyGateway.findById(input.companyId);
    if (!existCompany) {
      throw new NotFoundError("Company");
    }

    const leadSource = LeadSource.create({
      name: input.name,
      description: input.description,
      companyId: existCompany.id,
    });

    await this.leadSourceGateway.save(leadSource);
    return { id: leadSource.id };
  }
}
