import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { PlanType } from "../../../domain/entities/admin/Admin";
import {
  UpdateUser,
  UpdateUserInputDto,
  UpdateUserOutputDto,
} from "../../../usecase/user/UpdateUser";

export type UpdateUserResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
};

export class UpdateUserRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateUserService: UpdateUser,
    private readonly authorization: Authorization
  ) {}

  static create(updateUserService: UpdateUser, authorization: Authorization) {
    return new UpdateUserRoute(
      "/users/:id",
      HttpMethod.PATCH,
      updateUserService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;
      const { name, email, role, phone, companyId } = request.body;

      const input: UpdateUserInputDto = {
        id,
        name,
        email,
        phone,
        role,
        companyId,
      };

      const output: UpdateUserOutputDto = await this.updateUserService.execute(
        input
      );

      const result = { id: output.id };
      response.status(200).json(result);
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.authorizationRoute];
  }
}
