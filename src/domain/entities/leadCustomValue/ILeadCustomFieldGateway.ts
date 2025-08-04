import { UpsertLeadCustomValueInputDto } from "../leadCustomField/ILeadCustomFieldGateway";
import { LeadCustomValue } from "./LeadCustomValue";

export interface ILeadCustomValueGateway {
  upsertMany(values: UpsertLeadCustomValueInputDto[]): Promise<void>;
  deleteByLead(leadId: string): Promise<void>;
  findByLead(leadId: string): Promise<LeadCustomValue[]>;
}
