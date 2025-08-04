import { ILeadCustomValueGateway } from "../../domain/entities/leadCustomValue/ILeadCustomFieldGateway";
import { IUseCases } from "../IUseCases";

export type UpsertLeadCustomValueInputDto = {
  leadId: string;
  fieldId: string;
  value: string;
};

export class UpsertLeadCustomValues
  implements IUseCases<UpsertLeadCustomValueInputDto[], void>
{
  private constructor(private readonly gateway: ILeadCustomValueGateway) {}

  public static create(gateway: ILeadCustomValueGateway) {
    return new UpsertLeadCustomValues(gateway);
  }

  public async execute(input: UpsertLeadCustomValueInputDto[]): Promise<void> {
    if (!input.length) return;
    await this.gateway.upsertMany(input);
  }
}
