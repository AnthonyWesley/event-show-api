import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { ScreenAccessService } from "../../../usecase/company/ScreenAccessService";
import { ScreenAccessType } from "../../../usecase/company/SendScreenAccessInvite";

export class ScreenAccessServiceRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly screenAccessService: ScreenAccessService,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    screenAccessService: ScreenAccessService,
    authorization: AuthorizationRoute
  ) {
    return new ScreenAccessServiceRoute(
      "/:type/invite/:invite",
      HttpMethod.GET,
      screenAccessService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;

      const { invite, type } = request.params;
      console.log(request.params);

      const search = request.query.search as string | undefined;
      const result = await this.screenAccessService.execute({
        screenAccess: type as ScreenAccessType,
        invite,
        search: typeof search === "string" ? search.trim() : undefined,
      });

      response.status(200).json(result);
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [];
  }
}
