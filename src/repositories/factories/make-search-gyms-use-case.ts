import { SerachGymUseCase } from "@/use-cases/search-gyms";
import { PrismaGymsRepository } from "../prisma/prisma-gyms-repository";

export function makeSearchGymsUseCase() {
	const checkInRepostory = new PrismaGymsRepository();
	const useCase = new SerachGymUseCase(checkInRepostory);

	return useCase;
}
