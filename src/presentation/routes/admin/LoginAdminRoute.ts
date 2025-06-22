import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import {
  LoginInputDto,
  TokenType,
} from "../../../usecase/partner/LoginPartner";
import { LoginAdmin } from "../../../usecase/admin/LoginAdmin";

export type LoginAdminResponseDto = {
  token: TokenType;
};

export class LoginAdminRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly loginAdminService: LoginAdmin
  ) {}

  static create(loginAdminService: LoginAdmin) {
    return new LoginAdminRoute(
      "/admin/login",
      HttpMethod.POST,
      loginAdminService
    );
  }

  getHandler() {
    return async (req: Request, res: Response) => {
      const input: LoginInputDto = {
        email: req.body.email,
        password: req.body.password,
      };

      const output = await this.loginAdminService.execute(input);
      res.status(201).json({ output });
    };
  }

  getPath() {
    return this.path;
  }

  getMethod() {
    return this.method;
  }
}
