import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

import { Multer } from "multer";

import { UpdateSellerPhotoOutputDto } from "../../../usecase/seller/UpdateSellerPhoto";
import {
  UpdateProductPhoto,
  UpdateProductPhotoInputDto,
} from "../../../usecase/product/UpdateProductPhoto";

export type UpdateProductPhotoRouteResponseDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};

export class UpdateProductPhotoRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateProductPhotoService: UpdateProductPhoto,
    private readonly authorization: Authorization,
    private readonly multer: Multer
  ) {}

  static create(
    updateProductPhotoService: UpdateProductPhoto,
    authorization: Authorization,
    multer: Multer
  ) {
    return new UpdateProductPhotoRoute(
      "/product/:productId/photo",
      HttpMethod.PATCH,
      updateProductPhotoService,
      authorization,
      multer
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { productId } = request.params;

      const { partner } = request as any;
      const file = request.file;

      const input: UpdateProductPhotoInputDto = {
        productId,
        partnerId: partner.id,
        file,
      };

      const output: UpdateSellerPhotoOutputDto =
        await this.updateProductPhotoService.execute(input);

      const result: UpdateProductPhotoRouteResponseDto = {
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
