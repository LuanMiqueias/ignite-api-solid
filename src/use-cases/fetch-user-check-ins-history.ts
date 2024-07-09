import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import dayjs from "dayjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "./utils/get-distance-between-coordinate";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

interface FetchUserCheckInsHistoryRequest {
	userId: string;
	page: number;
}
interface FetchUserCheckInsHistoryResponse {
	checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
	constructor(private checkInRepostory: CheckInsRepository) {}
	async execute({
		userId,
		page,
	}: FetchUserCheckInsHistoryRequest): Promise<FetchUserCheckInsHistoryResponse> {
		const checkIns = await this.checkInRepostory.findManyByUserId(userId, page);

		return {
			checkIns,
		};
	}
}
