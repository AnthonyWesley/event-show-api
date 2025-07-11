import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { MarkInvoiceAsPaid } from "../../../usecase/invoice/MarkInvoiceAsPaid";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class MarkInvoiceAsPaidRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly markInvoiceAsPaidService: MarkInvoiceAsPaid,
    private readonly authorization: Authorization
  ) {}

  public static create(
    markInvoiceAsPaidService: MarkInvoiceAsPaid,
    authorization: Authorization
  ) {
    return new MarkInvoiceAsPaidRoute(
      "/invoices/:id/pay",
      HttpMethod.POST,
      markInvoiceAsPaidService,
      authorization
    );
  }

  public getHandler() {
    return async (req: Request, res: Response) => {
      const { id } = req.params;

      await this.markInvoiceAsPaidService.execute(id);

      res.status(204).send();
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
