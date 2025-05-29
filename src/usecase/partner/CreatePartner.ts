import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { PlanType, Partner } from "../../domain/entities/partner/Partner";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type CreatePartnerInputDto = {
  name: string;
  email: string;
  password: string;
  phone: string;
  plan: PlanType;
};

export type CreatePartnerOutputDto = {
  id: string;
};

export class CreatePartner
  implements IUseCases<CreatePartnerInputDto, CreatePartnerOutputDto>
{
  private constructor(private readonly partnerGateway: IPartnerGateway) {}

  public static create(partnerGateway: IPartnerGateway) {
    return new CreatePartner(partnerGateway);
  }

  public async execute(
    input: CreatePartnerInputDto
  ): Promise<CreatePartnerOutputDto> {
    if (!input.name || !input.email || !input.password || !input.plan) {
      throw new ValidationError("All fields are required: name, email, plan.");
    }

    const existPartner = await this.partnerGateway.findByEmail(input.email);
    if (existPartner) {
      throw new UnauthorizedError("E-mail already exist.");
    }

    const aPartner = await Partner.create(
      input.name,
      input.email,
      input.password,
      input.phone,
      input.plan
    );

    await this.partnerGateway.save(aPartner);

    return { id: aPartner.id };
  }
}
