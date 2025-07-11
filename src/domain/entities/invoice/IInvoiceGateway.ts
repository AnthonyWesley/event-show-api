import { Invoice } from "./Invoice";

export interface IInvoiceGateway {
  save(invoice: Invoice): Promise<void>;
  update(invoice: Invoice): Promise<void>;
  findById(id: string): Promise<Invoice | null>;
  findByCompanyId(companyId: string): Promise<Invoice[]>;
}
