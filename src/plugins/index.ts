import { Elysia } from "elysia";
import { SecurityPlugin } from "./security.plugin";
import { RegisterShutdown } from "./shutdown.plugin";
import { SwaggerPlugin } from './swagger.plugin';

export function RegisterPlugins(app: Elysia) {
  SecurityPlugin(app);
  SwaggerPlugin(app);
  RegisterShutdown(app);
  return app;
}