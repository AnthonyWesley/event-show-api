import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type SuspendCompanyInputDto = {
  id: string;
};
export type SuspendCompanyOutputDto = {
  id: string;
};

export class SuspendCompany
  implements IUseCases<SuspendCompanyInputDto, SuspendCompanyOutputDto>
{
  private constructor(private readonly companyGateway: ICompanyGateway) {}

  static create(companyGateway: ICompanyGateway) {
    return new SuspendCompany(companyGateway);
  }

  async execute(
    input: SuspendCompanyInputDto
  ): Promise<SuspendCompanyOutputDto> {
    const existingCompany = await this.companyGateway.findById(input.id);
    if (!existingCompany) {
      throw new NotFoundError("Company");
    }

    await this.companyGateway.suspendCompany(existingCompany.id);

    return { id: existingCompany.id };
  }
}
