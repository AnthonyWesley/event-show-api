import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";

import {
  FindEventSellerByEmail,
  FindEventSellerByEmailOutputDto,
} from "../../../usecase/seller/FindEventSellerByEmail";

export type FindEventSellerResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  partnerId: string;
  createdAt: Date;
};

export class FindEventSellerByEmailRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findEventSellerByEmail: FindEventSellerByEmail,
    private readonly authorization: Authorization
  ) {}

  public static create(
    findEventSellerByEmail: FindEventSellerByEmail,
    authorization: Authorization
  ) {
    return new FindEventSellerByEmailRoute(
      "/sellers/email/:email",
      HttpMethod.GET,
      findEventSellerByEmail,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { email } = request.params;
      const { partner } = request as any;

      const input = { partnerId: partner.id, email };

      const output: FindEventSellerByEmailOutputDto =
        await this.findEventSellerByEmail.execute(input);

      const result = {
        id: output.id,
        name: output.name,
        email: output.email,
        phone: output.phone,
        photo: output.photo,
        partnerId: output.partnerId,
        createdAt: output.createdAt,
      };
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
