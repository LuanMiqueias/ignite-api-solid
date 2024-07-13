import { PrismaCheckInsRepository } from "../prisma/prisma-check-ins-repository";
import { PrismaGymsRepository } from "../prisma/prisma-gyms-repository";
import { CheckInUseCase } from "@/use-cases/check-in";

export function makeCheckInUseCase() {
	const checkInRepostory = new PrismaCheckInsRepository();
	const gymsRepository = new PrismaGymsRepository();
	const useCase = new CheckInUseCase(checkInRepostory, gymsRepository);

	return useCase;
}
