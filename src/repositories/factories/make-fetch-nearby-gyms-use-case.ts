import { PrismaGymsRepository } from "../prisma/prisma-gyms-repository";
import { FetchNearByGymsUseCase } from "@/use-cases/fetch-nearby-gyms";

export function makeFetchNearbyGymUseCase() {
	const GymsInRepostory = new PrismaGymsRepository();
	const useCase = new FetchNearByGymsUseCase(GymsInRepostory);

	return useCase;
}
