import { generateId } from "../../../shared/utils/IdGenerator";

export enum FieldType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  DATE = "DATE",
  BOOLEAN = "BOOLEAN",
}

export type LeadCustomFieldProps = {
  id: string;
  companyId: string;
  name: string;
  key: string;
  type: FieldType;
  required: boolean;
  order: number;
};

export class LeadCustomField {
  private constructor(private props: LeadCustomFieldProps) {}

  public static create(
    props: Omit<LeadCustomFieldProps, "id">
  ): LeadCustomField {
    if (!props.name.trim()) throw new Error("Field name is required.");
    if (!props.key.trim()) throw new Error("Field key is required.");
    return new LeadCustomField({
      ...props,
      id: generateId(),
    });
  }

  public static with(props: LeadCustomFieldProps): LeadCustomField {
    return new LeadCustomField(props);
  }

  public get id() {
    return this.props.id;
  }
  public get companyId() {
    return this.props.companyId;
  }
  public get name() {
    return this.props.name;
  }
  public get key() {
    return this.props.key;
  }
  public get type() {
    return this.props.type;
  }
  public get required() {
    return this.props.required;
  }
  public get order() {
    return this.props.order;
  }
}
