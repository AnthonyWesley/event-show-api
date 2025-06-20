import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

import { Multer } from "multer";

import {
  UpdateSellerPhoto,
  UpdateSellerPhotoInputDto,
  UpdateSellerPhotoOutputDto,
} from "../../../usecase/seller/UpdateSellerPhoto";

export type UpdateSellerEventResponseDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};

export class UpdateSellerPhotoRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateSellerPhotoService: UpdateSellerPhoto,
    private readonly authorization: Authorization,
    private readonly multer: Multer
  ) {}

  static create(
    updateSellerPhotoService: UpdateSellerPhoto,
    authorization: Authorization,
    multer: Multer
  ) {
    return new UpdateSellerPhotoRoute(
      "/seller/:sellerId/photo",
      HttpMethod.PATCH,
      updateSellerPhotoService,
      authorization,
      multer
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { sellerId } = request.params;
      const { partner } = request as any;
      const file = request.file;

      const input: UpdateSellerPhotoInputDto = {
        sellerId,
        partnerId: partner.id,
        file,
      };

      const output: UpdateSellerPhotoOutputDto =
        await this.updateSellerPhotoService.execute(input);

      const result: UpdateSellerEventResponseDto = {
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
