import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  UpdateCompanyPhoto,
  UpdateCompanyPhotoInputDto,
  UpdateCompanyPhotoOutputDto,
} from "../../../usecase/company/UpdateCompanyPhoto";
import { Multer } from "multer";

export type UpdateCompanyResponseDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};

export class UpdateCompanyPhotoRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateCompanyPhotoService: UpdateCompanyPhoto,
    private readonly authorization: AuthorizationRoute,
    private readonly multer: Multer
  ) {}

  static create(
    updateCompanyPhotoService: UpdateCompanyPhoto,
    authorization: AuthorizationRoute,
    multer: Multer
  ) {
    return new UpdateCompanyPhotoRoute(
      "/companies/:id/photo",
      HttpMethod.PATCH,
      updateCompanyPhotoService,
      authorization,
      multer
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;
      const file = request.file;

      const input: UpdateCompanyPhotoInputDto = {
        id,
        file,
      };

      const output: UpdateCompanyPhotoOutputDto =
        await this.updateCompanyPhotoService.execute(input);

      const result: UpdateCompanyResponseDto = {
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
