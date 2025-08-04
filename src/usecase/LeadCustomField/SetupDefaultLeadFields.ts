import { FieldType } from "@prisma/client";
import { ILeadCustomFieldGateway } from "../../domain/entities/leadCustomField/ILeadCustomFieldGateway";

export class SetupDefaultLeadFields {
  constructor(
    private readonly leadCustomFieldGateway: ILeadCustomFieldGateway
  ) {}

  public async execute(input: { companyId: string }): Promise<void> {
    const defaultFields = [
      { name: "CPF", key: "cpf", type: FieldType.STRING, required: true },
      {
        name: "Telefone",
        key: "phone",
        type: FieldType.STRING,
        required: true,
      },
      { name: "Email", key: "email", type: FieldType.STRING, required: false },
      {
        name: "Data de Nascimento",
        key: "birthDate",
        type: FieldType.DATE,
        required: false,
      },
    ];

    await Promise.all(
      defaultFields.map((field) =>
        this.leadCustomFieldGateway.save({
          ...field,
          companyId: input.companyId,
        })
      )
    );
  }
}
