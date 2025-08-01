import { generateId } from "../../../shared/utils/IdGenerator";
import { LeadProps } from "../lead/Lead";

type LeadSourceProps = {
  id: string;
  name: string;
  photo?: string;
  photoPublicId?: string;
  description?: string;
  companyId: string;
  leads?: LeadProps[];
  createdAt: Date;
};

export class LeadSource {
  private constructor(private readonly props: LeadSourceProps) {}

  public static create(
    props: Omit<LeadSourceProps, "id" | "createdAt">
  ): LeadSource {
    return new LeadSource({
      ...props,
      id: generateId(),
      createdAt: new Date(),
    });
  }

  public static with(props: LeadSourceProps): LeadSource {
    return new LeadSource(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
  get photo() {
    return this.props.photo;
  }
  get photoPublicId() {
    return this.props.photoPublicId;
  }

  get leads() {
    return this.props.leads;
  }
  get companyId() {
    return this.props.companyId;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
