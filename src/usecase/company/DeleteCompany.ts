import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type DeleteCompanyInputDto = {
  id: string;
};

export class DeleteCompany implements IUseCases<DeleteCompanyInputDto, void> {
  private constructor(readonly companyGateway: ICompanyGateway) {}

  static create(companyGateway: ICompanyGateway) {
    return new DeleteCompany(companyGateway);
  }

  async execute({ id }: DeleteCompanyInputDto): Promise<void> {
    if (!id) {
      throw new ValidationError("Id is required.");
    }
    await this.companyGateway.delete(id);
  }
}
