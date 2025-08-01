import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type UpdateLeadInputDto = {
  name?: string;
  email?: string;
  phone?: string;
  products?: { id: string }[];

  customInterest?: string;
  notes?: string;
  leadSourceId?: string;

  leadId: string;
  companyId: string;
};

export type UpdateLeadOutputDto = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  products: { id: string }[];
  customInterest?: string;
  notes?: string;
  leadSourceId?: string;

  companyId: string;
  createdAt: Date;
};

export class UpdateLead {
  constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  static create(leadGateway: ILeadGateway, companyGateway: ICompanyGateway) {
    return new UpdateLead(leadGateway, companyGateway);
  }

  async execute(input: UpdateLeadInputDto): Promise<UpdateLeadOutputDto> {
    const company = await this.companyGateway.findById(input.companyId);
    if (!company) {
      throw new NotFoundError("Company");
    }

    const lead = await this.leadGateway.findById({
      leadId: input.leadId,
      companyId: input.companyId,
    });
    if (!lead) {
      throw new NotFoundError("Lead");
    }

    const updatedLead = await this.leadGateway.update(input);

    return {
      id: updatedLead.id,
      name: updatedLead.name,
      email: updatedLead.email ?? "",
      phone: updatedLead.phone ?? "",
      notes: updatedLead.notes ?? "",
      leadSourceId: updatedLead.leadSourceId,
      customInterest: updatedLead.customInterest,
      companyId: updatedLead.companyId,
      products: updatedLead.products ?? [],
      createdAt: updatedLead.createdAt,
    };
  }
}
