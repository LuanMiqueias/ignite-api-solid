import { expect, it, describe, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "../get-user-metrics";

let checkInRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInRepository();
		sut = new GetUserMetricsUseCase(checkInRepository);
	});

	it("should be able to get check-ins count from metrics", async () => {
		await checkInRepository.create({
			gymId: "gym-01",
			userId: "user-01",
		});
		await checkInRepository.create({
			gymId: "gym-02",
			userId: "user-01",
		});

		const { checkInsCount } = await sut.execute({
			userId: "user-01",
		});

		expect(checkInsCount).toEqual(2);
	});
});
