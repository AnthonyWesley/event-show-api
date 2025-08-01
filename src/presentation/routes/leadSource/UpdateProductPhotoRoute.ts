import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

import { Multer } from "multer";

import { UpdateSellerPhotoOutputDto } from "../../../usecase/seller/UpdateSellerPhoto";
import {
  UpdateLeadSourcePhoto,
  UpdateLeadSourcePhotoInputDto,
} from "../../../usecase/leadSource/UpdateLeadSourcePhoto";

export type UpdateLeadSourcePhotoRouteResponseDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};

export class UpdateLeadSourcePhotoRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateLeadSourcePhotoService: UpdateLeadSourcePhoto,
    private readonly authorization: AuthorizationRoute,
    private readonly multer: Multer
  ) {}

  static create(
    updateLeadSourcePhotoService: UpdateLeadSourcePhoto,
    authorization: AuthorizationRoute,
    multer: Multer
  ) {
    return new UpdateLeadSourcePhotoRoute(
      "/sources/:leadSourceId/photo",
      HttpMethod.PATCH,
      updateLeadSourcePhotoService,
      authorization,
      multer
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { leadSourceId } = request.params;

      const { user } = request as any;
      const file = request.file;

      const input: UpdateLeadSourcePhotoInputDto = {
        leadSourceId,
        companyId: user.companyId,
        file,
      };

      const output: UpdateSellerPhotoOutputDto =
        await this.updateLeadSourcePhotoService.execute(input);

      const result: UpdateLeadSourcePhotoRouteResponseDto = {
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
