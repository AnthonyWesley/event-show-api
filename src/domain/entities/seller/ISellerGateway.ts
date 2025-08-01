import { DeleteSellerInputDto } from "../../../usecase/seller/DeleteSeller";
import { FindSellerInputDto } from "../../../usecase/seller/FindSeller";
import { FindSellerByEmailInputDto } from "../../../usecase/seller/FindSellerByEmail";
import { UpdateSellerInputDto } from "../../../usecase/seller/UpdateSeller";
import { Seller } from "./Seller";

export interface ISellerGateway {
  save(seller: Seller): Promise<void>;
  list(eventId: string, search?: string): Promise<Seller[]>;
  findById(input: FindSellerInputDto): Promise<Seller | null>;
  countByCompany(companyId: string): Promise<number>;
  findByEmail(input: FindSellerByEmailInputDto): Promise<Seller | null>;
  update(input: UpdateSellerInputDto): Promise<Seller>;
  delete(input: DeleteSellerInputDto): Promise<void>;
}
