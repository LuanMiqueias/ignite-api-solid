import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
	await request(app.server).post("/users").send({
		name: "test",
		email: "johndoe@example.com",
		password: "123456",
	});

	const authResponse = await request(app.server).post("/auth/login").send({
		email: "johndoe@example.com",
		password: "123456",
	});

	const { token } = authResponse.body;

	return {
		token,
	};
}
