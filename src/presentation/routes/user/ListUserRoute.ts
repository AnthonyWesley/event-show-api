import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { PlanType, StatusType } from "../../../domain/entities/admin/Admin";
import { ListUsers } from "../../../usecase/user/ListUsers";

export type ListUsersResponseDto = {
  users: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photo?: string;
    photoPublicId?: string;
    role: string;
    companyId: string;
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
  }[];
};

export class ListUserRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listUserServer: ListUsers,
    private readonly authorization: Authorization
  ) {}

  public static create(
    listUserServer: ListUsers,
    authorization: Authorization
  ) {
    return new ListUserRoute(
      "/users",
      HttpMethod.GET,
      listUserServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      // const { user } = request as any;

      const search = request.query.search as string | undefined;
      const output = await this.listUserServer.execute({
        search: typeof search === "string" ? search.trim() : undefined,
      });
      const result = {
        users: output.users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          photo: user.photo,
          photoPublicId: user.photoPublicId,
          role: user.role,
          createdAt: user.createdAt,

          company: user.company,
          companyId: user.companyId,
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
