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

    doc.fontSize(14).text("Vendedores", { underline: true });
    doc.moveDown(0.5);

    // Define colunas
    const tableTop = doc.y;
    const itemHeight = 20;

    const columns = [
      { label: "Nome", prop: "name", width: 100 },
      { label: "Email", prop: "email", width: 120 },
      { label: "Telefone", prop: "phone", width: 80 },
      { label: "Unid.", prop: "totalUnits", width: 50 },
      { label: "Valor", prop: "totalValue", width: 60 },
      { label: "Meta", prop: "goal", width: 50 },
      { label: "Atingiu", prop: "goalReached", width: 50 },
    ];

    // Cabeçalho
    let x = doc.x;
    columns.forEach((col) => {
      doc.rect(x, tableTop, col.width, itemHeight).stroke();
      doc.text(col.label, x + 2, tableTop + 6, { width: col.width - 4 });
      x += col.width;
    });

    // Linhas
    let y = tableTop + itemHeight;
    sellers.forEach((seller) => {
      let x = doc.x;
      columns.forEach((col) => {
        let text = seller[col.prop as keyof typeof seller];
        if (col.prop === "goalReached") text = text ? "Sim" : "Não";
        doc.rect(x, y, col.width, itemHeight).stroke();
        doc.text(String(text), x + 2, y + 6, { width: col.width - 4 });
        x += col.width;
      });
      y += itemHeight;

      // Se passar da página, quebra e reinicia
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = doc.y;
      }
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
