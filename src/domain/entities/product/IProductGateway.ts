import { DeletePartnerProductInputDto } from "../../../usecase/product/DeletePartnerProduct";
import { FindPartnerProductInputDto } from "../../../usecase/product/FindPartnerProduct";
import { UpdatePartnerProductInputDto } from "../../../usecase/product/UpdatePartnerProduct";
import { Product } from "./Product";

export interface IProductGateway {
  save(product: Product): Promise<void>;
  list(partnerId: string, search?: string): Promise<Product[]>;
  findById(input: FindPartnerProductInputDto): Promise<Product | null>;
  update(input: UpdatePartnerProductInputDto): Promise<Product>;
  delete(input: DeletePartnerProductInputDto): Promise<void>;
}
