import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IUseCases } from "../IUseCases";
import { AuthorizationRoute } from "../../infra/http/middlewares/AuthorizationRoute";
import { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUserGateway } from "../../domain/entities/user/IUserGateway";
import { AuthTokenService } from "../../service/AuthTokenService";

export type UserInputDto = {
  refreshToken: string;
};

export type UserOutputDto = {
  accessToken: string;
};

export class RefreshUser implements IUseCases<UserInputDto, UserOutputDto> {
  private constructor(
    private readonly userGateway: IUserGateway,
    private readonly authorization: AuthTokenService
  ) {}
  static create(userGateway: IUserGateway, authorization: AuthTokenService) {
    return new RefreshUser(userGateway, authorization);
  }

  async execute(input: UserInputDto): Promise<UserOutputDto> {
    if (!input.refreshToken) {
      throw new UnauthorizedError("User token is required.");
    }

    let decoded: JwtPayload;
    decoded = this.authorization.verifyToken(input.refreshToken) as JwtPayload;

    const user = await this.userGateway.findById(decoded.id);
    if (!user) {
      throw new NotFoundError("User");
    }

    const newAccessToken = this.authorization.generateToken(
      { id: user.id, email: user.email },
      "24h"
    );

    return { accessToken: newAccessToken };
  }
}
