export interface IEventExporter {
  export(data: any[]): Promise<Buffer>;
  contentType: string;
  fileName: string;
}
