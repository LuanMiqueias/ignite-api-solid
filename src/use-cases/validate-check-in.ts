import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import dayjs from "dayjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "./utils/get-distance-between-coordinate";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

interface ValidateCheckInUseCaseRequest {
	checkInId: string;
}
interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
	constructor(private checkInRepostory: CheckInsRepository) {}
	async execute({
		checkInId,
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const MAX_DISTANCE_IN_KILOMETERS = 0.1;

		const checkIn = await this.checkInRepostory.findById(checkInId);

		if (!checkIn) {
			throw new ResourceNotFoundError();
		}

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.createdAt,
			"minutes"
		);

		if (distanceInMinutesFromCheckInCreation > 20) {
			throw new LateCheckInValidationError();
		}
		checkIn.validatedAt = new Date();

		await this.checkInRepostory.save({
			...checkIn,
		});

		return {
			checkIn,
		};
	}
}
