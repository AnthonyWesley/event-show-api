import { Request, Response } from "express";
import {
  DeletePartner,
  DeletePartnerInputDto,
} from "../../../usecase/partner/DeletePartner";
import { IRoute, HttpMethod } from "../IRoute";

export type DeletePartnerResponseDto = {
  id: string;
};
export class DeletePartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deletePartnerService: DeletePartner
  ) {}

  static create(deletePartnerService: DeletePartner) {
    return new DeletePartnerRoute(
      "/partner/:id",
      HttpMethod.DELETE,
      deletePartnerService
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { id } = request.params;

      const input: DeletePartnerInputDto = { id };

      await this.deletePartnerService.execute(input);

      response.status(201).json();
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }
}
