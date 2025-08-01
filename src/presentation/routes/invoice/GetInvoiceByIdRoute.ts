import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { GetInvoiceById } from "../../../usecase/invoice/GetInvoiceById";

export class GetInvoiceByIdRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly getInvoicesByIdService: GetInvoiceById,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    getInvoicesByIdService: GetInvoiceById,
    authorization: AuthorizationRoute
  ) {
    return new GetInvoiceByIdRoute(
      "/invoices/:id",
      HttpMethod.POST,
      getInvoicesByIdService,
      authorization
    );
  }

  public getHandler() {
    return async (req: Request, res: Response) => {
      const { companyId } = req.params;

      const result = await this.getInvoicesByIdService.execute(companyId);

      res.json(result);
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
