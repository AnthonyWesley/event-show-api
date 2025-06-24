import { Response, Request } from "express";
import {
  DeleteSeller,
  DeleteSellerInputDto,
} from "../../../usecase/seller/DeleteSeller";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type DeleteSellerResponseDto = {
  id: string;
};
export class DeleteSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteSellerService: DeleteSeller,
    private readonly authorization: Authorization
  ) {}

  static create(
    deleteSellerService: DeleteSeller,
    authorization: Authorization
  ) {
    return new DeleteSellerRoute(
      "/sellers/:sellerId",
      HttpMethod.DELETE,
      deleteSellerService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { sellerId } = request.params;
      const { partner } = request as any;

      const input: DeleteSellerInputDto = {
        partnerId: partner.id,
        sellerId,
      };

      await this.deleteSellerService.execute(input);

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
