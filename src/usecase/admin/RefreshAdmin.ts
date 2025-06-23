import { IUseCases } from "../IUseCases";
import { Authorization } from "../../infra/http/middlewares/Authorization";
import { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IAdminGateway } from "../../domain/entities/admin/IAdminGateway";

export type RefreshInputDto = {
  refreshToken: string;
};

export type RefreshOutputDto = {
  accessToken: string;
};

export class RefreshAdmin
  implements IUseCases<RefreshInputDto, RefreshOutputDto>
{
  private constructor(
    private readonly adminGateway: IAdminGateway,
    private readonly authorization: Authorization
  ) {}
  static create(adminGateway: IAdminGateway, authorization: Authorization) {
    return new RefreshAdmin(adminGateway, authorization);
  }

  async execute(input: RefreshInputDto): Promise<RefreshOutputDto> {
    if (!input.refreshToken) {
      throw new UnauthorizedError("Refresh token is required.");
    }

    let decoded: JwtPayload;
    decoded = this.authorization.verifyToken(input.refreshToken) as JwtPayload;

    const admin = await this.adminGateway.findById(decoded.id);
    if (!admin) {
      throw new NotFoundError("Admin");
    }

    const newAccessToken = this.authorization.generateToken({
      id: admin.id,
      email: admin.email,
      role: "admin",
    });

    return { accessToken: newAccessToken };
  }
}
