import { LeadSource } from "./LeadSource";

export interface ILeadSourceGateway {
  save(leadSource: LeadSource): Promise<void>;
  list(leadSourceId: string, search?: string): Promise<LeadSource[]>;
  findById(leadSourceId: string): Promise<LeadSource | null>;
  update(leadSourceId: string, data: LeadSource): Promise<void>;
  delete(leadSourceId: string): Promise<void>;
}
