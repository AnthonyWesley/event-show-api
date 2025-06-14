import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { ILeadExporter } from "../../infra/exporters/ILeadExporter";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type ExportLeadInputDto = {
  eventId: string;
  partnerId: string;
};

export type ExportLeadOutputDto = {
  id: string;
};

export class ExportLead implements IUseCases<ExportLeadInputDto, any> {
  private constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly eventGateway: IEventGateway,
    private readonly exporter: ILeadExporter
  ) {}

  public static create(
    leadGateway: ILeadGateway,
    eventGateway: IEventGateway,
    exporter: ILeadExporter
  ) {
    return new ExportLead(leadGateway, eventGateway, exporter);
  }

  public async execute(input: ExportLeadInputDto): Promise<any> {
    let leadsToExport;

    if (input.eventId) {
      const event = await this.eventGateway.findById({
        eventId: input.eventId,
        partnerId: input.partnerId,
      });
      if (!event) {
        throw new NotFoundError("Event");
      }

      leadsToExport = await this.leadGateway.listByEvent(input.eventId);
    } else {
      leadsToExport = await this.leadGateway.listByPartner(input.partnerId);
    }

    const maxProducts = 3;

    const formatted = leadsToExport.map((lead) => {
      const productIds = lead.products?.map((p: any) => p.name) || [];

      const productInterests: Record<string, string> = {};
      for (let i = 0; i < maxProducts; i++) {
        productInterests[`Produto de Interesse ${i + 1}`] = productIds[i] || "";
      }

      return {
        Nome: lead.name,
        Email: lead.email || "Não informado",
        Telefone: lead.phone || "Não informado",
        ...productInterests,
        Origem: lead.source,
        Observações: lead.notes || "",
        Evento: lead.eventId,
        CriadoEm: lead.createdAt.toLocaleString("pt-BR"),
      };
    });

    const file = await this.exporter.export(formatted);

    return {
      file,
      contentType: this.exporter.contentType,
      fileName: this.exporter.fileName,
    };
  }
}
