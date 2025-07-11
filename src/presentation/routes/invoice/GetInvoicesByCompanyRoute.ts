import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { GetInvoicesByCompany } from "../../../usecase/invoice/GetInvoicesByCompany";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class GetInvoicesByCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly getInvoicesByCompanyService: GetInvoicesByCompany,
    private readonly authorization: Authorization
  ) {}

  public static create(
    getInvoicesByCompanyService: GetInvoicesByCompany,
    authorization: Authorization
  ) {
    return new GetInvoicesByCompanyRoute(
      "/invoices/company/:companyId",
      HttpMethod.POST,
      getInvoicesByCompanyService,
      authorization
    );
  }

  public getHandler() {
    return async (req: Request, res: Response) => {
      const { companyId } = req.params;

      const result = await this.getInvoicesByCompanyService.execute(companyId);

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
    return [this.authorization.authorizationRoute];
  }
}
