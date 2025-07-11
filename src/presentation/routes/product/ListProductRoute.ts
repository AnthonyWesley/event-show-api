import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { ListProduct } from "../../../usecase/product/ListProduct";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type ListProductResponseDto = {
  products: {
    id: string;
    name: string;
    photo: string;
    photoPublicId: string;
    startDate: Date;
    endDate: Date;
    companyId: string;
    createdAt: Date;
  }[];
};

export class ListProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listProductServer: ListProduct,
    private readonly authorization: Authorization
  ) {}

  public static create(
    listProductServer: ListProduct,
    authorization: Authorization
  ) {
    return new ListProductRoute(
      "/products",
      HttpMethod.GET,
      listProductServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { user } = request as any;
      const search = request.query.search as string | undefined;
      const output = await this.listProductServer.execute({
        companyId: user.companyId,
        search: typeof search === "string" ? search.trim() : undefined,
      });

      const result = {
        products: output.products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          photo: product.photo,
          photoPublicId: product.photoPublicId,
          companyId: product.companyId,
          createdAt: product.createdAt,
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
    return [this.authorization.authorizationRoute];
  }
}
