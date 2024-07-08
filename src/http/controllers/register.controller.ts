import { registerUseCase } from "@/use-cases/register";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const register = async (req: FastifyRequest, res: FastifyReply) => {
	const registerBodyShema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { name, email, password } = registerBodyShema.parse(req.body);

	try {
		await registerUseCase({
			email,
			name,
			password,
		});
	} catch (err) {
		return res.status(409).send();
	}

	return res.status(201).send();
};
