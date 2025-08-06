import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { ISocketServer } from "./ISocketServer";

export class SocketServer implements ISocketServer {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:5173",
          "https://event-flow-awl.netlify.app",
          "http://192.168.0.93:5173",
          "http://192.168.100.62:5173",
        ],
        credentials: true,
      },
    });

    this.io.on("connection", (socket) => {
      console.log("Socket conectado:", socket.id);

      socket.on("disconnect", () => {
        console.log("Socket desconectado:", socket.id);
      });
    });
  }

  public emit(eventName: string, payload: any) {
    this.io.emit(eventName, payload);
  }
}
