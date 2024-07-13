import { CreateGymUseCase } from "@/use-cases/create-gym";
import { PrismaGymsRepository } from "../prisma/prisma-gyms-repository";

export function makeCreateGymUseCase() {
	const checkInRepostory = new PrismaGymsRepository();
	const useCase = new CreateGymUseCase(checkInRepostory);

	return useCase;
}
