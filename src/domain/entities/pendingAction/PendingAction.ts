import { generateId } from "../../../shared/utils/IdGenerator";

export type ActionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ActionType = "CREATE_SALE" | "DELETE_SALE" | "UPDATE_SALE";

export const ActionType = {
  CREATE_SALE: "CREATE_SALE" as ActionType,
  DELETE_SALE: "DELETE_SALE" as ActionType,
  UPDATE_SALE: "UPDATE_SALE" as ActionType,
} as const;

export const ActionStatus = {
  PENDING: "PENDING" as ActionStatus,
  APPROVED: "APPROVED" as ActionStatus,
  REJECTED: "REJECTED" as ActionStatus,
} as const;

export type PendingActionProps = {
  id: string;
  companyId: string;
  eventId: string;
  sellerId: string;
  targetId: string | null;
  payload: any;
  actionType: ActionType;
  createdAt: Date;
  status: ActionStatus;
};

export class PendingAction {
  private constructor(private readonly props: PendingActionProps) {}

  public static create(
    companyId: string,
    eventId: string,
    sellerId: string,
    actionType: ActionType,
    payload: any,
    targetId: string | null
  ) {
    if (!companyId.trim()) throw new Error("Company ID is required.");
    if (!sellerId.trim()) throw new Error("Seller ID is required.");

    if (
      (actionType === "UPDATE_SALE" || actionType === "DELETE_SALE") &&
      (!targetId || !targetId.trim())
    ) {
      throw new Error("Target ID is required for update or delete actions.");
    }

    return new PendingAction({
      id: generateId(),
      companyId,
      eventId,
      sellerId,
      payload,
      actionType,
      status: "PENDING",
      targetId,
      createdAt: new Date(),
    });
  }

  public static with(props: PendingActionProps) {
    return new PendingAction(props);
  }

  get id() {
    return this.props.id;
  }

  get companyId() {
    return this.props.companyId;
  }

  get eventId() {
    return this.props.eventId;
  }

  get targetId() {
    return this.props.targetId;
  }

  get sellerId() {
    return this.props.sellerId;
  }

  get payload() {
    return this.props.payload;
  }

  get actionType() {
    return this.props.actionType;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
