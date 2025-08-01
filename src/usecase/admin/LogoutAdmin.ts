import { IUseCases } from "../IUseCases";
import { AuthorizationRoute } from "../../infra/http/middlewares/AuthorizationRoute";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { IAdminGateway } from "../../domain/entities/admin/IAdminGateway";
import { AuthTokenService } from "../../service/AuthTokenService";

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
    private readonly authorization: AuthTokenService
  ) {}

  static create(adminGateway: IAdminGateway, authorization: AuthTokenService) {
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
