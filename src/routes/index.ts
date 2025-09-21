import { Elysia } from "elysia";
import { userRoutes } from "../components/user/user.routes";
import { config } from "../config/env.config";
import { successResponse } from "../utils/response.util";

export function RegisterRoutes(app: Elysia) {
  app.get('/health', async () => {
    return successResponse({
      status: 'OK',
      environment: config.NODE_ENV,
      uptime: process.uptime(),
    }, 200, 'Server is running');
  });

  app.group('/api/user', userRoutes);
  
  // TODO: Convert other routes
  // app.group('/api/color', (app) => app.use(jwtAuthMiddleware).group('', (app) => colorRoute(app)));
  // app.group('/api/plant-category', (app) => plantCategoryRoute(app));
  // app.group('/api/fertilizer', (app) => FertilizerRoute(app));
  
  return app;
}