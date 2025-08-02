import { ApiExpress } from "../src/infra/api/express/api.express";
import { makeUseCases } from "../src/infra/Container";
import { AuthorizationRoute } from "../src/infra/http/middlewares/AuthorizationRoute";
import { SocketServer } from "../src/infra/socket/SocketServer";
import { makeRoutes } from "../src/presentation/routes/Routes";
import { ServiceTokenService } from "../src/service/ServiceTokenService";
import { AuthTokenService } from "../src/service/AuthTokenService";

// Carrega variáveis de ambiente apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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
  const port = parseInt(process.env.PORT || '3000', 10);
  api.start(port);
}

main();
