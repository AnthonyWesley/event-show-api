import { Request, Response } from "express";

import { IRoute, HttpMethod } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  DeleteUser,
  DeleteUserInputDto,
} from "../../../usecase/user/DeleteUser";

export type DeleteUserResponseDto = {
  id: string;
};
export class DeleteUserRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteUserService: DeleteUser,
    private readonly authorization: Authorization
  ) {}

  static create(deleteUserService: DeleteUser, authorization: Authorization) {
    return new DeleteUserRoute(
      "/user/:id",
      HttpMethod.DELETE,
      deleteUserService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { id } = request.params;

      const input: DeleteUserInputDto = { id };

      await this.deleteUserService.execute(input);

      response.status(201).json();
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.adminAuthorizationRoute];
  }
}
