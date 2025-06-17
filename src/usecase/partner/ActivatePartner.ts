import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";

import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type ActivatePartnerInputDto = {
  id: string;
};
export type ActivatePartnerOutputDto = {
  id: string;
};

export class ActivatePartner
  implements IUseCases<ActivatePartnerInputDto, ActivatePartnerOutputDto>
{
  private constructor(private readonly partnerGateway: IPartnerGateway) {}

  static create(partnerGateway: IPartnerGateway) {
    return new ActivatePartner(partnerGateway);
  }

  async execute(
    input: ActivatePartnerInputDto
  ): Promise<ActivatePartnerOutputDto> {
    const existingPartner = await this.partnerGateway.findById(input.id);
    if (!existingPartner) {
      throw new NotFoundError("Partner");
    }

    await this.partnerGateway.activatePartner(existingPartner.id);

    return { id: existingPartner.id };
  }
}
