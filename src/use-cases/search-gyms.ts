import { Gym, User } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface SerachGymUseCaseRequest {
	query: string;
	page: number;
}

interface SerachGymUseCaseResponse {
	gyms: Gym[];
}

export class SerachGymUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page,
	}: SerachGymUseCaseRequest): Promise<SerachGymUseCaseResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page);

		return { gyms };
	}
}
