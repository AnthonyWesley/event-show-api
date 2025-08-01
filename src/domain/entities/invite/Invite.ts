import { generateId } from "../../../shared/utils/IdGenerator";

export type InviteProps = {
  id: string;
  code: string;
  sellerEventId: string;
  sellerEvent?: { id: string; sellerId: string };
  event?: { id: string; name: string; companyId: string };
  eventId: string;
  expiresAt: Date;
  createdAt: Date;
};

export class Invite {
  private constructor(private readonly props: InviteProps) {}

  public static create(props: Omit<InviteProps, "id" | "createdAt">): Invite {
    if (!props.eventId) {
      throw new Error("Invalid event ID.");
    }

    if (!props.sellerEventId) {
      throw new Error("Invalid seller ID.");
    }

    if (!props.code || props.code.trim().length < 6) {
      throw new Error("Invite code must be at least 6 characters.");
    }

    if (props.expiresAt <= new Date()) {
      throw new Error("Expiration date must be in the future.");
    }

    return new Invite({
      ...props,
      id: generateId(),
      createdAt: new Date(),
    });
  }

  public static with(props: InviteProps): Invite {
    return new Invite(props);
  }

  public isExpired(): boolean {
    return this.props.expiresAt <= new Date();
  }

  // private static isValidId(id: string): boolean {
  //   return /^[0-9a-fA-F-]{36}$/.test(id); // UUID v4 regex
  // }

  // Getters
  public get id() {
    return this.props.id;
  }

  public get code() {
    return this.props.code;
  }

  public get sellerEventId() {
    return this.props.sellerEventId;
  }
  public get sellerEvent() {
    return this.props.sellerEvent;
  }

  public get event() {
    return this.props.event;
  }
  public get eventId() {
    return this.props.eventId;
  }

  public get expiresAt() {
    return this.props.expiresAt;
  }

  public get createdAt() {
    return this.props.createdAt;
  }
}
