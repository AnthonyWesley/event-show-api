import { PrismaClient } from "@prisma/client";
import { IInvoiceGateway } from "../../../domain/entities/invoice/IInvoiceGateway";
import { Invoice } from "../../../domain/entities/invoice/Invoice";

export class InvoiceRepositoryPrisma implements IInvoiceGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new InvoiceRepositoryPrisma(prisma);
  }

  async save(invoice: Invoice): Promise<void> {
    const data = invoice.toResponse();

    await this.prisma.invoice.create({
      data: {
        id: data.id,
        companyId: data.companyId,
        subscriptionId: data.subscriptionId,
        externalId: data.externalId,
        amount: data.amount,
        dueDate: data.dueDate,
        paidAt: data.paidAt,
        status: data.status,
        createdAt: data.createdAt,
      },
    });
  }

  async update(invoice: Invoice): Promise<void> {
    const data = invoice.toResponse();

    await this.prisma.invoice.update({
      where: { id: data.id },
      data: {
        status: data.status,
        paidAt: data.paidAt,
      },
    });
  }

  async findById(id: string): Promise<Invoice | null> {
    const data = await this.prisma.invoice.findUnique({ where: { id } });

    return data ? Invoice.with(data) : null;
  }

  async findByCompanyId(companyId: string): Promise<Invoice[]> {
    const data = await this.prisma.invoice.findMany({
      where: { companyId },
      orderBy: { dueDate: "desc" },
    });

    return data.map(Invoice.with);
  }
}
