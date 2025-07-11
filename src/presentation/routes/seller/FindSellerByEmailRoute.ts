import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";

import {
  FindSellerByEmail,
  FindSellerByEmailOutputDto,
} from "../../../usecase/seller/FindSellerByEmail";

export type FindSellerResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  companyId: string;
  createdAt: Date;
};

export class FindSellerByEmailRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findSellerByEmail: FindSellerByEmail,
    private readonly authorization: Authorization
  ) {}

  public static create(
    findSellerByEmail: FindSellerByEmail,
    authorization: Authorization
  ) {
    return new FindSellerByEmailRoute(
      "/sellers/email/:email",
      HttpMethod.GET,
      findSellerByEmail,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { email } = request.params;
      const { user } = request as any;

      const input = { companyId: user.companyId, email };

      const output: FindSellerByEmailOutputDto =
        await this.findSellerByEmail.execute(input);

      const result = {
        id: output.id,
        name: output.name,
        email: output.email,
        phone: output.phone,
        photo: output.photo,
        companyId: output.companyId,
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
