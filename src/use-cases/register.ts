import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/user.already-exists-error";
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

interface RegisterUseCaseResponse {
	user: User;
}
export class RegisterUseCase {
	constructor(private userRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password,
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const passwordHash = await hash(password, 6);
		const userWithSameEmail = await this.userRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		const user = await this.userRepository.create({
			email,
			name,
			passwordHash,
		});

		return {
			user,
		};
	}
}
