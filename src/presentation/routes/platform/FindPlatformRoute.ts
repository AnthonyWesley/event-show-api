import { Request, Response } from "express";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { HttpMethod, IRoute } from "../IRoute";
import { ListPlatform } from "../../../usecase/platform/ListPlatform";
import {
  FindPlatform,
  FindPlatformInputDto,
  FindPlatformOutputDto,
} from "../../../usecase/platform/FindPlatform";

export class FindPlatformRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findPlatformService: FindPlatform,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    findPlatformService: FindPlatform,
    authorization: AuthorizationRoute
  ) {
    return new FindPlatformRoute(
      "/platform/:platformId",
      HttpMethod.GET,
      findPlatformService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;
      const { platformId } = request.params;

      const input: FindPlatformInputDto = {
        companyId: user.companyId,
        platformId,
      };
      const output: FindPlatformOutputDto =
        await this.findPlatformService.execute(input);
      const result = {
        id: output.id,
        name: output.name,
        status: output.status ?? "ACTIVE",
        companyId: output.companyId,
        modules: output.modules,
        createdAt: output.createdAt,
      };
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
