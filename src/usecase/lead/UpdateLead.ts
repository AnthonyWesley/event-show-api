import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import {
  UpsertLeadCustomValueInputDto,
  UpsertLeadCustomValues,
} from "../LeadCustomValues/UpsertLeadCustomValues";
import { ISocketServer } from "../../infra/socket/ISocketServer";

export type UpdateLeadInputDto = {
  name?: string;
  email?: string;
  phone?: string;
  products?: { id: string }[];
  wasPresent?: boolean;
  customInterest?: string;
  notes?: string;
  leadSourceId?: string;
  sellerId?: string;

  leadId: string;
  companyId: string;

  customValues?: UpsertLeadCustomValueInputDto[]; // ✅ Adicionado
};

export type UpdateLeadOutputDto = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  wasPresent: boolean;
  products: { id: string }[];
  customInterest?: string;
  notes?: string;
  leadSourceId?: string;
  sellerId?: string;

  companyId: string;
  createdAt: Date;
};

export class UpdateLead {
  constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly upsertLeadCustomValues: UpsertLeadCustomValues,
    private readonly socketServer: ISocketServer
  ) {}

  static create(
    leadGateway: ILeadGateway,
    companyGateway: ICompanyGateway,
    upsertLeadCustomValues: UpsertLeadCustomValues,
    socketServer: ISocketServer
  ) {
    return new UpdateLead(
      leadGateway,
      companyGateway,
      upsertLeadCustomValues,
      socketServer
    );
  }

  async execute(input: UpdateLeadInputDto): Promise<UpdateLeadOutputDto> {
    const company = await this.companyGateway.findById(input.companyId);
    if (!company) throw new NotFoundError("Company");

    const lead = await this.leadGateway.findById({
      leadId: input.leadId,
      companyId: input.companyId,
    });
    if (!lead) throw new NotFoundError("Lead");

    const updatedLead = await this.leadGateway.update(input);

    if (input.wasPresent)
      await this.socketServer.emit(
        `lead:updated-${updatedLead.sellerId}`,
        `${updatedLead.name} acabou de confirmar presença no evento!`
      );
    // if (input.customValues && input.customValues.length > 0) {
    //   input.customValues.forEach((v) => {
    //     v.leadId = lead.id; // garante leadId em todos os valores
    //   });

    //   await this.upsertLeadCustomValues.execute(input.customValues);
    // }

    return {
      id: updatedLead.id,
      name: updatedLead.name,
      notes: updatedLead.notes ?? "",
      leadSourceId: updatedLead.leadSourceId,
      wasPresent: updatedLead.wasPresent,
      customInterest: updatedLead.customInterest,
      companyId: updatedLead.companyId,
      products: updatedLead.products ?? [],
      createdAt: updatedLead.createdAt,
    };
  }
}
