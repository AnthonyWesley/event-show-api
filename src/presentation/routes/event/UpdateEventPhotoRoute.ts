import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

import { Multer } from "multer";
import {
  UpdateEventPhoto,
  UpdateEventPhotoInputDto,
  UpdateEventPhotoOutputDto,
} from "../../../usecase/event/UpdateEventPhoto";

export type UpdateEventResponseDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};

export class UpdateEventPhotoRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateEventPhotoService: UpdateEventPhoto,
    private readonly authorization: Authorization,
    private readonly multer: Multer
  ) {}

  static create(
    updateEventPhotoService: UpdateEventPhoto,
    authorization: Authorization,
    multer: Multer
  ) {
    return new UpdateEventPhotoRoute(
      "/event/:eventId/photo",
      HttpMethod.PATCH,
      updateEventPhotoService,
      authorization,
      multer
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { eventId } = request.params;
      const { partner } = request as any;
      const file = request.file;

      const input: UpdateEventPhotoInputDto = {
        eventId,
        partnerId: partner.id,
        file,
      };

      const output: UpdateEventPhotoOutputDto =
        await this.updateEventPhotoService.execute(input);

      const result: UpdateEventResponseDto = {
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
