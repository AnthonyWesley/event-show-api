import { ApiExpress } from "../src/infra/api/express/api.express";
import { routes } from "../src/presentation/routes/Routes";
import serverless from "serverless-http";

// Cria a instância
const api = ApiExpress.create(routes);

// Exporta como handler para Vercel
const app = api.getApp(); // você vai adicionar esse método abaixo
export const handler = serverless(app); // Vercel usa isso
