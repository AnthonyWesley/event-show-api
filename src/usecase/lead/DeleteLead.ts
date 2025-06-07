import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type DeleteLeadInputDto = {
  id: string;
  eventId: string;
  partnerId: string;
};

export class DeleteLead {
  constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  static create(leadGateway: ILeadGateway, partnerGateway: IPartnerGateway) {
    return new DeleteLead(leadGateway, partnerGateway);
  }

  async execute(input: DeleteLeadInputDto): Promise<void> {
    const partner = await this.partnerGateway.findById(input.partnerId);
    if (!partner) {
      throw new NotFoundError("Partner");
    }

    const lead = await this.leadGateway.findById({
      leadId: input.id,
      partnerId: input.partnerId,
    });
    if (!lead) {
      throw new NotFoundError("Lead");
    }

    await this.leadGateway.delete(input);
  }
}
