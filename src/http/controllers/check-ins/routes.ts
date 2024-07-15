import { FastifyInstance } from "fastify";

// Middlewares
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/only-admin";

// Controllers
import { validate } from "./validate";
import { history } from "./history";
import { metrics } from "./metrics";
import { create } from "./create";

export const checkInRoutes = async (app: FastifyInstance) => {
	app.addHook("onRequest", verifyJWT);

	app.get("/check-ins/history", history);
	app.get("/check-ins/metrics", metrics);

	app.post("/gyms/:gymId/check-ins", create);
	app.patch(
		"/check-ins/:checkInId/validate",
		{ onRequest: [verifyUserRole("ADMIN")] },
		validate
	);
};
