import { generateId } from "../../../shared/utils/IdGenerator";
import { SaleProps } from "../sale/Sale";

export type Goal = "QUANTITY" | "VALUE";

export const Goal = {
  QUANTITY: "QUANTITY" as Goal,
  VALUE: "VALUE" as Goal,
};

export type SellerEvent = {
  id: string; // ou gere um novo id se necessário
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
  partnerId: string;
  goal: number;
  goalType: string;
  createdAt: Date;
  sales: SaleProps[];
  sellerEvents: SellerEvent[];
};

export class Event {
  private constructor(private readonly props: EventProps) {}

  public static create(
    name: string,
    goal: number,
    goalType: Goal,
    partnerId: string,
    photo?: string
  ) {
    if (!name.trim()) {
      throw new Error("Event name is required.");
    }

    // if (startDate >= endDate) {
    //   throw new Error("Start date must be before end date.");
    // }

    if (!partnerId.trim()) {
      throw new Error("Partner ID is required.");
    }

    return new Event({
      id: generateId(),
      name,
      photo,
      startDate: new Date(),
      // endDate,
      isActive: false,
      goal,
      goalType,
      partnerId,
      sellerEvents: [],
      sales: [],
      createdAt: new Date(),
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

  public get goal() {
    return this.props.goal;
  }

  public get goalType() {
    return this.props.goalType;
  }

  public get partnerId() {
    return this.props.partnerId;
  }

  public get sellerEvents() {
    return this.props.sellerEvents;
  }

  public get sales() {
    return this.props.sales;
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
