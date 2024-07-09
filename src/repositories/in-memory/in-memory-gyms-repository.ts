import { Gym, Prisma } from "@prisma/client";
import { findManyNearByParams, GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/use-cases/utils/get-distance-between-coordinate";

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = [];

	async findById(userId: string) {
		const gym = this.items.find((item) => item?.id === userId) || null;

		return gym;
	}

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: data?.id || randomUUID(),
			createdAt: new Date(),
			title: data?.title,
			description: data?.description ?? null,
			phone: data?.phone ?? null,
			latitude: new Prisma.Decimal(data?.latitude.toString()),
			longitude: new Prisma.Decimal(data?.longitude.toString()),
		};

		this.items.push(gym);

		return gym;
	}

	async searchMany(query: string, page: number) {
		return this.items
			.filter((gym) => gym?.title.includes(query))
			?.slice((page - 1) * 20, page * 20);
	}

	async findManyNearBy(params: findManyNearByParams) {
		return this.items.filter((item) => {
			const distance = getDistanceBetweenCoordinates(
				{
					latitude: params.latitude,
					longitude: params.longitude,
				},
				{
					latitude: item?.latitude.toNumber(),
					longitude: item?.longitude.toNumber(),
				}
			);
			return distance < 10;
		});
	}
}
