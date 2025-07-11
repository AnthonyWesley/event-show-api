import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";

import {
  CreateUser,
  CreateUserInputDto,
} from "../../../usecase/user/CreateUser";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type CreateCompanyResponseDto = {
  id: string;
};

export class CreateUserRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createUserService: CreateUser,
    private readonly authorization: Authorization
  ) {}

  public static create(
    createUserService: CreateUser,
    authorization: Authorization
  ) {
    return new CreateUserRoute(
      "/auth/register",
      HttpMethod.POST,
      createUserService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { name, email, password, phone, companyId, company } = request.body;

      const input: CreateUserInputDto = {
        name,
        email,
        password,
        phone,
        companyId,
        company,
      };

      const output: CreateCompanyResponseDto =
        await this.createUserService.execute(input);

      const result = { id: output.id };

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
