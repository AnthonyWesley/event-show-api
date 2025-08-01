import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { ListEventsBySeller } from "../../../usecase/sellerEvent/ListEventsBySeller";

export type ListEventBySellerResponseDto = {
  sellerEvents: {
    eventId: string;
    sellerId: string;
  }[];
};

export class ListEventsBySellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listEventsBySellerServer: ListEventsBySeller,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    listEventsBySellerServer: ListEventsBySeller,
    authorization: AuthorizationRoute
  ) {
    return new ListEventsBySellerRoute(
      "/sellers/:sellerId/events/",
      HttpMethod.GET,
      listEventsBySellerServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { sellerId } = request.params;
      const { user } = request as any;

      const result = await this.listEventsBySellerServer.execute({
        companyId: user.companyId,
        // eventId,
        sellerId,
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
    return [this.authorization.userRoute];
  }
}
