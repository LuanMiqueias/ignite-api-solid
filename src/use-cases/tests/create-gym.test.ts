import { expect, it, describe, beforeEach } from "vitest";
import { RegisterUseCase } from "../register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "../errors/user.already-exists-error";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "../create-gym";
import { Decimal } from "@prisma/client/runtime/library";

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
