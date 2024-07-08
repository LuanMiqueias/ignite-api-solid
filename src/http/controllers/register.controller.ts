import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user.already-exists-error";
import { RegisterUseCase } from "@/use-cases/register";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const register = async (req: FastifyRequest, res: FastifyReply) => {
	const registerBodyShema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { name, email, password } = registerBodyShema.parse(req.body);
	const usersRepository = new PrismaUsersRepository();

	const registerUseCase = new RegisterUseCase(usersRepository);
	try {
		await registerUseCase.execute({
			email,
			name,
			password,
		});
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return res.status(409).send({ message: err.message });
		} else {
			return res.status(500).send(); //TODO: fix later
		}
	}

	return res.status(201).send();
};
