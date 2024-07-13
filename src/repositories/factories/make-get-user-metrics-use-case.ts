import { GetUserMetricsUseCase } from "@/use-cases/get-user-metrics";
import { PrismaCheckInsRepository } from "../prisma/prisma-check-ins-repository";

export function makeGetUserMetricsUseCase() {
	const checkInRepostory = new PrismaCheckInsRepository();
	const useCase = new GetUserMetricsUseCase(checkInRepostory);

	return useCase;
}
