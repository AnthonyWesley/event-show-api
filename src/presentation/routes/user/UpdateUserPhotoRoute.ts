import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

import { Multer } from "multer";
import {
  UpdateUserPhoto,
  UpdateUserPhotoInputDto,
  UpdateUserPhotoOutputDto,
} from "../../../usecase/user/UpdateUserPhoto";

export type UpdateUserResponseDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};

export class UpdateUserPhotoRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateUserPhotoService: UpdateUserPhoto,
    private readonly authorization: AuthorizationRoute,
    private readonly multer: Multer
  ) {}

  static create(
    updateUserPhotoService: UpdateUserPhoto,
    authorization: AuthorizationRoute,
    multer: Multer
  ) {
    return new UpdateUserPhotoRoute(
      "/users/:id/photo",
      HttpMethod.PATCH,
      updateUserPhotoService,
      authorization,
      multer
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;
      const file = request.file;

      const input: UpdateUserPhotoInputDto = {
        id,
        file,
      };

      const output: UpdateUserPhotoOutputDto =
        await this.updateUserPhotoService.execute(input);

      const result: UpdateUserResponseDto = {
        id: output.id,
        photo: output.photo,
        photoPublicId: output.photoPublicId,
      };
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
    return [this.authorization.userRoute, this.multer.single("photo")];
  }
}
