import { CreateInvoice } from "../../usecase/invoice/CreateInvoice";
import { GetInvoiceById } from "../../usecase/invoice/GetInvoiceById";
import { GetInvoicesByCompany } from "../../usecase/invoice/GetInvoicesByCompany";
import { MarkInvoiceAsPaid } from "../../usecase/invoice/MarkInvoiceAsPaid";
import { InvoiceRepositoryPrisma } from "../repositories/invoice/InvoiceRepositoryPrisma";

export function makeInvoiceUseCases(
  invoiceRepository: InvoiceRepositoryPrisma
) {
  return {
    create: CreateInvoice.create(invoiceRepository),
    getById: GetInvoiceById.create(invoiceRepository),
    getAllByCompany: GetInvoicesByCompany.create(invoiceRepository),
    paid: MarkInvoiceAsPaid.create(invoiceRepository),
  };
}
