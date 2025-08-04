import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { ListLeadsByEvent } from "../../../usecase/lead/ListLeadsByEvent";

export type ListLeadResponseDto = {
  products: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    companyId: string;
    createdAt: Date;
  }[];
};

export class ListLeadByEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listLeadServer: ListLeadsByEvent,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    listLeadServer: ListLeadsByEvent,
    authorization: AuthorizationRoute
  ) {
    return new ListLeadByEventRoute(
      "/events/:eventId/leads",
      HttpMethod.GET,
      listLeadServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { user } = request as any;
      const { eventId } = request.params;

      const search = request.query.search as string | undefined;
      const output = await this.listLeadServer.execute({
        eventId,
        companyId: user.companyId,
        search: typeof search === "string" ? search.trim() : undefined,
      });

      // const result = await this.listLeadServer.execute({
      //   eventId,
      //   companyId: user.companyId,
      // });

      response.status(200).json(output);
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
