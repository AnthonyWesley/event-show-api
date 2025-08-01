import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

import { IUseCases } from "../IUseCases";

export type SendMessageInputDto = {
  companyId: string;
  message: string;
};

export type SendMessageOutputDto = {
  message: string;
};

export class SendMessage
  implements IUseCases<SendMessageInputDto, SendMessageOutputDto>
{
  private constructor(private readonly companyGateway: ICompanyGateway) {}

  public static create(companyGateway: ICompanyGateway) {
    return new SendMessage(companyGateway);
  }

  public async execute(
    input: SendMessageInputDto
  ): Promise<SendMessageOutputDto> {
    return { message: input.message };
  }
}
