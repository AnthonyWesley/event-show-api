import { FieldType } from "@prisma/client";
import { ILeadCustomFieldGateway } from "../../domain/entities/leadCustomField/ILeadCustomFieldGateway";
import { LeadCustomField } from "../../domain/entities/leadCustomField/LeadCustomField";
import { IUseCases } from "../IUseCases";

export type CreateLeadCustomFieldInputDto = {
  companyId: string;
  name: string;
  key: string;
  type: FieldType;
  required?: boolean;
  order?: number;
};

export type CreateLeadCustomFieldOutputDto = {
  id: string;
};

export class CreateLeadCustomField
  implements
    IUseCases<CreateLeadCustomFieldInputDto, CreateLeadCustomFieldOutputDto>
{
  private constructor(private readonly gateway: ILeadCustomFieldGateway) {}

  public static create(gateway: ILeadCustomFieldGateway) {
    return new CreateLeadCustomField(gateway);
  }

  public async execute(
    input: CreateLeadCustomFieldInputDto
  ): Promise<CreateLeadCustomFieldOutputDto> {
    const field = LeadCustomField.create(input);
    const saved = await this.gateway.save(field);
    return { id: saved.id };
  }
}
