import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import {
  RefreshAdmin,
  RefreshInputDto,
} from "../../../usecase/admin/RefreshAdmin";

export type RefreshAdminResponseDto = {
  accessToken: string;
};

export class RefreshAdminRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly refreshAdminService: RefreshAdmin
  ) {}

  public static create(refreshAdminService: RefreshAdmin) {
    return new RefreshAdminRoute(
      "/admin/refresh",
      HttpMethod.POST,
      refreshAdminService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const refreshToken = request.cookies.refreshToken;

      const input: RefreshInputDto = { refreshToken };
      const output: RefreshAdminResponseDto =
        await this.refreshAdminService.execute(input);

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
