import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { ListSellerByEvent } from "../../../usecase/sellerEvent/ListSellerByEvent";

export type ListSellerByEventResponseDto = {
  sellerEvents: {
    eventId: string;
    sellerId: string;
  }[];
};

export class ListSellerByEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listSellerByEventServer: ListSellerByEvent,
    private readonly authorization: Authorization
  ) {}

  public static create(
    listSellerByEventServer: ListSellerByEvent,
    authorization: Authorization
  ) {
    return new ListSellerByEventRoute(
      "/events/:eventId/sellers/",
      HttpMethod.GET,
      listSellerByEventServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { eventId } = request.params;
      const { user } = request as any;

      const result = await this.listSellerByEventServer.execute({
        companyId: user.companyId,
        eventId,
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
    return [this.authorization.authorizationRoute];
  }
}
