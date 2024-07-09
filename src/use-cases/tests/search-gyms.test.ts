import { expect, it, describe, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "../check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "../errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "../errors/max-number-of-check-ins-error";
import { SerachGymUseCase } from "../search-gyms";
import { title } from "process";

let gymsRepository: InMemoryGymsRepository;
let sut: SerachGymUseCase;

describe("Search Gyms Use Case", () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SerachGymUseCase(gymsRepository);
	});

	it("should be able to search for gyms", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await gymsRepository.create({
			title: "Gym 01",
			description: null,
			latitude: 0,
			longitude: 0,
			phone: "",
		});

		await gymsRepository.create({
			title: "Gym 02",
			description: null,
			latitude: 0,
			longitude: 0,
			phone: "",
		});

		const { gyms } = await sut.execute({
			query: "Gym 01",
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "Gym 01" })]);
	});

	it("should be able to fetch paginated gyms search", async () => {
		for (let i = 1; i <= 42; i++) {
			await gymsRepository.create({
				id: `gym-${i}`,
				title: `Gym ${i}`,
				description: null,
				latitude: 0,
				longitude: 0,
				phone: "",
			});
		}

		const { gyms } = await sut.execute({
			query: "Gym",
			page: 3,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "Gym 41" }),
			expect.objectContaining({ title: "Gym 42" }),
		]);
	});
});
