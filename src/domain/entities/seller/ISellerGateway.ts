import { DeleteEventSellerInputDto } from "../../../usecase/seller/DeleteEventSeller";
import { FindEventSellerInputDto } from "../../../usecase/seller/FindEventSeller";
import { FindEventSellerByEmailInputDto } from "../../../usecase/seller/FindEventSellerByEmail";
import { UpdateEventSellerInputDto } from "../../../usecase/seller/UpdateEventSeller";
import { Seller } from "./Seller";

export interface ISellerGateway {
  save(seller: Seller): Promise<void>;
  list(eventId: string, search?: string): Promise<Seller[]>;
  findById(input: FindEventSellerInputDto): Promise<Seller | null>;
  findByEmail(input: FindEventSellerByEmailInputDto): Promise<Seller | null>;
  update(input: UpdateEventSellerInputDto): Promise<Seller>;
  delete(input: DeleteEventSellerInputDto): Promise<void>;
}
