import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { ListLeadsByEvent } from "../../../usecase/lead/ListLeadsByEvent";

export type ListLeadResponseDto = {
  products: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    partnerId: string;
    createdAt: Date;
  }[];
};

export class ListLeadByEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listLeadServer: ListLeadsByEvent,
    private readonly authorization: Authorization
  ) {}

  public static create(
    listLeadServer: ListLeadsByEvent,
    authorization: Authorization
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
      const { partner } = request as any;
      const { eventId } = request.params;

      const result = await this.listLeadServer.execute({
        eventId,
        partnerId: partner.id,
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
    return this.authorization.authorizationRoute;
  }
}
