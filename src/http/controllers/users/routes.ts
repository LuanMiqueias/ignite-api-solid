import { FastifyInstance } from "fastify";

// Middlewares
import { verifyJWT } from "@/http/middlewares/verify-jwt";

// Controllers
import { register } from "./register.controller";
import { authenticate } from "./authenticate.controller";
import { profile } from "./profile.controller";
import { refresh } from "./refresh";

export const usersRoutes = async (app: FastifyInstance) => {
	app.post("/users", register);
	app.post("/auth/login", authenticate);

	app.patch("/auth/login/refresh", refresh);

	/** Authenticated */
	app.get("/me", { onRequest: [verifyJWT] }, profile);
};
