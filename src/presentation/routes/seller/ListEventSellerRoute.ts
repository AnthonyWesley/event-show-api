import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { ListEventSeller } from "../../../usecase/seller/ListEventSeller";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type ListEventSellerResponseDto = {
  sellers: {
    id: string;
    name: string;
    email: string;
    eventId: string;
    createdAt: Date;
  }[];
};

export class ListEventSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listEventSellerService: ListEventSeller,
    private readonly authorization: Authorization
  ) {}

  public static create(
    listEventSellerService: ListEventSeller,
    authorization: Authorization
  ) {
    return new ListEventSellerRoute(
      "/sellers",
      HttpMethod.GET,
      listEventSellerService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { partner } = request as any;
      const search = request.query.search as string | undefined;
      const output = await this.listEventSellerService.execute({
        partnerId: partner.id,
        search: typeof search === "string" ? search.trim() : undefined,
      });

      const result = {
        sellers: output.sellers.map((seller) => ({
          id: seller.id,
          name: seller.name,
          email: seller.email,
          phone: seller.phone,
          photo: seller.photo,
          partnerId: seller.partnerId,
          createdAt: seller.createdAt,
        })),
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
    return this.authorization.authorizationRoute;
  }
}
