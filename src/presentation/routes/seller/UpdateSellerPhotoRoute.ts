import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

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
    private readonly authorization: AuthorizationRoute,
    private readonly multer: Multer
  ) {}

  static create(
    updateSellerPhotoService: UpdateSellerPhoto,
    authorization: AuthorizationRoute,
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
      const { user } = request as any;

      const file = request.file;

      const input: UpdateSellerPhotoInputDto = {
        sellerId,
        companyId: user.companyId,
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
    return [this.authorization.userRoute, this.multer.single("photo")];
  }
}
