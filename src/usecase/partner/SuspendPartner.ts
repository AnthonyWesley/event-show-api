import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { PlanType, StatusType } from "../../domain/entities/partner/Partner";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type SuspendPartnerInputDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  maxConcurrentEvents: number;
  plan: PlanType;
};
export type SuspendPartnerOutputDto = {
  id: string;
};

export class SuspendPartner
  implements IUseCases<SuspendPartnerInputDto, SuspendPartnerOutputDto>
{
  private constructor(private readonly partnerGateway: IPartnerGateway) {}

  static create(partnerGateway: IPartnerGateway) {
    return new SuspendPartner(partnerGateway);
  }

  async execute(
    input: SuspendPartnerInputDto
  ): Promise<SuspendPartnerOutputDto> {
    const existingPartner = await this.partnerGateway.findById(input.id);
    if (!existingPartner) {
      throw new NotFoundError("Partner");
    }

    await this.partnerGateway.suspendPartner(existingPartner.id);

    return { id: existingPartner.id };
  }
}
