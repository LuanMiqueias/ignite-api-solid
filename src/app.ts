import fastify from "fastify";

// Components
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { ZodError } from "zod";

// configs
import { env } from "./env";

// Routes
import { usersRoutes } from "./http/controllers/users/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();
app.register(fastifyCookie);

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: "refreshToken",
		signed: false,
	},
	sign: {
		expiresIn: "10m",
	},
});

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInRoutes);

app.setErrorHandler((error, req, res) => {
	if (error instanceof ZodError) {
		return res.status(400).send({
			message: "Validation error.",
			issues: error.format(),
		});
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	} else {
		// TODO: DataDog, NewRelic, Sentry
	}

	return res.status(500).send({ message: "Internal server error." });
});
