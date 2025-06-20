import { Response, Request } from "express";
import {
  DeleteEventSeller,
  DeleteEventSellerInputDto,
} from "../../../usecase/seller/DeleteEventSeller";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type DeleteEventSellerResponseDto = {
  id: string;
};
export class DeleteEventSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteEventSellerService: DeleteEventSeller,
    private readonly authorization: Authorization
  ) {}

  static create(
    deleteEventSellerService: DeleteEventSeller,
    authorization: Authorization
  ) {
    return new DeleteEventSellerRoute(
      "/sellers/:sellerId",
      HttpMethod.DELETE,
      deleteEventSellerService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { sellerId } = request.params;
      const { partner } = request as any;

      const input: DeleteEventSellerInputDto = {
        partnerId: partner.id,
        sellerId,
      };

      await this.deleteEventSellerService.execute(input);

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
    return [this.authorization.authorizationRoute];
  }
}
