import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "../authenticate";
import { hash } from "bcryptjs";
import { InvalidCreditialError } from "../errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

const userData = {
	name: "Jony doe",
	email: "jonydoe@email.com",
	password: "123456",
};

describe("Authenticate Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it("should be able to authenticate", async () => {
		await usersRepository.create({
			name: userData.name,
			email: userData.email,
			passwordHash: await hash(userData?.password, 6),
		});

		const { user } = await sut.execute({
			email: "jonydoe@email.com",
			password: userData?.password,
		});

		expect(user?.id).toEqual(expect.any(String));
	});

	it("should not be able to authenticate with wrong email", async () => {
		await expect(
			sut.execute({
				email: userData.email,
				password: userData.password,
			})
		).rejects.toBeInstanceOf(InvalidCreditialError);
	});

	it("should not be able to authenticate with wrong password", async () => {
		await usersRepository.create({
			name: userData.name,
			email: userData.email,
			passwordHash: await hash(userData?.password, 6),
		});

		await expect(
			sut.execute({
				email: userData.email,
				password: "wrongpassword",
			})
		).rejects.toBeInstanceOf(InvalidCreditialError);
	});
});
