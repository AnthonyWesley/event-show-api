import { DeleteLeadInputDto } from "../../../usecase/lead/DeleteLead";
import { FindLeadInputDto } from "../../../usecase/lead/FindLead";
import { UpdateLeadInputDto } from "../../../usecase/lead/UpdateLead";
import { Lead } from "./Lead";

export interface ILeadGateway {
  save(lead: Lead): Promise<void>;
  listByPartner(partnerId: string): Promise<Lead[]>;
  listByEvent(eventId: string): Promise<Lead[]>;
  findById(input: FindLeadInputDto): Promise<Lead | null>;
  update(input: UpdateLeadInputDto): Promise<Lead>;
  delete(input: DeleteLeadInputDto): Promise<void>;
}
