import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInsRepository {
	public items: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn: CheckIn = {
			id: randomUUID(),
			userId: data?.userId,
			gymId: data?.gymId,

			validatedAt: data?.validatedAt ? new Date(data.validatedAt) : null,
			createdAt: new Date(),
		};

		this.items.push(checkIn);

		return checkIn;
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf("date");
		const endOfTheDay = dayjs(date).endOf("date");

		const checkOnSameDate =
			this.items.find((item) => {
				const checkInDate = dayjs(item?.createdAt);
				const isOnSameDate =
					checkInDate.isAfter(startOfTheDay) &&
					checkInDate.isBefore(endOfTheDay);

				return item?.userId === userId && isOnSameDate;
			}) || null;

		return checkOnSameDate;
	}

	async findManyByUserId(userId: string, page: number) {
		return this.items
			.filter((user) => user?.userId === userId)
			?.slice((page - 1) * 20, page * 20);
	}

	async countsByUserId(userId: string) {
		return this.items.filter((user) => user?.userId === userId).length;
	}

	async findById(id: string) {
		return this.items.find((checkIn) => checkIn?.id === id) || null;
	}

	async save(checkIn: CheckIn) {
		const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

		if (checkInIndex >= 0) {
			this.items[checkInIndex] = checkIn;
		}
		return checkIn;
	}
}
