import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IUseCases } from "../IUseCases";
import { AuthorizationRoute } from "../../infra/http/middlewares/AuthorizationRoute";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { IUserGateway } from "../../domain/entities/user/IUserGateway";
import { AuthTokenService } from "../../service/AuthTokenService";

export type LogoutInputDto = {
  refreshToken: string;
};

export type LogoutOutputDto = {
  message: string;
};

export class LogoutUser implements IUseCases<LogoutInputDto, LogoutOutputDto> {
  private constructor(
    private readonly userGateway: IUserGateway,
    private readonly authorization: AuthTokenService
  ) {}

  static create(userGateway: IUserGateway, authorization: AuthTokenService) {
    return new LogoutUser(userGateway, authorization);
  }

  async execute(input: LogoutInputDto): Promise<LogoutOutputDto> {
    const refreshToken = await this.userGateway.findByRefreshToken(
      input.refreshToken
    );

    if (!refreshToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    return { message: "Logout completed" };
  }
}
