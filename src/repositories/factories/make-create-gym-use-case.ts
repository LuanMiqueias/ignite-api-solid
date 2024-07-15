import { CreateGymUseCase } from "@/use-cases/create-gym";
import { PrismaGymsRepository } from "../prisma/prisma-gyms-repository";

export function makeCreateGymUseCase() {
	const gymsRepository = new PrismaGymsRepository();
	const useCase = new CreateGymUseCase(gymsRepository);

	return useCase;
}
