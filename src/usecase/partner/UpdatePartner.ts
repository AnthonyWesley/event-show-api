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

    const updatedPartner = Partner.with({
      id: existingPartner.id,
      name: input.name,
      email: input.email,
      password: existingPartner.password,
      phone: input.phone,
      plan: existingPartner.plan,
      products: existingPartner.products,
      status: existingPartner.status,
      events: existingPartner.events,
      accessExpiresAt: existingPartner.accessExpiresAt,
      createdAt: existingPartner.createdAt,
    });

    if (input.plan !== existingPartner.plan) {
      updatedPartner.updatePlan(input.plan);
    }

    await this.partnerGateway.update(updatedPartner.id, updatedPartner);

    return { id: updatedPartner.id };
  }
}
