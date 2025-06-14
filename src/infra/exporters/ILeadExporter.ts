export interface ILeadExporter {
  export(data: any[]): Promise<Buffer>;
  contentType: string;
  fileName: string;
}
