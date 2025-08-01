import { Response, Request } from "express";

import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  DeleteSellerEvent,
  DeleteSellerEventInputDto,
} from "../../../usecase/sellerEvent/DeleteSellerEvent";

export type DeleteRouteResponseDto = {
  id: string;
};
export class DeleteSellerEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteSellerEventServer: DeleteSellerEvent,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    deleteSellerEventServer: DeleteSellerEvent,
    authorization: AuthorizationRoute
  ) {
    return new DeleteSellerEventRoute(
      "/events/:eventId/sellers/:sellerId",
      HttpMethod.DELETE,
      deleteSellerEventServer,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId, sellerId } = request.params;
      const { user } = request as any;

      const input: DeleteSellerEventInputDto = {
        sellerId,
        eventId,
      };

      await this.deleteSellerEventServer.execute(input);

      response.status(201).json();
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.userRoute];
  }
}
