import { FastifyInstance } from "fastify";

// Middlewares
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/only-admin";

// Controllers
import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";

export const gymsRoutes = async (app: FastifyInstance) => {
	app.addHook("onRequest", verifyJWT);

	app.get("/gyms/search", search);
	app.get("/gyms/nearby", nearby);

	app.post("/gyms", { onRequest: [verifyUserRole("ADMIN")] }, create);
};
