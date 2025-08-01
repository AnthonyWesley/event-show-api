import axios from "axios";
import { ISubscriptionGateway } from "../../domain/entities/subscription/ISubscriptionGateway";
import { ServiceTokenService } from "../../service/ServiceTokenService";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
export class GetSubscriptionByCompany {
  constructor(
    private readonly subscriptionGateway: ISubscriptionGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly serviceToken: ServiceTokenService
  ) {}

  public static create(
    subscriptionGateway: ISubscriptionGateway,
    companyGateway: ICompanyGateway,
    serviceToken: ServiceTokenService
  ) {
    return new GetSubscriptionByCompany(
      subscriptionGateway,
      companyGateway,
      serviceToken
    );
  }

  public async execute(companyId: string) {
    const existCompany = await this.companyGateway.findById(companyId);

    if (!existCompany) {
      throw new NotFoundError("Company");
    }
    const token = this.serviceToken.generate("EventShow");
    try {
      const response = await axios.get(
        `http://localhost:7000/plans/${existCompany.platformId}/service`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar os planos:", error);
    }
    // const subscription = await this.subscriptionGateway.findActiveByCompany(
    //   companyId
    // );

    // if (!subscription)
    //   throw new NotFoundError("Active subscription not found.");
  }
}
