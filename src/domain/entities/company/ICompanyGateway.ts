import { Company, CompanyProps } from "./Company";

export interface ICompanyGateway {
  save(company: Company, userId: string): Promise<void>;
  list(search?: string): Promise<Company[]>;
  findById(id: string): Promise<Company | null>;
  findByEmail(email: string): Promise<Company | null>;
  update(id: string, data: Partial<CompanyProps>): Promise<Company>;

  delete(id: string): Promise<void>;
  activateCompany(companyId: string): Promise<void>;
  suspendCompany(companyId: string): Promise<void>;
}
