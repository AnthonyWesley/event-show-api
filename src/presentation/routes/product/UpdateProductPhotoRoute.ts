import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

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
    private readonly authorization: AuthorizationRoute,
    private readonly multer: Multer
  ) {}

  static create(
    updateProductPhotoService: UpdateProductPhoto,
    authorization: AuthorizationRoute,
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

      const { user } = request as any;
      const file = request.file;

      const input: UpdateProductPhotoInputDto = {
        productId,
        companyId: user.companyId,
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
    return [this.authorization.userRoute, this.multer.single("photo")];
  }
}
