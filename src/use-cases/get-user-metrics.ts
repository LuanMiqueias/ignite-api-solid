import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";

interface GetUserMetricsRequest {
	userId: string;
}
interface GetUserMetricsResponse {
	checkInsCount: number;
}

export class GetUserMetricsUseCase {
	constructor(private checkInRepostory: CheckInsRepository) {}
	async execute({
		userId,
	}: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
		const checkInsCount = await this.checkInRepostory.countsByUserId(userId);

		return {
			checkInsCount,
		};
	}
}
