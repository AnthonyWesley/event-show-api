import { FieldType } from "@prisma/client";
import { LeadCustomField } from "./LeadCustomField";

export type CreateLeadCustomFieldInputDto = {
  companyId: string;
  name: string;
  key: string;
  type: FieldType;
  required?: boolean;
  order?: number;
};

export type UpdateLeadCustomFieldInputDto = {
  id: string;
  companyId: string;
  name?: string;
  key?: string;
  type?: FieldType;
  required?: boolean;
  order?: number;
};

export type UpsertLeadCustomValueInputDto = {
  leadId: string;
  fieldId: string;
  value: string;
};

export interface ILeadCustomFieldGateway {
  save(field: CreateLeadCustomFieldInputDto): Promise<LeadCustomField>;
  update(field: UpdateLeadCustomFieldInputDto): Promise<LeadCustomField>;
  delete(fieldId: string, companyId: string): Promise<void>;
  findByCompany(companyId: string): Promise<LeadCustomField[]>;
  findById(fieldId: string, companyId: string): Promise<LeadCustomField | null>;
}
