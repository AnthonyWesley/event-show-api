import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { Company } from "../../domain/entities/company/Company";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import fs from "fs";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";
import { IUserGateway } from "../../domain/entities/user/IUserGateway";
import { User } from "../../domain/entities/user/User";

export type UpdateUserPhotoInputDto = {
  id: string;
  photo?: string;
  photoPublicId?: string;
  file?: any;
};

export type UpdateUserPhotoOutputDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};

export class UpdateUserPhoto
  implements IUseCases<UpdateUserPhotoInputDto, UpdateUserPhotoOutputDto>
{
  private constructor(
    private readonly userGateway: IUserGateway,
    private readonly uploadPhotoService: CloudinaryUploadService
  ) {}

  static create(
    userGateway: IUserGateway,
    uploadPhotoService: CloudinaryUploadService
  ) {
    return new UpdateUserPhoto(userGateway, uploadPhotoService);
  }

  async execute(
    input: UpdateUserPhotoInputDto
  ): Promise<UpdateUserPhotoOutputDto> {
    console.log(input);

    if (!input.file) throw new NotFoundError("File");

    const existingUser = await this.userGateway.findById(input.id);
    if (!existingUser) {
      throw new NotFoundError("User");
    }

    if (existingUser.photoPublicId) {
      await this.uploadPhotoService.deleteImage(existingUser.photoPublicId);
    }

    const upload = await this.uploadPhotoService.uploadImage(input.file.path, {
      folder: `user/${existingUser.id}`,
      public_id: "photo",
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "thumb", gravity: "face" },
      ],
      tags: ["user"],
      context: {
        alt: `${existingUser.name} - foto`,
        caption: "Foto do usuário",
      },
    });

    fs.unlinkSync(input.file.path);

    const updatedCompany = User.with({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      password: existingUser.password,
      phone: existingUser.phone,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
      companyId: existingUser.companyId,
    });

    const updated = await this.userGateway.update(input.id, updatedCompany);

    return {
      id: updated.id,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    };
  }
}
