import { PrismaCheckInsRepository } from "../prisma/prisma-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "@/use-cases/fetch-user-check-ins-history";

export function makeFetchUserCheckInHistoryUseCase() {
	const checkInRepostory = new PrismaCheckInsRepository();
	const useCase = new FetchUserCheckInsHistoryUseCase(checkInRepostory);

	return useCase;
}
