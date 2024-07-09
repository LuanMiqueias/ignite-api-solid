import { expect, it, describe, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "../check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "../errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "../errors/max-number-of-check-ins-error";

let checkInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInRepository, gymsRepository);

		await gymsRepository.create({
			title: "Gym.JS",
			description: "Gym Javascript",
			id: "gymId-01",
			latitude: new Decimal(0),
			longitude: new Decimal(0),
			phone: "",
		});
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check-in", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gymId-01",
			userId: "userId-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn?.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gymId-01",
			userId: "userId-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		await expect(() =>
			sut.execute({
				gymId: "gymId-01",
				userId: "userId-01",
				userLatitude: 0,
				userLongitude: 0,
			})
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("should not be able to check in twice but in diferent days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gymId-01",
			userId: "userId-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gymId-01",
			userId: "userId-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn?.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym", async () => {
		gymsRepository.items.push({
			title: "Gym.JS 2",
			description: "Gym Javascript",
			id: "gymId-02",
			latitude: new Decimal(-22.1836382),
			longitude: new Decimal(-46.7442474),
			phone: "",
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		await expect(() =>
			sut.execute({
				gymId: "gymId-02",
				userId: "userId-01",
				userLatitude: -22.1844777,
				userLongitude: -46.7446605,
			})
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
