import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import {
  RefreshInputDto,
  RefreshPartner,
} from "../../../usecase/partner/RefreshPartner";

export type RefreshPartnerResponseDto = {
  accessToken: string;
};

export class RefreshPartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly refreshPartnerService: RefreshPartner
  ) {}

  public static create(refreshPartnerService: RefreshPartner) {
    return new RefreshPartnerRoute(
      "/auth/refresh",
      HttpMethod.POST,
      refreshPartnerService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const refreshToken = request.cookies.refreshToken;

      const input: RefreshInputDto = { refreshToken };
      const output: RefreshPartnerResponseDto =
        await this.refreshPartnerService.execute(input);

      console.log("Refresh token from cookie:", refreshToken);

      response.status(200).json(output);
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }
}
