import { generateId } from "../../../shared/utils/IdGenerator";

type ModuleProps = {
  id: string;
  serviceId: string;
  createdAt: Date;
};

export class Module {
  private constructor(private readonly props: ModuleProps) {}

  public static create(props: Omit<ModuleProps, "id" | "createdAt">): Module {
    return new Module({ ...props, id: generateId(), createdAt: new Date() });
  }

  public static with(props: ModuleProps): Module {
    return new Module(props);
  }

  get id() {
    return this.props.id;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
