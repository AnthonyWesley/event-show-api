import { Request, Response } from "express";
import { CreateInvoice } from "../../../usecase/invoice/CreateInvoice";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export class CreateInvoiceRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createInvoiceService: CreateInvoice,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createInvoiceService: CreateInvoice,
    authorization: AuthorizationRoute
  ) {
    return new CreateInvoiceRoute(
      "/invoices",
      HttpMethod.POST,
      createInvoiceService,
      authorization
    );
  }

  public getHandler() {
    return async (req: Request, res: Response) => {
      const input = req.body;

      const output = await this.createInvoiceService.execute(input);

      res.status(201).json(output);
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
