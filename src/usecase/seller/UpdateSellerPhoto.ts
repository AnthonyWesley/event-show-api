import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";
import fs from "fs";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { SocketServer } from "../../infra/socket/SocketServer";
import { S3Client } from "@aws-sdk/client-s3";
import { MinIoUploadService } from "../../infra/services/MinIoUploadService";
import { WhatsAppService } from "../../infra/mail/WhatsAppService";

export type UpdateSellerPhotoInputDto = {
  sellerId: string;
  companyId: string;
  photo?: string;
  photoPublicId?: string;
  file?: any;
};

export type UpdateSellerPhotoOutputDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};
export class UpdateSellerPhoto {
  constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly uploadPhotoService: CloudinaryUploadService,

    private readonly socketServer: SocketServer // private readonly minIoUploadService: S3Client,
  ) {}

  static create(
    sellerGateway: ISellerGateway,
    companyGateway: ICompanyGateway,
    uploadPhotoService: CloudinaryUploadService,
    // minIoUploadService: S3Client,
    socketServer: SocketServer
  ) {
    return new UpdateSellerPhoto(
      sellerGateway,
      companyGateway,
      uploadPhotoService,
      // minIoUploadService,
      socketServer
    );
  }

  async execute(
    input: UpdateSellerPhotoInputDto
  ): Promise<UpdateSellerPhotoOutputDto> {
    if (!input.file) throw new NotFoundError("File");

    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
    }

    const existingSeller = await this.sellerGateway.findById(input);
    if (!existingSeller) {
      throw new NotFoundError("Seller");
    }

    if (existingSeller.photoPublicId) {
      await this.uploadPhotoService.deleteImage(existingSeller.photoPublicId);
    }

    // const minUpload = await new MinIoUploadService().uploadImage(
    //   input.file.path,
    //   {
    //     objectName: `sellers/${input.file.filename}`,
    //   }
    // );

    const upload = await this.uploadPhotoService.uploadImage(input.file.path, {
      folder: `seller/${existingSeller.id}`,
      public_id: "photo",
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "thumb", gravity: "face" },
      ],
      tags: ["seller"],
      context: {
        alt: `${existingSeller.name} - foto`,
        caption: "Foto do vendedor",
      },
    });
    fs.unlinkSync(input.file.path);

    const updated = await this.sellerGateway.update({
      companyId: existingSeller.companyId,
      sellerId: existingSeller.id,
      name: existingSeller.name,
      email: existingSeller.email,
      phone: existingSeller.phone,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    });
    this.socketServer?.emit("seller:updated", { id: input.companyId });

    return {
      id: updated.id,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    };
  }
}
