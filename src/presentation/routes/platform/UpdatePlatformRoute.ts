import { Request, Response } from "express";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  CreatePlatform,
  CreatePlatformInputDto,
} from "../../../usecase/platform/CreatePlatform";
import { HttpMethod, IRoute } from "../IRoute";
import {
  UpdatePlatform,
  UpdatePlatformInputDto,
} from "../../../usecase/platform/UpdatePlatform";

export class UpdatePlatformRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updatePlatformService: UpdatePlatform,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    updatePlatformService: UpdatePlatform,
    authorization: AuthorizationRoute
  ) {
    return new UpdatePlatformRoute(
      "/platform/:platformId",
      HttpMethod.PATCH,
      updatePlatformService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;
      const { name, status } = request.body;
      const { platformId } = request.params;

      const input: UpdatePlatformInputDto = {
        companyId: user.companyId,
        platformId,
        name,
        status,
      };

      const result = await this.updatePlatformService.execute(input);
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
