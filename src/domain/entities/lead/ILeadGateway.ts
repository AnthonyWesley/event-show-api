import { Prisma } from "@prisma/client";
import { DeleteLeadInputDto } from "../../../usecase/lead/DeleteLead";
import { FindLeadInputDto } from "../../../usecase/lead/FindLead";
import { UpdateLeadInputDto } from "../../../usecase/lead/UpdateLead";
import { Lead } from "./Lead";
export type LeadWithField = Prisma.LeadGetPayload<{
  include: {
    products: { select: { id: true; name: true } };
    leadSource: { select: { id: true; name: true } };
    seller: { select: { id: true; name: true } };
    event: { select: { id: true; name: true } };
    customValues: {
      include: {
        field: true;
      };
    };
  };
}>;
export interface ILeadGateway {
  save(lead: Lead): Promise<void>;
  listByCompany(companyId: string): Promise<LeadWithField[]>;
  listByEvent(eventId: string, search?: string): Promise<LeadWithField[]>;
  findById(input: FindLeadInputDto): Promise<Lead | null>;
  update(input: UpdateLeadInputDto): Promise<Lead>;
  delete(input: DeleteLeadInputDto): Promise<void>;
}
