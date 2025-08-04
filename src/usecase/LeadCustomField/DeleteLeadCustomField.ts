import { ILeadCustomFieldGateway } from "../../domain/entities/leadCustomField/ILeadCustomFieldGateway";
import { IUseCases } from "../IUseCases";

export type DeleteLeadCustomFieldInputDto = {
  fieldId: string;
  companyId: string;
};

export class DeleteLeadCustomField
  implements IUseCases<DeleteLeadCustomFieldInputDto, void>
{
  private constructor(private readonly gateway: ILeadCustomFieldGateway) {}

  public static create(gateway: ILeadCustomFieldGateway) {
    return new DeleteLeadCustomField(gateway);
  }

  public async execute(input: DeleteLeadCustomFieldInputDto): Promise<void> {
    await this.gateway.delete(input.fieldId, input.companyId);
  }
}
