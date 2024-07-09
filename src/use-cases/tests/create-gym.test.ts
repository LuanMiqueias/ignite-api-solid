import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "../create-gym";

let gymRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
	beforeEach(() => {
		gymRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(gymRepository);
	});

	it("should be able to create gym", async () => {
		const { gym } = await sut.execute({
			title: "Gym.JS",
			description: "Gym Javascript",
			latitude: 0,
			longitude: 0,
			phone: "",
		});

		expect(gym?.id).toEqual(expect.any(String));
	});
});
