import { FastifyInstance } from "fastify";
import { register } from "./controllers/register.controller";

export const appRoutes = async (app: FastifyInstance) => {
	app.post("/users", register);
	app.get("/", () => "oi");
};
