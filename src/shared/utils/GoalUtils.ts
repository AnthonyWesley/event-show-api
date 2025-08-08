import { GoalType } from "@prisma/client";
import { SellerWithStats } from "./SellerStatsHelper";
import { SellerProps } from "../../domain/entities/seller/Seller";
import { LeadProps } from "../../domain/entities/lead/Lead";

export class GoalUtils {
  /**
   * Soma o progresso de todos os vendedores baseado no tipo da meta.
   */
  static sumSellerProgressForGoal(
    allSellers: SellerWithStats[],
    goalType: GoalType
  ): number {
    return allSellers?.reduce((acc, seller) => {
      const value =
        goalType === "VALUE" ? seller.totalSalesValue : seller.totalSalesCount;

      return acc + (value || 0);
    }, 0);
  }

  /**
   * Calcula quanto cada vendedor precisa atingir individualmente para alcançar a meta total.
   */
  static calculateIndividualSellerGoals(
    allSellers: any[],
    totalGoal: number
  ): Record<string, number> {
    const sellerCount = allSellers.length;
    if (!sellerCount || totalGoal <= 0) return {};

    const baseGoal = Math.floor(totalGoal / sellerCount);
    let remainder = totalGoal % sellerCount;

    const goals: Record<string, number> = {};

    for (const seller of allSellers) {
      // Distribui o excedente para os primeiros "remainder" vendedores
      goals[seller.sellerId] = baseGoal + (remainder > 0 ? 1 : 0);
      remainder--;
    }

    return goals;
  }
}
