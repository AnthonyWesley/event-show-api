import { EventProps } from "../../domain/entities/event/Event";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { StatusType } from "../../domain/entities/partner/Partner";
import { IUseCases } from "../IUseCases";

export type ListPartnerInputDto = { search?: string };

export type ListPartnerOutputDto = {
  partners: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    plan: any;
    photo?: string;
    photoPublicId?: string;
    maxConcurrentEvents: number;
    status: StatusType;
    events: EventProps[];
    accessExpiresAt: Date;
    createdAt: Date;
  }[];
};

export class ListPartner
  implements IUseCases<ListPartnerInputDto, ListPartnerOutputDto>
{
  private constructor(private readonly partnerGateway: IPartnerGateway) {}

  public static create(partnerGateway: IPartnerGateway) {
    return new ListPartner(partnerGateway);
  }

  public async execute(
    input: ListPartnerInputDto
  ): Promise<ListPartnerOutputDto> {
    const aPartners = await this.partnerGateway.list(input.search);
    if (!aPartners) {
      throw new Error("Failed do list partners");
    }
    return {
      partners: aPartners.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        password: c.password,
        phone: c.phone,
        photo: c.photo,
        photoPublicId: c.photoPublicId,
        plan: c.plan,
        status: c.status,
        maxConcurrentEvents: c.maxConcurrentEvents,
        events: c.events ?? [],
        accessExpiresAt: c.accessExpiresAt,
        createdAt: c.createdAt,
      })),
    };
  }
}
