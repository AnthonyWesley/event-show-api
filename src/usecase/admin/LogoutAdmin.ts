import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { IUseCases } from "../IUseCases";
import { Authorization } from "../../infra/http/middlewares/Authorization";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { IAdminGateway } from "../../domain/entities/admin/IAdminGateway";

export type LogoutAdminInputDto = {
  refreshToken: string;
};

export type LogoutAdminOutputDto = {
  message: string;
};

export class LogoutAdmin
  implements IUseCases<LogoutAdminInputDto, LogoutAdminOutputDto>
{
  private constructor(
    private readonly adminGateway: IAdminGateway,
    private readonly authorization: Authorization
  ) {}

  static create(adminGateway: IAdminGateway, authorization: Authorization) {
    return new LogoutAdmin(adminGateway, authorization);
  }

  async execute(input: LogoutAdminInputDto): Promise<LogoutAdminOutputDto> {
    const refreshToken = await this.adminGateway.findByRefreshToken(
      input.refreshToken
    );

    if (!refreshToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    return { message: "Logout completed" };
  }
}
