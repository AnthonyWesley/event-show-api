import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";

import {
  CreateUser,
  CreateUserInputDto,
} from "../../../usecase/user/CreateUser";

export type CreateCompanyResponseDto = {
  id: string;
};

export class RegisterUserRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createUserService: CreateUser
  ) {}

  public static create(createUserService: CreateUser) {
    return new RegisterUserRoute(
      "/auth/register",
      HttpMethod.POST,
      createUserService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { name, email, password, phone, companyId, company } = request.body;

      const keys = (request as any).featureValues;

      const input: CreateUserInputDto = {
        name,
        email,
        password,
        phone,
        companyId,
        company,
        keys,
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
