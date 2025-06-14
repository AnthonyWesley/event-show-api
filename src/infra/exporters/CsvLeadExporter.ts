import { stringify } from "csv-stringify/sync";
import { ILeadExporter } from "./ILeadExporter";

export class CsvLeadExporter implements ILeadExporter {
  public readonly contentType = "text/csv";
  public readonly fileName = "leads.csv";

  async export(data: any[]): Promise<Buffer> {
    const csv = stringify(data, {
      header: true,
      delimiter: ";",
      quoted: true,
    });

    return Buffer.from("\uFEFF" + csv, "utf-8");
  }
}
