import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IUseCases } from "../IUseCases";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { Seller } from "../../domain/entities/seller/Seller";
import { ValidationError } from "../../shared/errors/ValidationError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";

export type CreateEventSellerInputDto = {
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  partnerId: string;
  // sales     Sale[]
  // createdAt: Date;
};

export type CreateEventSellerOutputDto = {
  id: string;
};

export class CreateEventSeller
  implements IUseCases<CreateEventSellerInputDto, CreateEventSellerOutputDto>
{
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    sellerGateway: ISellerGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new CreateEventSeller(sellerGateway, partnerGateway);
  }

  public async execute(
    input: CreateEventSellerInputDto
  ): Promise<CreateEventSellerOutputDto> {
    if (!input.name || !input.email || !input.partnerId) {
      throw new ValidationError(
        "All fields are required: name, email, partnerId."
      );
    }

    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new NotFoundError("Partner");
    }

    // ✅ Check for existing seller by email
    const existingSeller = await this.sellerGateway.findByEmail({
      email: input.email,
      partnerId: input.partnerId,
    });

    if (existingSeller) {
      throw new ValidationError("A seller with this email already exists.");
    }

    const anEvent = Seller.create(
      input.name,
      input.email,
      partnerExists.id,
      input.phone ?? "",
      input.photo ?? ""
    );

    await this.sellerGateway.save(anEvent);

    return { id: anEvent.id };
  }
}
