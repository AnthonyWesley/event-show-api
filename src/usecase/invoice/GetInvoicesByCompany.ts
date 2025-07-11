import { IInvoiceGateway } from "../../domain/entities/invoice/IInvoiceGateway";

export class GetInvoicesByCompany {
  private constructor(private readonly invoiceGateway: IInvoiceGateway) {}

  public static create(invoiceGateway: IInvoiceGateway) {
    return new GetInvoicesByCompany(invoiceGateway);
  }

  public async execute(companyId: string): Promise<any[]> {
    const invoices = await this.invoiceGateway.findByCompanyId(companyId);

    return invoices.map((invoice) => invoice.toResponse());
  }
}
