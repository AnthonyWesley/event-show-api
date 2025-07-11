import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import { LogoutInputDto, LogoutUser } from "../../../usecase/user/LogoutUser";

export type LogoutUserResponseDto = {
  message: string;
};

export class LogoutUserRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly logoutUserService: LogoutUser
  ) {}

  public static create(logoutUserService: LogoutUser) {
    return new LogoutUserRoute(
      "/auth/logout",
      HttpMethod.POST,
      logoutUserService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const refreshToken = request.cookies.refreshToken as string;

      const input: LogoutInputDto = {
        refreshToken,
      };
      const output: LogoutUserResponseDto =
        await this.logoutUserService.execute(input);

      response.clearCookie("refreshToken");
      response.status(201).json(output.message);
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }
}
