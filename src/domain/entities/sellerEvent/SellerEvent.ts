import { generateId } from "../../../shared/utils/IdGenerator";
import { SellerProps } from "../seller/Seller";

export type SellerEventProps = {
  id: string;
  sellerId: string;
  eventId: string;
  goal: number;
  event?: { id: string; name: string; goal: number };
  seller?: {
    id: string;
    name: string;
    phone: string;
    photo: string;
    email: string;
  };
};

export class SellerEvent {
  private constructor(private readonly props: SellerEventProps) {}
  public static create(
    props: Omit<SellerEventProps, "id" | "goal">
  ): SellerEvent {
    if (!props.sellerId.trim()) {
      throw new Error("Seller ID is required.");
    }

    if (!props.eventId.trim()) {
      throw new Error("Event ID is required.");
    }
    return new SellerEvent({ ...props, id: generateId(), goal: 0 });
  }

  public static with(props: SellerEventProps) {
    return new SellerEvent(props);
  }

  public get id() {
    return this.props.id;
  }

  public get sellerId() {
    return this.props.sellerId;
  }

  public get eventId() {
    return this.props.eventId;
  }
  public get event() {
    return this.props.event;
  }
  public get goal() {
    return this.props.goal;
  }

  public get seller() {
    return this.props.seller;
  }
}
