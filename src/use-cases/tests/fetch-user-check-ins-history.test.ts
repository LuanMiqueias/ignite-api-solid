import { expect, it, describe, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history";

let checkInRepository: InMemoryCheckInRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch Check-in History Use Case", () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInRepository();
		sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);
	});

	it("should be able to fetch check-in history", async () => {
		await checkInRepository.create({
			gymId: "gym-01",
			userId: "user-01",
		});
		await checkInRepository.create({
			gymId: "gym-02",
			userId: "user-01",
		});

		const { checkIns } = await sut.execute({
			userId: "user-01",
			page: 1,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gymId: "gym-01" }),
			expect.objectContaining({ gymId: "gym-02" }),
		]);
	});

	it("should be able to fetch paginated check-in history", async () => {
		for (let i = 1; i <= 22; i++) {
			await checkInRepository.create({
				gymId: `gym-${i}`,
				userId: "user-01",
			});
		}

		const { checkIns } = await sut.execute({
			userId: "user-01",
			page: 2,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gymId: "gym-21" }),
			expect.objectContaining({ gymId: "gym-22" }),
		]);
	});
});
