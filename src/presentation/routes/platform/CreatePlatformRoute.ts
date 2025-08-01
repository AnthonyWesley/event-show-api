import { Request, Response } from "express";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  CreatePlatform,
  CreatePlatformInputDto,
} from "../../../usecase/platform/CreatePlatform";
import { HttpMethod, IRoute } from "../IRoute";

export class CreatePlatformRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createPlatformService: CreatePlatform,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createPlatformService: CreatePlatform,
    authorization: AuthorizationRoute
  ) {
    return new CreatePlatformRoute(
      "/platform",
      HttpMethod.POST,
      createPlatformService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;
      const { name } = request.body;

      const input: CreatePlatformInputDto = { companyId: user.companyId, name };

      const result = await this.createPlatformService.execute(input);
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
    return [this.authorization.adminRoute];
  }
}
