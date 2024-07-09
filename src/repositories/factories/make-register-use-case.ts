import { RegisterUseCase } from "@/use-cases/register";
import { PrismaUsersRepository } from "../prisma/prisma-users-repository";

export function makeRegisterUseCase() {
	const usersRepository = new PrismaUsersRepository();
	const registerUseCase = new RegisterUseCase(usersRepository);

	return registerUseCase;
}
