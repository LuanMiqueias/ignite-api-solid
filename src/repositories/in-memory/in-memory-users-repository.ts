import { Prisma, User } from "@prisma/client";
import { usersRepository } from "../users-repository";

export class InMemoryUsersRepository implements usersRepository {
	public items: User[] = [];

	async create(data: Prisma.UserCreateInput) {
		const user = {
			id: "user-1",
			email: data?.email,
			name: data?.name,
			passwordHash: data?.passwordHash,
			createdAt: new Date(),
		};

		this.items.push(user);

		return user;
	}
	async findByEmail(email: string) {
		const user = this.items.find((item) => item?.email === email) || null;

		return user;
	}
}
