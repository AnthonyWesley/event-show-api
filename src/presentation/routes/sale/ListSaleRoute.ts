import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { ListSale, ListSaleOutputDto } from "../../../usecase/sale/ListSale";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type ListSaleResponseDto = {
  sales: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    partnerId: string;
    createdAt: Date;
  }[];
};

export class ListSaleRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listSaleServer: ListSale,
    private readonly authorization: Authorization
  ) {}

  public static create(listSaleServer: ListSale, authorization: Authorization) {
    return new ListSaleRoute(
      "/events/:eventId/sales",
      HttpMethod.GET,
      listSaleServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { eventId } = request.params;
      const { partner } = request as any;

      const output: ListSaleOutputDto = await this.listSaleServer.execute({
        partnerId: partner.id,
        eventId,
      });

      const result = {
        sales: output.sales.map((sale) => ({
          id: sale.id,
          quantity: sale.quantity,
          // total: sale.total,
          productId: sale.productId,
          eventId: sale.eventId,
          sellerId: sale.sellerId,
          createdAt: sale.createdAt,
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
