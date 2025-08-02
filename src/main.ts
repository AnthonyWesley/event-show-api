import dotenv from "dotenv";
dotenv.config();

import { ApiExpress } from "./infra/api/express/api.express";
import { makeUseCases } from "./infra/Container";
import { AuthorizationRoute } from "./infra/http/middlewares/AuthorizationRoute";
import { SocketServer } from "./infra/socket/SocketServer";
import { makeRoutes } from "./presentation/routes/Routes";
import { ServiceTokenService } from "./service/ServiceTokenService";
import { AuthTokenService } from "./service/AuthTokenService";

function main() {
  const api = ApiExpress.create();
  const socketServer = new SocketServer(api.getHttpServer());
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
  api.start(8000);
}

main();
