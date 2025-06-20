import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  UpdatePartnerPhoto,
  UpdatePartnerPhotoInputDto,
  UpdatePartnerPhotoOutputDto,
} from "../../../usecase/partner/UpdatePartnerPhoto";
import { Multer } from "multer";

export type UpdatePartnerResponseDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};

export class UpdatePartnerPhotoRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updatePartnerPhotoService: UpdatePartnerPhoto,
    private readonly authorization: Authorization,
    private readonly multer: Multer
  ) {}

  static create(
    updatePartnerPhotoService: UpdatePartnerPhoto,
    authorization: Authorization,
    multer: Multer
  ) {
    return new UpdatePartnerPhotoRoute(
      "/partner/:id/photo",
      HttpMethod.PATCH,
      updatePartnerPhotoService,
      authorization,
      multer
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;
      const file = request.file;

      const input: UpdatePartnerPhotoInputDto = {
        id,
        file,
      };

      const output: UpdatePartnerPhotoOutputDto =
        await this.updatePartnerPhotoService.execute(input);

      const result: UpdatePartnerResponseDto = {
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
    return [this.authorization.authorizationRoute, this.multer.single("photo")];
  }
}
