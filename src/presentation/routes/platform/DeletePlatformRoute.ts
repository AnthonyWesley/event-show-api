import { Request, Response } from "express";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  DeletePlatform,
  DeletePlatformInputDto,
} from "../../../usecase/platform/DeletePlatform";
import { HttpMethod, IRoute } from "../IRoute";

export class DeletePlatformRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deletePlatformService: DeletePlatform,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    deletePlatformService: DeletePlatform,
    authorization: AuthorizationRoute
  ) {
    return new DeletePlatformRoute(
      "/platform/platformId",
      HttpMethod.DELETE,
      deletePlatformService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;
      const { platformId } = request.params;

      const input: DeletePlatformInputDto = {
        companyId: user.companyId,
        platformId,
      };

      const result = await this.deletePlatformService.execute({
        companyId: input.companyId,
        platformId: input.platformId,
      });
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
