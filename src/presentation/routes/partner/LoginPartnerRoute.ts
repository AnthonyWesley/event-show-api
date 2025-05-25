import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import {
  LoginInputDto,
  LoginPartner,
  TokenType,
} from "../../../usecase/partner/LoginPartner";

export type LoginPartnerResponseDto = {
  token: TokenType;
};

export class LoginPartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly loginPartnerService: LoginPartner
  ) {}

  public static create(loginPartnerService: LoginPartner) {
    return new LoginPartnerRoute(
      "/auth/login",
      HttpMethod.POST,
      loginPartnerService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { email, password } = request.body;

      const input: LoginInputDto = {
        email,
        password,
      };

      const output: LoginPartnerResponseDto =
        await this.loginPartnerService.execute(input);

      response.cookie("refreshToken", output.token.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const result = { output };

      response.status(201).json(result);
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }
}
