import bcrypt from "bcryptjs";
import { IUseCases } from "../IUseCases";
import { ValidationError } from "../../shared/errors/ValidationError";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { IAdminGateway } from "../../domain/entities/admin/IAdminGateway";
import { AuthorizationRoute } from "../../infra/http/middlewares/AuthorizationRoute";
import { AuthTokenService } from "../../service/AuthTokenService";

export type LoginAdminInputDto = {
  email: string;
  password: string;
};

export type TokenType = {
  accessToken: string;
  // refreshToken: string;
};

export type LoginOutputDto = {
  token: TokenType;
};

export class LoginAdmin
  implements IUseCases<LoginAdminInputDto, LoginOutputDto>
{
  private constructor(
    private readonly adminGateway: IAdminGateway,
    private readonly authorization: AuthTokenService
  ) {}

  static create(adminGateway: IAdminGateway, authorization: AuthTokenService) {
    return new LoginAdmin(adminGateway, authorization);
  }

  async execute(input: LoginAdminInputDto): Promise<LoginOutputDto> {
    if (!input.email || !input.password) {
      throw new ValidationError("All fields are required.");
    }

    const admin = await this.adminGateway.findByEmail(input.email);
    if (!admin) throw new UnauthorizedError("Invalid email or password.");

    const isValid = await bcrypt.compare(input.password, admin.password);
    if (!isValid) throw new UnauthorizedError("Invalid email or password.");

    const accessToken = this.authorization.generateToken({
      id: admin.id,
      email: admin.email,
      role: "admin",
    });

    return { token: { accessToken } };
  }
}
