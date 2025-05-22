import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type DeletePartnerInputDto = {
  id: string;
};

export class DeletePartner implements IUseCases<DeletePartnerInputDto, void> {
  private constructor(readonly partnerGateway: IPartnerGateway) {}

  static create(partnerGateway: IPartnerGateway) {
    return new DeletePartner(partnerGateway);
  }

  async execute({ id }: DeletePartnerInputDto): Promise<void> {
    if (!id) {
      throw new ValidationError("Id is required.");
    }
    await this.partnerGateway.delete(id);
  }
}
