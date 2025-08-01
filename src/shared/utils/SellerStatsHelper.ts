import { Goal } from "../../domain/entities/event/Event";
import { SaleProps } from "../../domain/entities/sale/Sale";
import { SellerProps } from "../../domain/entities/seller/Seller";
import { GoalUtils } from "./GoalUtils";

export type SellerWithStats = SellerProps & {
  sales: SaleProps[];
  totalSalesCount: number;
  totalSalesValue: number;
  goal: number;
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
    goalEvent: number
  ): SellerWithStats[] {
    return sellers
      .filter((s): s is SellerProps => !!s)
      .map((seller) => {
        const goal = GoalUtils.calculateIndividualSellerGoal(
          sellers,
          goalEvent
        );
        const { count, total } = stats[seller.id] ?? { count: 0, total: 0 };
        return {
          ...seller,
          sales: [],
          totalSalesCount: count,
          totalSalesValue: total,
          goal,
        };
      });
  }

  static sortByGoalType(
    sellers: SellerWithStats[],
    goalType: Goal
  ): SellerWithStats[] {
    return sellers.sort((a, b) =>
      goalType === Goal.QUANTITY
        ? b.totalSalesCount - a.totalSalesCount
        : b.totalSalesValue - a.totalSalesValue
    );
  }
}
