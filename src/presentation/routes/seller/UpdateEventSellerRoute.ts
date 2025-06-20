import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import {
  UpdateEventSeller,
  UpdateEventSellerInputDto,
} from "../../../usecase/seller/UpdateEventSeller";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class UpdateEventSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateEventSellerService: UpdateEventSeller,
    private readonly authorization: Authorization
  ) {}

  static create(
    updateEventSellerService: UpdateEventSeller,
    authorization: Authorization
  ) {
    return new UpdateEventSellerRoute(
      "/sellers/:sellerId",
      HttpMethod.PATCH,
      updateEventSellerService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { sellerId } = request.params;
      const { partner } = request as any;

      const { name, email, phone } = request.body;

      if (!name || !email) {
        response.status(400).json({ error: "Missing required fields" });
      }

      const input: UpdateEventSellerInputDto = {
        sellerId,
        partnerId: partner.id,
        name,
        email,
        phone,
        // photo,
      };

      const result = await this.updateEventSellerService.execute(input);
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
