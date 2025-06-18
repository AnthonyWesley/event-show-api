import PDFDocument from "pdfkit";
import { Writable } from "stream";
import { EventReportPdfProps } from "./templates/EventReportPdfProps";

export class PdfEventExporter {
  constructor(readonly props: any) {}

  async export(data: EventReportPdfProps["data"]): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];

    const writable = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      },
    });

    doc.pipe(writable);
    this.generateContent(doc, data);
    doc.end();

    return new Promise((resolve, reject) => {
      writable.on("finish", () => {
        resolve(Buffer.concat(chunks));
      });
      writable.on("error", reject);
    });
  }

  private generateContent(
    doc: PDFKit.PDFDocument,
    data: EventReportPdfProps["data"]
  ) {
    const { event, sellers, sales } = data;

    doc
      .fontSize(20)
      .text(`Relatório do Evento: ${event.name}`, { underline: true });
    doc.moveDown();

    doc.fontSize(12).text(`Período: ${event.startDate} a ${event.endDate}`);
    doc.text(`Meta Geral: ${event.goal} (${event.goalType})`);
    doc.moveDown();

    doc.fontSize(14).text("Resumo Geral", { underline: true });
    doc.fontSize(12).text(`Total de Unidades Vendidas: ${event.totalUnits}`);
    doc.text(`Valor Total Vendido: ${event.totalValue}`);
    doc.text(`Meta Atingida: ${event.goalReached ? "Sim ✅" : "Não ❌"}`);
    doc.moveDown();

    doc.fontSize(14).text("Vendedores", { underline: true });
    doc.moveDown(0.5);

    sellers.forEach((seller) => {
      doc.fontSize(11).text(`Nome: ${seller.name}`);
      doc.text(`Email: ${seller.email}`);
      doc.text(`Telefone: ${seller.phone}`);
      doc.text(`Total Unidades: ${seller.totalUnits}`);
      doc.text(`Total Valor: ${seller.totalValue}`);
      doc.text(`Meta: ${seller.goal}`);
      doc.text(`Meta Atingida: ${seller.goalReached ? "Sim" : "Não"}`);
      doc.moveDown();
    });

    doc.addPage();
    doc.fontSize(14).text("Vendas Detalhadas", { underline: true });
    doc.moveDown();

    sales.forEach((sale) => {
      doc
        .fontSize(10)
        .text(
          `Data: ${sale.date} | Vendedor: ${sale.seller} | Produto: ${sale.product} | Qtd: ${sale.quantity} | Unit: ${sale.unitPrice} | Total: ${sale.total}`
        );
    });
  }
}
