// usecases/admin/ImpersonatePartner.ts

import { IUseCases } from "../IUseCases";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { Authorization } from "../../infra/http/middlewares/Authorization";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";

type Input = { partnerId: string; adminId: string };
type Output = { accessToken: string };

export class ImpersonatePartner implements IUseCases<Input, Output> {
  private constructor(
    private readonly partnerGateway: IPartnerGateway,
    private readonly authorization: Authorization
  ) {}

  static create(partnerGateway: IPartnerGateway, authorization: Authorization) {
    return new ImpersonatePartner(partnerGateway, authorization);
  }

  async execute(input: Input): Promise<Output> {
    const partner = await this.partnerGateway.findById(input.partnerId);
    if (!partner) throw new UnauthorizedError("Partner not found");

    const token = this.authorization.generateToken(
      {
        id: partner.id,
        email: partner.email,
        role: "partner",
        impersonatedBy: input.adminId,
      },
      "1d"
    );

    return { accessToken: token };
  }
}
