import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type ActivateCompanyInputDto = {
  id: string;
};
export type ActivateCompanyOutputDto = {
  id: string;
};

export class ActivateCompany
  implements IUseCases<ActivateCompanyInputDto, ActivateCompanyOutputDto>
{
  private constructor(private readonly companyGateway: ICompanyGateway) {}

  static create(companyGateway: ICompanyGateway) {
    return new ActivateCompany(companyGateway);
  }

  async execute(
    input: ActivateCompanyInputDto
  ): Promise<ActivateCompanyOutputDto> {
    const existingCompany = await this.companyGateway.findById(input.id);
    if (!existingCompany) {
      throw new NotFoundError("Company");
    }

    await this.companyGateway.activateCompany(existingCompany.id);

    return { id: existingCompany.id };
  }
}
