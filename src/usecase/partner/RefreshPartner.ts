import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { IUseCases } from "../IUseCases";
import { Authorization } from "../../infra/http/middlewares/Authorization";
import { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type RefreshInputDto = {
  refreshToken: string;
};

export type RefreshOutputDto = {
  accessToken: string;
};

export class RefreshPartner
  implements IUseCases<RefreshInputDto, RefreshOutputDto>
{
  private constructor(
    private readonly partnerGateway: IPartnerGateway,
    private readonly authorization: Authorization
  ) {}
  static create(partnerGateway: IPartnerGateway, authorization: Authorization) {
    return new RefreshPartner(partnerGateway, authorization);
  }

  async execute(input: RefreshInputDto): Promise<RefreshOutputDto> {
    if (!input.refreshToken) {
      throw new UnauthorizedError("Refresh token is required.");
    }

    let decoded: JwtPayload;
    decoded = this.authorization.verifyToken(input.refreshToken) as JwtPayload;

    const partner = await this.partnerGateway.findById(decoded.id);
    if (!partner) {
      throw new NotFoundError("Partner");
    }

    const newAccessToken = this.authorization.generateToken(
      { id: partner.id, email: partner.email },
      "24h"
    );

    return { accessToken: newAccessToken };
  }
}
