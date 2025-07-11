import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import { LogoutInputDto } from "../../../usecase/company/LogoutCompany";
import { LogoutAdmin } from "../../../usecase/admin/LogoutAdmin";

export type LogoutAdminResponseDto = {
  message: string;
};

export class LogoutAdminRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly logoutAdminService: LogoutAdmin
  ) {}

  public static create(logoutAdminService: LogoutAdmin) {
    return new LogoutAdminRoute(
      "/admin/logout",
      HttpMethod.POST,
      logoutAdminService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const refreshToken = request.cookies.refreshToken as string;

      const input: LogoutInputDto = {
        refreshToken,
      };
      const output: LogoutAdminResponseDto =
        await this.logoutAdminService.execute(input);

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
