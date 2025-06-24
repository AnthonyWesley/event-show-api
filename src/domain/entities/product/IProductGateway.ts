import { DeletePartnerProductInputDto } from "../../../usecase/product/DeleteProduct";
import { FindPartnerProductInputDto } from "../../../usecase/product/FindProduct";
import { UpdatePartnerProductInputDto } from "../../../usecase/product/UpdateProduct";
import { Product } from "./Product";

export interface IProductGateway {
  save(product: Product): Promise<void>;
  list(partnerId: string, search?: string): Promise<Product[]>;
  findById(input: FindPartnerProductInputDto): Promise<Product | null>;
  update(input: UpdatePartnerProductInputDto): Promise<Product>;
  delete(input: DeletePartnerProductInputDto): Promise<void>;
}
