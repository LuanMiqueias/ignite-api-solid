import { GetUserProfileUseCase } from "@/use-cases/get-user-profile";
import { PrismaUsersRepository } from "../prisma/prisma-users-repository";

export function makeGetUserProfileUseCase() {
	const usersRepository = new PrismaUsersRepository();
	const useCase = new GetUserProfileUseCase(usersRepository);

	return useCase;
}
