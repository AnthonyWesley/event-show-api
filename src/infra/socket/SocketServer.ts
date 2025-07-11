import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export class SocketServer {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173", "https://event-flow-awl.netlify.app"],
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

  public emitPendingCreated(pendingData: any) {
    this.io.emit("new-pending", pendingData);
  }
}
