import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { FindUser } from "../../../usecase/user/FindUser";
import { PlanType } from "../../../domain/entities/admin/Admin";

export type FindUserResponseDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  photoPublicId?: string;
  role: string;
  createdAt: Date;

  company: {
    id: string;
    name: string;
    phone?: string;
    photo?: string;
    photoPublicId?: string;
    plan: PlanType;
    status: string;
    maxConcurrentEvents?: number;
    accessExpiresAt: Date;
    createdAt: Date;
  };
};

export class FindUserRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findUserServer: FindUser,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    findUserServer: FindUser,
    authorization: AuthorizationRoute
  ) {
    return new FindUserRoute(
      "/auth/me",
      HttpMethod.GET,
      findUserServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { user } = request as any;

      const output = await this.findUserServer.execute({ id: user.id });

      const result = {
        id: output.id,
        name: output.name,
        email: output.email,
        photo: output.photo,
        photoPublicId: output.photoPublicId,
        role: output.role,
        createdAt: output.createdAt,
        companyId: output.companyId,
        company: output.company,
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
