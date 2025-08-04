import { FieldType } from "@prisma/client";
import { generateId } from "../../../shared/utils/IdGenerator";
export type LeadCustomFieldSnapshot = {
  id: string;
  companyId: string;
  name: string;
  key: string;
  type: FieldType;
  required: boolean;
  order: number;
};
export type LeadCustomValueProps = {
  id: string;
  leadId: string;
  fieldId: string;
  value: string;
  field?: LeadCustomFieldSnapshot;
};

export class LeadCustomValue {
  private constructor(private props: LeadCustomValueProps) {}

  public static create(
    props: Omit<LeadCustomValueProps, "id">
  ): LeadCustomValue {
    if (!props.leadId || !props.fieldId) {
      throw new Error("leadId and fieldId are required.");
    }
    return new LeadCustomValue({
      ...props,
      id: generateId(),
    });
  }

  public static with(props: LeadCustomValueProps): LeadCustomValue {
    return new LeadCustomValue(props);
  }

  public get id() {
    return this.props.id;
  }
  public get leadId() {
    return this.props.leadId;
  }
  public get fieldId() {
    return this.props.fieldId;
  }
  public get value() {
    return this.props.value;
  }

  public get field(): LeadCustomFieldSnapshot | undefined {
    return this.props.field;
  }
}
