import { Goal } from "../../domain/entities/event/Event";
import { LeadProps } from "../../domain/entities/lead/Lead";
import { SaleProps } from "../../domain/entities/sale/Sale";
import { SellerProps } from "../../domain/entities/seller/Seller";
import { GoalUtils } from "./GoalUtils";

export type SellerWithStats = SellerProps & {
  sales: SaleProps[];
  totalSalesCount: number;
  totalSalesValue: number;
  goal: number;
  wasPresentCount: number;
};

export class SellerStatsHelper {
  static computeStats(
    sales: SaleProps[],
    products: { id: string; price: number }[]
  ): Record<string, { count: number; total: number }> {
    const productMap = products.reduce((map, product) => {
      map[product.id] = product.price;
      return map;
    }, {} as Record<string, number>);

    return sales.reduce((acc, sale) => {
      const sellerId = sale.sellerId;
      const productPrice = productMap[sale.productId] ?? 0;
      const quantity = sale.quantity ?? 1;
      const saleTotal = productPrice * quantity;

      if (!acc[sellerId]) acc[sellerId] = { count: 0, total: 0 };
      acc[sellerId].count += quantity;
      acc[sellerId].total += saleTotal;

      return acc;
    }, {} as Record<string, { count: number; total: number }>);
  }

  static applyStatsToSellers(
    sellers: SellerProps[],
    stats: Record<string, { count: number; total: number }>,
    goalEvent: number,
    wasPresentMap: Record<string, number>
  ): SellerWithStats[] {
    return sellers
      .filter((s): s is SellerProps => !!s)
      .map((seller) => {
        const goal = GoalUtils.calculateIndividualSellerGoal(
          sellers,
          goalEvent
        );
        const { count, total } = stats[seller.id] ?? { count: 0, total: 0 };
        const wasPresentCount = wasPresentMap[seller.id] ?? 0;

        return {
          ...seller,
          sales: [],
          totalSalesCount: count,
          totalSalesValue: total,
          goal,
          wasPresentCount,
        };
      });
  }

  static sortByGoalType(
    sellers: SellerWithStats[],
    goalType: Goal
  ): SellerWithStats[] {
    return sellers.sort((a, b) => {
      if (goalType === Goal.QUANTITY) {
        if (b.totalSalesCount !== a.totalSalesCount) {
          return b.totalSalesCount - a.totalSalesCount;
        }
        if (b.totalSalesValue !== a.totalSalesValue) {
          return b.totalSalesValue - a.totalSalesValue;
        }
        // Desempate final: presença
        return b.wasPresentCount - a.wasPresentCount;
      } else {
        if (b.totalSalesValue !== a.totalSalesValue) {
          return b.totalSalesValue - a.totalSalesValue;
        }
        // Desempate final (opcional aqui): por presença
        return b.wasPresentCount - a.wasPresentCount;
      }
    });
  }

  static computeWasPresentPerSeller(
    leads: { sellerId?: string; wasPresent: boolean }[]
  ): Record<string, number> {
    return leads.reduce((acc, lead) => {
      if (lead.wasPresent && lead.sellerId) {
        acc[lead.sellerId] = (acc[lead.sellerId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }
}
