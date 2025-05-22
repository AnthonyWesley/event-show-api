import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { PlanType, StatusType } from "../../domain/entities/partner/Partner";

import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindPartnerInputDto = { id: string };

export type FindPartnerOutputDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  maxConcurrentEvents: number;

  plan: PlanType;
  status: StatusType;
  trialEndsAt: Date;
  createdAt: Date;
};

export class FindPartner
  implements IUseCases<FindPartnerInputDto, FindPartnerOutputDto>
{
  private constructor(private readonly partnerGateway: IPartnerGateway) {}

  public static create(partnerGateway: IPartnerGateway) {
    return new FindPartner(partnerGateway);
  }

  public async execute(
    input: FindPartnerInputDto
  ): Promise<FindPartnerOutputDto> {
    const aPartner = await this.partnerGateway.findById(input.id);
    if (!aPartner) throw new NotFoundError("Partner");

    return {
      id: aPartner.id,
      name: aPartner.name,
      email: aPartner.email,
      phone: aPartner.phone,
      plan: aPartner.plan,
      maxConcurrentEvents: aPartner.maxConcurrentEvents,

      status: aPartner.status,
      trialEndsAt: aPartner.trialEndsAt,
      createdAt: aPartner.createdAt,
    };
  }
}
