import { FieldType } from "@prisma/client";
import { ILeadCustomFieldGateway } from "../../domain/entities/leadCustomField/ILeadCustomFieldGateway";
import { IUseCases } from "../IUseCases";

export type UpdateLeadCustomFieldInputDto = {
  id: string;
  companyId: string;
  name?: string;
  key?: string;
  type?: FieldType;
  required?: boolean;
  order?: number;
};

export class UpdateLeadCustomField
  implements IUseCases<UpdateLeadCustomFieldInputDto, void>
{
  private constructor(private readonly gateway: ILeadCustomFieldGateway) {}

  public static create(gateway: ILeadCustomFieldGateway) {
    return new UpdateLeadCustomField(gateway);
  }

  public async execute(input: UpdateLeadCustomFieldInputDto): Promise<void> {
    await this.gateway.update(input);
  }
}
