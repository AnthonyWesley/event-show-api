import { ISocketServer } from "./ISocketServer";

export class NullSocketServer implements ISocketServer {
  emit() {}
  on() {}
  //   broadcast() {}
}
