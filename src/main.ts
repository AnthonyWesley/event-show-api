import { ApiExpress } from "./infra/api/express/api.express";
import { makeUseCases } from "./infra/Container";
import { AuthorizationRoute } from "./infra/http/middlewares/AuthorizationRoute";
import { SocketServer } from "./infra/socket/SocketServer";
import { makeRoutes } from "./presentation/routes/Routes";
import { ServiceTokenService } from "./service/ServiceTokenService";
import { AuthTokenService } from "./service/AuthTokenService";
import { NullSocketServer } from "./infra/socket/NullSocketServer";
import { ISocketServer } from "./infra/socket/ISocketServer";

// Carrega variáveis de ambiente apenas em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

function main() {
  const api = ApiExpress.create();
  const socketServer: ISocketServer =
    process.env.SOCKET_ENABLED === "true"
      ? new SocketServer(api.getHttpServer())
      : new NullSocketServer();

  // const socketServer = new SocketServer(api.getHttpServer());
  const secretKey = process.env.SECRET_KEY as string;
  const serviceKey = process.env.CORE_CONNECTION_SECRET_KEY as string;
  const authTokenService = new AuthTokenService(secretKey);
  const serviceTokenService = new ServiceTokenService(serviceKey);
  const authorization = AuthorizationRoute.create(authTokenService);
  const useCases = makeUseCases(
    socketServer,
    authTokenService,
    serviceTokenService
  );
  const routes = makeRoutes(useCases, authorization);

  api.setRoutes(routes);
  const port = parseInt(process.env.PORT || "3000", 10);
  api.start(port);
}

main();
