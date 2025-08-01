import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { ListSeller } from "../../../usecase/seller/ListSeller";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export type ListSellerResponseDto = {
  sellers: {
    id: string;
    name: string;
    email: string;
    eventId: string;
    createdAt: Date;
  }[];
};

export class ListSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listSellerService: ListSeller,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    listSellerService: ListSeller,
    authorization: AuthorizationRoute
  ) {
    return new ListSellerRoute(
      "/sellers",
      HttpMethod.GET,
      listSellerService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { user } = request as any;
      const search = request.query.search as string | undefined;
      const output = await this.listSellerService.execute({
        companyId: user.companyId,
        search: typeof search === "string" ? search.trim() : undefined,
      });

      const result = {
        sellers: output.sellers.map((seller) => ({
          id: seller.id,
          name: seller.name,
          email: seller.email,
          phone: seller.phone,
          photo: seller.photo,
          companyId: seller.companyId,
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
    return [this.authorization.userRoute];
  }
}
