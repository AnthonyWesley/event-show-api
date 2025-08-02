import axios from "axios";

const PLATFORM_CORE_BASE_URL =
  process.env.PLATFORM_CORE_URL || "http://localhost:7000";

export type FeatureResponse = {
  key: string;
  name: string;
  type: "INT" | "BOOLEAN" | "STRING";
  intValue?: number;
  boolValue?: boolean;
  stringValue?: string;
};

const featureCache = new Map<string, FeatureResponse[]>();

export class PlatformClient {
  static async getFeatures(
    platformId: string,
    companyId: string
  ): Promise<FeatureResponse[]> {
    const cacheKey = `${platformId}:${companyId}`;
    if (featureCache.has(cacheKey)) return featureCache.get(cacheKey)!;

    const url = `${PLATFORM_CORE_BASE_URL}/features/${platformId}`;

    try {
      const { data } = await axios.get(url);
      if (!Array.isArray(data)) throw new Error("Formato inválido da API");
      featureCache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Erro ao buscar features da plataforma:", error);
      throw new Error("Erro ao comunicar com Platform Core");
    }
  }

  static async getFeatureValue<T extends number | boolean | string>(
    platformId: string,
    companyId: string,
    featureKey: string
  ): Promise<T | null> {
    const features = await this.getFeatures(platformId, companyId);
    const feature = features.find((f) => f.key === featureKey);
    if (!feature) return null;

    switch (feature.type) {
      case "BOOLEAN":
        return feature.boolValue as T;
      case "INT":
        return feature.intValue as T;
      case "STRING":
        return feature.stringValue as T;
      default:
        return null;
    }
  }

  static async hasFeature(
    platformId: string,
    companyId: string,
    featureKey: string
  ): Promise<boolean> {
    const value = await this.getFeatureValue<boolean>(
      platformId,
      companyId,
      featureKey
    );
    return value === true;
  }
}
