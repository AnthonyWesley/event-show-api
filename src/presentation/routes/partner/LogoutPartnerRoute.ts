import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import {
  LogoutInputDto,
  LogoutPartner,
} from "../../../usecase/partner/LogoutPartner";

export type LogoutPartnerResponseDto = {
  message: string;
};

export class LogoutPartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly logoutPartnerService: LogoutPartner
  ) {}

  public static create(logoutPartnerService: LogoutPartner) {
    return new LogoutPartnerRoute(
      "/auth/logout",
      HttpMethod.POST,
      logoutPartnerService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const refreshToken = request.cookies.refreshToken as string;

      const input: LogoutInputDto = {
        refreshToken,
      };
      const output: LogoutPartnerResponseDto =
        await this.logoutPartnerService.execute(input);

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
