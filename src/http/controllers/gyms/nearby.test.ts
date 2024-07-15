import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { title } from "process";

describe("NearBy gym (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to list nearby gyms", async () => {
		const { token } = await createAndAuthenticateUser(app);

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "JavaScript Gym - Near",
				description: "Some description.",
				phone: "1199999999",
				latitude: -22.2149282,
				longitude: -46.7442474,
			});

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Typescript Gym - Far",
				description: "Some description.",
				phone: "1199999999",
				latitude: -22.3656008,
				longitude: -46.9421553,
			});

		const response = await request(app.server)
			.get("/gyms/nearby")
			.query({
				latitude: -22.2104633,
				longitude: -46.7785596,
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: "JavaScript Gym - Near",
			}),
		]);
	});
});
