import { FastifyInstance } from "fastify";
import { register } from "./controllers/register.controller";
import { authenticate } from "./controllers/authenticate.controller";
import { profile } from "./controllers/profile.controller";
import { verifyJWT } from "./middlewares/verify-jwt";

export const appRoutes = async (app: FastifyInstance) => {
	app.post("/users", register);
	app.post("/auth/login", authenticate);

	/** Authenticated */
	app.get("/me", { onRequest: [verifyJWT] }, profile);
};
