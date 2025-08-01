// services/subscriptionService.ts

import { prisma } from "../../package/prisma";

export interface CompanySubscription {
  planId: string;
  platformId: string;
}

export async function getCompanySubscription(
  companyId: string
): Promise<CompanySubscription | null> {
  const subscription = await prisma.subscription.findFirst({
    where: { companyId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
    select: {
      planId: true,
      company: {
        select: {
          platformId: true,
        },
      },
    },
  });

  if (!subscription) return null;

  return {
    planId: subscription.planId,
    platformId: subscription.company.platformId,
  };
}
