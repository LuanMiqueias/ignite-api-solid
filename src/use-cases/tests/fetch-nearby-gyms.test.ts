import { expect, it, describe, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "../check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "../errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "../errors/max-number-of-check-ins-error";
import { SerachGymUseCase } from "../search-gyms";
import { title } from "process";
import { FetchNearByGymsUseCase } from "../fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearByGymsUseCase;

describe("Search Gyms Use Case", () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FetchNearByGymsUseCase(gymsRepository);
	});

	it("should be able to fetch nearby gyms", async () => {
		await gymsRepository.create({
			title: "Near Gym 01",
			description: null,
			latitude: new Decimal(-22.2149282),
			longitude: new Decimal(-46.7442474),
			phone: "",
		});

		await gymsRepository.create({
			title: "Far Gym 02",
			description: null,
			latitude: new Decimal(-22.3656008),
			longitude: new Decimal(-46.9421553),
			phone: "",
		});

		const { gyms } = await sut.execute({
			userLatitude: -22.2104633,
			userLongitude: -46.7785596,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym 01" })]);
	});
});
