import { IInvoiceGateway } from "../../domain/entities/invoice/IInvoiceGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export class MarkInvoiceAsPaid {
  private constructor(private readonly invoiceGateway: IInvoiceGateway) {}

  public static create(invoiceGateway: IInvoiceGateway) {
    return new MarkInvoiceAsPaid(invoiceGateway);
  }

  public async execute(id: string): Promise<void> {
    const invoice = await this.invoiceGateway.findById(id);

    if (!invoice) {
      throw new NotFoundError("Invoice not found.");
    }

    invoice.setPaid();

    await this.invoiceGateway.update(invoice);
  }
}
