import { makeAuthenticateUseCase } from "@/repositories/factories/make-authenticate-use-case";
import { InvalidCreditialError } from "@/use-cases/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const authenticate = async (req: FastifyRequest, res: FastifyReply) => {
	const authenticateBodyShema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { email, password } = authenticateBodyShema.parse(req.body);
	const authenticateUseCase = makeAuthenticateUseCase();

	try {
		const { user } = await authenticateUseCase.execute({
			email,
			password,
		});
		const token = await res.jwtSign(
			{},
			{
				sign: {
					sub: user?.id,
				},
			}
		);
		return res.status(200).send({
			token,
		});
	} catch (err) {
		if (err instanceof InvalidCreditialError) {
			return res.status(409).send({ message: err.message });
		} else {
			return res.status(500).send();
		}
	}
};
