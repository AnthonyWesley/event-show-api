import { IInvoiceGateway } from "../../domain/entities/invoice/IInvoiceGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export class GetInvoiceById {
  private constructor(private readonly invoiceGateway: IInvoiceGateway) {}

  public static create(invoiceGateway: IInvoiceGateway) {
    return new GetInvoiceById(invoiceGateway);
  }

  public async execute(id: string) {
    const invoice = await this.invoiceGateway.findById(id);

    if (!invoice) throw new NotFoundError("Invoice not found.");

    return invoice.toResponse();
  }
}
