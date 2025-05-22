import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { PlanType, Partner } from "../../domain/entities/partner/Partner";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type UpdatePartnerInputDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  maxConcurrentEvents: number;

  plan: PlanType;
};
export type UpdatePartnerOutputDto = {
  id: string;
};

export class UpdatePartner
  implements IUseCases<UpdatePartnerInputDto, UpdatePartnerOutputDto>
{
  private constructor(private readonly partnerGateway: IPartnerGateway) {}

  static create(partnerGateway: IPartnerGateway) {
    return new UpdatePartner(partnerGateway);
  }

  async execute(input: UpdatePartnerInputDto): Promise<UpdatePartnerOutputDto> {
    const existingPartner = await this.partnerGateway.findById(input.id);
    if (!existingPartner) {
      throw new NotFoundError("Partner");
    }
    console.log(input.phone);

    const updatedPartner = Partner.with({
      id: existingPartner.id,
      name: input.name,
      email: input.email,
      password: existingPartner.password,
      phone: input.phone,
      plan: input.plan,
      maxConcurrentEvents: input.maxConcurrentEvents,

      products: existingPartner.products,
      status: existingPartner.status,
      events: existingPartner.events,
      trialEndsAt: existingPartner.trialEndsAt,
      createdAt: existingPartner.createdAt,
    });

    await this.partnerGateway.update(updatedPartner.id, updatedPartner);

    return { id: updatedPartner.id };
  }
}
