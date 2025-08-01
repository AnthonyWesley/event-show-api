import { Request, Response } from "express";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { HttpMethod, IRoute } from "../IRoute";
import { ListPlatform } from "../../../usecase/platform/ListPlatform";

export class ListPlatformRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly ListPlatformService: ListPlatform,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    ListPlatformService: ListPlatform,
    authorization: AuthorizationRoute
  ) {
    return new ListPlatformRoute(
      "/platform",
      HttpMethod.GET,
      ListPlatformService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;

      const search = request.query.search as string | undefined;
      const output = await this.ListPlatformService.execute({
        companyId: user.companyId,
        search: typeof search === "string" ? search.trim() : undefined,
      });

      const result = {
        platforms: output.platforms.map((platform) => ({
          id: platform.id,
          name: platform.name,
          status: platform.status ?? "ACTIVE",
          companyId: platform.companyId,
          modules: platform.modules,
          createdAt: platform.createdAt,
        })),
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
    return [this.authorization.userRoute];
  }
}
