import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "../get-user-profile";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

const userData = {
	name: "John Doe",
	email: "jonydoe@email.com",
	password: "123456",
};

describe("Get User Profile Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it("should be able to get user profile", async () => {
		const createdUser = await usersRepository.create({
			name: userData.name,
			email: userData.email,
			passwordHash: await hash(userData?.password, 6),
		});

		const { user } = await sut.execute({
			userId: createdUser?.id,
		});

		expect(user?.name).toEqual("John Doe");
	});

	it("should not be able to get user profile with wrong profile", async () => {
		await expect(() =>
			sut.execute({
				userId: "non-existing-id",
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
