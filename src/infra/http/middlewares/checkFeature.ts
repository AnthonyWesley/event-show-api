import { Request, Response, NextFunction } from "express";
import { getCompanySubscription } from "../../services/getCompanySubscription";
import { checkFeatureAccessBulk } from "../../services/checkFeatureAccessBulk";

export function checkFeatures(featureKeys: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as any;

      if (!user?.companyId) {
        return res.status(401).json({ message: "Company not found" });
      }

      const sub = await getCompanySubscription(user.companyId);

      if (!sub) {
        return res.status(403).json({ message: "Subscription not found" });
      }

      const result = await checkFeatureAccessBulk({
        planId: sub.planId,
        platformId: sub.platformId,
        featureKeys,
      });

      const featureValues: Record<string, boolean | number | string | null> =
        {};

      for (const key of featureKeys) {
        const feature = result[key];
        if (!feature || !feature.allowed) {
          return res
            .status(403)
            .json({ message: `Feature '${key}' not allowed` });
        }

        featureValues[key] = feature.value;
      }

      (req as any).featureValues = {
        ...(req as any).featureValues,
        ...featureValues,
      };

      next();
    } catch (err: any) {
      const fallback: Record<string, { allowed: boolean; value: null }> = {};
      for (const key of featureKeys) {
        fallback[key] = { allowed: true, value: null };
      }

      (req as any).featureValues = fallback;

      console.warn(
        `[checkFeatures] Serviço de feature falhou. Aplicando fallback.`,
        err.message
      );

      next();
    }
  };
}
