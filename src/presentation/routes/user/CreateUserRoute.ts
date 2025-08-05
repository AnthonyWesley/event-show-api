import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";

import {
  CreateUser,
  CreateUserInputDto,
} from "../../../usecase/user/CreateUser";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { checkFeatures } from "../../../infra/http/middlewares/checkFeature";

export type CreateCompanyResponseDto = {
  id: string;
};

export class CreateUserRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createUserService: CreateUser,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createUserService: CreateUser,
    authorization: AuthorizationRoute
  ) {
    return new CreateUserRoute(
      "/users",
      HttpMethod.POST,
      createUserService,
      authorization
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

  public getMiddlewares() {
    return [this.authorization.userRoute, checkFeatures(["limit_user"])];
  }
}
