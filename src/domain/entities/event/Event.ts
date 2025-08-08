import { GoalMode, GoalType } from "@prisma/client";
import { generateId } from "../../../shared/utils/IdGenerator";
import { SaleProps } from "../sale/Sale";
import { LeadProps } from "../lead/Lead";
import { SellerEventProps } from "../sellerEvent/SellerEvent";

export type Goal = "QUANTITY" | "VALUE";

export const Goal = {
  QUANTITY: "QUANTITY" as Goal,
  VALUE: "VALUE" as Goal,
};

export type SellerEvent = {
  id: string;
  sellerId: string;
  eventId: string;
};

export type EventProps = {
  id: string;
  name: string;
  photo?: string;
  photoPublicId?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  goalMode?: GoalMode;
  inviteValidityDays?: number;
  companyId: string;
  goal: number;
  goalType: GoalType;
  createdAt: Date;
  sales?: SaleProps[];
  sellerEvents?: SellerEventProps[];
  leads?: LeadProps[];
};

export class Event {
  private constructor(private readonly props: EventProps) {}

  public static create(
    props: Omit<
      EventProps,
      "id" | "createdAt" | "startDate" | "isActive" | "inviteValidityDays"
    >
  ): Event {
    if (!props.name.trim()) {
      throw new Error("Event name is required.");
    }

    if (!props.companyId.trim()) {
      throw new Error("Company ID is required.");
    }
    return new Event({
      ...props,
      id: generateId(),
      startDate: new Date(),
      isActive: false,
      createdAt: new Date(),
      inviteValidityDays: 1,
    });
  }

  public static with(props: EventProps) {
    return new Event(props);
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get photo() {
    return this.props.photo;
  }

  public get photoPublicId() {
    return this.props.photoPublicId;
  }

  public get startDate() {
    return this.props.startDate;
  }

  public get endDate() {
    return this.props.endDate;
  }

  public get inviteValidityDays() {
    return this.props.inviteValidityDays;
  }
  public get goal() {
    return this.props.goal;
  }

  public get goalType() {
    return this.props.goalType;
  }
  public get goalMode() {
    return this.props.goalMode;
  }

  public get companyId() {
    return this.props.companyId;
  }

  public get sellerEvents() {
    return this.props.sellerEvents;
  }

  public get sales() {
    return this.props.sales;
  }
  public get leads() {
    return this.props.leads;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get isActive() {
    return this.props.isActive;
  }

  public finish() {
    if (this.props.endDate) {
      throw new Error("Event is already finished.");
    }

    this.props.endDate = new Date();
  }
}
