import { S3Client } from "@aws-sdk/client-s3";
import { CreateSeller } from "../../usecase/seller/CreateSeller";
import { DeleteSeller } from "../../usecase/seller/DeleteSeller";
import { FindSeller } from "../../usecase/seller/FindSeller";
import { FindSellerByEmail } from "../../usecase/seller/FindSellerByEmail";
import { ListSeller } from "../../usecase/seller/ListSeller";
import { UpdateSeller } from "../../usecase/seller/UpdateSeller";
import { UpdateSellerPhoto } from "../../usecase/seller/UpdateSellerPhoto";
import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { SellerRepositoryPrisma } from "../repositories/seller/SellerRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";
import { SocketServer } from "../socket/SocketServer";

export function makeSellerUseCases(
  sellerRepository: SellerRepositoryPrisma,
  companyRepository: CompanyRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService,
  // minIoUploadService: S3Client,

  socketServer: SocketServer
) {
  return {
    create: CreateSeller.create(
      sellerRepository,
      companyRepository,
      socketServer
    ),
    list: ListSeller.create(sellerRepository, companyRepository),
    findOne: FindSeller.create(sellerRepository, companyRepository),
    findByEmail: FindSellerByEmail.create(sellerRepository, companyRepository),
    delete: DeleteSeller.create(
      sellerRepository,
      companyRepository,
      socketServer
    ),
    update: UpdateSeller.create(
      sellerRepository,
      companyRepository,
      socketServer
    ),
    updatePhoto: UpdateSellerPhoto.create(
      sellerRepository,
      companyRepository,
      uploadPhotoService,
      // minIoUploadService,

      socketServer
    ),
  };
}
