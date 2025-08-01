import { Response, Request } from "express";
import {
  DeleteSeller,
  DeleteSellerInputDto,
} from "../../../usecase/seller/DeleteSeller";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export type DeleteSellerResponseDto = {
  id: string;
};
export class DeleteSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteSellerService: DeleteSeller,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    deleteSellerService: DeleteSeller,
    authorization: AuthorizationRoute
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
      const { user } = request as any;

      const input: DeleteSellerInputDto = {
        companyId: user.companyId,
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
    return [this.authorization.userRoute];
  }
}
