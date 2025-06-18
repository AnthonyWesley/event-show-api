import { Readable } from "stream";
import EventReport from "./templates/EventReportPdf";
import { EventReportPdfProps } from "./templates/EventReportPdfProps";

export class PdfEventExporter {
  constructor(readonly props: any) {}

  async export(data: EventReportPdfProps["data"]): Promise<Buffer> {
    const components = await import("@react-pdf/renderer");
    const { pdf } = components;

    const doc = <EventReport data={data} components={components} />;
    const pdfInstance = pdf(doc);
    const pdfResult = await pdfInstance.toBuffer();

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
