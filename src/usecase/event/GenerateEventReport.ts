import { GoalType } from "@prisma/client";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { SellerStatsHelper } from "../../helpers/SellerStatsHelper";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import { formatDate } from "../../helpers/formatDate";

export type GenerateEventReportInputDto = {
  partnerId: string;
  eventId: string;
};

export type GenerateEventReportOutputDto = {
  id: string;
  pdfBuffer: Buffer;
};

export class GenerateEventReport
  implements
    IUseCases<GenerateEventReportInputDto, GenerateEventReportOutputDto>
{
  private constructor(
    private readonly eventGateway: IEventGateway,
    private readonly partnerGateway: IPartnerGateway,
    private readonly exporter: PdfEventExporter
  ) {}

  public static create(
    eventGateway: IEventGateway,
    partnerGateway: IPartnerGateway,
    exporter: PdfEventExporter
  ) {
    return new GenerateEventReport(eventGateway, partnerGateway, exporter);
  }

  public async execute(
    input: GenerateEventReportInputDto
  ): Promise<GenerateEventReportOutputDto> {
    const partner = await this.partnerGateway.findById(input.partnerId);
    if (!partner) throw new NotFoundError("Partner");

    const eventList = await this.eventGateway.list(partner.id);
    const event = eventList.find((e) => e.id === input.eventId);
    if (!event) throw new NotFoundError("Event");

    const sellerIds = event.sellerEvents.map((se: any) => se.sellerId);
    const sellers = (partner.sellers ?? []).filter((s) =>
      sellerIds.includes(s.id)
    );

    const stats = SellerStatsHelper.computeStats(
      event.sales,
      partner.products ?? []
    );

    const sellersWithStats = SellerStatsHelper.applyStatsToSellers(
      sellers,
      stats
    );

    const allSellers = SellerStatsHelper.sortByGoalType(
      sellersWithStats,
      event.goalType as GoalType
    );

    const totalUnits = allSellers.reduce(
      (acc, seller) => acc + seller.totalSalesCount,
      0
    );

    const totalValue = allSellers.reduce(
      (acc, seller) => acc + seller.totalSalesValue,
      0
    );

    const goalReached =
      event.goalType === GoalType.QUANTITY
        ? totalUnits >= event.goal
        : totalValue >= event.goal;

    const sellerGoal = Math.ceil(
      sellers.length > 0 ? event.goal / sellers.length : 0
    );

    const data = {
      event: {
        name: event.name,
        startDate: formatDate(event.startDate),
        endDate: formatDate(event.endDate),

        goal: this.currencyFormatter.ToBRL(event.goal),
        goalType: event.goalType,
        totalUnits,
        totalValue: this.currencyFormatter.ToBRL(totalValue),
        goalReached,
        isActive: event.isActive,
      },
      sellers: allSellers.map((seller) => {
        const goalHit =
          event.goalType === GoalType.QUANTITY
            ? seller.totalSalesCount >= sellerGoal
            : seller.totalSalesValue >= sellerGoal;

        return {
          name: seller.name,
          email: seller.email,
          phone: seller.phone,
          totalUnits: seller.totalSalesCount,
          totalValue: this.currencyFormatter.ToBRL(seller.totalSalesValue),
          goal:
            event.goalType === GoalType.QUANTITY
              ? sellerGoal
              : this.currencyFormatter.ToBRL(sellerGoal),
          goalReached: goalHit,
        };
      }),
      sales: event.sales
        .map((sale) => {
          const product = partner?.products?.find(
            (p) => p.id === sale.productId
          );
          const seller = partner?.sellers?.find((s) => s.id === sale.sellerId);
          if (!product || !seller) return null;

          const unitPrice = product.price || 0;

          return {
            date: sale.createdAt.toISOString().split("T")[0],
            seller: seller.name || "Desconhecido",
            product: product.name || "Desconhecido",
            quantity: sale.quantity,
            unitPrice: this.currencyFormatter.ToBRL(unitPrice),
            total: this.currencyFormatter.ToBRL(sale.quantity * unitPrice),
          };
        })
        .filter((sale) => sale !== null),
    };

    // const exporter = new PdfEventExporter({});
    // const pdfBuffer = await exporter.export(data);
    const pdfBuffer = await this.exporter.export(data);

    return { id: event.id, pdfBuffer };
  }

  currencyFormatter = {
    ToBRL: (value: string | number): string => {
      if (typeof value === "number") {
        return value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }

      if (typeof value === "string") {
        const numeric = value.replace(/\D/g, "");
        const number = parseFloat(numeric || "0") / 100;

        return number.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }

      return "R$ 0,00";
    },

    ToNumber(value: string | number): number {
      if (typeof value !== "string") {
        value = String(value);
      }

      const cleaned = value
        .replace(/[R$\s]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

      return parseFloat(cleaned) || 0;
    },
  };
}
