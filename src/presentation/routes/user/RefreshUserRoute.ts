import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import { RefreshInputDto } from "../../../usecase/admin/RefreshAdmin";
import { RefreshUser } from "../../../usecase/user/RefreshUser";

export type RefreshUserResponseDto = {
  accessToken: string;
};

export class RefreshUserRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly refreshUserService: RefreshUser
  ) {}

  public static create(refreshUserService: RefreshUser) {
    return new RefreshUserRoute(
      "/auth/refresh",
      HttpMethod.POST,
      refreshUserService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const refreshToken = request.cookies.refreshToken;

      const input: RefreshInputDto = { refreshToken };
      const output: RefreshUserResponseDto =
        await this.refreshUserService.execute(input);

      response.status(200).json({ accessToken: output.accessToken });
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }
}
