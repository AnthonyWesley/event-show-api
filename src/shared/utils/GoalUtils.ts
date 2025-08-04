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
  static calculateIndividualSellerGoal(
    allSellers: SellerProps[],
    totalGoal: number
  ): number {
    if (!allSellers.length) return 0;
    return totalGoal / allSellers.length;
  }
}
