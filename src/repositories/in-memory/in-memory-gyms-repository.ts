import { Gym, Prisma } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";

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
}
