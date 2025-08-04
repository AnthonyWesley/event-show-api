import { ILeadCustomValueGateway } from "../../domain/entities/leadCustomValue/ILeadCustomFieldGateway";
import { IUseCases } from "../IUseCases";

export type DeleteLeadCustomValuesByLeadInputDto = {
  leadId: string;
};

export class DeleteLeadCustomValuesByLead
  implements IUseCases<DeleteLeadCustomValuesByLeadInputDto, void>
{
  private constructor(private readonly gateway: ILeadCustomValueGateway) {}

  public static create(gateway: ILeadCustomValueGateway) {
    return new DeleteLeadCustomValuesByLead(gateway);
  }

  public async execute(
    input: DeleteLeadCustomValuesByLeadInputDto
  ): Promise<void> {
    await this.gateway.deleteByLead(input.leadId);
  }
}
