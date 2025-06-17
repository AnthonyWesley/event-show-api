import { IEventExporter } from "./IEventExporter";

export class PdfEventExporter implements IEventExporter {
  public readonly contentType = "text/csv";
  public readonly fileName = "leads.csv";
  constructor(readonly props: any) {}
  export(data: any[]): Promise<Buffer> {
    throw new Error("Method not implemented.");
  }
}
