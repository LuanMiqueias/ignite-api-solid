import { PrismaCheckInsRepository } from "../prisma/prisma-check-ins-repository";
import { ValidateCheckInUseCase } from "@/use-cases/validate-check-in";

export function makeValidateCheckInUseCase() {
	const checkInRepostory = new PrismaCheckInsRepository();
	const useCase = new ValidateCheckInUseCase(checkInRepostory);

	return useCase;
}
