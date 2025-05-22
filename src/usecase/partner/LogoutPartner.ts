import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { IUseCases } from "../IUseCases";
import { Authorization } from "../../infra/http/middlewares/Authorization";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";

export type LogoutInputDto = {
  refreshToken: string;
};

export type LogoutOutputDto = {
  message: string;
};

export class LogoutPartner
  implements IUseCases<LogoutInputDto, LogoutOutputDto>
{
  private constructor(
    private readonly partnerGateway: IPartnerGateway,
    private readonly authorization: Authorization
  ) {}

  static create(partnerGateway: IPartnerGateway, authorization: Authorization) {
    return new LogoutPartner(partnerGateway, authorization);
  }

  async execute(input: LogoutInputDto): Promise<LogoutOutputDto> {
    const refreshToken = await this.partnerGateway.findByRefreshToken(
      input.refreshToken
    );

    if (!refreshToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    return { message: "Logout completed" };
  }
}
