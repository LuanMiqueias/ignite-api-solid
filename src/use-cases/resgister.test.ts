import { expect, it, describe } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user.already-exists-error";

describe("Register Use Case", () => {
	it("should be able to register", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.execute({
			name: "John Doe",
			email: "jonydoe@email.com",
			password: "123456",
		});

		expect(user?.id).toEqual(expect.any(String));
	});

	it("should hash user password upon registration", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.execute({
			name: "John Doe",
			email: "jonydoe@email.com",
			password: "123456",
		});

		const isPasswordCorrectlyHashed = await compare(
			"123456",
			user?.passwordHash
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("should nopt be able to register with same email twice", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);
		const email = "jonydoe@email.com";

		await registerUseCase.execute({
			name: "John Doe",
			password: "123456",
			email,
		});

		await expect(async () => {
			await registerUseCase.execute({
				name: "John Doe",
				password: "123456",
				email,
			});
		}).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
