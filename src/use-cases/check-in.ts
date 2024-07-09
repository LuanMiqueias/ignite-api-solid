import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import dayjs from "dayjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "./utils/get-distance-between-coordinate";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

interface CheckInRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
}
interface CheckInUseCaseResponse {
	checkIn: CheckIn;
}

export class CheckInUseCase {
	constructor(
		private checkInRepostory: CheckInsRepository,
		private gymsRepository: GymsRepository
	) {}
	async execute({
		gymId,
		userId,
		userLatitude,
		userLongitude,
	}: CheckInRequest): Promise<CheckInUseCaseResponse> {
		const MAX_DISTANCE_IN_KILOMETERS = 0.1;

		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) {
			throw new ResourceNotFoundError();
		}

		const distance = getDistanceBetweenCoordinates(
			{ latitude: userLatitude, longitude: userLongitude },
			{
				latitude: gym?.latitude.toNumber(),
				longitude: gym?.longitude.toNumber(),
			}
		);

		if (distance > MAX_DISTANCE_IN_KILOMETERS) {
			throw new MaxDistanceError();
		}

		const checkInOnSameDay = await this.checkInRepostory.findByUserIdOnDate(
			userId,
			new Date()
		);

		if (checkInOnSameDay) {
			throw new MaxNumberOfCheckInsError();
		}

		const checkIn = await this.checkInRepostory.create({
			gymId,
			userId,
		});

		return {
			checkIn,
		};
	}
}
