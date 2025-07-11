import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import {
  UpdateSeller,
  UpdateSellerInputDto,
} from "../../../usecase/seller/UpdateSeller";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class UpdateSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateSellerService: UpdateSeller,
    private readonly authorization: Authorization
  ) {}

  static create(
    updateSellerService: UpdateSeller,
    authorization: Authorization
  ) {
    return new UpdateSellerRoute(
      "/sellers/:sellerId",
      HttpMethod.PATCH,
      updateSellerService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { sellerId } = request.params;
      const { user } = request as any;

      const { name, email, phone } = request.body;

      if (!name || !email) {
        response.status(400).json({ error: "Missing required fields" });
      }

      const input: UpdateSellerInputDto = {
        sellerId,
        companyId: user.companyId,
        name,
        email,
        phone,
        // photo,
      };

      const result = await this.updateSellerService.execute(input);
      response.status(200).json(result);
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
