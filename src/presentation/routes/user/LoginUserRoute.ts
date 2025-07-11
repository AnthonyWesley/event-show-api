import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";

import {
  LoginUser,
  LoginUserInputDto,
  TokenType,
} from "../../../usecase/user/LoginUser";

export type LoginUserResponseDto = {
  token: TokenType;
};

export class LoginUserRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly loginUserService: LoginUser
  ) {}

  public static create(loginUserService: LoginUser) {
    return new LoginUserRoute("/auth/login", HttpMethod.POST, loginUserService);
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { email, password } = request.body;

      const input: LoginUserInputDto = {
        email,
        password,
      };

      const output: LoginUserResponseDto = await this.loginUserService.execute(
        input
      );

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
