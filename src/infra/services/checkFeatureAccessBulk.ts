import axios from "axios";

interface MultiFeatureCheckParams {
  platformId: string;
  planId: string;
  featureKeys: string[];
}

interface MultiFeatureCheckResponse {
  [featureKey: string]: {
    allowed: boolean;
    value: boolean | number | string | null;
  };
}

export async function checkFeatureAccessBulk(
  params: MultiFeatureCheckParams
): Promise<MultiFeatureCheckResponse> {
  try {
    const res = await axios.post(
      "http://localhost:7000/features/check-access",
      {
        platformId: params.platformId,
        planId: params.planId,
        featureKeys: params.featureKeys,
      }
    );
    return res.data;
  } catch (error: any) {
    console.warn("[checkFeatureAccessBulk] Fallback ativado:", error.message);

    const fallback: MultiFeatureCheckResponse = {};
    for (const key of params.featureKeys) {
      fallback[key] = {
        allowed: true,
        value: null,
      };
    }
    return fallback;
  }
}
