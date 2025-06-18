import EventReport, { EventReportPdfProps } from "./templates/EventReportPdf";
import { Readable } from "stream";

export class PdfEventExporter {
  constructor(readonly props: any) {}

  async export(data: EventReportPdfProps["data"]): Promise<Buffer> {
    const { pdf } = await import("@react-pdf/renderer");

    const doc = <EventReport data={data} />;

    const pdfInstance = pdf(doc);
    const pdfResult = await pdfInstance.toBuffer();

    // No Node.js normalmente já é Buffer, mas se for stream converte
    if (pdfResult instanceof Readable) {
      const chunks: Uint8Array[] = [];
      for await (const chunk of pdfResult) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    }

    return pdfResult;
  }
}
