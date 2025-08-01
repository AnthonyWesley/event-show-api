import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { ListSale, ListSaleOutputDto } from "../../../usecase/sale/ListSale";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export type ListSaleResponseDto = {
  sales: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    companyId: string;
    createdAt: Date;
  }[];
};

export class ListSaleRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listSaleServer: ListSale,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    listSaleServer: ListSale,
    authorization: AuthorizationRoute
  ) {
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
      const { user } = request as any;

      const output: ListSaleOutputDto = await this.listSaleServer.execute({
        companyId: user.companyId,
        eventId,
      });

      const result = {
        sales: output.sales.map((sale) => ({
          id: sale.id,
          quantity: sale.quantity,
          product: sale.product,

          lead: sale.lead,
          eventId: sale.eventId,
          seller: sale.seller,
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
    return [this.authorization.userRoute];
  }
}
