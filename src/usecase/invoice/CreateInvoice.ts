import { IInvoiceGateway } from "../../domain/entities/invoice/IInvoiceGateway";
import { Invoice } from "../../domain/entities/invoice/Invoice";
import { ValidationError } from "../../shared/errors/ValidationError";
export type CreateInvoiceInputDto = {
  companyId: string;
  subscriptionId?: string;
  externalId: string;
  amount: number;
  dueDate: Date;
};

export type CreateInvoiceOutputDto = {
  id: string;
};

export class CreateInvoice {
  private constructor(private readonly invoiceGateway: IInvoiceGateway) {}

  public static create(invoiceGateway: IInvoiceGateway) {
    return new CreateInvoice(invoiceGateway);
  }

  public async execute(
    input: CreateInvoiceInputDto
  ): Promise<CreateInvoiceOutputDto> {
    if (
      !input.companyId ||
      !input.externalId ||
      !input.amount ||
      !input.dueDate
    ) {
      throw new ValidationError("Missing required invoice fields.");
    }

    const invoice = Invoice.create({
      ...input,
      status: "PENDING",
    });

    await this.invoiceGateway.save(invoice);

    return { id: invoice.id };
  }
}
